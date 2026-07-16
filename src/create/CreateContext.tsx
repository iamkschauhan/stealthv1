import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_DRAFT,
  FILLED_DRAFT,
  GOING,
  INVITED,
  PLAN_REQUESTS,
  type CreatePlanDraft,
  type Person,
  type PlanRequest,
} from './data'

export type ManageTarget =
  | { kind: 'going'; person: Person }
  | { kind: 'invited'; person: Person }
  | null

type Ctx = {
  draft: CreatePlanDraft
  setDraft: React.Dispatch<React.SetStateAction<CreatePlanDraft>>
  patchDraft: (patch: Partial<CreatePlanDraft>) => void
  resetDraft: () => void
  loadSample: () => void
  ensureSamplePlan: () => void
  postedPlanId: string | null
  setPostedPlanId: (id: string | null) => void
  suggestOpen: boolean
  setSuggestOpen: (v: boolean) => void
  going: Person[]
  invited: Person[]
  requests: PlanRequest[]
  removeGoing: (name: string) => void
  removeInvited: (name: string) => void
  addInvites: (people: Person[]) => void
  addReservedSlots: (count: number) => void
  resolveRequest: (id: string, accept: boolean) => void
  manageTarget: ManageTarget
  setManageTarget: (t: ManageTarget) => void
}

const CreateContext = createContext<Ctx | null>(null)

export function CreateProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CreatePlanDraft>(DEFAULT_DRAFT)
  const [postedPlanId, setPostedPlanId] = useState<string | null>(null)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [going, setGoing] = useState<Person[]>(GOING)
  const [invited, setInvited] = useState<Person[]>(INVITED)
  const [requests, setRequests] = useState<PlanRequest[]>(PLAN_REQUESTS)
  const [manageTarget, setManageTarget] = useState<ManageTarget>(null)

  const patchDraft = useCallback(
    (patch: Partial<CreatePlanDraft>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  )

  const resetDraft = useCallback(() => {
    setDraft(DEFAULT_DRAFT)
    setGoing(GOING)
    setInvited(INVITED)
    setRequests(PLAN_REQUESTS)
    setPostedPlanId(null)
  }, [])

  const loadSample = useCallback(() => setDraft(FILLED_DRAFT), [])

  const ensureSamplePlan = useCallback(() => {
    setDraft((d) => (d.activity ? d : FILLED_DRAFT))
  }, [])

  const removeGoing = useCallback((name: string) => {
    setGoing((list) => list.filter((p) => p.name !== name || p.role === 'Host'))
    setManageTarget(null)
  }, [])

  const removeInvited = useCallback((name: string) => {
    setInvited((list) => list.filter((p) => p.name !== name))
    setManageTarget(null)
  }, [])

  const addInvites = useCallback((people: Person[]) => {
    setInvited((list) => {
      const names = new Set(list.map((p) => p.name))
      const next = people
        .filter((p) => !names.has(p.name))
        .map((p) => ({ ...p, expires: 'Expires in 1 hour' }))
      return [...list.filter((p) => !p.reserved), ...next, ...list.filter((p) => p.reserved)]
    })
  }, [])

  const addReservedSlots = useCallback((count: number) => {
    setInvited((list) => [
      ...list,
      ...Array.from({ length: count }, (_, i) => ({
        name: `Reserved ${list.filter((p) => p.reserved).length + i + 1}`,
        avatar: '',
        expires: 'Expires in 1 hour',
        reserved: true,
      })),
    ])
  }, [])

  const resolveRequest = useCallback(
    (id: string, accept: boolean) => {
      setRequests((list) => {
        const req = list.find((r) => r.id === id)
        if (accept && req?.kind === 'join') {
          setGoing((g) => {
            if (g.some((p) => p.name === req.name)) return g
            return [...g, { name: req.name, avatar: req.avatar }]
          })
        }
        if (accept && req?.kind === 'location') {
          setDraft((d) => ({ ...d, location: 'Laurel Lanes Country Club' }))
        }
        if (accept && req?.kind === 'time') {
          setDraft((d) => ({ ...d, startTime: '8:00 AM' }))
        }
        if (accept && req?.kind === 'spots') {
          setDraft((d) => ({ ...d, spots: '8' }))
        }
        return list.filter((r) => r.id !== id)
      })
    },
    [],
  )

  return (
    <CreateContext.Provider
      value={{
        draft,
        setDraft,
        patchDraft,
        resetDraft,
        loadSample,
        ensureSamplePlan,
        postedPlanId,
        setPostedPlanId,
        suggestOpen,
        setSuggestOpen,
        going,
        invited,
        requests,
        removeGoing,
        removeInvited,
        addInvites,
        addReservedSlots,
        resolveRequest,
        manageTarget,
        setManageTarget,
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export function useCreate() {
  const ctx = useContext(CreateContext)
  if (!ctx) throw new Error('useCreate must be used within CreateProvider')
  return ctx
}
