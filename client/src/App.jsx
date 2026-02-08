import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout' // Import the new layout

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FindSkills from './pages/FindSkills'
import CommunityMap from './pages/CommunityMap'

function App() {
  return (
    <Router>
      {/* Toast Notifications Provider */}
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#005F02',
          },
        },
      }}/>
      
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find" element={<FindSkills />} />
          <Route path="/map" element={<CommunityMap />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App