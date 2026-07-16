import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'
import { getDb } from '../firebase'
import type { UserProfile } from './types'

function db(): Firestore {
  return getDb()
}

export function userRef(uid: string) {
  return doc(db(), 'users', uid)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userRef(uid))
  if (!snap.exists()) return null
  return { uid, ...(snap.data() as Omit<UserProfile, 'uid'>) }
}

export async function ensureUserProfile(
  uid: string,
  seed: Partial<UserProfile> = {},
): Promise<UserProfile> {
  const ref = userRef(uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return { uid, ...(snap.data() as Omit<UserProfile, 'uid'>) }
  }

  const now = Date.now()
  const profile: UserProfile = {
    uid,
    onboardingComplete: false,
    onboardingStep: 'personal-info',
    createdAt: now,
    updatedAt: now,
    ...seed,
  }
  await setDoc(ref, {
    ...profile,
    // serverTimestamp kept for audit; numeric fields used by app
    serverCreatedAt: serverTimestamp(),
  })
  return profile
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<UserProfile>,
): Promise<void> {
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  )
  await updateDoc(userRef(uid), {
    ...cleaned,
    updatedAt: Date.now(),
  })
}

export async function setOnboardingComplete(uid: string): Promise<void> {
  await updateUserProfile(uid, {
    onboardingComplete: true,
    onboardingStep: 'done',
  })
}
