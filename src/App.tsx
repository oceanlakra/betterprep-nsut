import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { Toaster } from '@/components/ui/sonner'
import { supabase } from './lib/supabase'
import Dashboard from './pages/Dashboard'
import BranchView from './pages/BranchView'
import SubjectView from './pages/SubjectView'
import { useNavigationRefresh } from '@/hooks/use-navigation'

function AppRoutes() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  useNavigationRefresh()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      setSession(initialSession)
      setLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/branch/:branchId" element={<BranchView />} />
      <Route path="/subject/:subjectId" element={<SubjectView />} />
      <Route 
        path="/auth" 
        element={
          session ? <Navigate to="/" replace /> : <Auth />
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          session ? <Dashboard /> : <Navigate to="/auth" replace />
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  )
}