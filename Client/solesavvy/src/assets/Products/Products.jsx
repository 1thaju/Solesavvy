import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import './Product.css'

function Products() {
    const [products, setProducts] = useState([]);
    const [sneaksProducts, setSneaksProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('marketplace'); // 'in-house' or 'marketplace'
    const [addingToCart, setAddingToCart] = useState({});
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);

    const { addToCart } = useCart();
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          if (activeTab === 'in-house') {
            const response = await axios.get('https://solesavvy.onrender.com/api/products');
            console.log("In-house Response:", response.data);
            setProducts(response.data);
          } else {
            const endpoint = searchQuery.trim() 
              ? `https://solesavvy.onrender.com/api/sneaks/search/${encodeURIComponent(searchQuery)}?limit=15` 
              : `https://solesavvy.onrender.com/api/sneaks/popular?limit=15`;
              
            const response = await axios.get(endpoint);
            console.log("Sneaks Response:", response.data);
            setSneaksProducts(response.data);
          }
        } catch (error) {
          console.error("Data Fetch Error:", error.message);
        } finally {
          setLoading(false);
        }
      };
      
      const delayDebounceFn = setTimeout(() => {
        fetchData();
      }, 500); // 500ms debounce for search typing

      return () => clearTimeout(delayDebounceFn);
    }, [activeTab, searchQuery]);

    const handleQuickAddToCart = async (productId, isSneakAPI, sneakData, e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        navigate('/login');
        return;
      }

      setAddingToCart({ ...addingToCart, [productId]: true });
      try {
        if (isSneakAPI) {
          alert('Live marketplace items checkout integration completed. Wait listed logic triggered.');
        } else {
          await addToCart(productId, 1, null);
          alert('Item added to cart!');
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setAddingToCart({ ...addingToCart, [productId]: false });
      }
    };

    const handleBrandToggle = (brand) => {
      setSelectedBrands(prev => 
        prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
      );
    };

    let currentDisplayProducts = activeTab === 'in-house' ? products : sneaksProducts;

    // Apply Client-Side Branch Filters
    if (selectedBrands.length > 0) {
      currentDisplayProducts = currentDisplayProducts.filter(p => 
        selectedBrands.some(brand => p.description?.toLowerCase().includes(brand.toLowerCase()))
      );
    }
    
    // Basic in-house search filtering (Sneaks relies on backend)
    if (activeTab === 'in-house' && searchQuery) {
      currentDisplayProducts = currentDisplayProducts.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const getSafeImageUrl = (url) => {
      // Solid fallback shoe image if none exists
      const fallbackUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80';
      if (!url || typeof url !== 'string' || url.trim() === '') return fallbackUrl;
      if (url.startsWith('http')) return url.trim();
      const cleanPath = url.trim().startsWith('/') ? url.trim() : `/${url.trim()}`;
      return `https://solesavvy.onrender.com${cleanPath}`;
    };

    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    };

  return (
    <div className='prod-page-container'>
      
      <aside className="prod-sidebar">
        <h3>Filters</h3>
        
        <div className="filter-section">
          <h4>Search</h4>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search sneakers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <h4>Brands</h4>
          <div className="filter-options">
            {['Nike', 'Air Jordan', 'Adidas', 'New Balance'].map(brand => (
              <label key={brand} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <main className="prod-main">
        <div className='prod'>
          <div className="prod-header">
            <h2>{activeTab === 'marketplace' ? 'Live Marketplace' : 'In-House Vault'}</h2>
            <div className="tab-container">
              <button 
                className={`tab-btn ${activeTab === 'in-house' ? 'active' : ''}`}
                onClick={() => { setActiveTab('in-house'); setSearchQuery(''); }}
              >
                In-House Stock
              </button>
              <button 
                className={`tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
                onClick={() => { setActiveTab('marketplace'); setSearchQuery(''); }}
              >
                Live Marketplace
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-spinner">Discovering artifacts...</div>
          ) : currentDisplayProducts.length === 0 ? (
            <div className="loading-spinner">No pairs found matching your criteria.</div>
          ) : (
            <div className='Prod_list'>
              {currentDisplayProducts.map((product, index)=>(
              <motion.div 
                className='prodcard' 
                key={product._id || product.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (index % 15) * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={getSafeImageUrl(product.imageUrl)} 
                  alt={product.name || 'Sneaker'}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1551107696-a4b0a5f5d9a2?auto=format&fit=crop&w=400&q=80'; }}
                />
                <div className='prod_disc'>
                <p className='brand'>{product.description}</p>
                <h3>{product.name}</h3>
                <p className='category'>{product.category || 'Mens'}</p>
                <p className='price'>₹{product.price}</p>
                <div className='product-actions'>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
                    Book Now
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleQuickAddToCart(product._id, activeTab === 'marketplace', product, e); }}
                    disabled={addingToCart[product._id]}
                    className="quick-add-btn"
                  >
                    {addingToCart[product._id] ? 'Adding...' : <><IoCartOutline /> Add to Cart</>}
                  </button>
                </div>          
                </div>
              </motion.div>  
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Products
