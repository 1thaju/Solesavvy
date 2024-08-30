const express = require('express')
const {signup , login} = require('../Controllers/authController')
const verifyToken = require("../middleware/authmiddleware")

const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)

router.get('/dashboard',verifyToken,(req,res)=>{
    res.json({message:'haai Welcome...'})
})

module.exports = router;