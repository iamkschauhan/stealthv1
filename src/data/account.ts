import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'
import { getDb, getFirebaseAuth } from '../firebase'
import { deleteStoragePath } from './storage'
import { userRef } from './users'
import type { SupportTicket } from './types'

export async function createSupportTicket(opts: {
  userId: string
  kind: SupportTicket['kind']
  body: string
  subject?: string
}): Promise<string> {
  const id = doc(collection(getDb(), 'supportTickets')).id
  await setDoc(doc(getDb(), 'supportTickets', id), {
    userId: opts.userId,
    kind: opts.kind,
    body: opts.body,
    subject: opts.subject,
    createdAt: Date.now(),
  })
  return id
}

export async function listBlockedUsers(uid: string): Promise<
  { uid: string; name?: string; avatarUrl?: string }[]
> {
  const snap = await getDocs(collection(getDb(), 'blocks', uid, 'blocked'))
  return snap.docs.map((d) => ({
    uid: d.id,
    ...(d.data() as { name?: string; avatarUrl?: string }),
  }))
}

export async function unblockUser(uid: string, otherUid: string): Promise<void> {
  await deleteDoc(doc(getDb(), 'blocks', uid, 'blocked', otherUid))
}

export async function blockUser(
  uid: string,
  other: { uid: string; name?: string; avatarUrl?: string },
): Promise<void> {
  await setDoc(doc(getDb(), 'blocks', uid, 'blocked', other.uid), {
    name: other.name,
    avatarUrl: other.avatarUrl,
    createdAt: Date.now(),
  })
}

/** Best-effort account wipe: Firestore user, Storage paths, Auth user. */
export async function deleteAccount(uid: string): Promise<void> {
  const auth = getFirebaseAuth()
  const current = auth.currentUser
  if (!current || current.uid !== uid) {
    throw new Error('Not signed in')
  }

  try {
    const photos = await getDocs(collection(getDb(), 'users', uid, 'photos'))
    await Promise.all(photos.docs.map((d) => deleteDoc(d.ref)))
  } catch (err) {
    console.warn('photo cleanup', err)
  }

  try {
    const blocked = await getDocs(collection(getDb(), 'blocks', uid, 'blocked'))
    await Promise.all(blocked.docs.map((d) => deleteDoc(d.ref)))
  } catch (err) {
    console.warn('blocks cleanup', err)
  }

  try {
    await deleteDoc(userRef(uid))
  } catch (err) {
    console.warn('user doc cleanup', err)
  }

  for (const path of [
    `users/${uid}/avatar.jpg`,
    `users/${uid}/verify/id`,
    `users/${uid}/verify/selfie`,
  ]) {
    try {
      await deleteStoragePath(path)
    } catch {
      /* ignore missing */
    }
  }

  await deleteUser(current)
}
