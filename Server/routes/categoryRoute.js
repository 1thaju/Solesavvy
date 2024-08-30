// routes/categoryRoute.js
const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// POST route for filtering products by category
router.post('/products', async (req, res) => {
    try {
        const { category } = req.body;
        console.log(`Received category: ${category}`);
        const products = await Product.find({ category: category.trim() });
        console.log(`Found products:`, products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(404).json({ message: 'Error fetching products', error });
    }
});
module.exports = router;
