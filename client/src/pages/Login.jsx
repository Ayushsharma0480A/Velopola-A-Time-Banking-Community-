import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LogIn, Mail, Lock } from 'lucide-react'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://velopola-a-time-banking-community.onrender.com/api/users/login', formData)
      localStorage.setItem('user', JSON.stringify(response.data))
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Glassmorphic Card */}
      <div className="max-w-md w-full bg-white/70 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-forest/10 text-forest rounded-2xl mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 mt-2">Welcome back to the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button className="w-full bg-forest hover:bg-moss text-white font-bold py-3 rounded-xl transition shadow-lg shadow-forest/20">
            Enter Dashboard
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          New here? <Link hide-external-icon="true" to="/register" className="text-forest font-bold hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login