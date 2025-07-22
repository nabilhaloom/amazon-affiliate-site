// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  affiliateLink: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ecoRating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

// API Routes

// Get all active products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook for n8n integration
app.post('/api/webhook/product-update', async (req, res) => {
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { operation, productId, productData } = req.body;
  
  try {
    switch (operation) {
      case 'update':
        await Product.findByIdAndUpdate(productId, {
          ...productData,
          updatedAt: new Date()
        });
        break;
      case 'deactivate':
        await Product.findByIdAndUpdate(productId, {
          isActive: false,
          updatedAt: new Date()
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Dashboard Analytics Endpoint
app.get('/api/analytics', async (req, res) => {
  // In production: Integrate with analytics service
  res.json({
    monthlyVisitors: 15230,
    conversionRate: 4.7,
    topProducts: [
      { id: 'prod_001', name: 'Solar Charger', clicks: 3420 },
      { id: 'prod_002', name: 'Bamboo Earbuds', clicks: 2980 }
    ],
    revenue: 2875.50
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});