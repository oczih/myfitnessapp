import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
export default function SignOut() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function signout() {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL }/auth/signout`, {
          method: 'POST', // tai GET riippuen backendistä
          credentials: 'include',
        })
        localStorage.removeItem('loggedFitnessappUser')
        // haetaan callbackUrl query-parametrista tai käytetään "/"
        const params = new URLSearchParams(location.search)
        const callbackUrl = params.get('callbackUrl') || '/'
        navigate(callbackUrl)
      } catch (error) {
        console.error('Signout failed:', error)
      }
    }
    signout()
  }, [navigate, location.search])

  return <div>Signing out...</div>
}
