import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react'

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
      const response = await axios.post('https://velopola-a-time-banking-community.onrender.com/api/users/login', formData)
      if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        navigate('/') 
      }
    } catch (error) {
      console.error(error)
      // Note: Replaced alert with a more modern feel would be better with your toast library
      alert("Login Failed: " + (error.response?.data?.message || "Invalid Credentials"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf7] px-4">
      <div className="max-w-md w-full">
        {/* Branding Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-forest rounded-2xl shadow-lg mb-4 text-white">
            <Leaf size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Velopola</h1>
          <p className="text-gray-500 mt-2 font-medium">Empowering communities through skill exchange</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Welcome Back</h2>
          
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                name="email" 
                value={email} 
                placeholder="Email Address" 
                onChange={onChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                name="password" 
                value={password} 
                placeholder="Password" 
                onChange={onChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-forest hover:bg-moss text-white py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-500">
              New here? <Link to="/register" className="text-forest font-bold hover:underline ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login