import {
  BadgeCheck,
  Copy,
  Pencil,
  Settings,
  Camera,
  List,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from './ProfileContext'
import { PROFILE_TABS } from './data'
import { BadgeIcon, SoftPill, AboutSection, ProfilePill } from './ui'

export function ProfileHeader() {
  const { user, setSettingsOpen } = useProfile()
  const navigate = useNavigate()

  async function copyUsername() {
    try {
      await navigator.clipboard.writeText(user.username)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="px-4 sm:px-6 pt-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-ink tracking-tight">My Profile</h1>
        <button
          type="button"
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
          className="rounded-lg p-2 text-ink hover:bg-feed-gap"
        >
          <Settings size={22} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={user.avatar}
            alt=""
            className="h-28 w-28 rounded-full object-cover border-2 border-avatar-ring md:h-32 md:w-32"
          />
          <button
            type="button"
            aria-label="Edit photo"
            onClick={() => navigate('/profile/change-photo')}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow"
          >
            <Pencil size={14} />
          </button>
        </div>

        <div className="mb-2 flex items-center gap-1.5">
          <h2 className="text-[22px] font-bold text-ink">
            {user.name}, {user.age}
          </h2>
          {user.verified ? (
            <BadgeCheck className="fill-brand text-white" size={22} />
          ) : null}
        </div>

        {!user.identityVerified ? (
          <button
            type="button"
            onClick={() => navigate('/profile/verify-identity')}
            className="mb-2 rounded-full border border-brand px-4 py-1.5 text-[13px] font-semibold text-brand"
          >
            Verify your identity
          </button>
        ) : null}

        <div className="mb-5 flex items-center gap-1.5 text-[13px] text-muted">
          <span>Username: {user.username}</span>
          <button
            type="button"
            aria-label="Copy username"
            onClick={copyUsername}
            className="text-brand p-0.5"
          >
            <Copy size={14} />
          </button>
        </div>

        <div className="mb-5 grid w-full grid-cols-4 gap-2">
          {user.badges.map((b) => (
            <div key={b.id} className="flex flex-col items-center gap-1.5">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                <BadgeIcon icon={b.icon} />
                <span className="absolute -top-1 -right-1 rounded-md bg-[#3a3a3c] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {b.count}
                </span>
              </div>
              <span className="text-[11px] font-medium text-brand">{b.label}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mb-5 w-full rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white hover:bg-black"
        >
          Link account
        </button>
      </div>
    </div>
  )
}

export function ProfileTabs() {
  const { tab, setTab } = useProfile()

  return (
    <div className="px-4 sm:px-6 mb-4">
      <div className="flex rounded-full bg-[#f0f2f8] p-1">
        {PROFILE_TABS.map((t, i) => {
          const active = tab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                'relative flex-1 rounded-full py-2.5 text-[13px] font-semibold transition-colors',
                active ? 'bg-brand text-white shadow-sm' : 'text-ink/70',
              ].join(' ')}
            >
              {i > 0 && !active && tab !== PROFILE_TABS[i - 1] ? null : null}
              {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function PhotosTab() {
  const { user, setViewingPhoto, uploadGalleryPhoto } = useProfile()
  const fileRef = useRef<HTMLInputElement>(null)
  const slots = Array.from({ length: 6 })
  const [busy, setBusy] = useState(false)

  return (
    <div className="px-4 sm:px-6 pb-8">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setBusy(true)
          void uploadGalleryPhoto(file).finally(() => {
            setBusy(false)
            if (fileRef.current) fileRef.current.value = ''
          })
        }}
      />
      <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-3">
        {slots.map((_, i) => {
          const src = user.photos[i]
          if (src) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => setViewingPhoto(i)}
                className="aspect-square overflow-hidden rounded-2xl bg-feed-gap"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            )
          }
          return (
            <button
              key={i}
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-2xl bg-pill text-brand disabled:opacity-50"
            >
              <span className="text-3xl font-light">☺︎+</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function AboutTab() {
  const { user } = useProfile()
  const navigate = useNavigate()

  return (
    <div className="px-4 sm:px-6 pb-10">
      <AboutSection title="Vaccination status">
        <SoftPill tone="green">{user.vaccination}</SoftPill>
      </AboutSection>

      <AboutSection
        title="Hometown"
        onEdit={() => navigate('/profile/edit-hometown')}
      >
        <p className="text-[14px] text-ink">City: {user.hometown}</p>
      </AboutSection>

      <AboutSection
        title="Work"
        onEdit={() => navigate('/profile/edit-company')}
      >
        <p className="text-[14px] text-ink">Company name: {user.company}</p>
        <p className="text-[14px] text-ink">Job: {user.job}</p>
      </AboutSection>

      <AboutSection title="What's important to you?">
        <ul className="space-y-2">
          {user.important.map((item) => (
            <li key={item.prompt} className="text-[14px] text-ink">
              <span className="font-semibold">{item.prompt}:</span> {item.answer}
            </li>
          ))}
        </ul>
      </AboutSection>

      <AboutSection title="Interests">
        <div className="space-y-3">
          {user.interests.map((group) => (
            <div key={group.category}>
              <p className="mb-1.5 text-[12px] font-semibold text-muted">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((t) => (
                  <ProfilePill key={t}>{t}</ProfilePill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AboutSection>

      <AboutSection title="Relationship status">
        <SoftPill>{user.relationship}</SoftPill>
      </AboutSection>
      <AboutSection title="Gender">
        <SoftPill>{user.gender}</SoftPill>
      </AboutSection>
      <AboutSection title="Sexuality">
        <SoftPill>{user.sexuality}</SoftPill>
      </AboutSection>
      <AboutSection title="Pronoun">
        <SoftPill>{user.pronoun}</SoftPill>
      </AboutSection>
      <AboutSection title="Children">
        <SoftPill>{user.children}</SoftPill>
      </AboutSection>
      <AboutSection title="Education">
        <div className="space-y-2">
          <SoftPill>{user.education}</SoftPill>
          <p className="text-[14px] text-ink">Name of your school: {user.school}</p>
        </div>
      </AboutSection>
      <AboutSection title="Exercise">
        <SoftPill>{user.exercise}</SoftPill>
      </AboutSection>
      <AboutSection
        title="Ethnicity"
        onEdit={() => navigate('/profile/edit-ethnicity')}
      >
        <SoftPill>{user.ethnicity}</SoftPill>
      </AboutSection>
      <AboutSection title="Religious beliefs">
        <SoftPill>{user.religion}</SoftPill>
      </AboutSection>
      <AboutSection title="Political beliefs">
        <SoftPill>{user.political}</SoftPill>
      </AboutSection>
      <AboutSection title="Lifestyle Habits">
        <div className="space-y-2">
          {user.habits.map((h) => (
            <div key={h.label} className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-muted">{h.label}</span>
              <SoftPill>{h.value}</SoftPill>
            </div>
          ))}
        </div>
      </AboutSection>
      <AboutSection title="Height" showToggle={false}>
        <p className="text-[14px] text-ink">{user.height}</p>
      </AboutSection>
    </div>
  )
}

export function ActivitiesTab() {
  const { user } = useProfile()

  if (!user.activities.length) {
    return (
      <p className="px-8 py-16 text-center text-[14px] text-muted">
        Your plans&apos; activities and photos will appear here.
      </p>
    )
  }

  return (
    <div className="px-4 sm:px-6 pb-8">
      {user.activities.map((a) => (
        <div
          key={a.title}
          className="flex items-center justify-between gap-3 border-b border-gray-100 py-4"
        >
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-ink truncate">{a.title}</p>
            <p className="text-[13px] text-muted">
              {a.plans} plans made around this activity
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-feed-gap text-muted">
              <List size={16} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-feed-gap text-muted">
              <Camera size={16} />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function FriendsTab() {
  const { user } = useProfile()

  if (!user.friends.length) {
    return (
      <p className="px-8 py-16 text-center text-[14px] text-muted">
        You have not added any friends yet. Start making plans to add friends!
      </p>
    )
  }

  return (
    <div className="px-4 sm:px-6 pb-8 space-y-3">
      {user.friends.map((f) => (
        <div key={f.id} className="flex items-center gap-3 py-2">
          <img src={f.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="text-[15px] font-semibold text-ink">{f.name}</p>
            <p className="text-[12px] text-muted">@{f.username}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
