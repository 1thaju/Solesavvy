import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext';
import './Login.css'


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { getCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://solesavvy.onrender.com/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      // Dispatch event to notify cart context
      window.dispatchEvent(new Event('tokenChanged'));
      
      // Redirect to home page
      nav('/');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
    <div className='login'>
      <h1>Login</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input 
          type='email' 
          value={email} 
          placeholder='Email' 
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input 
          type='password' 
          value={password} 
          placeholder='Password' 
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <a href='#' onClick={(e) => { e.preventDefault(); }} style={{ cursor: 'pointer' }}>Forgot Password?</a>
      <Link to={'/signup'} style={{ textDecoration: 'none' }}>
        <span style={{ cursor: 'pointer' }}>Don't Have an Account? | Signup</span>
      </Link>
    </div>
    </div>
  );
}

export default Login;
