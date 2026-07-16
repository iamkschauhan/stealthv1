import { collection, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore'
import { getDb } from '../firebase'
import { getPlan, listFeedPlans, updatePlan } from '../data/plans'
import {
  clearWatch,
  getMember,
  listMembers,
  setWatch,
  upsertMember,
} from '../data/joins'
import { createNotification } from '../data/notifications'
import { ensureThreadForPlan } from '../data/threads'
import type { Plan, PlanMember, UserProfile } from '../data/types'

export type JoinState = 'none' | 'joined' | 'waiting' | 'requested'

export async function loadLiveFeed(max = 50): Promise<Plan[]> {
  return listFeedPlans(max)
}

export async function joinPlanAsUser(opts: {
  planId: string
  uid: string
  displayName?: string
  avatarUrl?: string
}): Promise<JoinState> {
  const plan = await getPlan(opts.planId)
  if (!plan) throw new Error('Plan not found')
  if (plan.hostId === opts.uid) return 'joined'

  const existing = await getMember(opts.planId, opts.uid)
  if (existing?.role === 'going' || existing?.role === 'host') return 'joined'
  if (existing?.role === 'waiting' || existing?.role === 'requested') {
    return existing.role === 'waiting' ? 'waiting' : 'requested'
  }

  const full = (plan.spotsTaken || 1) >= plan.spotsTotal
  const now = Date.now()
  const role = full ? 'waiting' : 'going'

  await upsertMember(opts.planId, opts.uid, {
    role,
    displayName: opts.displayName,
    avatarUrl: opts.avatarUrl,
    requestKind: full ? 'join' : undefined,
    requestDetail: full ? 'would like to join your plan' : undefined,
    createdAt: now,
    updatedAt: now,
  })

  if (!full) {
    const taken = Math.min(plan.spotsTotal, (plan.spotsTaken || 1) + 1)
    await updatePlan(opts.planId, {
      spotsTaken: taken,
      status: taken >= plan.spotsTotal ? 'full' : plan.status,
    })
  }

  await createNotification(`n_join_${opts.planId}_${opts.uid}`, {
    userId: plan.hostId,
    type: full ? 'join_request' : 'joined',
    title: full ? 'Join request' : 'Someone joined',
    body: full
      ? `${opts.displayName || 'Someone'} requested to join ${plan.title}`
      : `${opts.displayName || 'Someone'} is going to ${plan.title}`,
    actorId: opts.uid,
    actorName: opts.displayName,
    actorAvatarUrl: opts.avatarUrl,
    planId: opts.planId,
    actionState: full ? 'pending' : 'joined',
    read: false,
    createdAt: now,
  })

  if (!full) await ensureThreadForPlan(opts.planId)

  return full ? 'waiting' : 'joined'
}

export async function toggleWatchPlan(
  uid: string,
  planId: string,
  watching: boolean,
): Promise<boolean> {
  if (watching) {
    await clearWatch(uid, planId)
    return false
  }
  await setWatch(uid, planId)
  return true
}

export async function loadUserWatches(uid: string): Promise<Set<string>> {
  const q = query(collection(getDb(), 'watches'), where('userId', '==', uid))
  const snap = await getDocs(q)
  return new Set(snap.docs.map((d) => (d.data() as { planId: string }).planId))
}

export async function loadJoinStatesForUser(
  uid: string,
  planIds: string[],
): Promise<Record<string, JoinState>> {
  const out: Record<string, JoinState> = {}
  await Promise.all(
    planIds.map(async (planId) => {
      const m = await getMember(planId, uid)
      if (!m) return
      if (m.role === 'going' || m.role === 'host') out[planId] = 'joined'
      else if (m.role === 'waiting') out[planId] = 'waiting'
      else if (m.role === 'requested') out[planId] = 'requested'
    }),
  )
  return out
}

export async function hidePlan(uid: string, planId: string): Promise<void> {
  await setDoc(doc(getDb(), 'feedHidden', uid, 'plans', planId), {
    planId,
    createdAt: Date.now(),
  })
}

export async function listHiddenPlanIds(uid: string): Promise<Set<string>> {
  const snap = await getDocs(collection(getDb(), 'feedHidden', uid, 'plans'))
  return new Set(snap.docs.map((d) => d.id))
}

export async function submitReport(opts: {
  reporterId: string
  planId: string
  details: string
  photoUrl?: string
}): Promise<void> {
  const id = doc(collection(getDb(), 'reports')).id
  await setDoc(doc(getDb(), 'reports', id), {
    reporterId: opts.reporterId,
    targetType: 'plan',
    targetId: opts.planId,
    details: opts.details,
    photoUrl: opts.photoUrl,
    createdAt: Date.now(),
  })
}

export async function submitEditRequest(opts: {
  planId: string
  hostId: string
  requesterId: string
  field: string
  note?: string
}): Promise<void> {
  const id = doc(collection(getDb(), 'editRequests')).id
  const now = Date.now()
  await setDoc(doc(getDb(), 'editRequests', id), {
    planId: opts.planId,
    hostId: opts.hostId,
    requesterId: opts.requesterId,
    field: opts.field,
    note: opts.note,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  })
  await createNotification(`n_edit_${id}`, {
    userId: opts.hostId,
    type: 'edit_request',
    title: 'Edit request',
    body: `Someone requested a ${opts.field} change`,
    actorId: opts.requesterId,
    planId: opts.planId,
    actionState: 'pending',
    read: false,
    createdAt: now,
  })
}

export async function searchPeople(qText: string, max = 20): Promise<UserProfile[]> {
  const snap = await getDocs(query(collection(getDb(), 'users'), limit(80)))
  const needle = qText.trim().toLowerCase()
  const users = snap.docs.map((d) => ({
    uid: d.id,
    ...(d.data() as Omit<UserProfile, 'uid'>),
  }))
  if (!needle) return users.slice(0, max)
  return users
    .filter((u) => (u.displayName || '').toLowerCase().includes(needle))
    .slice(0, max)
}

export async function getPlanMembers(planId: string): Promise<PlanMember[]> {
  return listMembers(planId)
}

export async function countUserUpcoming(uid: string): Promise<number> {
  const snap = await getDocs(
    query(collection(getDb(), 'plans'), where('hostId', '==', uid), limit(40)),
  )
  return snap.docs.filter((d) => {
    const status = (d.data() as { status?: string }).status
    return status === 'open' || status === 'full' || status === 'confirmed'
  }).length
}
