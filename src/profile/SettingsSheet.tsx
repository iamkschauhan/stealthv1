import {
  Bell,
  Contact,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  ShieldCheck,
  Trash2,
  UserPlus,
  List,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth'
import { deleteAccount } from '../data/account'
import { useProfile } from './ProfileContext'
import { SETTINGS_MENU } from '../settings/data'
import { ConfirmModal } from '../settings/ui'

const ICONS = {
  Preferences: List,
  'Security & Login': ShieldCheck,
  Notifications: Bell,
  'Invite Friends to StealthApp': UserPlus,
  Privacy: Lock,
  'Help Center': HelpCircle,
  Legal: FileText,
  Contact: Contact,
} as const

export function SettingsSheet() {
  const { settingsOpen, setSettingsOpen } = useProfile()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0)
  const [deleteText, setDeleteText] = useState('')
  const [busy, setBusy] = useState(false)

  if (!settingsOpen && !logoutOpen && deleteStep === 0) return null

  return (
    <>
      {settingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-0 md:px-6">
          <button
            type="button"
            aria-label="Close settings"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl max-h-[85dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-gray-50">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
              <h2 className="text-center text-[18px] font-bold text-ink">Settings</h2>
            </div>

            <ul className="px-2 py-2">
              {SETTINGS_MENU.map(({ label, path }) => {
                const Icon = ICONS[label as keyof typeof ICONS]
                return (
                  <li key={label}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left hover:bg-feed-gap"
                      onClick={() => {
                        setSettingsOpen(false)
                        navigate(path)
                      }}
                    >
                      <Icon size={20} className="text-ink" strokeWidth={1.75} />
                      <span className="text-[15px] text-ink">{label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-gray-100 px-2 py-2 pb-6">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-brand hover:bg-feed-gap"
                onClick={() => {
                  setSettingsOpen(false)
                  setLogoutOpen(true)
                }}
              >
                <LogOut size={20} />
                <span className="text-[15px] font-medium">Log Out</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-red-500 hover:bg-red-50"
                onClick={() => {
                  setSettingsOpen(false)
                  setDeleteStep(1)
                  setDeleteText('')
                }}
              >
                <Trash2 size={20} />
                <span className="text-[15px] font-medium">Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        open={logoutOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        cancelLabel="Cancel"
        confirmLabel="Logout"
        confirmDanger
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setBusy(true)
          void logout()
            .then(() => {
              setLogoutOpen(false)
              navigate('/onboarding/splash')
            })
            .finally(() => setBusy(false))
        }}
      />

      {deleteStep === 1 ? (
        <ConfirmModal
          open
          title="Delete account"
          message="Are you sure you want to delete your account?"
          cancelLabel="Cancel"
          confirmLabel="Delete"
          confirmDanger
          onCancel={() => setDeleteStep(0)}
          onConfirm={() => setDeleteStep(2)}
        />
      ) : null}

      {deleteStep === 2 ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteStep(0)}
          />
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-5 py-5 text-center">
              <h3 className="text-[17px] font-bold text-ink">Delete account</h3>
              <p className="mt-2 text-[14px] leading-snug text-[#6b6b70]">
                After deleting your account, you will not be able to log in anymore. All personal
                data will be deleted. This is irreversible.
              </p>
              <div className="relative mt-4">
                <input
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full rounded-xl bg-onboard-input px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
                />
                {deleteText ? (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                    onClick={() => setDeleteText('')}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              disabled={deleteText !== 'DELETE' || busy || !user}
              onClick={() => {
                if (!user) return
                setBusy(true)
                void deleteAccount(user.uid)
                  .then(() => {
                    setDeleteStep(0)
                    navigate('/onboarding/splash')
                  })
                  .catch((err) => {
                    console.error(err)
                    alert(
                      err instanceof Error
                        ? err.message
                        : 'Could not delete account. You may need to re-authenticate.',
                    )
                  })
                  .finally(() => setBusy(false))
              }}
              className={[
                'w-full border-t border-gray-200 py-3.5 text-[15px] font-semibold disabled:opacity-50',
                deleteText === 'DELETE' ? 'text-red-500' : 'text-[#c7c7cc]',
              ].join(' ')}
            >
              {busy ? 'Deleting…' : 'Permanently delete'}
            </button>
            <button
              type="button"
              onClick={() => setDeleteStep(0)}
              className="w-full border-t border-gray-200 py-3.5 text-[15px] text-brand"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
