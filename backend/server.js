require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();
const cartRoutes = require('./routes/cartRoutes');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
// ADD THIS LINE RIGHT HERE:
app.use('/api/cart', cartRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);