import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import { getPlan } from '../data/plans'
import type { FeedItem } from '../data'
import type { Plan } from '../data/types'
import {
  countUserUpcoming,
  getPlanMembers,
  hidePlan,
  joinPlanAsUser,
  listHiddenPlanIds,
  loadJoinStatesForUser,
  loadLiveFeed,
  loadUserWatches,
  submitEditRequest,
  toggleWatchPlan,
  type JoinState,
} from './feedActions'
import { membersToPeople, planToFeedItem } from './mapPlan'

export type { JoinState }

export type FeedFilters = {
  types: string[]
  categories: string[]
  additional: string[]
  maxDistance: number
  dateLabel: string
  timeLabel: string
  zip: string
}

const defaultFilters: FeedFilters = {
  types: [],
  categories: [],
  additional: [],
  maxDistance: 20,
  dateLabel: '',
  timeLabel: '',
  zip: '02882',
}

type Ctx = {
  items: FeedItem[]
  plansById: Record<string, Plan>
  loading: boolean
  error: string | null
  refreshFeed: () => Promise<void>
  joinStates: Record<string, JoinState>
  watchIds: Set<string>
  upcomingCount: number
  filters: FeedFilters
  setFilters: React.Dispatch<React.SetStateAction<FeedFilters>>
  clearFilters: () => void
  filterOpen: boolean
  setFilterOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  dateOpen: boolean
  setDateOpen: (v: boolean) => void
  shareId: string | null
  setShareId: (id: string | null) => void
  menuId: string | null
  setMenuId: (id: string | null) => void
  peopleId: string | null
  setPeopleId: (id: string | null) => void
  peopleList: { uid?: string; name: string; avatar: string; role?: string }[]
  expandId: string | null
  setExpandId: (id: string | null) => void
  joinConfirmId: string | null
  setJoinConfirmId: (id: string | null) => void
  editRequestId: string | null
  setEditRequestId: (id: string | null) => void
  requestSentOpen: boolean
  setRequestSentOpen: (v: boolean) => void
  confirmJoin: (id: string) => Promise<void>
  setJoinState: (id: string, state: JoinState) => void
  toggleWatch: (id: string) => Promise<void>
  hideFromFeed: (id: string) => Promise<void>
  requestEdit: (planId: string, field: string, note?: string) => Promise<void>
  loadPeople: (planId: string) => Promise<void>
  activeCategory: string
  setActiveCategory: (c: string) => void
  filteredItems: FeedItem[]
}

const FeedContext = createContext<Ctx | null>(null)

