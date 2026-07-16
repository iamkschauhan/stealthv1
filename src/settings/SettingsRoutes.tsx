import { Navigate, Route, Routes } from 'react-router-dom'
import {
  BlockedAccountsScreen,
  ChangePasswordScreen,
  ContactScreen,
  DownloadDataScreen,
  FaqScreen,
  HelpScreen,
  InviteScreen,
  LegalScreen,
  NotifStealthAppScreen,
  NotifFriendsScreen,
  NotifHostingScreen,
  NotifJoiningScreen,
  NotifPhotosScreen,
  NotificationsHubScreen,
  PreferencesScreen,
  PrinciplesScreen,
  PrivacyPolicyScreen,
  PrivacyScreen,
  ReportProblemScreen,
  SafeTipsScreen,
  SecurityScreen,
  SupportRequestsScreen,
  TermsScreen,
  ThemeScreen,
  TypeOfPlansScreen,
} from './Screens'

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path="preferences" element={<PreferencesScreen />} />
      <Route path="preferences/theme" element={<ThemeScreen />} />
      <Route path="preferences/plans" element={<TypeOfPlansScreen />} />
      <Route path="security" element={<SecurityScreen />} />
      <Route path="security/password" element={<ChangePasswordScreen />} />
      <Route path="notifications" element={<NotificationsHubScreen />} />
      <Route path="notifications/joining" element={<NotifJoiningScreen />} />
      <Route path="notifications/hosting" element={<NotifHostingScreen />} />
      <Route path="notifications/photos" element={<NotifPhotosScreen />} />
      <Route path="notifications/friends" element={<NotifFriendsScreen />} />
      <Route path="notifications/stealth" element={<NotifStealthAppScreen />} />
      <Route path="invite" element={<InviteScreen />} />
      <Route path="privacy" element={<PrivacyScreen />} />
      <Route path="privacy/blocked" element={<BlockedAccountsScreen />} />
      <Route path="privacy/safe-tips" element={<SafeTipsScreen />} />
      <Route path="privacy/principles" element={<PrinciplesScreen />} />
      <Route path="help" element={<HelpScreen />} />
      <Route path="help/report" element={<ReportProblemScreen />} />
      <Route path="help/faq" element={<FaqScreen />} />
      <Route path="help/support" element={<SupportRequestsScreen />} />
      <Route path="legal" element={<LegalScreen />} />
      <Route path="legal/privacy-policy" element={<PrivacyPolicyScreen />} />
      <Route path="legal/terms" element={<TermsScreen />} />
      <Route path="legal/download-data" element={<DownloadDataScreen />} />
      <Route path="contact" element={<ContactScreen />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  )
}
