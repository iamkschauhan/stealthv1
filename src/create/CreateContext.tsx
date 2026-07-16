import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import {
  acceptJoinRequest,
  cancelPlan,
  denyJoinRequest,
  loadPlanBundle,
  publishPlanFromDraft,
  removeMember,
  savePlanDraftEdits,
  upsertMember,
} from '../data/planActions'
import { updatePlan } from '../data/plans'
import {
  DEFAULT_DRAFT,
  FILLED_DRAFT,
  type CreatePlanDraft,
  type Person,
  type PlanRequest,
} from './data'
import { planToDraft } from './mapPlan'
import type { Plan } from '../data/types'
import { notifyInvite } from '../notify/notifyActions'

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
  livePlan: Plan | null
  busy: boolean
  error: string | null
  publishDraft: () => Promise<string>
  saveEdits: () => Promise<void>
  deleteLivePlan: () => Promise<void>
  reloadPlan: (planId: string) => Promise<void>
  suggestOpen: boolean
  setSuggestOpen: (v: boolean) => void
  going: Person[]
  invited: Person[]
  requests: PlanRequest[]
  removeGoing: (person: Person) => Promise<void>
  removeInvited: (person: Person) => Promise<void>
  addInvites: (people: Person[]) => Promise<void>
  addReservedSlots: (count: number) => Promise<void>
  resolveRequest: (id: string, accept: boolean) => Promise<void>
  manageTarget: ManageTarget
  setManageTarget: (t: ManageTarget) => void
}

const CreateContext = createContext<Ctx | null>(null)

function membersToLists(
  members: Awaited<ReturnType<typeof loadPlanBundle>> extends null
    ? never
    : NonNullable<Awaited<ReturnType<typeof loadPlanBundle>>>['members'],
  hostId: string,
) {
  const going: Person[] = []
  const invited: Person[] = []
  const requests: PlanRequest[] = []

  for (const m of members) {
    const person: Person = {
      uid: m.uid,
      name: m.displayName || 'Guest',
      avatar: m.avatarUrl || '',
      role: m.role === 'host' ? 'Host' : undefined,
      reserved: m.reserved,
      expires: m.expiresAt
        ? `Expires in ${Math.max(1, Math.round((m.expiresAt - Date.now()) / 60000))} mins`
        : undefined,
    }
    if (m.role === 'host' || m.role === 'going') going.push(person)
    else if (m.role === 'invited') invited.push(person)
    else if (m.role === 'requested' || m.role === 'waiting') {
      requests.push({
        id: m.uid,
        uid: m.uid,
        name: person.name,
        avatar: person.avatar,
        kind: m.requestKind || 'join',
        detail: m.requestDetail || 'would like to join your plan',
        time: 'now',
      })
    }
  }

  // Ensure host first in going
  going.sort((a, b) => {
    if (a.uid === hostId) return -1
    if (b.uid === hostId) return 1
    return 0
  })

  return { going, invited, requests }
}

