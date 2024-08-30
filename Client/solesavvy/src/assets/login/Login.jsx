import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cred,setCred] = useState(false)
  const nav =  useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      console.log('Login Successful');
      nav('/land');
    } catch (error) {
      console.error('Error:', error);
      console.log(error.response?.data?.message || 'Login failed');
      setCred(!cred)
    }
    setEmail('');
    setPassword('');
  };

  return (
    <div className='container'>
    <div className='login'>
      <h1>Login</h1>
      {cred && (
        <label>Invalid Credential!</label>
      )}
      <form onSubmit={handleSubmit}>
        <input type='text' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Login</button>
      </form>
      <a href=''>Forgot Password?</a>
      <Link to={'/signup'}>
      <a >Don't Have an Account? | Signup</a>
      </Link>
    </div>
    </div>
  );
}

export default Login;
