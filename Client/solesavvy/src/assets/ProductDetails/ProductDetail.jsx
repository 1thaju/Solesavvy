import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoCartOutline } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import NavBar from '../Navbar/NavBar';
import Footer from '../LandingPage/Footer/Footer';
import './Productdetail.css'

function ProductDetail() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(` http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <React.Fragment>
         <NavBar/>

    <div className='product_details'>
      <img src={`http://localhost:5000${product.imageUrl.trim()}`} alt={product.name} />
      <div className="prodcontent">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p> {product.category}</p>
      <p>₹{product.price}</p>
      <label>Sizes Available</label>
      <div className="sizes">
        <div className="size1">6</div>
        <div className="size1">7</div>
        <div className="size1">8</div>
        <div className="size1">9</div>
      </div>
      <div className='buttoncontent'>
        <button>Add to Cart  <IoCartOutline /></button>
        <button>Favourite  <FiHeart /></button>
      </div>
     
      </div>
    </div>
    <Footer/>
    </React.Fragment>
  );
}

export default ProductDetail;
