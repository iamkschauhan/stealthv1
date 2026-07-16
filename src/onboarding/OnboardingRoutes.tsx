import { Navigate, Route, Routes } from 'react-router-dom'
import { OnboardingProvider } from './OnboardingContext'
import { SplashScreen } from './screens/SplashScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { PrinciplesScreen } from './screens/PrinciplesScreen'
import { PhoneScreen } from './screens/PhoneScreen'
import { VerifyCodeScreen } from './screens/VerifyCodeScreen'
import { PersonalInfoScreen } from './screens/PersonalInfoScreen'
import { BirthdayConfirmScreen } from './screens/BirthdayConfirmScreen'
import { IdentityScreen } from './screens/IdentityScreen'
import { PronounsScreen } from './screens/PronounsScreen'
import { LookingForScreen } from './screens/LookingForScreen'
import { AddPhotosScreen } from './screens/AddPhotosScreen'
import { AddProfilePhotoScreen } from './screens/AddProfilePhotoScreen'
import { UploadPhotoScreen } from './screens/UploadPhotoScreen'
import { LocationScreen } from './screens/LocationScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'
import { VerifyYourselfScreen } from './screens/VerifyYourselfScreen'
import {
  ChildrenScreen,
  EducationScreen,
  EthnicityScreen,
  ExerciseScreen,
  HabitsScreen,
  InterestsScreen,
  PoliticalScreen,
  RelationshipScreen,
  YourLifeScreen,
} from './screens/Batch4Screens'

export function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route index element={<Navigate to="splash" replace />} />
        <Route path="splash" element={<SplashScreen />} />
        <Route path="welcome" element={<WelcomeScreen />} />
        <Route path="principles" element={<PrinciplesScreen />} />
        <Route path="phone" element={<PhoneScreen />} />
        <Route path="verify-code" element={<VerifyCodeScreen />} />
        <Route path="personal-info" element={<PersonalInfoScreen />} />
        <Route path="birthday-confirm" element={<BirthdayConfirmScreen />} />
        <Route path="identity" element={<IdentityScreen />} />
        <Route path="pronouns" element={<PronounsScreen />} />
        <Route path="looking-for" element={<LookingForScreen />} />
        <Route path="add-profile-photo" element={<AddProfilePhotoScreen />} />
        <Route path="add-photos" element={<AddPhotosScreen />} />
        <Route path="upload-photo" element={<UploadPhotoScreen />} />
        <Route path="location" element={<LocationScreen />} />
        <Route path="notifications" element={<NotificationsScreen />} />
        <Route path="verify-yourself" element={<VerifyYourselfScreen />} />
        <Route path="interests" element={<InterestsScreen />} />
        <Route path="your-life" element={<YourLifeScreen />} />
        <Route path="relationship" element={<RelationshipScreen />} />
        <Route path="children" element={<ChildrenScreen />} />
        <Route path="education" element={<EducationScreen />} />
        <Route path="ethnicity" element={<EthnicityScreen />} />
        <Route path="exercise" element={<ExerciseScreen />} />
        <Route path="habits" element={<HabitsScreen />} />
        <Route path="political" element={<PoliticalScreen />} />
        <Route path="*" element={<Navigate to="splash" replace />} />
      </Routes>
    </OnboardingProvider>
  )
}
