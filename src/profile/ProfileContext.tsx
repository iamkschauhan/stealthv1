import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_PROFILE, type ProfileTab, type ProfileUser } from './data'

type Ctx = {
  user: ProfileUser
  patch: (partial: Partial<ProfileUser>) => void
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
  const [user, setUser] = useState<ProfileUser>(DEMO_PROFILE)
  const [tab, setTab] = useState<ProfileTab>('Photos')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [viewingPhoto, setViewingPhoto] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const value = useMemo<Ctx>(
    () => ({
      user,
      patch: (partial) => setUser((u) => ({ ...u, ...partial })),
      tab,
      setTab,
      settingsOpen,
      setSettingsOpen,
      viewingPhoto,
      setViewingPhoto,
      deleteConfirm,
      setDeleteConfirm,
    }),
    [user, tab, settingsOpen, viewingPhoto, deleteConfirm],
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
