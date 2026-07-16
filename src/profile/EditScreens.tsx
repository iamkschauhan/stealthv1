import { useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { createSupportTicket } from '../data/account'
import { useProfile } from './ProfileContext'
import { SettingsShell } from '../settings/ui'

function EditShell({
  title,
  children,
  onSave,
  canSave,
  busy,
}: {
  title: string
  children: ReactNode
  onSave: () => void
  canSave: boolean
  busy?: boolean
}) {
  return (
    <SettingsShell
      title={title}
      backTo="/profile"
      footer={
        <button
          type="button"
          disabled={!canSave || busy}
          onClick={onSave}
          className={[
            'w-full rounded-full py-4 text-[15px] font-semibold disabled:opacity-50',
            canSave ? 'bg-ink text-white' : 'bg-onboard-disabled text-[#c7c7cc]',
          ].join(' ')}
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
      }
    >
      {children}
    </SettingsShell>
  )
}

export function EditHometownScreen() {
  const { user, saveProfile } = useProfile()
  const navigate = useNavigate()
  const [city, setCity] = useState(user.hometown)
  const [busy, setBusy] = useState(false)

  return (
    <EditShell
      title="Hometown"
      canSave={city.trim().length > 0}
      busy={busy}
      onSave={() => {
        setBusy(true)
        void saveProfile({ hometown: city.trim() })
          .then(() => navigate('/profile'))
          .finally(() => setBusy(false))
      }}
    >
      <label className="mb-2 block text-[13px] text-muted">City</label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full rounded-2xl bg-onboard-input px-4 py-4 text-[16px] outline-none focus:ring-2 focus:ring-brand/30"
        placeholder="City"
      />
    </EditShell>
  )
}

export function EditCompanyScreen() {
  const { user, saveProfile } = useProfile()
  const navigate = useNavigate()
  const [company, setCompany] = useState(user.company)
  const [job, setJob] = useState(user.job)
  const [busy, setBusy] = useState(false)

  return (
    <EditShell
      title="Work"
      canSave={company.trim().length > 0}
      busy={busy}
      onSave={() => {
        setBusy(true)
        void saveProfile({ company: company.trim(), job: job.trim() })
          .then(() => navigate('/profile'))
          .finally(() => setBusy(false))
      }}
    >
      <label className="mb-2 block text-[13px] text-muted">Company name</label>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="mb-4 w-full rounded-2xl bg-onboard-input px-4 py-4 text-[16px] outline-none"
        placeholder="Company"
      />
      <label className="mb-2 block text-[13px] text-muted">Job</label>
      <input
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="w-full rounded-2xl bg-onboard-input px-4 py-4 text-[16px] outline-none"
        placeholder="Job title"
      />
    </EditShell>
  )
}

export function EditEthnicityScreen() {
  const { user, saveProfile } = useProfile()
  const navigate = useNavigate()
  const options = [
    'East Asian',
    'South Asian',
    'Black / African descent',
    'Hispanic / Latino',
    'White / Caucasian',
    'Middle Eastern',
    'Indigenous',
    'Prefer not to say',
  ]
  const [value, setValue] = useState(user.ethnicity)
  const [busy, setBusy] = useState(false)

  return (
    <EditShell
      title="Ethnicity"
      canSave={!!value}
      busy={busy}
      onSave={() => {
        setBusy(true)
        void saveProfile({ ethnicity: value })
          .then(() => navigate('/profile'))
          .finally(() => setBusy(false))
      }}
    >
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(opt)}
            className={[
              'rounded-full py-3.5 text-[15px] font-medium',
              value === opt ? 'bg-brand text-white' : 'bg-pill text-ink',
            ].join(' ')}
          >
            {opt}
          </button>
        ))}
      </div>
    </EditShell>
  )
}

export function ChangePhotoScreen() {
  const { user, uploadAvatar } = useProfile()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(user.avatar)
  const [pending, setPending] = useState<Blob | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <EditShell
      title="Change photo"
      canSave={!!pending}
      busy={busy}
      onSave={() => {
        if (!pending) {
          navigate('/profile')
          return
        }
        setBusy(true)
        void uploadAvatar(pending)
          .then(() => navigate('/profile'))
          .finally(() => setBusy(false))
      }}
    >
      <div className="mb-6 flex justify-center">
        <img
          src={preview}
          alt=""
          className="h-40 w-40 rounded-full object-cover border-2 border-avatar-ring"
        />
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setPending(file)
          setPreview(URL.createObjectURL(file))
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-full bg-brand py-3.5 text-[15px] font-semibold text-white"
      >
        Choose from device
      </button>
    </EditShell>
  )
}

export function VerifyIdentityScreen() {
  const { saveProfile, uploadVerifyPhoto } = useProfile()
  const navigate = useNavigate()
  const idRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)
  const [idUrl, setIdUrl] = useState<string | null>(null)
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onPick(kind: 'id' | 'selfie', file: File | undefined) {
    if (!file) return
    setBusy(true)
    try {
      const url = await uploadVerifyPhoto(kind, file)
      if (kind === 'id') setIdUrl(url)
      else setSelfieUrl(url)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <EditShell
      title="Verify identity"
      canSave={!!idUrl && !!selfieUrl}
      busy={busy}
      onSave={() => {
        setBusy(true)
        void saveProfile({ identityVerified: true, verified: true })
          .then(() => navigate('/profile'))
          .finally(() => setBusy(false))
      }}
    >
      <p className="mb-6 text-center text-[14px] text-muted leading-relaxed">
        Upload a clear photo of yourself and take a quick selfie. We&apos;ll
        compare them to confirm that you&apos;re you. Your photo will never be
        shared on your profile.
      </p>
      <input
        ref={idRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onPick('id', e.target.files?.[0])}
      />
      <input
        ref={selfieRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => void onPick('selfie', e.target.files?.[0])}
      />
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => idRef.current?.click()}
          className="rounded-3xl bg-pill py-10 text-[14px] font-bold text-brand disabled:opacity-50"
        >
          {idUrl ? 'Photo uploaded ✓' : 'Upload photo'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => selfieRef.current?.click()}
          className="rounded-3xl bg-pill py-10 text-[14px] font-bold text-brand disabled:opacity-50"
        >
          {selfieUrl ? 'Selfie uploaded ✓' : 'Take selfie'}
        </button>
      </div>
    </EditShell>
  )
}

export function ReportAccountScreen() {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const reasons = [
    'Spam',
    'Harassment',
    'Fake profile',
    'Inappropriate content',
    'Other',
  ]

  return (
    <EditShell
      title="Report account"
      canSave={!!reason}
      busy={busy}
      onSave={() => {
        if (!authUser) {
          navigate('/profile')
          return
        }
        setBusy(true)
        void createSupportTicket({
          userId: authUser.uid,
          kind: 'report_problem',
          subject: 'Report account',
          body: reason,
        })
          .then(() => navigate('/profile'))
          .finally(() => setBusy(false))
      }}
    >
      <p className="mb-4 text-[14px] text-muted">
        Why are you reporting this account?
      </p>
      <div className="flex flex-col gap-2">
        {reasons.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={[
              'rounded-full py-3.5 text-[15px] font-medium',
              reason === r ? 'bg-brand text-white' : 'bg-pill text-ink',
            ].join(' ')}
          >
            {r}
          </button>
        ))}
      </div>
    </EditShell>
  )
}
