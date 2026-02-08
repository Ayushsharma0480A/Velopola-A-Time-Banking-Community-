import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Hooks for navigation
import axios from 'axios' // To talk to the backend

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  
  const navigate = useNavigate()

  const { name, email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Connect to the Backend
      const response = await axios.post('http://localhost:5000/api/users', formData)
      
      if(response.data) {
        alert("Registration Successful!")
        navigate('/login') // Send them to login page
      }
    } catch (error) {
      console.error(error)
      alert("Registration Failed: " + (error.response?.data?.message || "Server Error"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-500">Register</h1>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name" 
            value={name} 
            placeholder="Name" 
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
          />
          <input 
            type="email" 
            name="email" 
            value={email} 
            placeholder="Email" 
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
          />
          <input 
            type="password" 
            name="password" 
            value={password} 
            placeholder="Password" 
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
          />
          
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-bold transition">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register