export function CreateProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [draft, setDraft] = useState<CreatePlanDraft>(DEFAULT_DRAFT)
  const [postedPlanId, setPostedPlanId] = useState<string | null>(null)
  const [livePlan, setLivePlan] = useState<Plan | null>(null)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [going, setGoing] = useState<Person[]>([])
  const [invited, setInvited] = useState<Person[]>([])
  const [requests, setRequests] = useState<PlanRequest[]>([])
  const [manageTarget, setManageTarget] = useState<ManageTarget>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hostSeeded, setHostSeeded] = useState(false)

  useEffect(() => {
    if (hostSeeded || !profile) return
    setDraft((d) => ({
      ...d,
      host: profile.displayName || d.host || 'You',
      hostAvatar:
        profile.avatarUrl ||
        d.hostAvatar ||
        DEFAULT_DRAFT.hostAvatar,
    }))
    setHostSeeded(true)
  }, [profile, hostSeeded])

  const patchDraft = useCallback(
    (patch: Partial<CreatePlanDraft>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  )

  const resetDraft = useCallback(() => {
    setDraft({
      ...DEFAULT_DRAFT,
      host: profile?.displayName || DEFAULT_DRAFT.host,
      hostAvatar: profile?.avatarUrl || DEFAULT_DRAFT.hostAvatar,
    })
    setGoing([])
    setInvited([])
    setRequests([])
    setPostedPlanId(null)
    setLivePlan(null)
    setError(null)
  }, [profile])

  const loadSample = useCallback(() => {
    setDraft({
      ...FILLED_DRAFT,
      host: profile?.displayName || FILLED_DRAFT.host,
      hostAvatar: profile?.avatarUrl || FILLED_DRAFT.hostAvatar,
    })
  }, [profile])

  const ensureSamplePlan = useCallback(() => {
    setDraft((d) =>
      d.activity
        ? d
        : {
            ...FILLED_DRAFT,
            host: profile?.displayName || FILLED_DRAFT.host,
            hostAvatar: profile?.avatarUrl || FILLED_DRAFT.hostAvatar,
          },
    )
  }, [profile])

  const applyBundle = useCallback(
    (plan: Plan, members: NonNullable<Awaited<ReturnType<typeof loadPlanBundle>>>['members']) => {
      setLivePlan(plan)
      setPostedPlanId(plan.id)
      setDraft(planToDraft(plan))
      const lists = membersToLists(members, plan.hostId)
      setGoing(lists.going)
      setInvited(lists.invited)
      setRequests(lists.requests)
    },
    [],
  )

  const reloadPlan = useCallback(
    async (planId: string) => {
      const bundle = await loadPlanBundle(planId)
      if (!bundle) throw new Error('Plan not found')
      applyBundle(bundle.plan, bundle.members)
    },
    [applyBundle],
  )

  const publishDraft = useCallback(async () => {
    if (!user) throw new Error('Sign in to post a plan')
    setBusy(true)
    setError(null)
    try {
      const plan = await publishPlanFromDraft(draft, user.uid)
      await reloadPlan(plan.id)
      return plan.id
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to post plan'
      setError(message)
      throw err
    } finally {
      setBusy(false)
    }
  }, [draft, reloadPlan, user])

  const saveEdits = useCallback(async () => {
    if (!user || !postedPlanId) throw new Error('No plan to update')
    setBusy(true)
    setError(null)
    try {
      await savePlanDraftEdits(postedPlanId, draft, user.uid)
      await reloadPlan(postedPlanId)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update plan'
      setError(message)
      throw err
    } finally {
      setBusy(false)
    }
  }, [draft, postedPlanId, reloadPlan, user])

  const deleteLivePlan = useCallback(async () => {
    if (!postedPlanId) {
      resetDraft()
      return
    }
    setBusy(true)
    try {
      await cancelPlan(postedPlanId)
      resetDraft()
    } finally {
      setBusy(false)
    }
  }, [postedPlanId, resetDraft])

  const removeGoing = useCallback(
    async (person: Person) => {
      if (person.role === 'Host' || !person.uid || !postedPlanId) {
        setManageTarget(null)
        return
      }
      await removeMember(postedPlanId, person.uid)
      if (livePlan) {
        await updatePlan(postedPlanId, {
          spotsTaken: Math.max(1, (livePlan.spotsTaken || 1) - 1),
          status: livePlan.status === 'full' ? 'open' : livePlan.status,
        })
      }
      setManageTarget(null)
      await reloadPlan(postedPlanId)
    },
    [livePlan, postedPlanId, reloadPlan],
  )

  const removeInvited = useCallback(
    async (person: Person) => {
      if (!person.uid || !postedPlanId) {
        setManageTarget(null)
        return
      }
      await removeMember(postedPlanId, person.uid)
      setManageTarget(null)
      await reloadPlan(postedPlanId)
    },
    [postedPlanId, reloadPlan],
  )

  const addInvites = useCallback(
    async (people: Person[]) => {
      if (!postedPlanId) {
        setInvited((list) => {
          const names = new Set(list.map((p) => p.name))
          const next = people
            .filter((p) => !names.has(p.name))
            .map((p) => ({ ...p, expires: 'Expires in 1 hour' }))
          return [
            ...list.filter((p) => !p.reserved),
            ...next,
            ...list.filter((p) => p.reserved),
          ]
        })
        return
      }
      const now = Date.now()
      const expiresAt = now + 60 * 60 * 1000
      const planTitle = draft.activity || 'a plan'
      for (const p of people) {
        const uid = p.uid || `invite_${p.name.replace(/\W+/g, '_').toLowerCase()}_${now}`
        await upsertMember(postedPlanId, uid, {
          role: 'invited',
          displayName: p.name,
          avatarUrl: p.avatar,
          expiresAt,
          createdAt: now,
          updatedAt: now,
        })
        if (p.uid) {
          await notifyInvite({
            inviteeUid: p.uid,
            hostId: user!.uid,
            hostName: profile?.displayName || draft.host,
            hostAvatar: profile?.avatarUrl || draft.hostAvatar,
            planId: postedPlanId,
            planTitle,
          })
        }
      }
      await reloadPlan(postedPlanId)
    },
    [draft.activity, draft.host, draft.hostAvatar, postedPlanId, profile, reloadPlan, user],
  )

  const addReservedSlots = useCallback(
    async (count: number) => {
      if (!postedPlanId) {
        setInvited((list) => [
          ...list,
          ...Array.from({ length: count }, (_, i) => ({
            name: `Reserved ${list.filter((p) => p.reserved).length + i + 1}`,
            avatar: '',
            expires: 'Expires in 1 hour',
            reserved: true,
          })),
        ])
        return
      }
      const now = Date.now()
      const expiresAt = now + 60 * 60 * 1000
      for (let i = 0; i < count; i++) {
        const uid = `reserved_${now}_${i}`
        await upsertMember(postedPlanId, uid, {
          role: 'invited',
          displayName: 'Reserved',
          reserved: true,
          expiresAt,
          createdAt: now,
          updatedAt: now,
        })
      }
      await reloadPlan(postedPlanId)
    },
    [postedPlanId, reloadPlan],
  )

  const resolveRequest = useCallback(
    async (id: string, accept: boolean) => {
      const req = requests.find((r) => r.id === id)
      if (!req || !postedPlanId || !user) {
        setRequests((list) => list.filter((r) => r.id !== id))
        return
      }
      const memberUid = req.uid || req.id
      if (req.kind === 'join') {
        if (accept) await acceptJoinRequest(postedPlanId, memberUid, user.uid)
        else await denyJoinRequest(postedPlanId, memberUid, user.uid)
      } else if (accept) {
        if (req.kind === 'location') {
          const loc = req.detail.replace(/^Location change:\s*/i, '')
          await updatePlan(postedPlanId, { locationLabel: loc })
          setDraft((d) => ({ ...d, location: loc }))
        }
        if (req.kind === 'time') {
          const time = req.detail.replace(/^Time change:\s*/i, '')
          await updatePlan(postedPlanId, { startTimeLabel: time })
          setDraft((d) => ({ ...d, startTime: time }))
        }
        if (req.kind === 'spots') {
          const spots = req.detail.replace(/^Available spots change:\s*/i, '')
          await updatePlan(postedPlanId, { spotsTotal: Number(spots) || 0 })
          setDraft((d) => ({ ...d, spots }))
        }
        await removeMember(postedPlanId, memberUid)
      } else {
        await removeMember(postedPlanId, memberUid)
      }
      await reloadPlan(postedPlanId)
    },
    [postedPlanId, reloadPlan, requests, user],
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
        livePlan,
        busy,
        error,
        publishDraft,
        saveEdits,
        deleteLivePlan,
        reloadPlan,
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
