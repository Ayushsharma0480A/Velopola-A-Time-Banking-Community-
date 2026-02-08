import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const navigate = useNavigate()

  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData)
      
      if(response.data) {
        // SAVE THE TOKEN! This is the most important part.
        localStorage.setItem('user', JSON.stringify(response.data))
        
        alert("Login Successful!")
        navigate('/') // Send them to the Dashboard (Home)
      }
    } catch (error) {
      console.error(error)
      alert("Login Failed: " + (error.response?.data?.message || "Invalid Credentials"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Login</h1>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input 
            type="email" 
            name="email" 
            value={email} 
            placeholder="Email" 
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <input 
            type="password" 
            name="password" 
            value={password} 
            placeholder="Password" 
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition">
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          New here? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login