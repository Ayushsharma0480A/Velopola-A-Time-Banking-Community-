import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Wallet, TrendingUp, Inbox, Plus, CheckCircle, XCircle, 
  ListTodo, Trash2, CheckSquare, Square
} from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [skill, setSkill] = useState('')
  const [requests, setRequests] = useState([]) 
  const [loading, setLoading] = useState(true)

  // --- NEW: TASK MANAGER STATE ---
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  // Fetch Data on Load
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
    } else {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchRequests(parsedUser.token) 
      fetchNotes(parsedUser.token) // <-- Call Read Tasks
    }
  }, [navigate])

  const fetchRequests = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('https://velopola-a-time-banking-community.onrender.com/api/swaps', config)
      setRequests(response.data)
      setLoading(false)
    } catch (error) { 
      toast.error("Could not load requests")
      setLoading(false)
    }
  }

  // ==========================================
  // TASK 4: CRUD OPERATIONS FOR NOTES/TASKS
  // ==========================================

  // 1. READ (GET)
  const fetchNotes = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('https://velopola-a-time-banking-community.onrender.com/api/notes', config)
      setNotes(response.data)
    } catch (error) {
      console.error("Could not load tasks")
    }
  }

  // 2. CREATE (POST)
  const handleAddNote = async (e) => {
    e.preventDefault()
    if(!newNote.trim()) return toast.error("Please enter a task")

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.post('https://velopola-a-time-banking-community.onrender.com/api/notes', { text: newNote }, config)
      
      setNotes([response.data, ...notes]) // Add new note to the top of the list
      setNewNote('')
      toast.success("Task created!")
    } catch (error) { 
      toast.error("Failed to add task") 
    }
  }

  // 3. UPDATE (PUT)
  const handleToggleNote = async (note) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.put(
        `https://velopola-a-time-banking-community.onrender.com/api/notes/${note._id}`, 
        { isCompleted: !note.isCompleted }, 
        config
      )
      
      // Update UI with the edited note
      setNotes(notes.map(n => n._id === note._id ? response.data : n))
    } catch (error) { 
      toast.error("Failed to update task") 
    }
  }

  // 4. DELETE (DELETE)
  const handleDeleteNote = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.delete(`https://velopola-a-time-banking-community.onrender.com/api/notes/${id}`, config)
      
      // Remove from UI
      setNotes(notes.filter(n => n._id !== id))
      toast.success("Task deleted!")
    } catch (error) { 
      toast.error("Failed to delete task") 
    }
  }

  // ==========================================
  // EXISTING SKILL & SWAP LOGIC
  // ==========================================

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if(!skill) return toast.error("Please enter a skill")
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.put('https://velopola-a-time-banking-community.onrender.com/api/users/skills', { skill }, config)
      const updatedUser = { ...user, skillsOffered: response.data.skillsOffered }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setSkill('')
      toast.success("Skill added!")
    } catch (error) { toast.error("Failed to add skill") }
  }

  const handleSwapAction = async (swapId, action) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.put(`https://velopola-a-time-banking-community.onrender.com/api/swaps/${swapId}`, { status: action }, config)
      fetchRequests(user.token) 
      if(action === 'accepted') toast.success("Request Accepted!")
      else toast('Request Rejected', { icon: '👋' })
    } catch (error) { toast.error("Action failed") }
  }

  if (loading || !user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. WELCOME HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Hello, <span className="text-forest">{user.name}</span>! 👋
        </h1>
        <p className="text-gray-500 mt-1">Manage your skills, requests, and tasks here.</p>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-green-50 text-forest rounded-xl"><Wallet size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Time Credits</p>
            <p className="text-3xl font-bold text-gray-900">{user.credits} <span className="text-sm font-normal text-gray-400">Hrs</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl"><Inbox size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
            <p className="text-3xl font-bold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><ListTodo size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{notes.filter(n => !n.isCompleted).length}</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: INBOX & TASK MANAGER */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TASK MANAGER (CRUD Assignment) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <ListTodo size={20} className="text-forest"/> My Learning Tasks
            </h2>
            
            {/* CREATE Task */}
            <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="What do you need to learn or prepare?" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest/20 transition"
              />
              <button type="submit" className="bg-forest hover:bg-moss text-white px-6 py-3 rounded-xl font-bold transition shadow-sm">
                Add Task
              </button>
            </form>

            {/* READ Tasks */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-gray-400 text-center py-4 italic">No tasks yet. Create one above!</p>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className={`flex items-center justify-between p-4 rounded-xl border transition ${note.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-forest/30'}`}>
                    
                    {/* UPDATE Task (Toggle Complete) */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleToggleNote(note)}>
                      <button className={`text-xl ${note.isCompleted ? 'text-forest' : 'text-gray-300 hover:text-forest'}`}>
                        {note.isCompleted ? <CheckSquare size={24} /> : <Square size={24} />}
                      </button>
                      <span className={`text-lg transition-all ${note.isCompleted ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                        {note.text}
                      </span>
                    </div>

                    {/* DELETE Task */}
                    <button 
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* INBOX */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Inbox size={20} className="text-forest"/> Swap Requests Inbox
            </h2>
            {/* ... Existing Inbox Code ... */}
            <div className="divide-y divide-gray-100">
                {requests.length === 0 ? <p className="text-gray-400 py-4">No requests yet.</p> : requests.map((req) => (
                  <div key={req._id} className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-forest text-white flex items-center justify-center font-bold">
                        {req.requester?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{req.requester?.name}</p>
                        <p className="text-sm text-gray-500">Wants to trade skills</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {req.status === 'pending' && (
                        <>
                          <button onClick={() => handleSwapAction(req._id, 'accepted')} className="flex items-center gap-2 px-3 py-1.5 bg-forest text-white rounded-lg text-sm font-bold">Accept</button>
                          <button onClick={() => handleSwapAction(req._id, 'rejected')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold">Reject</button>
                        </>
                      )}
                      {req.status === 'accepted' && <span className="text-green-600 font-bold text-sm">Accepted ✅</span>}
                      {req.status === 'rejected' && <span className="text-red-600 font-bold text-sm">Rejected ❌</span>}
                    </div>
                  </div>
                ))}
              </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SKILLS MANAGER */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-forest"/> My Skills
            </h2>
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
              <input type="text" placeholder="Ex: Pottery..." value={skill} onChange={(e) => setSkill(e.target.value)} className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200" />
              <button type="submit" className="bg-forest text-white p-2 rounded-lg"><Plus size={24} /></button>
            </form>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered && user.skillsOffered.map((s, index) => (
                <span key={index} className="px-3 py-1.5 bg-cream/50 text-forest border border-sand/50 rounded-lg text-sm font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard