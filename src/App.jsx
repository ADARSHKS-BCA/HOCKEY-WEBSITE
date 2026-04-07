import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Matchmaking from './pages/Matchmaking'
import Leaderboard from './pages/Leaderboard'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden">
      {/* Absolute Fixed Video Background - Merged perfectly for the whole site */}
      <div className="fixed inset-0 w-full h-full z-[-1]">
        {/* Light overlay for cohesiveness with the Light Theme */}
        <div className="absolute inset-0 bg-white/50 dark:bg-black/60 z-10 transition-colors duration-500 backdrop-blur-sm"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/Alfa_hockey_stick_202604071425.mp4" type="video/mp4" />
        </video>
      </div>

      <Navbar />
      <main className="flex-grow pt-20 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
