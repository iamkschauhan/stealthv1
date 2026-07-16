import { Navigate, Route, Routes } from 'react-router-dom'
import { PlansProvider } from './PlansContext'
import { PlansPage } from './PlansPage'
import { PastPlanDetail } from './PastPlanDetail'
import { RequestedPlanDetail } from './RequestedPlanDetail'
import { UpcomingPlanDetail } from './UpcomingPlanDetail'
import { WatchingPlanDetail } from './WatchingPlanDetail'
import { UploadPhotosScreen } from './UploadPhotosScreen'
import { RatePlanScreen } from './RatePlanScreen'

export function PlansRoutes() {
  return (
    <PlansProvider>
      <Routes>
        <Route index element={<PlansPage />} />
        <Route path="past/:id" element={<PastPlanDetail />} />
        <Route path="past/:id/upload" element={<UploadPhotosScreen />} />
        <Route path="past/:id/rate" element={<RatePlanScreen />} />
        <Route path="requested/:id" element={<RequestedPlanDetail />} />
        <Route path="upcoming/:id" element={<UpcomingPlanDetail />} />
        <Route path="watching/:id" element={<WatchingPlanDetail />} />
        <Route path="*" element={<Navigate to="/plans" replace />} />
      </Routes>
    </PlansProvider>
  )
}
