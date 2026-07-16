export type OnboardingData = {
  phone: string
  countryCode: string
  firstName: string
  birthday: string
  showAge: boolean
  identity: string
  pronouns: string[]
  lookingFor: string[]
  photos: string[]
  profilePhoto: string
  location: string
  notificationsEnabled: boolean
  interests: string[]
  lifeTags: string[]
  relationship: string
  children: string
  education: string
  ethnicity: string[]
  exercise: string
  habits: string[]
  political: string
}

export const ONBOARDING_DEFAULTS: OnboardingData = {
  phone: '',
  countryCode: '+1',
  firstName: '',
  birthday: '',
  showAge: true,
  identity: '',
  pronouns: [],
  lookingFor: [],
  photos: [],
  profilePhoto: '',
  location: '',
  notificationsEnabled: true,
  interests: [],
  lifeTags: [],
  relationship: '',
  children: '',
  education: '',
  ethnicity: [],
  exercise: '',
  habits: [],
  political: '',
}
