require("dotenv").config(); // FIX: .env se secrets load karne ke liye (pehle code me hardcoded the)
const express = require("express");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const path = require("path");
const User = require("./db/users");
const Order = require("./db/orders");
// REMOVED: express-graphql / graphql / schema.js (GraphQL abhi use nahi karna)

const PORT = process.env.PORT || 6070;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_CODE = process.env.ADMIN_CODE;

if (!JWT_SECRET || !MONGO_URI || !ADMIN_CODE) {
  console.error("MONGO_URI, JWT_SECRET aur ADMIN_CODE .env file me set karo (.env.example dekho)");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("error occurred:", err));

// ---------- ADMIN AUTH ----------

const sha = (v) => crypto.createHash("sha256").update(String(v)).digest();

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is unavailable. Check that MongoDB is running and MONGO_URI is correct.",
    });
  }
  next();
}

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "database unavailable",
  });
});

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

app.post("/admin-login", (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.first > WINDOW_MS) attempts.delete(ip);
  const cur = attempts.get(ip) || { count: 0, first: now };
  if (cur.count >= MAX_ATTEMPTS) {
    return res.status(429).json({ success: false, message: "Too many attempts. 15 minute baad try karo." });
  }

  const code = req.body && req.body.code;
  const ok = code && crypto.timingSafeEqual(sha(code), sha(ADMIN_CODE));
  if (!ok) {
    cur.count += 1;
    attempts.set(ip, cur);
    return res.status(401).json({ success: false, message: "Wrong admin code" });
  }
  attempts.delete(ip);

  const adminToken = jsonwebtoken.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ success: true, adminToken });
});


function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Admin login required" });
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: "Invalid or expired admin token" });
  }
}


app.get("/admin-check", requireAdmin, (req, res) => res.json({ success: true }));

// ---------- ORDERS ----------


app.delete("/delete-user/:id", requireAdmin, requireDatabase, async (req, res) => {
  try {
    const orders = await Order.findByIdAndDelete(req.params.id);
    if (orders) {
      return res.json({ success: true, data: orders });
    }
    const users = await User.findByIdAndDelete(req.params.id);
    if (users) {
      return res.json({ success: true, data: users });
    }
    res.status(404).json({ success: false, message: "Not found" });
  } catch (e) {
    // FIX: pehle catch khali tha, request hang ho jati thi
    res.status(500).json({ success: false, message: e.message });
  }
});


app.delete("/delete-order/:id", requireAdmin, requireDatabase, async (req, res) => {
  try {
    const orders = await Order.findByIdAndDelete(req.params.id);
    if (!orders) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get("/orders-lao", requireAdmin, requireDatabase, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post("/cart", requireDatabase, async (req, res) => {
  try {
    const inserted = await Order.insertMany(req.body);
    res.json({ success: true, data: inserted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ---------- USERS ----------

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const findUserByEmail = (email) =>
  User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, "i") });

app.post("/create-user", requireDatabase, async (req, res) => {
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;
    if (!email || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "A valid email and a password of at least 8 characters are required.",
      });
    }
    const exists = await findUserByEmail(email);
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await new User({ email, password: hashed }).save();
    res.status(201).json({ success: true, message: "Account created successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get("/users-lao", requireAdmin, requireDatabase, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password 
    res.json(users);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post("/login", requireDatabase, async (req, res) => {
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;
    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({ success: false, message: "email and password required" });
    }
    const userMilgya = await findUserByEmail(email);
    if (!userMilgya) return res.status(401).json({ success: false, message: "Invalid email or password" });

    
    const isHashed = userMilgya.password.startsWith("$2");
    const ok = isHashed ? await bcrypt.compare(password, userMilgya.password) : password === userMilgya.password;
    if (!ok) return res.status(401).json({ success: false, message: "Invalid email or password" });
    if (!isHashed) {
      userMilgya.password = await bcrypt.hash(password, 10);
      await userMilgya.save();
    }

    jsonwebtoken.sign(
      { email: userMilgya.email },
      JWT_SECRET,
      { expiresIn: "2d" },
      function (err, token) {
        if (err) return res.status(500).json({ success: false, message: "Token error" });
       
        const { password: _pw, ...safeUser } = userMilgya.toObject();
        res.json({ myToken: token, userMilgya: safeUser });
      }
    );
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post("/check-token", requireDatabase, (req, res) => {
  const token = req.body && req.body.token;
  if (typeof token !== "string" || !token) {
    return res.status(401).json({ message: "Invalid token" });
  }
  jsonwebtoken.verify(token, JWT_SECRET, function (err, decoded) {
    if (err || !decoded || !decoded.email) return res.status(401).json({ message: "Invalid token" });

    User.findOne({ email: decoded.email })
      .select("-password")
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
      })
      .catch((error) => {
        console.error("Error finding user:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
