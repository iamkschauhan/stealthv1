import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import { updateUserProfile } from '../data/users'
import { listHostedPlans } from '../data/plans'
import { uploadUserAvatar, uploadUserGalleryPhoto, uploadImage } from '../data/storage'
import type { UserProfile } from '../data/types'
import { DEMO_PROFILE, type ProfileTab, type ProfileUser } from './data'
import { mapUserToProfile } from './mapProfile'

type Ctx = {
  user: ProfileUser
  loading: boolean
  patch: (partial: Partial<ProfileUser>) => void
  saveProfile: (partial: Partial<UserProfile>) => Promise<void>
  uploadAvatar: (file: Blob) => Promise<string>
  uploadGalleryPhoto: (file: Blob) => Promise<string>
  uploadVerifyPhoto: (kind: 'id' | 'selfie', file: Blob) => Promise<string>
  removeGalleryPhoto: (url: string) => Promise<void>
  tab: ProfileTab
  setTab: (t: ProfileTab) => void
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
  viewingPhoto: number | null
  setViewingPhoto: (i: number | null) => void
  deleteConfirm: boolean
  setDeleteConfirm: (v: boolean) => void
}

const ProfileContext = createContext<Ctx | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user: authUser, profile, refreshProfile } = useAuth()
  const [user, setUser] = useState<ProfileUser>(DEMO_PROFILE)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<ProfileTab>('Photos')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [viewingPhoto, setViewingPhoto] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const hydrate = useCallback(async () => {
    setLoading(true)
    try {
      const mapped = mapUserToProfile(profile)
      if (authUser) {
        try {
          const hosted = await listHostedPlans(authUser.uid)
          const byActivity = new Map<string, number>()
          for (const p of hosted) {
            const key = p.activity || p.title || 'Plan'
            byActivity.set(key, (byActivity.get(key) || 0) + 1)
          }
          mapped.activities = [...byActivity.entries()].map(([title, plans]) => ({
            title,
            plans,
          }))
        } catch (err) {
          console.warn(err)
        }
      }
      setUser(mapped)
    } finally {
      setLoading(false)
    }
  }, [authUser, profile])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const patch = useCallback((partial: Partial<ProfileUser>) => {
    setUser((u) => ({ ...u, ...partial }))
  }, [])

  const saveProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      if (!authUser) throw new Error('Sign in required')
      await updateUserProfile(authUser.uid, partial)
      await refreshProfile()
    },
    [authUser, refreshProfile],
  )

  const uploadAvatar = useCallback(
    async (file: Blob) => {
      if (!authUser) throw new Error('Sign in required')
      const url = await uploadUserAvatar(authUser.uid, file)
      await updateUserProfile(authUser.uid, { avatarUrl: url })
      await refreshProfile()
      return url
    },
    [authUser, refreshProfile],
  )

  const uploadGalleryPhoto = useCallback(
    async (file: Blob) => {
      if (!authUser) throw new Error('Sign in required')
      const id = `${Date.now()}`
      const url = await uploadUserGalleryPhoto(authUser.uid, id, file)
      const next = [...(profile?.photoUrls || []), url].slice(0, 12)
      await updateUserProfile(authUser.uid, { photoUrls: next })
      await refreshProfile()
      return url
    },
    [authUser, profile?.photoUrls, refreshProfile],
  )

  const uploadVerifyPhoto = useCallback(
    async (kind: 'id' | 'selfie', file: Blob) => {
      if (!authUser) throw new Error('Sign in required')
      const url = await uploadImage(
        `users/${authUser.uid}/verify/${kind}_${Date.now()}`,
        file,
        {
          contentType: (file as File).type || 'image/jpeg',
          customMetadata: { uploaderId: authUser.uid },
        },
      )
      return url
    },
    [authUser],
  )

  const removeGalleryPhoto = useCallback(
    async (url: string) => {
      if (!authUser) return
      const next = (profile?.photoUrls || []).filter((u) => u !== url)
      const avatar = profile?.avatarUrl === url ? undefined : profile?.avatarUrl
      await updateUserProfile(authUser.uid, {
        photoUrls: next,
        ...(avatar === undefined && profile?.avatarUrl === url
          ? { avatarUrl: next[0] || '' }
          : {}),
      })
      await refreshProfile()
    },
    [authUser, profile, refreshProfile],
  )

  const value = useMemo<Ctx>(
    () => ({
      user,
      loading,
      patch,
      saveProfile,
      uploadAvatar,
      uploadGalleryPhoto,
      uploadVerifyPhoto,
      removeGalleryPhoto,
      tab,
      setTab,
      settingsOpen,
      setSettingsOpen,
      viewingPhoto,
      setViewingPhoto,
      deleteConfirm,
      setDeleteConfirm,
    }),
    [
      user,
      loading,
      patch,
      saveProfile,
      uploadAvatar,
      uploadGalleryPhoto,
      uploadVerifyPhoto,
      removeGalleryPhoto,
      tab,
      settingsOpen,
      viewingPhoto,
      deleteConfirm,
    ],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
