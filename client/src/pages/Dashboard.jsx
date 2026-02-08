import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [skill, setSkill] = useState('')
  const [requests, setRequests] = useState([]) 

  // ... (Keep your existing useEffect, handleLogout, fetchRequests logic exactly the same) ...
  // just copying the render part below for the visual update:

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
    } else {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchRequests(parsedUser.token) 
    }
  }, [navigate])

  const fetchRequests = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('https://velopola-a-time-banking-community.onrender.com/api/swaps', config)
      setRequests(response.data)
    } catch (error) { console.error(error) }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if(!skill) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.put('https://velopola-a-time-banking-community.onrender.com/api/users/skills', { skill }, config)
      setUser({ ...user, skillsOffered: response.data.skillsOffered })
      localStorage.setItem('user', JSON.stringify({ ...user, skillsOffered: response.data.skillsOffered }))
      setSkill('')
    } catch (error) { alert("Failed") }
  }

  const handleSwapAction = async (swapId, action) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.put(`https://velopola-a-time-banking-community.onrender.com/api/swaps/${swapId}`, { status: action }, config)
      fetchRequests(user.token)
    } catch (error) { alert("Action failed") }
  }

  if (!user) return <div className="min-h-screen bg-cream flex items-center justify-center text-forest font-bold">Loading...</div>

  return (
    <div className="min-h-screen bg-cream text-forest p-8 font-sans">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center mb-12 bg-white/40 p-4 rounded-2xl border border-sand/30 shadow-sm backdrop-blur-sm">
        <h1 className="text-3xl font-black text-forest tracking-tighter">Skill<span className="text-moss">Sync</span></h1>
        <div className="space-x-4">
            <button onClick={() => navigate('/find')} className="bg-forest text-cream hover:bg-moss px-6 py-2 rounded-full font-bold transition shadow-md">
            Find Skills 🔍
            </button>
            <button onClick={() => navigate('/map')} className="bg-sand text-forest hover:bg-white px-6 py-2 rounded-full font-bold transition shadow-md border-2 border-forest">
            View Map 🗺️
            </button>
            <button onClick={handleLogout} className="text-forest hover:text-red-600 font-bold px-4 py-2 transition">
            Logout
            </button>
        </div>
      </nav>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
            
            {/* PROFILE CARD */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-r-4 border-sand relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-moss/10 rounded-bl-full -mr-4 -mt-4"></div>
                <h2 className="text-3xl font-bold mb-6 text-forest">Profile</h2>
                <div className="space-y-4 text-lg">
                    <p className="flex justify-between border-b border-cream pb-2">
                        <span className="text-moss font-semibold">Name</span> 
                        <span className="font-bold">{user.name}</span>
                    </p>
                    <p className="flex justify-between border-b border-cream pb-2">
                        <span className="text-moss font-semibold">Email</span> 
                        <span className="font-bold text-sm">{user.email}</span>
                    </p>
                    <div className="mt-6 bg-cream p-4 rounded-xl text-center border border-sand">
                        <p className="text-sm uppercase tracking-widest text-forest/60 mb-1">Time Bank Balance</p>
                        <p className="text-4xl font-black text-forest">{user.credits} <span className="text-xl">Hrs</span></p>
                    </div>
                </div>
            </div>

            {/* INBOX CARD */}
            <div className="bg-forest p-8 rounded-3xl shadow-xl text-cream relative">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Incoming Requests 🔔
                    <span className="bg-moss text-xs px-2 py-1 rounded-full">{requests.length}</span>
                </h2>
                
                {requests.length === 0 ? (
                    <p className="text-cream/50 italic text-center py-4">It's quiet here... too quiet.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req._id} className="bg-white/10 p-4 rounded-xl flex justify-between items-center backdrop-blur-sm border border-white/20">
                                <div>
                                    <p className="font-bold text-lg">{req.requester?.name}</p>
                                    <p className="text-xs text-sand">Wants to swap credits</p>
                                </div>
                                <div className="flex gap-2">
                                    {req.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleSwapAction(req._id, 'accepted')} className="bg-cream text-forest hover:bg-white px-3 py-1 rounded-lg font-bold text-sm transition">Accept</button>
                                            <button onClick={() => handleSwapAction(req._id, 'rejected')} className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm transition">Reject</button>
                                        </>
                                    )}
                                    {req.status === 'accepted' && <span className="bg-moss text-white px-3 py-1 rounded-lg text-xs font-bold">Accepted ✅</span>}
                                    {req.status === 'rejected' && <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">Rejected ❌</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: SKILLS */}
        <div className="bg-sand/20 p-8 rounded-3xl border-2 border-sand border-dashed h-fit">
          <h2 className="text-2xl font-bold mb-2 text-forest">My Skills</h2>
          <p className="text-forest/60 mb-6 text-sm">Add skills to appear in search results.</p>
          
          <form onSubmit={handleAddSkill} className="flex gap-2 mb-8">
            <input 
              type="text" 
              placeholder="e.g. Pottery, React, Yoga..." 
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-white border border-sand focus:outline-none focus:border-forest text-forest placeholder-forest/30 shadow-inner"
            />
            <button type="submit" className="bg-forest hover:bg-moss text-cream px-6 py-2 rounded-xl font-bold shadow-lg transition transform active:scale-95">
              + Add
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            {user.skillsOffered && user.skillsOffered.map((s, index) => (
                <span key={index} className="bg-white text-forest px-4 py-2 rounded-lg font-semibold border-b-2 border-r-2 border-sand shadow-sm text-sm">
                    {s}
                </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard