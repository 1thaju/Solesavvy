const express = require('express');
const router = express.Router();
const Product = require('../models/product')

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;