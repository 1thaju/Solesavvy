const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors');
const authRoutes = require('../Server/routes/authRoutes')
const bodyParser = require('body-parser')
const uploadRoutes = require('../Server/routes/uploadRoute')
const productRoutes = require('../Server/routes/productRoutes')
const productdetailRoutes = require('../Server/routes/productDetailRoute')
const categoryRoute = require('../Server/routes/categoryRoute')
const path = require('path')
const app = express()
const fs = require('fs');

if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

app.use(cors());
app.use(bodyParser.json())
app.use('/auth',authRoutes)
app.use('/api/products',uploadRoutes)
app.use('/api/products',productRoutes)
app.use('/upload', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products',productdetailRoutes)
app.use('/api', categoryRoute);




connectDB()
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
