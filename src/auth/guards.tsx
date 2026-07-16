import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { ONBOARDING_STEPS } from '../onboarding/flow'
import { LoadingState } from '../ui/LoadingState'

function resumeOnboardingPath(step?: string): string {
  const match = ONBOARDING_STEPS.find((s) => s.id === step)
  if (match && match.id !== 'done' && match.id !== 'splash') {
    return match.path
  }
  return '/onboarding/personal-info'
}

/** Full-screen wait while Firebase restores session. */
export function AuthBootScreen() {
  return <LoadingState fullScreen label="Loading…" />
}

/** App routes that require a signed-in, onboarded user. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, profile } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <AuthBootScreen />

  if (status === 'signedOut') {
    return (
      <Navigate
        to="/onboarding/splash"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (profile && !profile.onboardingComplete) {
    return <Navigate to={resumeOnboardingPath(profile.onboardingStep)} replace />
  }

  // Profile still loading after sign-in — allow through; S1 fills profile.
  if (!profile) return <AuthBootScreen />

  return children
}

/** Onboarding entry: send finished users home; incomplete stay in flow. */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { status, profile } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <AuthBootScreen />

  if (status === 'signedIn' && profile?.onboardingComplete) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from && from !== '/' ? from : '/home'} replace />
  }

  return children
}
