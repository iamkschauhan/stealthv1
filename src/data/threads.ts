import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  addDoc,
  type Firestore,
} from 'firebase/firestore'
import { getDb } from '../firebase'
import { getPlan } from './plans'
import { listMembers } from './joins'
import type { ChatMessage, Thread } from './types'

function db(): Firestore {
  return getDb()
}

export function threadRef(threadId: string) {
  return doc(db(), 'threads', threadId)
}

export function messagesCol(threadId: string) {
  return collection(db(), 'threads', threadId, 'messages')
}

export async function getThread(threadId: string): Promise<Thread | null> {
  const snap = await getDoc(threadRef(threadId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Thread, 'id'>) }
}

export async function listThreadsForUser(uid: string): Promise<Thread[]> {
  const q = query(
    collection(db(), 'threads'),
    where('memberIds', 'array-contains', uid),
    orderBy('updatedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Thread, 'id'>),
    }))
    .filter((t) => !(t.hiddenFor || []).includes(uid))
}

export async function upsertThread(
  threadId: string,
  data: Partial<Omit<Thread, 'id'>> &
    Pick<Thread, 'planId' | 'memberIds' | 'createdAt' | 'updatedAt'>,
): Promise<void> {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  )
  await setDoc(threadRef(threadId), cleaned, { merge: true })
}

/** Thread id === planId so deep links `/messages/:planId` work. */
export async function ensureThreadForPlan(planId: string): Promise<string | null> {
  const [plan, members] = await Promise.all([getPlan(planId), listMembers(planId)])
  if (!plan) return null

  const active = members.filter((m) => m.role === 'host' || m.role === 'going')
  // Host alone is enough — chat opens right after posting a plan
  const memberIds = [
    ...new Set([plan.hostId, ...active.map((m) => m.uid)].filter(Boolean)),
  ]
  if (memberIds.length === 0) return null

  const existing = await getThread(planId)
  const now = Date.now()
  await upsertThread(planId, {
    planId,
    memberIds,
    title: plan.activity || plan.title || 'Plan chat',
    avatarUrl: plan.coverUrl || plan.hostAvatarUrl,
    lastMessage: existing?.lastMessage,
    lastSenderId: existing?.lastSenderId,
    unreadBy: existing?.unreadBy,
    hiddenFor: existing?.hiddenFor,
    createdAt: existing?.createdAt ?? now,
    updatedAt: existing ? existing.updatedAt : now,
  })
  return planId
}

export async function listMessages(
  threadId: string,
  max = 100,
): Promise<ChatMessage[]> {
  const q = query(messagesCol(threadId), orderBy('createdAt', 'asc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChatMessage, 'id'>),
  }))
}

export async function sendMessage(
  threadId: string,
  data: Omit<ChatMessage, 'id'>,
): Promise<string> {
  const thread = await getThread(threadId)
  const ref = await addDoc(messagesCol(threadId), data)
  const unreadBy: Record<string, number> = { ...(thread?.unreadBy || {}) }
  for (const mid of thread?.memberIds || []) {
    if (mid === data.senderId) {
      unreadBy[mid] = 0
      continue
    }
    unreadBy[mid] = (unreadBy[mid] || 0) + 1
  }
  await updateDoc(threadRef(threadId), {
    lastMessage: data.text ?? (data.photoUrl ? 'Photo' : ''),
    lastSenderId: data.senderId,
    updatedAt: Date.now(),
    unreadBy,
  })
  return ref.id
}

export async function markThreadReadForUser(
  threadId: string,
  uid: string,
): Promise<void> {
  const thread = await getThread(threadId)
  if (!thread) return
  await updateDoc(threadRef(threadId), {
    [`unreadBy.${uid}`]: 0,
  })
}

export async function hideThreadForUser(
  threadId: string,
  uid: string,
): Promise<void> {
  await updateDoc(threadRef(threadId), {
    hiddenFor: arrayUnion(uid),
  })
}
