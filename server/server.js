require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { fail } = require('./utils/respond');

const app = express();

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/info', require('./routes/info'));
app.use('/api', (req, res) => fail(res, 404, 'NOT_FOUND', 'Route not found'));

const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return fail(res, 400, 'VALIDATION', 'Invalid JSON body');
  if (err.name === 'ValidationError') return fail(res, 400, 'VALIDATION', err.message);
  if (err.code === 11000) return fail(res, 409, 'EMAIL_EXISTS', 'Already exists');
  console.error(err);
  return fail(res, 500, 'SERVER', 'Something went wrong');
});

const port = process.env.PORT || 5001;

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing JWT_SECRET or MONGO_URI in server/.env');
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(port, () => console.log('Krishi Mithra API running on http://localhost:' + port));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Start MongoDB or update MONGO_URI in server/.env');
    process.exit(1);
  });
