import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './signup.css'

function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpass, setConfirmPass] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Validation
        if (!username || !email || !password || !confirmpass) {
            setError('Please fill in all fields')
            return
        }

        if (password !== confirmpass) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setLoading(true)
        try {
            await axios.post('https://solesavvy.onrender.com/auth/signup', { username, email, password })
            setSuccess(true)
            setUsername('')
            setEmail('')
            setPassword('')
            setConfirmPass('')
            setTimeout(() => {
                navigate('/login')
            }, 1500)
        }
        catch (err) {
            console.error('Signup error:', err)
            console.error('Error response:', err.response?.data)
            console.error('Error response data:', JSON.stringify(err.response?.data, null, 2))
            let errorMessage = 'Signup failed. Please try again.'
            
            if (err.response) {
                // Server responded with error
                const responseData = err.response.data;
                console.log('Full error response:', responseData);
                
                // Get the actual error message
                let serverMessage = responseData?.message || 'Unknown error';
                let serverError = responseData?.error;
                
                // If error is an object, try to extract the message
                if (typeof serverError === 'object' && serverError !== null) {
                    serverError = serverError.message || JSON.stringify(serverError);
                }
                
                // Check for network/database errors
                if (err.response.status === 500) {
                    if (serverMessage?.includes('Database') || serverMessage?.includes('MongoDB')) {
                        errorMessage = '❌ Database connection error. Please check if MongoDB is running and try again.\n\n' +
                                     'To check MongoDB:\n' +
                                     '1. Open Services (press Win+R, type "services.msc")\n' +
                                     '2. Look for "MongoDB" service\n' +
                                     '3. If stopped, right-click and select "Start"';
                    } else if (serverMessage?.includes('password')) {
                        errorMessage = 'Error processing password. Please try again.'
                    } else {
                        // Show the actual error message from server
                        errorMessage = serverMessage;
                        if (serverError) {
                            errorMessage += `\n\nError details: ${serverError}`;
                        }
                        // Also show the full error in console for debugging
                        console.error('Server error details:', serverError);
                    }
                } else {
                    // For non-500 errors, show the message
                    errorMessage = serverMessage;
                    if (serverError) {
                        errorMessage += `\n\nDetails: ${serverError}`;
                    }
                }
            } else if (err.request) {
                // Request made but no response
                errorMessage = 'Unable to connect to server. Please check if the server is running on port 5000.'
            } else {
                // Something else happened
                errorMessage = err.message || errorMessage
            }
            
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='container-sign'>
    <div className='signup'>
      <h1>Signup</h1>
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px', 
          fontSize: '14px',
          whiteSpace: 'pre-line',
          textAlign: 'left',
          padding: '0.75rem 1rem',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem'
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: 'green', marginBottom: '10px', fontSize: '14px' }}>
          Account created successfully! Redirecting to login...
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input 
          type='text' 
          value={username} 
          placeholder='Enter Your Username' 
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
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
          minLength={6}
          disabled={loading}
        />
        <input 
          type='password' 
          value={confirmpass} 
          placeholder='Confirm Password' 
          onChange={(e) => setConfirmPass(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Signup'}
        </button>
      </form>
      <Link to={'/login'} style={{ textDecoration: 'none' }}>
        <span style={{ cursor: 'pointer' }}>Have An Account? | Login</span>
      </Link>
    </div>
    </div>
  )
}

export default Signup
