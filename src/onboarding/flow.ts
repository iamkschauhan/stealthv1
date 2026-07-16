/**
 * Onboarding flow — 99 Login PNGs → unique interactive screens.
 * Variants (fill / select / numbered) are states of the same route.
 */
export type OnboardingStepId =
  | 'splash'
  | 'welcome'
  | 'principles'
  | 'phone'
  | 'verify-code'
  | 'personal-info'
  | 'birthday-confirm'
  | 'identity'
  | 'pronouns'
  | 'looking-for'
  | 'add-photos'
  | 'add-profile-photo'
  | 'upload-photo'
  | 'location'
  | 'notifications'
  | 'verify-yourself'
  | 'interests'
  | 'your-life'
  | 'relationship'
  | 'children'
  | 'education'
  | 'ethnicity'
  | 'exercise'
  | 'habits'
  | 'political'
  | 'done'

export type OnboardingStep = {
  id: OnboardingStepId
  path: string
  title: string
  batch: 1 | 2 | 3 | 4
  mockRefs: string[]
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'splash',
    path: '/onboarding/splash',
    title: 'Splash',
    batch: 1,
    mockRefs: ['Splash screen.png', 'Splash screen (1).png', 'Splash screen (2).png', 'Splash screen (3).png'],
  },
  {
    id: 'welcome',
    path: '/onboarding/welcome',
    title: 'Create your profile',
    batch: 1,
    mockRefs: ['Welcome.png'],
  },
  {
    id: 'principles',
    path: '/onboarding/principles',
    title: 'The place for doers',
    batch: 1,
    mockRefs: ['Welcome (1).png'],
  },
  {
    id: 'phone',
    path: '/onboarding/phone',
    title: 'Phone number',
    batch: 1,
    mockRefs: ['Phone Number.png', 'Phone Number fill.png'],
  },
  {
    id: 'verify-code',
    path: '/onboarding/verify-code',
    title: 'Verification code',
    batch: 1,
    mockRefs: ['Verification Code.png', 'Verification Code fill.png', "Didn't get a code_.png"],
  },
  {
    id: 'personal-info',
    path: '/onboarding/personal-info',
    title: 'Personal info',
    batch: 1,
    mockRefs: [
      'Personal Info first name.png',
      'Personal Info first name fill.png',
      'Personal Info b-day.png',
      'Personal Info b-day fill.png',
    ],
  },
  {
    id: 'birthday-confirm',
    path: '/onboarding/birthday-confirm',
    title: 'Confirm birthday',
    batch: 1,
    mockRefs: ['Personal Info b-day confirmation.png'],
  },
  {
    id: 'identity',
    path: '/onboarding/identity',
    title: 'How do you identify',
    batch: 2,
    mockRefs: ['How do you identity.png', 'How do you identity woman select.png'],
  },
  {
    id: 'pronouns',
    path: '/onboarding/pronouns',
    title: 'Pronouns',
    batch: 2,
    mockRefs: ['Pronouns.png', 'Pronouns1.png'],
  },
  {
    id: 'looking-for',
    path: '/onboarding/looking-for',
    title: 'What are you looking for',
    batch: 2,
    mockRefs: ['What are you looking for.png', 'What are you looking for select all.png'],
  },
  {
    id: 'add-profile-photo',
    path: '/onboarding/add-profile-photo',
    title: 'Add profile photo',
    batch: 3,
    mockRefs: ['Add Profile Photo.png', 'Add Photos.png', 'Add Photos (1).png'],
  },
  {
    id: 'add-photos',
    path: '/onboarding/add-photos',
    title: 'Add photos',
    batch: 3,
    mockRefs: ['Add Photos (2).png'],
  },
  {
    id: 'upload-photo',
    path: '/onboarding/upload-photo',
    title: 'Upload photo',
    batch: 3,
    mockRefs: ['Upload photo.png', 'Upload photo (1).png'],
  },
  {
    id: 'location',
    path: '/onboarding/location',
    title: 'Location',
    batch: 3,
    mockRefs: ['Location.png', 'Location (1).png'],
  },
  {
    id: 'notifications',
    path: '/onboarding/notifications',
    title: 'Notifications',
    batch: 3,
    mockRefs: ['Notifications.png'],
  },
  {
    id: 'verify-yourself',
    path: '/onboarding/verify-yourself',
    title: 'Verify yourself',
    batch: 3,
    mockRefs: ['Verify Yourself.png', 'Verify Yourself (1).png'],
  },
  {
    id: 'interests',
    path: '/onboarding/interests',
    title: 'Your interests',
    batch: 4,
    mockRefs: ['Your Interests.png', 'Your Interests fill.png'],
  },
  {
    id: 'your-life',
    path: '/onboarding/your-life',
    title: 'Your life',
    batch: 4,
    mockRefs: ['Your Life.png', 'Your Life fill.png'],
  },
  {
    id: 'relationship',
    path: '/onboarding/relationship',
    title: 'Your relationship',
    batch: 4,
    mockRefs: ['Your Relationship.png', 'Your Relationship fill.png'],
  },
  {
    id: 'children',
    path: '/onboarding/children',
    title: 'Children',
    batch: 4,
    mockRefs: ['Children.png', 'Children fill.png'],
  },
  {
    id: 'education',
    path: '/onboarding/education',
    title: 'Education',
    batch: 4,
    mockRefs: ['Education.png', 'Education (1).png'],
  },
  {
    id: 'ethnicity',
    path: '/onboarding/ethnicity',
    title: 'Ethnicity',
    batch: 4,
    mockRefs: ['Ethnicity.png', 'Ethnicity (1).png'],
  },
  {
    id: 'exercise',
    path: '/onboarding/exercise',
    title: 'Exercise',
    batch: 4,
    mockRefs: ['Exercise.png', 'Exercise fill.png'],
  },
  {
    id: 'habits',
    path: '/onboarding/habits',
    title: 'Habits',
    batch: 4,
    mockRefs: ['Habbits.png', 'Habbits (1).png'],
  },
  {
    id: 'political',
    path: '/onboarding/political',
    title: 'Political',
    batch: 4,
    mockRefs: ['Political.png', 'Political1.png'],
  },
]

export function getStep(id: OnboardingStepId) {
  return ONBOARDING_STEPS.find((s) => s.id === id)!
}

export function getNextStep(id: OnboardingStepId): OnboardingStep | null {
  const i = ONBOARDING_STEPS.findIndex((s) => s.id === id)
  return ONBOARDING_STEPS[i + 1] ?? null
}

export function getPrevStep(id: OnboardingStepId): OnboardingStep | null {
  const i = ONBOARDING_STEPS.findIndex((s) => s.id === id)
  return i > 0 ? ONBOARDING_STEPS[i - 1] : null
}
