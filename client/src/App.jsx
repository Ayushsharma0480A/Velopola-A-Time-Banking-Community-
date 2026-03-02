import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout' 
import QuickGuide from './components/QuickGuide' // Import your guide

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FindSkills from './pages/FindSkills'
import CommunityMap from './pages/CommunityMap'

// --- HELPER COMPONENT TO HANDLE LOCATION ---
function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* 1. Only render QuickGuide if exactly on the root path "/" */}
      {location.pathname === '/' && <QuickGuide />}

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
    </>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#333', color: '#fff' },
        success: { style: { background: '#005F02' } },
      }}/>
      
      {/* 2. Call the helper component inside the Router */}
      <AppContent />
    </Router>
  )
}

export default App