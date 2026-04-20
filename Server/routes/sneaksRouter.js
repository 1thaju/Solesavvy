const express = require('express');
const router = express.Router();
const sneaksController = require('../controllers/sneaksController');

// GET /api/sneaks/popular
router.get('/popular', sneaksController.getPopularSneakers);

// GET /api/sneaks/search/:keyword
router.get('/search/:keyword', sneaksController.searchSneakers);

module.exports = router;
