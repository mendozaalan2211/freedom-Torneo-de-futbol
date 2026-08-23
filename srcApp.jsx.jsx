import React, { useEffect, useState } from 'react'
import RegistrationForm from './RegistrationForm.jsx'
import AdminPanel from './AdminPanel.jsx'

export default function App() {
  const [route, setRoute] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const isAdmin = route.startsWith('/admin')

  return isAdmin ? <AdminPanel /> : <RegistrationForm />
}
