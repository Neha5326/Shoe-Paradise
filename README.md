# Shoe Paradise

A student-friendly shoe-store web application built with React, Express, and MongoDB. Users can create an account, browse a shoe catalog, add shoes to their cart, and get personalized product suggestions with the Shoe Fit Finder.

## Features

- Email/password signup and login, with passwords hashed on the server.
- Protected store pages: visitors must sign in before opening the home page, shop, product details, About, Fit Finder, cart, account, or admin page.
- Product catalog with search and brand filters for Adidas, Nike, Service, and Bata.
- Shoe details, size selection, and a cart saved in the browser.
- Shoe Fit Finder recommendations based on size, budget, foot width, intended use, and catalog comfort rating.
- Admin area protected by a separate admin code, with an order list.
- Local product photos, the original home-page hero image in a slider, and the original black logo/favicon.
- Responsive pages for desktop and mobile screens.

## Requirements

- Node.js 20.19 or newer
- npm
- A running MongoDB database, either local or MongoDB Atlas

## Setup and run

1. Open a terminal in the project root.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root, using `.env.example` as a template:

   ```env
   PORT=6070
   MONGO_URI=mongodb://127.0.0.1:27017/shoe-paradise
   JWT_SECRET=replace-this-with-a-long-random-secret
   ADMIN_CODE=choose-a-private-admin-code
   ```

   For MongoDB Atlas, use the connection string supplied by your Atlas cluster as `MONGO_URI`. Keep `.env` private; do not commit database credentials or secrets.

4. Make sure MongoDB is running, then start the React development server and API together:

   ```bash
   npm run dev
   ```

5. Open **http://localhost:5173**. Use the signup page to create an account. A successful signup also signs in the new account and opens the store.

The API listens on port `6070` by default. Vite forwards API requests to it while developing. Open the app using the Vite URL above; do not open built files directly or use an old preview-server port.

If signup or login reports that the database is unavailable, verify that MongoDB is running and `MONGO_URI` is correct in `.env`.

## Production build

Build the frontend:

```bash
npm run build
```

The production frontend is generated in `build/`. With `.env` configured and MongoDB running, serve the production app and API together:

```bash
npm start
```

The server uses port `6070` by default. Set `PORT` in `.env` to change it.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the React development server and Express API |
| `npm run build` | Build the production frontend into `build/` |
| `npm start` | Serve the production build and API |
| `npm test` | Run Shoe Fit Finder recommendation tests |
| `npm run format` | Format files under `frontend/` with Prettier |

## Application flow

1. A visitor creates an account or logs in.
2. Express validates credentials against MongoDB and returns a signed login token.
3. React validates a saved token before showing protected pages.
4. Signed-in users browse or search the shoe catalog, choose a shoe size, and add items to the cart.
5. The Fit Finder filters the catalog by selected size and maximum budget. It then ranks suitable shoes: matching foot width adds 2 points, matching activity adds 2 points, and the catalog comfort rating contributes 1–5 points.
6. The admin page requires a signed-in user and the separate `ADMIN_CODE` configured in `.env`.

## Project structure

```text
.
├── db/                           MongoDB models for users and orders
├── frontend/
│   ├── public/                   Local logo, hero, and shoe image assets
│   └── src/
│       ├── app/                  App routes and protected-route logic
│       ├── components/
│       │   ├── layout/           Shared navbar, footer, and page layout
│       │   └── products/         Reusable shoe product card
│       ├── data/                 Sample shoe catalog
│       ├── features/
│       │   ├── auth/             Signup, login, and authentication state
│       │   ├── cart/             Cart state and browser persistence
│       │   └── fit-finder/       Recommendation logic and unit tests
│       ├── pages/                Home, About, shop, cart, and account pages
│       ├── services/             Requests to the Express API
│       └── styles/               Shared responsive styles
├── build/                        Generated production frontend
├── server.js                     Express API and static-file server
├── .env.example                  Environment-variable template
└── package.json                  Dependencies and project commands
```

## Shoe Fit Finder

The Fit Finder is a rule-based feature that does not need an AI service or external API. Its recommendation function is in `frontend/src/features/fit-finder/fitFinder.js`; tests are in `frontend/src/features/fit-finder/fitFinder.test.js`.

The sample catalog lives in `frontend/src/data/products.js`. To demonstrate or extend the feature, add products with sizes, widths, activities, prices, and comfort ratings, then run:

```bash
npm test
```
