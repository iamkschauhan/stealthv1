import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { getFirebaseAuth } from '../firebase'
import { ensureUserProfile, getUserProfile } from '../data/users'
import type { UserProfile } from '../data/types'

type AuthStatus = 'loading' | 'signedOut' | 'signedIn'

type AuthContextValue = {
  status: AuthStatus
  user: User | null
  profile: UserProfile | null
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const refreshProfile = async () => {
    const auth = getFirebaseAuth()
    const current = auth.currentUser
    if (!current) {
      setProfile(null)
      return
    }
    const next = await getUserProfile(current.uid)
    setProfile(next)
  }

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (!nextUser) {
        setProfile(null)
        setStatus('signedOut')
        return
      }

      try {
        const existing = await getUserProfile(nextUser.uid)
        const ensured =
          existing ??
          (await ensureUserProfile(nextUser.uid, {
            phone: nextUser.phoneNumber ?? undefined,
          }))
        setProfile(ensured)
        setStatus('signedIn')
      } catch (err) {
        console.error('Failed to load user profile', err)
        setProfile(null)
        setStatus('signedIn')
      }
    })
    return unsub
  }, [])

  const logout = async () => {
    await signOut(getFirebaseAuth())
  }

  return (
    <AuthContext.Provider
      value={{ status, user, profile, refreshProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
