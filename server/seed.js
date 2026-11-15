require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Crop = require('./models/Crop');
const Order = require('./models/Order');

const reset = process.argv.includes('--reset');

const farmers = [
  { name: 'Ramesh Gowda', email: 'farmer1@krishimithra.in', phone: '9886012345', state: 'Karnataka', district: 'Mandya' },
  { name: 'Lakshmi Devi', email: 'farmer2@krishimithra.in', phone: '9448012345', state: 'Karnataka', district: 'Dharwad' }
];

const cropsFor = (a, b) => [
  { farmer: a, name: 'Ragi (Finger Millet)', category: 'grain', pricePerKg: 38, quantityKg: 1200, minOrderKg: 25, organic: true, description: 'Sun dried ragi from this season harvest, cleaned and bagged in 25 kg sacks.' },
  { farmer: a, name: 'Tomato', category: 'vegetable', pricePerKg: 22, quantityKg: 800, minOrderKg: 20, description: 'Firm, ripe tomatoes picked this week.' },
  { farmer: a, name: 'Mango (Totapuri)', category: 'fruit', pricePerKg: 45, quantityKg: 500, minOrderKg: 10, description: 'Tree ripened mangoes suitable for pulp and table use.' },
  { farmer: a, name: 'Turmeric', category: 'spice', pricePerKg: 110, quantityKg: 300, minOrderKg: 5, organic: true, description: 'Cured and polished turmeric fingers.' },
  { farmer: b, name: 'Tur Dal (Pigeon Pea)', category: 'pulse', pricePerKg: 95, quantityKg: 600, minOrderKg: 10, description: 'Clean tur grain, graded and sun dried.' },
  { farmer: b, name: 'Groundnut', category: 'oilseed', pricePerKg: 62, quantityKg: 700, minOrderKg: 20, description: 'Bold kernel groundnut, low moisture.' },
  { farmer: b, name: 'Onion', category: 'vegetable', pricePerKg: 26, quantityKg: 1500, minOrderKg: 50, description: 'Well cured red onions, good for storage.' },
  { farmer: b, name: 'Maize', category: 'grain', pricePerKg: 21, quantityKg: 2000, minOrderKg: 100, description: 'Dry yellow maize, suitable for feed and flour.' }
];

async function run() {
  await connectDB();
  if (reset) {
    await Promise.all([User.deleteMany({}), Crop.deleteMany({}), Order.deleteMany({})]);
    console.log('Existing data removed');
  } else if (await User.exists({})) {
    console.log('Database already has data. Run "npm run seed -- --reset" to wipe it and load demo data.');
    return;
  }

  const created = [];
  for (const f of farmers) {
    created.push(await User.create({ ...f, password: 'password123', role: 'farmer', address: f.district + ', Karnataka' }));
  }
  await User.create({
    name: 'Anita Traders',
    email: 'buyer@krishimithra.in',
    password: 'password123',
    role: 'buyer',
    phone: '9900112233',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: '12, Market Road, Bengaluru, Karnataka'
  });

  const list = cropsFor(created[0], created[1]).map((c) => ({
    ...c,
    farmer: c.farmer._id,
    state: c.farmer.state,
    district: c.farmer.district,
    harvestDate: new Date(Date.now() - 5 * 24 * 3600 * 1000)
  }));
  await Crop.insertMany(list);

  console.log('Demo data loaded');
  console.log('Farmer: farmer1@krishimithra.in / password123');
  console.log('Farmer: farmer2@krishimithra.in / password123');
  console.log('Buyer : buyer@krishimithra.in / password123');
}

run()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
