const express = require('express')
const Product = require('../models/product')
const upload = require('../config/uploadConfig')

const router = express.Router()

router.post('/upload', upload.single('image'), async (req, res) => {
        try{
        const {name,description,price,category} = req.body;
        const imageUrl = req.file ? `/upload/${req.file.filename.trim()}` : '';


        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl,
        })
        await newProduct.save()
        res.status(201).json(newProduct)
    }
    catch(error){
        res.status(500).json({erorr:error.message})
    }
})
module.exports = router