import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomeFeed } from './HomeFeed'
import { OnboardingRoutes } from './onboarding/OnboardingRoutes'
import { ProfileRoutes } from './profile/ProfileRoutes'
import { MessageRoutes, NotificationRoutes } from './notify/NotifyRoutes'
import { NotifyProvider } from './notify/NotifyContext'
import { ReportPostScreen } from './feed/ReportPostScreen'
import { CreateRoutes } from './create/CreateRoutes'
import { PlansRoutes } from './plans/PlansRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <NotifyProvider>
        <Routes>
          <Route path="/onboarding/*" element={<OnboardingRoutes />} />
          <Route path="/profile/*" element={<ProfileRoutes />} />
          <Route path="/notifications/*" element={<NotificationRoutes />} />
          <Route path="/messages/*" element={<MessageRoutes />} />
          <Route path="/create/*" element={<CreateRoutes />} />
          <Route path="/plans/*" element={<PlansRoutes />} />
          <Route path="/" element={<Navigate to="/onboarding/splash" replace />} />
          <Route path="/home" element={<HomeFeed />} />
          <Route path="/home/report/:postId" element={<ReportPostScreen />} />
          <Route path="*" element={<Navigate to="/onboarding/splash" replace />} />
        </Routes>
      </NotifyProvider>
    </BrowserRouter>
  )
}