function spotsFilled(spots: string) {
  const m = spots.match(/(\d+)\s*\/\s*(\d+)/)
  if (!m) return { filled: 0, total: 5, full: false }
  const filled = Number(m[1])
  const total = Number(m[2])
  return { filled, total, full: filled >= total }
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [items, setItems] = useState<FeedItem[]>([])
  const [plansById, setPlansById] = useState<Record<string, Plan>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinStates, setJoinStates] = useState<Record<string, JoinState>>({})
  const [watchIds, setWatchIds] = useState<Set<string>>(new Set())
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [filters, setFilters] = useState<FeedFilters>(defaultFilters)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [peopleId, setPeopleId] = useState<string | null>(null)
  const [peopleList, setPeopleList] = useState<
    { uid?: string; name: string; avatar: string; role?: string }[]
  >([])
  const [expandId, setExpandId] = useState<string | null>(null)
  const [joinConfirmId, setJoinConfirmId] = useState<string | null>(null)
  const [editRequestId, setEditRequestId] = useState<string | null>(null)
  const [requestSentOpen, setRequestSentOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')

  const refreshFeed = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const plans = await loadLiveFeed()
      const map: Record<string, Plan> = {}
      for (const p of plans) map[p.id] = p
      setPlansById(map)

      let hidden = new Set<string>()
      if (user) {
        hidden = await listHiddenPlanIds(user.uid)
        setHiddenIds(hidden)
        const visible = plans.filter((p) => !hidden.has(p.id))
        setItems(visible.map(planToFeedItem))
        const states = await loadJoinStatesForUser(
          user.uid,
          visible.map((p) => p.id),
        )
        setJoinStates(states)
        setWatchIds(await loadUserWatches(user.uid))
        setUpcomingCount(await countUserUpcoming(user.uid))
      } else {
        setItems(plans.map(planToFeedItem))
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refreshFeed()
  }, [refreshFeed])

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])

  const setJoinState = useCallback((id: string, state: JoinState) => {
    setJoinStates((prev) => ({ ...prev, [id]: state }))
  }, [])

  const confirmJoin = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Sign in to join')
      const state = await joinPlanAsUser({
        planId: id,
        uid: user.uid,
        displayName: profile?.displayName,
        avatarUrl: profile?.avatarUrl,
      })
      setJoinStates((prev) => ({ ...prev, [id]: state }))
      await refreshFeed()
    },
    [profile, refreshFeed, user],
  )

  const toggleWatch = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Sign in to watch')
      const next = await toggleWatchPlan(user.uid, id, watchIds.has(id))
      setWatchIds((prev) => {
        const copy = new Set(prev)
        if (next) copy.add(id)
        else copy.delete(id)
        return copy
      })
    },
    [user, watchIds],
  )

  const hideFromFeed = useCallback(
    async (id: string) => {
      if (!user) return
      await hidePlan(user.uid, id)
      setHiddenIds((prev) => new Set(prev).add(id))
      setItems((prev) => prev.filter((i) => i.id !== id))
      setMenuId(null)
    },
    [user],
  )

  const requestEdit = useCallback(
    async (planId: string, field: string, note?: string) => {
      if (!user) throw new Error('Sign in required')
      const plan = plansById[planId] || (await getPlan(planId))
      if (!plan) throw new Error('Plan not found')
      await submitEditRequest({
        planId,
        hostId: plan.hostId,
        requesterId: user.uid,
        field,
        note,
      })
      setJoinState(planId, 'requested')
      setRequestSentOpen(true)
    },
    [plansById, setJoinState, user],
  )

  const loadPeople = useCallback(async (planId: string) => {
    const members = await getPlanMembers(planId)
    setPeopleList(membersToPeople(members))
  }, [])

  useEffect(() => {
    if (peopleId) void loadPeople(peopleId)
  }, [peopleId, loadPeople])

  const filteredItems = useMemo(() => {
    const pillMap: Record<string, string[]> = {
      Creative: ['paint', 'photo', 'writ'],
      'Events & Outings': ['concert', 'museum', 'boat'],
      'Food & Drinks': ['mexican', 'food', 'coffee', 'italian'],
      Games: ['game', 'trivia', 'board'],
      'Sports & Fitness': ['golf', 'football', 'flag', 'tennis', 'hike'],
      Nightlife: ['concert', 'night'],
    }
    const sheetMap: Record<string, string[]> = {
      Creative: ['paint', 'photo', 'writ'],
      'Events & Outings': ['concert', 'museum'],
      'Food & Drinks': ['mexican', 'food', 'coffee'],
      Games: ['game', 'trivia'],
      'Lifestyle & Enrichment': ['book', 'meditat', 'language'],
      'Sports & Outdoors': ['golf', 'football', 'flag', 'tennis', 'hike'],
      'Travel & Seasonal': ['ski', 'beach', 'road'],
    }

    const typeMap: Record<string, string> = {
      Friendship: 'friendship',
      Dating: 'dating',
      'Something casual': 'casual',
    }

    return items.filter((item) => {
      if (hiddenIds.has(item.id)) return false
      if (item.type !== 'activity') return true

      const plan = plansById[item.id]
      const cat = item.category.toLowerCase()
      const activity = (plan?.activity || item.category).toLowerCase()

      if (filters.types.length && plan) {
        const ok = filters.types.some(
          (t) => plan.planType === typeMap[t] || plan.planType === t.toLowerCase(),
        )
        if (!ok) return false
      }

      if (activeCategory) {
        const keys = pillMap[activeCategory] ?? []
        if (
          keys.length &&
          !keys.some((k) => cat.includes(k) || activity.includes(k))
        ) {
          return false
        }
      }

      if (filters.categories.length) {
        const ok = filters.categories.some((c) => {
          const keys = sheetMap[c] ?? []
          if (!keys.length) return true
          return keys.some((k) => cat.includes(k) || activity.includes(k))
        })
        if (!ok) return false
      }

      if (filters.additional.includes('Last-minute')) {
        if (!plan?.lastMinute && !item.status?.toLowerCase().includes('last')) {
          return false
        }
      }

      if (filters.additional.includes('Couples plan')) {
        if (!plan?.couplesOnly && !item.user.subtitle?.toLowerCase().includes('couple')) {
          return false
        }
      }

      return true
    })
  }, [items, activeCategory, filters, plansById, hiddenIds])

  const value: Ctx = {
    items,
    plansById,
    loading,
    error,
    refreshFeed,
    joinStates,
    watchIds,
    upcomingCount,
    filters,
    setFilters,
    clearFilters,
    filterOpen,
    setFilterOpen,
    searchOpen,
    setSearchOpen,
    dateOpen,
    setDateOpen,
    shareId,
    setShareId,
    menuId,
    setMenuId,
    peopleId,
    setPeopleId,
    peopleList,
    expandId,
    setExpandId,
    joinConfirmId,
    setJoinConfirmId,
    editRequestId,
    setEditRequestId,
    requestSentOpen,
    setRequestSentOpen,
    confirmJoin,
    setJoinState,
    toggleWatch,
    hideFromFeed,
    requestEdit,
    loadPeople,
    activeCategory,
    setActiveCategory,
    filteredItems,
  }

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
}

export function useFeed() {
  const ctx = useContext(FeedContext)
  if (!ctx) throw new Error('useFeed must be used within FeedProvider')
  return ctx
}

export function parseSpots(spots: string) {
  return spotsFilled(spots)
}
