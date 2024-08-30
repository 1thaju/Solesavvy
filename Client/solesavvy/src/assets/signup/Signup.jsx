import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './signup.css'

function Signup() {
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [cofirmpass,setConfirmPass] = useState()
    const navigate = useNavigate()
    const handleSubmit =  async(e)=>{
        e.preventDefault()
        try{
          await axios.post('http://localhost:5000/auth/signup',{username,email,password})
          setUsername('')
          setEmail('')
          setPassword('')
          setConfirmPass('')
          navigate('/login')
        }
        catch(err){
          if(err){
            console.log(err)
          }
        }
        
    }
  return (
    <div className='container-sign'>
    <div className='signup'>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' value={username} placeholder='Enter Your Username' onChange={(e)=>{
            e.preventDefault()
            setUsername(e.target.value)
        }}/>
        <input type='text' value={email} placeholder='Email' onChange={(e)=>{
            e.preventDefault()
            setEmail(e.target.value)
        }}/>
        <input type='password' value={password} placeholder='Password' onChange={(e)=>{
            e.preventDefault()
            setPassword(e.target.value)
        }}/>
        <input type='password' value={cofirmpass} placeholder='Confirm Password' onChange={(e)=>{
            e.preventDefault()
            setConfirmPass(e.target.value)
        }}/>
        <button type="submit">Signup</button>
      </form>
      <Link to={'/login'}>
      <label>Have An Account? | Login</label>
      </Link>
    </div>
    </div>
  )
}

export default Signup
