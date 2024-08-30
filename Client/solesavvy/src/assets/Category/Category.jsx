import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CategoryPage({ category }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/products', { category });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category]);

    return (
        <div>
            <h2>Products in {category} Category</h2>
            <div>
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div>
                        {products.map((product) => (
                            <div key={product._id}>
                                <img src={`http://localhost:5000${product.imageUrl.trim()}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ₹{product.price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;
