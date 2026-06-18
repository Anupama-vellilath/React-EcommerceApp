require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');

connectDB();
const cartRoutes = require('./routes/cartRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
// ADD THIS LINE RIGHT HERE:
app.use('/api/cart', cartRoutes);


app.use('/api/subcategories', subcategoryRoutes);


// Mount categories api endpoints tree layout
app.use('/api/categories', categoryRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);