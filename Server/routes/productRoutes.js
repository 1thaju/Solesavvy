const express = require('express')
const Product = require('../models/product')

const router = express.Router()

router.get('/',async(req,res)=>{
    try {
        const products = await Product.find();
        res.json(products)
    } catch (error) {
        res.json({error:error.message})
    }

})

module.exports = router