import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import QuickGuide from '../components/QuickGuide';
import { 
  Wallet, TrendingUp, Inbox, Plus, CheckCircle, XCircle, 
  ListTodo, Trash2, CheckSquare, Square, MessageSquare, Video, Send
} from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [skill, setSkill] = useState('')
  const [requests, setRequests] = useState([]) 
  const [loading, setLoading] = useState(true)

  // TASK MANAGER STATE
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
      fetchNotes(parsedUser.token)
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

  const fetchNotes = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('https://velopola-a-time-banking-community.onrender.com/api/notes', config)
      setNotes(response.data)
    } catch (error) {
      console.error("Could not load tasks")
    }
  }

  // --- TASK CRUD OPERATIONS ---
  const handleAddNote = async (e) => {
    e.preventDefault()
    if(!newNote.trim()) return toast.error("Please enter a task")
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.post('https://velopola-a-time-banking-community.onrender.com/api/notes', { text: newNote }, config)
      setNotes([response.data, ...notes])
      setNewNote('')
      toast.success("Task created!")
    } catch (error) { toast.error("Failed to add task") }
  }

  const handleToggleNote = async (note) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.put(`https://velopola-a-time-banking-community.onrender.com/api/notes/${note._id}`, { isCompleted: !note.isCompleted }, config)
      setNotes(notes.map(n => n._id === note._id ? response.data : n))
    } catch (error) { toast.error("Failed to update task") }
  }

  const handleDeleteNote = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.delete(`https://velopola-a-time-banking-community.onrender.com/api/notes/${id}`, config)
      setNotes(notes.filter(n => n._id !== id))
      toast.success("Task deleted!")
    } catch (error) { toast.error("Failed to delete task") }
  }

  // --- SKILL & SWAP LOGIC ---
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
      setRequests(prev => prev.map(req => req._id === swapId ? { ...req, status: action } : req))
      toast.success(`Request ${action}!`)
    } catch (error) { toast.error("Action failed") }
  }

  const handleSendMessage = async (swapId, text) => {
    if (!text.trim()) return
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.put(`https://velopola-a-time-banking-community.onrender.com/api/swaps/${swapId}`, { message: text }, config)
      setRequests(prev => prev.map(req => req._id === swapId ? { ...req, messages: response.data.messages } : req))
      toast.success("Message sent")
    } catch (error) { toast.error("Failed to send") }
  }

  const handleCompleteSwap = async (swapId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const response = await axios.put(`https://velopola-a-time-banking-community.onrender.com/api/swaps/${swapId}/complete`, {}, config)
      const updatedUser = { ...user, credits: response.data.swap.isCreditTransferred ? user.credits + 1 : user.credits }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setRequests(prev => prev.map(req => req._id === swapId ? { ...req, status: 'completed' } : req))
      toast.success("Time credits transferred! 🎉")
    } catch (error) { toast.error(error.response?.data?.message || "Transfer failed") }
  }

  if (loading || !user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
    </div>
  )

  return (
    <>
      {/* 1. INTERACTIVE GUIDE OVERLAY */}
      <QuickGuide />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#fdfcf7]">
        
        {/* WELCOME HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Hello, <span className="text-forest">{user.name}</span>! 👋
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Your community skill-sharing command center.</p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
            <div className="p-4 bg-green-50 text-forest rounded-2xl"><Wallet size={28} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Wallet Balance</p>
              <p className="text-3xl font-black text-gray-900">{user.credits} <span className="text-sm font-medium text-gray-400 italic">Hours</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
            <div className="p-4 bg-yellow-50 text-yellow-600 rounded-2xl"><Inbox size={28} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Incoming Requests</p>
              <p className="text-3xl font-black text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><ListTodo size={28} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Learning Goals</p>
              <p className="text-3xl font-black text-gray-900">{notes.filter(n => !n.isCompleted).length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: TASKS & INBOX */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <ListTodo className="text-forest" size={24} /> Learning Roadmap
              </h2>
              <form onSubmit={handleAddNote} className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  placeholder="What skill are you mastering next?" 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-forest/10 focus:border-forest outline-none transition-all"
                />
                <button type="submit" className="bg-forest text-white px-8 rounded-2xl font-bold hover:bg-moss transition-all shadow-lg shadow-green-900/10">Add</button>
              </form>

              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note._id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-forest/20 transition-all">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleToggleNote(note)}>
                      {note.isCompleted ? <CheckSquare className="text-forest" /> : <Square className="text-gray-300" />}
                      <span className={`text-lg ${note.isCompleted ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>{note.text}</span>
                    </div>
                    <button onClick={() => handleDeleteNote(note._id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Inbox className="text-forest" size={24} /> Connection Inbox
              </h2>
              <div className="space-y-6">
                {requests.map((req) => (
                  <div key={req._id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-forest text-white flex items-center justify-center font-black text-xl">{req.requester?.name?.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{req.requester?.name}</p>
                          <p className="text-sm text-gray-400 font-medium">{req.status.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => handleSwapAction(req._id, 'accepted')} className="px-5 py-2 bg-forest text-white rounded-xl font-bold text-sm shadow-md shadow-green-900/10">Accept</button>
                            <button onClick={() => handleSwapAction(req._id, 'rejected')} className="px-5 py-2 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm">Decline</button>
                          </>
                        )}
                      </div>
                    </div>

                    {req.status === 'accepted' && (
                      <div className="mt-4 p-6 bg-green-50/30 rounded-3xl border border-green-100/50 space-y-5 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 text-forest font-bold"><MessageSquare size={18}/> Chat Session</span>
                          <a href={req.meetingLink || "https://meet.google.com"} target="_blank" className="flex items-center gap-2 bg-white text-forest px-4 py-2 rounded-xl text-xs font-black border border-green-100 hover:shadow-sm transition-all"><Video size={16}/> Join Virtual Meet</a>
                        </div>
                        
                        <div className="h-32 overflow-y-auto bg-white/50 rounded-2xl p-4 space-y-2 border border-green-100/20 shadow-inner">
                          {req.messages?.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                              <p className={`px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm ${m.sender === user._id ? 'bg-forest text-white' : 'bg-white text-gray-600 border border-gray-100'}`}>{m.text}</p>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="Type a message..."
                              className="w-full pl-4 pr-10 py-3 rounded-xl border border-green-100 focus:ring-0 focus:border-forest outline-none text-sm"
                              onKeyDown={(e) => { if(e.key === 'Enter') { handleSendMessage(req._id, e.target.value); e.target.value=''; }}}
                            />
                            <Send size={16} className="absolute right-3 top-3.5 text-forest cursor-pointer" />
                          </div>
                          <button 
                            onClick={() => handleCompleteSwap(req._id)}
                            className="w-full bg-forest text-white py-3 rounded-xl font-black text-sm hover:bg-moss transition-all shadow-lg shadow-green-900/10"
                          >
                            Mark Swap as Completed
                          </button>
                        </div>
                      </div>
                    )}
                    {req.status === 'completed' && (
                      <div className="mt-2 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                        <p className="text-blue-600 font-bold text-sm flex items-center justify-center gap-2"><CheckCircle size={16}/> Credit Exchange Finalized</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: SKILLS & MAP PREVIEW */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <TrendingUp className="text-forest" size={24} /> My Expertise
              </h2>
              <form onSubmit={handleAddSkill} className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  placeholder="Add a new skill..." 
                  value={skill} 
                  onChange={(e) => setSkill(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-forest outline-none text-sm transition-all"
                />
                <button type="submit" className="bg-forest text-white p-3 rounded-xl shadow-lg shadow-green-900/10 hover:bg-moss"><Plus size={20}/></button>
              </form>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.map((s, i) => (
                  <span key={i} className="px-4 py-2 bg-green-50 text-forest border border-green-100 rounded-xl text-sm font-bold animate-in fade-in zoom-in">{s}</span>
                ))}
              </div>
            </section>
            
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Neighborhood</h2>
                <Link to="/map" className="text-xs font-black text-forest hover:underline">OPEN MAP</Link>
              </div>
              <div className="h-48 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                 <TrendingUp size={32} className="mb-2 opacity-20" />
                 <p className="text-xs font-bold uppercase tracking-widest">Connect Locally</p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </>
  )
}

export default Dashboard