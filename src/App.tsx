import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomeFeed } from './HomeFeed'
import { OnboardingRoutes } from './onboarding/OnboardingRoutes'
import { ProfileRoutes } from './profile/ProfileRoutes'
import { MessageRoutes, NotificationRoutes } from './notify/NotifyRoutes'
import { NotifyProvider } from './notify/NotifyContext'
import { ReportPostScreen } from './feed/ReportPostScreen'
import { CreateRoutes } from './create/CreateRoutes'
import { PlansRoutes } from './plans/PlansRoutes'
import {
  AuthBootScreen,
  AuthProvider,
  OnboardingGate,
  RequireAuth,
  useAuth,
} from './auth'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotifyProvider>
          <Routes>
            <Route
              path="/onboarding/*"
              element={
                <OnboardingGate>
                  <OnboardingRoutes />
                </OnboardingGate>
              }
            />
            <Route
              path="/profile/*"
              element={
                <RequireAuth>
                  <ProfileRoutes />
                </RequireAuth>
              }
            />
            <Route
              path="/notifications/*"
              element={
                <RequireAuth>
                  <NotificationRoutes />
                </RequireAuth>
              }
            />
            <Route
              path="/messages/*"
              element={
                <RequireAuth>
                  <MessageRoutes />
                </RequireAuth>
              }
            />
            <Route
              path="/create/*"
              element={
                <RequireAuth>
                  <CreateRoutes />
                </RequireAuth>
              }
            />
            <Route
              path="/plans/*"
              element={
                <RequireAuth>
                  <PlansRoutes />
                </RequireAuth>
              }
            />
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <HomeFeed />
                </RequireAuth>
              }
            />
            <Route
              path="/home/report/:postId"
              element={
                <RequireAuth>
                  <ReportPostScreen />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotifyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function RootRedirect() {
  const { status, profile } = useAuth()
  if (status === 'loading') return <AuthBootScreen />
  if (status === 'signedIn' && profile?.onboardingComplete) {
    return <Navigate to="/home" replace />
  }
  if (status === 'signedIn' && profile && !profile.onboardingComplete) {
    return <Navigate to="/onboarding/personal-info" replace />
  }
  return <Navigate to="/onboarding/splash" replace />
}
