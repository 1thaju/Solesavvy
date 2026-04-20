const mongoose = require('mongoose');
const initDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/solesavvy', {useNewUrlParser: true, useUnifiedTopology: true});
        const Product = require('./models/product');
        
        const count = await Product.countDocuments();
        if (count === 0) {
            const seedProducts = [
                { name: 'Air Jordan 1 Retro', description: 'Nike Classic', category: 'Men', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
                { name: 'Yeezy Boost 350', description: 'Adidas Originals', category: 'Men', price: 21000, imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0a5f5d9a2' },
                { name: 'AirMax 270 React', description: 'Nike Sportswear', category: 'Women', price: 13500, imageUrl: 'https://images.unsplash.com/photo-1514736737517-5e608035ed73' },
                { name: 'Dunk Low Rose', description: 'Nike Dunk', category: 'Women', price: 9500, imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a' },
                { name: 'Jordan 1 Mid Kids', description: 'Nike Jordan', category: 'Kids', price: 7000, imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782' },
                { name: 'Superstar Toddler', description: 'Adidas Originals', category: 'Kids', price: 4500, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5' },
                { name: 'Travis Scott x Dunk', description: 'Exclusive Collaboration', category: 'Collections', price: 85000, imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519' }
            ];
            await Product.insertMany(seedProducts);
            console.log('Database seeded with ' + seedProducts.length + ' products.');
        } else {
            console.log('Database already has ' + count + ' products. Updating categories if needed...');
            await Product.updateMany({category: 'Male'}, {$set: {category: 'Men'}});
            await Product.updateMany({category: 'Sports'}, {$set: {category: 'Collections'}});
            console.log('Category names normalized.');
        }
    } catch(err) {
        console.log(err.message);
    } finally {
        mongoose.disconnect();
    }
};

initDB();
