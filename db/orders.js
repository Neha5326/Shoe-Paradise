const mongoose = require("mongoose");
let orderSchema = new mongoose.Schema(
  {
    imageSrc: String,
    name: String,
    price: String,
    size: String,
  },
  {
    timestamps: true,
  }
);

let Order = mongoose.model("orders", orderSchema);
module.exports = Order;
