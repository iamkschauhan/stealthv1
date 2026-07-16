import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadMetadata,
} from 'firebase/storage'
import { getFirebaseStorage } from '../firebase'

export async function uploadImage(
  path: string,
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata,
): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, file, {
    contentType: metadata?.contentType ?? 'image/jpeg',
    customMetadata: metadata?.customMetadata,
  })
  return getDownloadURL(storageRef)
}

export async function uploadUserAvatar(
  uid: string,
  file: Blob,
): Promise<string> {
  return uploadImage(`users/${uid}/avatar.jpg`, file, {
    contentType: file.type || 'image/jpeg',
  })
}

export async function uploadUserGalleryPhoto(
  uid: string,
  photoId: string,
  file: Blob,
): Promise<string> {
  return uploadImage(`users/${uid}/gallery/${photoId}`, file, {
    contentType: file.type || 'image/jpeg',
  })
}

export async function uploadPlanCover(
  planId: string,
  hostId: string,
  fileId: string,
  file: Blob,
): Promise<string> {
  return uploadImage(`plans/${planId}/cover/${fileId}`, file, {
    contentType: file.type || 'image/jpeg',
    customMetadata: { hostId },
  })
}

export async function uploadChatPhoto(
  threadId: string,
  senderId: string,
  fileId: string,
  file: Blob,
): Promise<string> {
  return uploadImage(`chat/${threadId}/${fileId}`, file, {
    contentType: file.type || 'image/jpeg',
    customMetadata: { senderId },
  })
}

export async function deleteStoragePath(path: string): Promise<void> {
  await deleteObject(ref(getFirebaseStorage(), path))
}
