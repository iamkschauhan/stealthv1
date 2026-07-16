import { Navigate, Route, Routes } from 'react-router-dom'
import { CreateProvider } from './CreateContext'
import { CreatePlanForm } from './CreatePlanForm'
import { PostingScreen } from './PostingScreen'
import { HostPlanScreen } from './HostPlanScreen'
import { RequestsScreen } from './RequestsScreen'

export function CreateRoutes() {
  return (
    <CreateProvider>
      <Routes>
        <Route index element={<CreatePlanForm mode="create" />} />
        <Route path="edit" element={<CreatePlanForm mode="edit" />} />
        <Route path="posting" element={<PostingScreen />} />
        <Route path="plan" element={<HostPlanScreen />} />
        <Route path="plan/:planId" element={<HostPlanScreen />} />
        <Route path="requests" element={<RequestsScreen />} />
        <Route path="*" element={<Navigate to="/create" replace />} />
      </Routes>
    </CreateProvider>
  )
}
