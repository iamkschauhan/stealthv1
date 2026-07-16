import {
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
  deleteDoc,
  type Firestore,
} from 'firebase/firestore'
import { getDb } from '../firebase'
import type { Plan, PlanStatus } from './types'

function db(): Firestore {
  return getDb()
}

export function plansCol() {
  return collection(db(), 'plans')
}

export function planRef(planId: string) {
  return doc(db(), 'plans', planId)
}

export async function getPlan(planId: string): Promise<Plan | null> {
  const snap = await getDoc(planRef(planId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Plan, 'id'>) }
}

export async function createPlan(
  planId: string,
  data: Omit<Plan, 'id'>,
): Promise<Plan> {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  ) as Omit<Plan, 'id'>
  await setDoc(planRef(planId), cleaned)
  return { id: planId, ...cleaned }
}

export async function updatePlan(
  planId: string,
  patch: Partial<Plan>,
): Promise<void> {
  const cleaned = Object.fromEntries(
    Object.entries({ ...patch, updatedAt: Date.now() }).filter(
      ([, v]) => v !== undefined,
    ),
  )
  await updateDoc(planRef(planId), cleaned)
}

export async function deletePlan(planId: string): Promise<void> {
  await deleteDoc(planRef(planId))
}

/** Feed: open/full plans ordered by start time. */
export async function listFeedPlans(max = 40): Promise<Plan[]> {
  const q = query(
    plansCol(),
    where('status', 'in', ['open', 'full'] satisfies PlanStatus[]),
    orderBy('startsAt', 'asc'),
    limit(max),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Plan, 'id'>),
  }))
}

export async function listHostedPlans(hostId: string): Promise<Plan[]> {
  const q = query(
    plansCol(),
    where('hostId', '==', hostId),
    orderBy('startsAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Plan, 'id'>),
  }))
}
