import React, { useState } from 'react';
import axios from 'axios';

const ProductUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('image', formData.image);
  

    try {
      const response = await axios.post('http://localhost:5000/api/products/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
      e.target.reset();
    } catch (error) {
      console.error('Error uploading product:', error);
    }
   
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Product Description"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Product Price"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Product Category"
        onChange={handleChange}
        required
      />
      <input type="file" name="image" onChange={handleFileChange} required />
      <button type="submit">Upload Product</button>
    </form>
  );
};

export default ProductUpload;
