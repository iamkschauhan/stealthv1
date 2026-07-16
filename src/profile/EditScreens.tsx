import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from './ProfileContext'
import { SettingsShell } from '../settings/ui'

function EditShell({
  title,
  children,
  onSave,
  canSave,
}: {
  title: string
  children: ReactNode
  onSave: () => void
  canSave: boolean
}) {
  return (
    <SettingsShell
      title={title}
      backTo="/profile"
      footer={
        <button
          type="button"
          disabled={!canSave}
          onClick={onSave}
          className={[
            'w-full rounded-full py-4 text-[15px] font-semibold',
            canSave ? 'bg-ink text-white' : 'bg-onboard-disabled text-[#c7c7cc]',
          ].join(' ')}
        >
          Save
        </button>
      }
    >
      {children}
    </SettingsShell>
  )
}

export function EditHometownScreen() {
  const { user, patch } = useProfile()
  const navigate = useNavigate()
  const [city, setCity] = useState(user.hometown)

  return (
    <EditShell
      title="Hometown"
      canSave={city.trim().length > 0}
      onSave={() => {
        patch({ hometown: city.trim() })
        navigate('/profile')
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
  const { user, patch } = useProfile()
  const navigate = useNavigate()
  const [company, setCompany] = useState(user.company)
  const [job, setJob] = useState(user.job)

  return (
    <EditShell
      title="Work"
      canSave={company.trim().length > 0}
      onSave={() => {
        patch({ company: company.trim(), job: job.trim() })
        navigate('/profile')
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
  const { user, patch } = useProfile()
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

  return (
    <EditShell
      title="Ethnicity"
      canSave={!!value}
      onSave={() => {
        patch({ ethnicity: value })
        navigate('/profile')
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
  const { user, patch } = useProfile()
  const navigate = useNavigate()
  const demos = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
  ]

  return (
    <EditShell
      title="Change photo"
      canSave
      onSave={() => navigate('/profile')}
    >
      <div className="mb-6 flex justify-center">
        <img
          src={user.avatar}
          alt=""
          className="h-40 w-40 rounded-full object-cover border-2 border-avatar-ring"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {demos.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => patch({ avatar: src })}
            className={[
              'aspect-square overflow-hidden rounded-2xl border-2',
              user.avatar === src ? 'border-brand' : 'border-transparent',
            ].join(' ')}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </EditShell>
  )
}

export function VerifyIdentityScreen() {
  const { patch } = useProfile()
  const navigate = useNavigate()

  return (
    <EditShell
      title="Verify identity"
      canSave
      onSave={() => {
        patch({ identityVerified: true, verified: true })
        navigate('/profile')
      }}
    >
      <p className="mb-6 text-center text-[14px] text-muted leading-relaxed">
        Upload a clear photo of yourself and take a quick selfie. We&apos;ll
        compare them to confirm that you&apos;re you. Your photo will never be
        shared on your profile.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-3xl bg-pill py-10 text-[14px] font-bold text-brand"
        >
          Upload photo
        </button>
        <button
          type="button"
          className="rounded-3xl bg-pill py-10 text-[14px] font-bold text-brand"
        >
          Take selfie
        </button>
      </div>
    </EditShell>
  )
}

export function ReportAccountScreen() {
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
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
      onSave={() => navigate('/profile')}
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
