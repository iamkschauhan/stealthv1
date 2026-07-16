import {
  collection,
  doc,
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
import type { AppNotification } from './types'

function db(): Firestore {
  return getDb()
}

export function notificationsCol() {
  return collection(db(), 'notifications')
}

export async function listNotifications(
  userId: string,
  max = 50,
): Promise<AppNotification[]> {
  const q = query(
    notificationsCol(),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(max),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AppNotification, 'id'>),
  }))
}

export async function createNotification(
  id: string,
  data: Omit<AppNotification, 'id'>,
): Promise<void> {
  await setDoc(doc(db(), 'notifications', id), data)
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db(), 'notifications', id), { read: true })
}

export async function updateNotificationAction(
  id: string,
  actionState: AppNotification['actionState'],
): Promise<void> {
  await updateDoc(doc(db(), 'notifications', id), {
    actionState,
    read: true,
  })
}

export async function deleteNotification(id: string): Promise<void> {
  await deleteDoc(doc(db(), 'notifications', id))
}
