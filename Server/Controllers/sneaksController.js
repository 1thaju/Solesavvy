const Product = require('../models/product');

const getPopularSneakers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    
    // Fetch products locally from the native database
    const products = await Product.find().limit(limit);
    
    return res.status(200).json(products);
  } catch (error) {
    console.error("Local DB Failure (Popular):", error.message);
    res.status(500).json({ message: "Failed to fetch popular sneakers from local database." });
  }
};

const searchSneakers = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const limit = parseInt(req.query.limit) || 15;

    // Search locally using regex on product name and description
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    }).limit(limit);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Local DB Failure (Search):", error.message);
    res.status(500).json({ message: "Failed to search sneakers from local database." });
  }
};

module.exports = {
  getPopularSneakers,
  searchSneakers
};
