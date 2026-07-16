import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  type Firestore,
} from 'firebase/firestore'
import { getDb } from '../firebase'
import type { MemberRole, PlanMember } from './types'

function db(): Firestore {
  return getDb()
}

export function membersCol(planId: string) {
  return collection(db(), 'plans', planId, 'members')
}

export function memberRef(planId: string, uid: string) {
  return doc(db(), 'plans', planId, 'members', uid)
}

export async function getMember(
  planId: string,
  uid: string,
): Promise<PlanMember | null> {
  const snap = await getDoc(memberRef(planId, uid))
  if (!snap.exists()) return null
  return { uid, ...(snap.data() as Omit<PlanMember, 'uid'>) }
}

export async function listMembers(planId: string): Promise<PlanMember[]> {
  const snap = await getDocs(membersCol(planId))
  return snap.docs.map((d) => ({
    uid: d.id,
    ...(d.data() as Omit<PlanMember, 'uid'>),
  }))
}

export async function upsertMember(
  planId: string,
  uid: string,
  data: Omit<PlanMember, 'uid'>,
): Promise<void> {
  await setDoc(memberRef(planId, uid), { ...data, userId: uid }, { merge: true })
}

export async function setMemberRole(
  planId: string,
  uid: string,
  role: MemberRole,
): Promise<void> {
  await updateDoc(memberRef(planId, uid), {
    role,
    updatedAt: Date.now(),
  })
}

export async function removeMember(planId: string, uid: string): Promise<void> {
  await deleteDoc(memberRef(planId, uid))
}

export function watchId(userId: string, planId: string) {
  return `${userId}_${planId}`
}

export async function setWatch(userId: string, planId: string): Promise<void> {
  const id = watchId(userId, planId)
  await setDoc(doc(db(), 'watches', id), {
    userId,
    planId,
    createdAt: Date.now(),
  })
}

export async function clearWatch(userId: string, planId: string): Promise<void> {
  await deleteDoc(doc(db(), 'watches', watchId(userId, planId)))
}
