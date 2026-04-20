const express = require('express')
const { connectDB, checkConnection } = require('./config/db')
const cors = require('cors');
const authRoutes = require('../Server/routes/authRoutes')
const bodyParser = require('body-parser')
const uploadRoutes = require('../Server/routes/uploadRoute')
const productRoutes = require('../Server/routes/productRoutes')
const productdetailRoutes = require('../Server/routes/productDetailRoute')
const categoryRoute = require('../Server/routes/categoryRoute')
const cartRoutes = require('../Server/routes/cartRoutes')
const orderRoutes = require('../Server/routes/orderRoutes')
const sneaksRoutes = require('../Server/routes/sneaksRouter')
const adminRoutes = require('../Server/routes/adminRoutes')
const paymentRoutes = require('../Server/routes/paymentRoutes')
const path = require('path')
const app = express()
const fs = require('fs');

if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth',authRoutes)
app.use('/api/products',uploadRoutes)
app.use('/api/products',productRoutes)
app.use('/upload', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products',productdetailRoutes)
app.use('/api', categoryRoute);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sneaks', sneaksRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = checkConnection();
    res.json({
        status: 'ok',
        database: dbStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// MongoDB connection check endpoint
app.get('/api/check-db', (req, res) => {
    const dbStatus = checkConnection();
    if (dbStatus) {
        res.json({ 
            connected: true, 
            message: 'MongoDB is connected and running',
            database: 'exammanagement'
        });
    } else {
        res.status(503).json({ 
            connected: false, 
            message: 'MongoDB is not connected. Please check if MongoDB service is running.',
            troubleshooting: [
                '1. Check if MongoDB is running (see server console for instructions)',
                '2. Start MongoDB service if needed',
                '3. Verify MongoDB is listening on port 27017',
                '4. Check server console logs for connection errors'
            ]
        });
    }
});

connectDB()
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 DB check: http://localhost:${PORT}/api/check-db`);
    
    // Check DB connection after server starts
    setTimeout(() => {
        if (!checkConnection()) {
            console.error('\n⚠️ WARNING: MongoDB is not connected!');
            console.error('Database operations will fail until MongoDB is started.');
        }
    }, 1000);
});
