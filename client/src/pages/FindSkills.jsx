import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function FindSkills() {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users')
        setUsers(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError('Failed to load community. Is the server running?')
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRequestSwap = async (recipientId) => {
    if (!currentUser) return alert("Please login first")
    
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } }
      await axios.post('http://localhost:5000/api/swaps', { recipientId }, config)
      alert("Request sent! 🌿")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request")
    }
  }

  return (
    <div className="min-h-screen bg-cream text-forest p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-black text-forest tracking-tight">Community <span className="text-moss">Garden</span></h1>
          <p className="text-forest/60 mt-2">Find someone to trade skills with.</p>
        </div>
        <Link 
          to="/dashboard" 
          className="bg-white border-2 border-sand text-forest hover:bg-forest hover:text-cream px-6 py-3 rounded-xl font-bold transition shadow-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* ERROR / LOADING */}
      {loading && <p className="text-center text-xl text-forest animate-pulse">Growing the list...</p>}
      {error && <p className="text-center text-red-600 text-xl bg-red-100 p-4 rounded-xl border border-red-200">{error}</p>}

      {/* USER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-8 rounded-3xl shadow-lg border-b-4 border-r-4 border-sand hover:-translate-y-2 transition duration-300 relative group">
            
            {/* Top Section: Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-forest text-cream rounded-full flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-sand">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-forest group-hover:text-moss transition">{user.name}</h3>
                <p className="text-sm text-forest/50 font-medium">{user.email}</p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8 bg-cream/30 p-4 rounded-xl border border-sand/30 h-28 overflow-y-auto">
              <p className="text-xs uppercase tracking-widest text-forest/60 mb-3 font-bold">Can Teach:</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.length > 0 ? (
                  user.skillsOffered.map((skill, index) => (
                    <span key={index} className="bg-cream text-forest px-3 py-1 rounded-full text-xs font-bold border border-sand shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-forest/40 text-sm italic">No skills listed yet.</span>
                )}
              </div>
            </div>

            {/* Request Button */}
            {currentUser && currentUser._id !== user._id ? (
                <button 
                  onClick={() => handleRequestSwap(user._id)}
                  className="w-full bg-forest hover:bg-moss text-cream py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
                >
                  Request Swap 🌿
                </button>
            ) : (
                <button disabled className="w-full bg-sand/20 text-forest/40 border-2 border-sand/20 py-3 rounded-xl font-bold cursor-not-allowed">
                  {currentUser ? "This is You" : "Login to Swap"}
                </button>
            )}
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default FindSkills