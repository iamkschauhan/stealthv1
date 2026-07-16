import { Navigate, Route, Routes } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'
import { ProfileProvider } from './ProfileContext'
import {
  ChangePhotoScreen,
  EditCompanyScreen,
  EditEthnicityScreen,
  EditHometownScreen,
  ReportAccountScreen,
  VerifyIdentityScreen,
} from './EditScreens'
import { SettingsRoutes } from '../settings/SettingsRoutes'

export function ProfileRoutes() {
  return (
    <ProfileProvider>
      <Routes>
        <Route index element={<ProfilePage />} />
        <Route path="change-photo" element={<ChangePhotoScreen />} />
        <Route path="verify-identity" element={<VerifyIdentityScreen />} />
        <Route path="edit-hometown" element={<EditHometownScreen />} />
        <Route path="edit-company" element={<EditCompanyScreen />} />
        <Route path="edit-ethnicity" element={<EditEthnicityScreen />} />
        <Route path="report-account" element={<ReportAccountScreen />} />
        <Route path="settings/*" element={<SettingsRoutes />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </ProfileProvider>
  )
}
