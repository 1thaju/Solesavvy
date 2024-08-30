import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Product.css'

function Products() {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/products');
          setProducts(response.data);
          console.log(response);
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchProducts();
    }, []);
  return (
    <div className='prod'>
      <h2>Trending</h2>
      <div className='Prod_list'>
        {products.map((product)=>(
        <div className='prodcard' key={product.id}>
          <img src={`http://localhost:5000${product.imageUrl.trim()}`}/>
          <div className='prod_disc'>
          <h3>{product.description}</h3>
          <label>{product.name}</label>
          <label> {product.category}</label>
          <label>₹{product.price}</label>
          <Link to={`/product/${product._id}`}>
           <button>View</button>
          </Link>          
          </div>
        </div>  
        ))}
      </div>
    </div>
  )
}

export default Products
