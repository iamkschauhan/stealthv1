import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { feed as seedFeed, type FeedItem } from '../data'

export type JoinState = 'none' | 'joined' | 'waiting' | 'requested'

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
  joinStates: Record<string, JoinState>
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
  expandId: string | null
  setExpandId: (id: string | null) => void
  joinConfirmId: string | null
  setJoinConfirmId: (id: string | null) => void
  editRequestId: string | null
  setEditRequestId: (id: string | null) => void
  requestSentOpen: boolean
  setRequestSentOpen: (v: boolean) => void
  confirmJoin: (id: string) => void
  setJoinState: (id: string, state: JoinState) => void
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
  const [items] = useState(seedFeed)
  const [joinStates, setJoinStates] = useState<Record<string, JoinState>>({})
  const [filters, setFilters] = useState<FeedFilters>(defaultFilters)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [peopleId, setPeopleId] = useState<string | null>(null)
  const [expandId, setExpandId] = useState<string | null>(null)
  const [joinConfirmId, setJoinConfirmId] = useState<string | null>(null)
  const [editRequestId, setEditRequestId] = useState<string | null>(null)
  const [requestSentOpen, setRequestSentOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])

  const setJoinState = useCallback((id: string, state: JoinState) => {
    setJoinStates((prev) => ({ ...prev, [id]: state }))
  }, [])

  const confirmJoin = useCallback((id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item || item.type !== 'activity') {
      setJoinStates((prev) => ({ ...prev, [id]: 'joined' }))
      return
    }
    const { full } = spotsFilled(item.spots)
    setJoinStates((prev) => ({
      ...prev,
      [id]: full ? 'waiting' : 'joined',
    }))
  }, [items])

  const filteredItems = useMemo(() => {
    const pillMap: Record<string, string[]> = {
      Creative: [],
      'Events & Outings': ['concert'],
      'Food & Drinks': ['mexican', 'food'],
      Games: ['game'],
      'Sports & Fitness': ['golf', 'football', 'flag'],
      Nightlife: ['concert'],
    }
    const sheetMap: Record<string, string[]> = {
      Creative: [],
      'Events & Outings': ['concert'],
      'Food & Drinks': ['mexican', 'food'],
      Games: ['game'],
      'Lifestyle & Enrichment': [],
      'Sports & Outdoors': ['golf', 'football', 'flag'],
      'Travel & Seasonal': [],
    }

    return items.filter((item) => {
      if (item.type === 'social') {
        if (filters.additional.includes('Couples plan')) return false
        if (filters.additional.includes('Last-minute')) return false
        if (filters.categories.length || activeCategory) return false
        return true
      }

      const cat = item.category.toLowerCase()

      if (activeCategory) {
        const keys = pillMap[activeCategory] ?? []
        if (keys.length && !keys.some((k) => cat.includes(k))) return false
      }

      if (filters.categories.length) {
        const ok = filters.categories.some((c) => {
          const keys = sheetMap[c] ?? []
          if (!keys.length) return true
          return keys.some((k) => cat.includes(k))
        })
        if (!ok) return false
      }

      if (
        filters.additional.includes('Last-minute') &&
        item.type === 'activity' &&
        !item.status
      ) {
        return false
      }

      if (filters.additional.includes('Couples plan')) {
        if (item.type !== 'activity' || !item.user.subtitle?.toLowerCase().includes('couple')) {
          return false
        }
      }

      return true
    })
  }, [items, activeCategory, filters])

  const value: Ctx = {
    items,
    joinStates,
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
