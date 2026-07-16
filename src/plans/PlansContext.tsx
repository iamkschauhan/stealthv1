import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import type { Plan } from '../data/types'
import type { JoinState } from '../feed/feedActions'
import type { PlanCard, PlansTab } from './data'
import {
  cancelMembership,
  cardsForTab,
  hidePastPlan,
  joinFromWatching,
  loadGoingPeople,
  loadMyPlans,
  requestEditFromPlans,
  stopWatching,
  submitPlanRating,
  uploadPastPlanPhotos,
  type MyPlansBundle,
} from './plansActions'

export type GoingPerson = {
  name: string
  avatar: string
  role?: string
  uid: string
}

type Ctx = {
  loading: boolean
  error: string | null
  bundle: MyPlansBundle | null
  plansById: Record<string, Plan>
  refresh: () => Promise<void>
  listForTab: (tab: PlansTab) => PlanCard[]
  getCard: (id: string) => PlanCard | null
  getPlan: (id: string) => Plan | null
  stopWatch: (planId: string) => Promise<void>
  leaveOrCancel: (planId: string) => Promise<void>
  hidePast: (planId: string) => Promise<void>
  joinFromWatch: (planId: string) => Promise<JoinState>
  requestEdit: (planId: string, field: string, note?: string) => Promise<void>
  ratePlan: (
    planId: string,
    data: {
      score: number
      feedback?: string
      traits?: string[]
      noShow?: boolean
      didNotAttend?: boolean
    },
  ) => Promise<void>
  uploadPast: (opts: {
    planId: string
    files: Blob[]
    caption?: string
    shareToFeed?: boolean
  }) => Promise<void>
  loadPeople: (planId: string) => Promise<GoingPerson[]>
}

const PlansContext = createContext<Ctx | null>(null)

const EMPTY: MyPlansBundle = {
  watching: [],
  requested: [],
  upcoming: [],
  past: [],
  plansById: {},
}

export function PlansProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bundle, setBundle] = useState<MyPlansBundle | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setBundle(EMPTY)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setBundle(await loadMyPlans(user.uid))
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const listForTab = useCallback(
    (tab: PlansTab) => cardsForTab(bundle ?? EMPTY, tab),
    [bundle],
  )

  const getCard = useCallback(
    (id: string) => {
      const b = bundle ?? EMPTY
      return (
        [...b.watching, ...b.requested, ...b.upcoming, ...b.past].find(
          (c) => c.id === id,
        ) || null
      )
    },
    [bundle],
  )

  const getPlanDoc = useCallback(
    (id: string) => bundle?.plansById[id] || null,
    [bundle],
  )

  const stopWatch = useCallback(
    async (planId: string) => {
      if (!user) return
      await stopWatching(user.uid, planId)
      await refresh()
    },
    [refresh, user],
  )

  const leaveOrCancel = useCallback(
    async (planId: string) => {
      if (!user) return
      await cancelMembership(user.uid, planId)
      await refresh()
    },
    [refresh, user],
  )

  const hidePast = useCallback(
    async (planId: string) => {
      if (!user) return
      await hidePastPlan(user.uid, planId)
      await refresh()
    },
    [refresh, user],
  )

  const joinFromWatch = useCallback(
    async (planId: string) => {
      if (!user) throw new Error('Sign in required')
      const state = await joinFromWatching({
        planId,
        uid: user.uid,
        displayName: profile?.displayName,
        avatarUrl: profile?.avatarUrl,
      })
      await refresh()
      return state
    },
    [profile, refresh, user],
  )

  const requestEdit = useCallback(
    async (planId: string, field: string, note?: string) => {
      if (!user) throw new Error('Sign in required')
      const plan = getPlanDoc(planId)
      if (!plan) throw new Error('Plan not found')
      await requestEditFromPlans({
        planId,
        hostId: plan.hostId,
        requesterId: user.uid,
        field,
        note,
      })
      await refresh()
    },
    [getPlanDoc, refresh, user],
  )

  const ratePlan = useCallback(
    async (
      planId: string,
      data: {
        score: number
        feedback?: string
        traits?: string[]
        noShow?: boolean
        didNotAttend?: boolean
      },
    ) => {
      if (!user) throw new Error('Sign in required')
      await submitPlanRating(planId, user.uid, data)
      await refresh()
    },
    [refresh, user],
  )

  const uploadPast = useCallback(
    async (opts: {
      planId: string
      files: Blob[]
      caption?: string
      shareToFeed?: boolean
    }) => {
      if (!user) throw new Error('Sign in required')
      const plan = getPlanDoc(opts.planId)
      if (!plan) throw new Error('Plan not found')
      await uploadPastPlanPhotos({
        planId: opts.planId,
        hostId: plan.hostId,
        uid: user.uid,
        files: opts.files,
        caption: opts.caption,
        shareToFeed: opts.shareToFeed,
      })
      await refresh()
    },
    [getPlanDoc, refresh, user],
  )

  const loadPeople = useCallback(async (planId: string) => {
    return loadGoingPeople(planId)
  }, [])

  return (
    <PlansContext.Provider
      value={{
        loading,
        error,
        bundle,
        plansById: bundle?.plansById ?? {},
        refresh,
        listForTab,
        getCard,
        getPlan: getPlanDoc,
        stopWatch,
        leaveOrCancel,
        hidePast,
        joinFromWatch,
        requestEdit,
        ratePlan,
        uploadPast,
        loadPeople,
      }}
    >
      {children}
    </PlansContext.Provider>
  )
}

export function usePlans() {
  const ctx = useContext(PlansContext)
  if (!ctx) throw new Error('usePlans must be used within PlansProvider')
  return ctx
}
