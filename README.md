# Krishi Mithra (ಕೃಷಿ ಮಿತ್ರ / कृषि मित्र)

A MERN stack marketplace where farmers sell crops directly to buyers, with no middlemen.
Available in **Kannada, English and Hindi**.

## Features

- Farmer and buyer registration and login (JWT, hashed passwords)
- Separate farmer and buyer dashboards with live statistics
- Farmers: add, edit, hide and delete crop listings with price per kg and quantity
- Buyers: search, filter (category, state, price range, organic) and sort crops
- Order management: place order, accept or reject, ship, deliver, cancel
- Stock is reduced when an order is placed and restored on cancel or reject
- Crop information page: trusted government, research and market sources, crop guides and the Kisan Call Centre number
- General mandi information, market terminology, preparation tips and links to official market resources
- Language switcher (Kannada, English, Hindi) saved in the browser
- Responsive design for phone, tablet and desktop

## What you need

1. **Node.js 18 or newer** (https://nodejs.org)
2. **MongoDB** running locally (MongoDB Community Server) or a free MongoDB Atlas database
3. **VS Code** (optional, any editor works)

## Install and run

1. Extract the ZIP and open the `krishi-mithra` folder in VS Code (File > Open Folder).
2. Open a terminal in VS Code (Terminal > New Terminal).
3. Make sure MongoDB is running. For a local install the default address `mongodb://127.0.0.1:27017` is already set.
4. Install everything with one command:

   ```
   npm run setup
   ```

5. To set up a new environment in the VS Code PowerShell terminal:

   ```powershell
   Copy-Item server\.env.example server\.env
   ```

   Then fill in your MongoDB URI and a strong JWT secret. **No data.gov.in API key is needed** to run the site or use the Mandi Information page.

6. (Optional) Load demo farmers, buyer and crops:

   ```
   npm run seed
   ```

7. Start the backend and frontend together:

   ```
   npm run dev
   ```

8. Open **http://localhost:5173** in your browser and choose **Mandi information** in the navigation.

The API runs on http://localhost:5001.

## Mandi information

The Mandi Information page provides general guidance about how mandis work, commonly used market terms, preparation tips and links to Agmarknet and e-NAM. It does not fetch, cache or display live mandi prices, and it does not require a data.gov.in API key. Confirm local market rules and procedures with your market committee or Agriculture Department.

## Demo accounts (after `npm run seed`)

| Role   | Email                    | Password    |
| ------ | ------------------------ | ----------- |
| Farmer | farmer1@krishimithra.in  | password123 |
| Farmer | farmer2@krishimithra.in  | password123 |
| Buyer  | buyer@krishimithra.in    | password123 |

The demo prices and quantities are sample values only. To wipe the database and reload demo data run `npm run seed -- --reset`.

## Try the full flow

1. Login as a farmer and add a crop from the dashboard.
2. Login as a buyer in another browser or a private window, open the marketplace and order the crop.
3. Back in the farmer dashboard, open Orders and accept, ship and deliver it.
4. The buyer sees each status change in their Orders tab.

## Automatic API check

With the backend running, open a second terminal and run:

```
npm --prefix server run smoke
```

It registers test users, creates a crop, searches, orders, changes statuses and checks that stock is restored.

## Using MongoDB Atlas instead

1. Create a free cluster at https://www.mongodb.com/atlas and copy the connection string.
2. Open `server/.env` and replace `MONGO_URI` with that string (add a database name such as `/krishi_mithra`).
3. Change `JWT_SECRET` to your own long random text.

## Run as a single app (production style)

```
npm run build
npm start
```

Then open http://localhost:5001. The backend serves the built frontend.

## Project structure

```
krishi-mithra/
  server/            Express and MongoDB API
    models/          User, Crop, Order
    routes/          auth, crops, orders, dashboard, info
    middleware/      JWT authentication and role checks
    data/info.js     Trusted sources and crop guides (3 languages)
    seed.js          Demo data loader
    scripts/smoke.js API check script
  client/            React app (Vite)
    src/pages/       Home, Marketplace, MandiInfo, CropDetail, dashboards, Info, Login, Register
    src/components/  Navbar, CropCard, CropForm, OrdersPanel and more
    src/i18n/        Kannada, English and Hindi text
```

## API overview

| Method | Path                       | Who      | Purpose                    |
| ------ | -------------------------- | -------- | -------------------------- |
| POST   | /api/auth/register         | public   | Create account             |
| POST   | /api/auth/login            | public   | Login                      |
| GET    | /api/crops                 | public   | Search and filter crops    |
| GET    | /api/crops/:id             | public   | Crop details               |
| GET    | /api/crops/mine            | farmer   | My listings                |
| POST   | /api/crops                 | farmer   | Add crop                   |
| PUT    | /api/crops/:id             | farmer   | Edit crop                  |
| DELETE | /api/crops/:id             | farmer   | Delete crop                |
| POST   | /api/orders                | buyer    | Place order                |
| GET    | /api/orders/mine           | both     | My orders                  |
| PATCH  | /api/orders/:id/status     | both     | Update order status        |
| GET    | /api/dashboard/stats       | both     | Dashboard numbers          |
| GET    | /api/info/sources          | public   | Trusted sources            |
| GET    | /api/info/guides           | public   | Crop guides                |

## Troubleshooting

- **Could not connect to MongoDB**: start MongoDB, or fix `MONGO_URI` in `server/.env`.
- **Port already in use**: change `PORT` in `server/.env` and the proxy target in `client/vite.config.js`.
- **Blank crop list**: run `npm run seed`, or add crops from a farmer account.
- **Fonts look different offline**: Kannada and Hindi fonts load from Google Fonts. Without internet your system fonts are used.

## Notes on information sources

The Crop Information page links to official websites. Website addresses can change over time, so confirm a link if it does not open. Crop guides are general; confirm exact dates and varieties with your local Raitha Samparka Kendra, Krishi Vigyan Kendra or agricultural university.
