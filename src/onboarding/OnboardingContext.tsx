import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

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

const defaults: OnboardingData = {
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

type Ctx = {
  data: OnboardingData
  patch: (partial: Partial<OnboardingData>) => void
  reset: () => void
}

const OnboardingContext = createContext<Ctx | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaults)
  const value = useMemo<Ctx>(
    () => ({
      data,
      patch: (partial) => setData((d) => ({ ...d, ...partial })),
      reset: () => setData(defaults),
    }),
    [data],
  )
  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
