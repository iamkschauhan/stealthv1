import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { getNextStep, type OnboardingStepId } from './flow'
import { finishOnboarding, persistOnboardingStep, profileToDraft } from './persist'
import { ONBOARDING_DEFAULTS, type OnboardingData } from './types'

type Ctx = {
  data: OnboardingData
  patch: (partial: Partial<OnboardingData>) => void
  reset: () => void
  busy: boolean
  error: string | null
  setError: (msg: string | null) => void
  setBusy: (v: boolean) => void
  /** Persist current step then go next (or finish → /home). */
  advance: (
    fromStep: OnboardingStepId,
    overrides?: Partial<OnboardingData>,
  ) => Promise<void>
}

const OnboardingContext = createContext<Ctx | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<OnboardingData>(ONBOARDING_DEFAULTS)
  const [hydrated, setHydrated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hydrated) return
    if (!profile) {
      if (!user) setHydrated(true)
      return
    }
    setData((d) => ({ ...d, ...profileToDraft(profile) }))
    setHydrated(true)
  }, [profile, user, hydrated])

  const advance = useCallback(
    async (
      fromStep: OnboardingStepId,
      overrides?: Partial<OnboardingData>,
    ) => {
      setError(null)
      setBusy(true)
      const payload = { ...data, ...overrides }
      if (overrides) setData(payload)
      try {
        const next = getNextStep(fromStep)
        const isLast = !next || next.id === 'done'

        if (user) {
          if (isLast) {
            await finishOnboarding(user.uid, payload)
            await refreshProfile()
            navigate('/home', { replace: true })
            return
          }
          await persistOnboardingStep(user.uid, payload, fromStep)
          await refreshProfile()
        }

        if (next && next.id !== 'done') navigate(next.path)
        else navigate('/home', { replace: true })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Try again.'
        setError(message)
        console.error(err)
      } finally {
        setBusy(false)
      }
    },
    [data, navigate, refreshProfile, user],
  )

  const value = useMemo<Ctx>(
    () => ({
      data,
      patch: (partial) => setData((d) => ({ ...d, ...partial })),
      reset: () => setData(ONBOARDING_DEFAULTS),
      busy,
      error,
      setError,
      setBusy,
      advance,
    }),
    [data, busy, error, advance],
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

export type { OnboardingData }
