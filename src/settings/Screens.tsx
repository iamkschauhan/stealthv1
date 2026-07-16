import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CloudUpload, Copy, Mail, MessageSquare, Plus, Share, Trash2 } from 'lucide-react'
import {
  APP_INVITE_URL,
  SHARE_COPY,
  copyShare,
  mailtoHref,
  nativeShare,
  smsHref,
} from '../share/messages'
import {
  STEALTH_NOTIFS,
  FAQ_ITEMS,
  FRIEND_NOTIFS,
  HOSTING_NOTIFS,
  JOINING_NOTIFS,
  PHOTO_NOTIFS,
} from './data'
import {
  ConfirmModal,
  Segmented,
  SettingsRow,
  SettingsShell,
  SettingsToggle,
} from './ui'

export function PreferencesScreen() {
  const navigate = useNavigate()
  return (
    <SettingsShell title="Preferences" backTo="/profile">
      <SettingsRow
        label="Type of plans"
        onClick={() => navigate('/profile/settings/preferences/plans')}
      />
      <SettingsRow
        label="Dark/Light mode"
        onClick={() => navigate('/profile/settings/preferences/theme')}
      />
    </SettingsShell>
  )
}

export function ThemeScreen() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  return (
    <SettingsShell
      title="Dark/Light mode"
      backTo="/profile/settings/preferences"
      saveLabel="Save"
      onSave={() => navigate('/profile/settings/preferences')}
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-5 mt-4 max-w-md mx-auto w-full">
        {(
          [
            { id: 'light' as const, label: 'Light mode', bg: 'bg-white', ink: 'text-ink' },
            { id: 'dark' as const, label: 'Dark mode', bg: 'bg-[#1c1c1e]', ink: 'text-white' },
          ] as const
        ).map((opt) => {
          const selected = mode === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMode(opt.id)}
              className="flex flex-col items-center gap-3"
            >
              <div
                className={[
                  'w-full aspect-[3/4] max-h-64 sm:max-h-72 rounded-2xl border-2 overflow-hidden shadow-sm',
                  opt.bg,
                  selected ? 'border-brand' : 'border-gray-200',
                ].join(' ')}
              >
                <div className={`p-2 ${opt.ink}`}>
                  <p className="text-[11px] font-extrabold">
                    <span className="text-ink">Stealth</span>
                    <span className="text-brand">App</span>
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 rounded bg-brand/30" />
                    <div className="h-16 rounded-lg bg-brand/15" />
                    <div className="h-2 rounded bg-current/20" />
                  </div>
                </div>
              </div>
              <span className="text-[13px] font-medium text-ink">{opt.label}</span>
              <span
                className={[
                  'flex h-5 w-5 items-center justify-center rounded-full border-2',
                  selected ? 'border-brand' : 'border-gray-300',
                ].join(' ')}
              >
                {selected ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
              </span>
            </button>
          )
        })}
      </div>
    </SettingsShell>
  )
}

export function TypeOfPlansScreen() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<string[]>(['Friendships', 'Dating', 'Something casual'])
  const [friendsWith, setFriendsWith] = useState<string[]>(['Women'])
  const [dateWith, setDateWith] = useState<string[]>(['Non-binary people'])
  const [casualWith, setCasualWith] = useState<string[]>(['Non-binary people'])

  function toggle(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  const chip = (label: string, selected: boolean, tone: 'yellow' | 'pink' | 'purple' | 'gray', onClick: () => void) => {
    const tones = {
      yellow: selected ? 'bg-[#fdf6d2] text-[#c99214]' : 'bg-[#f0f2f9] text-ink',
      pink: selected ? 'bg-[#fee2e2] text-[#ef4444]' : 'bg-[#f0f2f9] text-ink',
      purple: selected ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-[#f0f2f9] text-ink',
      gray: selected ? 'bg-brand text-white' : 'bg-[#f0f2f9] text-ink',
    }
    return (
      <button
        key={label}
        type="button"
        onClick={onClick}
        className={`rounded-full px-4 py-2.5 text-[13px] font-medium ${tones[tone]}`}
      >
        {label}
      </button>
    )
  }

  return (
    <SettingsShell
      title="Type of plans"
      backTo="/profile/settings/preferences"
      footer={
        <button
          type="button"
          onClick={() => navigate('/profile/settings/preferences')}
          className="w-full rounded-full bg-ink py-4 text-[15px] font-semibold text-white"
        >
          Save
        </button>
      }
    >
      <p className="mb-4 text-center text-[14px] text-muted">
        Select <span className="font-semibold text-brand">as many as you&apos;d like.</span> You&apos;ll
        be able to make and join plans that match any of your selections.
      </p>
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {(['Friendships', 'Dating', 'Something casual'] as const).map((p) =>
          chip(
            p,
            plans.includes(p),
            p === 'Friendships' ? 'yellow' : p === 'Dating' ? 'pink' : 'purple',
            () => toggle(plans, setPlans, p),
          ),
        )}
      </div>

      {plans.includes('Friendships') ? (
        <section className="mb-6 border-t border-gray-100 pt-5">
          <h2 className="mb-3 text-center text-[15px] font-bold">Who do you want to become friends with?</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['Women', 'Men', 'Non-binary people'].map((o) =>
              chip(o, friendsWith.includes(o), 'yellow', () => toggle(friendsWith, setFriendsWith, o)),
            )}
          </div>
          <p className="mt-3 text-center text-[12px] text-muted">
            <em>Friendship</em> plans will be highlighted in yellow.
          </p>
        </section>
      ) : null}

      {plans.includes('Dating') ? (
        <section className="mb-6 border-t border-gray-100 pt-5">
          <h2 className="mb-3 text-center text-[15px] font-bold">Who do you want to date?</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['Women', 'Men', 'Non-binary people'].map((o) =>
              chip(o, dateWith.includes(o), 'pink', () => toggle(dateWith, setDateWith, o)),
            )}
          </div>
          <p className="mt-3 text-center text-[12px] text-muted">
            <em>Dating</em> plans will be highlighted in red.
          </p>
        </section>
      ) : null}

      {plans.includes('Something casual') ? (
        <section className="mb-2 border-t border-gray-100 pt-5">
          <h2 className="mb-3 text-center text-[15px] font-bold">
            Who do you want to meet for something casual?
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['Women', 'Men', 'Non-binary people'].map((o) =>
              chip(o, casualWith.includes(o), 'purple', () => toggle(casualWith, setCasualWith, o)),
            )}
          </div>
          <p className="mt-3 text-center text-[12px] text-muted">
            <em>Something casual</em> plans will be highlighted in purple.
          </p>
        </section>
      ) : null}
    </SettingsShell>
  )
}

export function SecurityScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('jo.bryant@example.com')
  const [methods, setMethods] = useState({ phone: true, facebook: true, apple: false })
  const [blockRemove, setBlockRemove] = useState(false)

  function tryRemove(key: 'phone' | 'facebook' | 'apple') {
    const connected = Object.values({ ...methods, [key]: false }).filter(Boolean).length
    if (connected < 1 && methods[key]) {
      setBlockRemove(true)
      return
    }
    setMethods((m) => ({ ...m, [key]: false }))
  }

  return (
    <SettingsShell
      title="Security & Login"
      backTo="/profile"
      saveLabel="Save"
      onSave={() => navigate('/profile')}
    >
      <div className="space-y-3 mb-5 text-[14px]">
        <p>
          <span className="text-muted">Phone number: </span>
          <span className="text-ink">+1 (805) 675-9890</span>
        </p>
        <p>
          <span className="text-muted">Birthday: </span>
          <span className="text-ink">April 23, 1993</span>
        </p>
      </div>

      <div className="relative mb-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl bg-onboard-input px-4 py-3.5 pr-10 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
        />
        <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-brand" size={18} />
      </div>
      <button type="button" className="mb-5 flex w-full items-center justify-center gap-1.5 text-[14px] font-medium text-brand">
        <Mail size={14} />
        Verify your email
      </button>

      <h2 className="mb-2 text-[15px] font-bold text-ink">Login methods</h2>
      {(
        [
          { key: 'phone' as const, label: 'Phone number', logo: null },
          { key: 'facebook' as const, label: 'Facebook', logo: 'f' },
          { key: 'apple' as const, label: 'Apple', logo: '' },
        ] as const
      ).map((m) => (
        <div key={m.key} className="flex items-center gap-3 border-b border-gray-100 py-3.5">
          {m.logo === 'f' ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877f2] text-[13px] font-bold text-white">
              f
            </span>
          ) : m.key === 'apple' ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.2-3.4zM14.7 5.9c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
              </svg>
            </span>
          ) : (
            <span className="w-7" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[15px] text-ink">{m.label}</p>
            {methods[m.key] ? (
              <p className="text-[12px] text-[#34c759] flex items-center gap-1">
                <Check size={12} /> connected
              </p>
            ) : null}
          </div>
          {methods[m.key] ? (
            <button type="button" aria-label={`Remove ${m.label}`} onClick={() => tryRemove(m.key)} className="text-red-500 p-1">
              <Trash2 size={18} />
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Add ${m.label}`}
              onClick={() => setMethods((x) => ({ ...x, [m.key]: true }))}
              className="text-brand p-1"
            >
              <Plus size={20} className="rounded-full border border-brand" />
            </button>
          )}
        </div>
      ))}

      <SettingsRow
        label="Change password"
        onClick={() => navigate('/profile/settings/security/password')}
      />

      <ConfirmModal
        open={blockRemove}
        title="You only have one login"
        message="Add another login method to remove this one."
        cancelLabel="Okay"
        confirmLabel="Okay"
        onCancel={() => setBlockRemove(false)}
        onConfirm={() => setBlockRemove(false)}
      />
    </SettingsShell>
  )
}

export function ChangePasswordScreen() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const ready = current.length >= 6 && next.length >= 6 && next === confirm

  return (
    <SettingsShell
      title="Change password"
      backTo="/profile/settings/security"
      saveLabel="Save"
      canSave={ready}
      onSave={() => navigate('/profile/settings/security')}
    >
      {(
        [
          ['Current password', current, setCurrent],
          ['New password', next, setNext],
          ['Confirm new password', confirm, setConfirm],
        ] as const
      ).map(([label, value, set]) => (
        <div key={label} className="mb-4">
          <label className="mb-1.5 block text-[13px] text-muted">{label}</label>
          <input
            type="password"
            value={value}
            onChange={(e) => set(e.target.value)}
            className="w-full rounded-2xl bg-onboard-input px-4 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      ))}
    </SettingsShell>
  )
}

function NotifCategoryScreen({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  const [channel, setChannel] = useState('Push')
  const [toggles, setToggles] = useState(() => Object.fromEntries(items.map((i) => [i, true])))

  return (
    <SettingsShell title={title} backTo="/profile/settings/notifications">
      <Segmented options={['Push', 'Email']} value={channel} onChange={setChannel} />
      {items.map((label) => (
        <div key={label} className="flex items-start justify-between gap-4 border-b border-gray-100 py-4">
          <p className="text-[14px] leading-snug text-ink flex-1">{label}</p>
          <SettingsToggle
            checked={!!toggles[label]}
            onChange={(v) => setToggles((t) => ({ ...t, [label]: v }))}
          />
        </div>
      ))}
    </SettingsShell>
  )
}

export function NotificationsHubScreen() {
  const navigate = useNavigate()
  const [all, setAll] = useState(true)

  return (
    <SettingsShell title="Notifications" backTo="/profile">
      <div className="flex items-center justify-between border-b border-gray-100 py-4">
        <p className="text-[15px] text-ink">All notifications</p>
        <SettingsToggle checked={all} onChange={setAll} />
      </div>
      <SettingsRow
        label="Notifications about plans you're joining"
        onClick={() => navigate('/profile/settings/notifications/joining')}
      />
      <SettingsRow
        label="Notifications about plans you're hosting"
        onClick={() => navigate('/profile/settings/notifications/hosting')}
      />
      <SettingsRow
        label="Notifications about photos"
        onClick={() => navigate('/profile/settings/notifications/photos')}
      />
      <SettingsRow
        label="Notifications about friends"
        onClick={() => navigate('/profile/settings/notifications/friends')}
      />
      <SettingsRow
        label="Notifications from StealthApp"
        onClick={() => navigate('/profile/settings/notifications/stealth')}
      />
    </SettingsShell>
  )
}

export function NotifJoiningScreen() {
  return <NotifCategoryScreen title="Notifications about joining" items={JOINING_NOTIFS} />
}
export function NotifHostingScreen() {
  return <NotifCategoryScreen title="Notifications about hosting" items={HOSTING_NOTIFS} />
}
export function NotifPhotosScreen() {
  return <NotifCategoryScreen title="Notifications about photos" items={PHOTO_NOTIFS} />
}
export function NotifFriendsScreen() {
  return <NotifCategoryScreen title="Notifications about friends" items={FRIEND_NOTIFS} />
}
export function NotifStealthAppScreen() {
  return <NotifCategoryScreen title="Notifications from StealthApp" items={STEALTH_NOTIFS} />
}

export function InviteScreen() {
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = APP_INVITE_URL
  const kind = 'appInvite' as const

  return (
    <SettingsShell title="Invite Friends to StealthApp" backTo="/profile">
      <a
        href={smsHref(kind, url)}
        className="flex w-full items-center gap-3 border-b border-gray-100 py-4 text-brand"
      >
        <MessageSquare size={18} />
        <span className="text-[15px] font-medium">Invite friends via SMS</span>
      </a>
      <a
        href={mailtoHref(kind, url)}
        className="flex w-full items-center gap-3 border-b border-gray-100 py-4 text-brand"
      >
        <Mail size={18} />
        <span className="text-[15px] font-medium">Invite friends via email</span>
      </a>
      <button
        type="button"
        onClick={async () => {
          const shared = await nativeShare(kind, url)
          if (!shared) setShareOpen(true)
        }}
        className="flex w-full items-center gap-3 border-b border-gray-100 py-4 text-brand"
      >
        <Share size={18} />
        <span className="text-[15px] font-medium">Invite friends by…</span>
      </button>

      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        {SHARE_COPY.appInvite.message}
      </p>

      {shareOpen ? (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-0 md:px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-0">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setShareOpen(false)} />
          <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-3xl md:rounded-3xl bg-white p-4 pb-8 md:p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-[12px] font-bold text-white">
                ap
              </span>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-ink"
              >
                ×
              </button>
            </div>
            <p className="mb-3 text-[14px] leading-snug text-muted">{SHARE_COPY.appInvite.message}</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await copyShare(kind, url)
                } catch {
                  /* ignore */
                }
                setCopied(true)
              }}
              className="flex w-full items-center justify-between rounded-xl bg-[#f2f2f7] px-4 py-3.5 text-brand"
            >
              <span className="text-[15px] font-medium">{copied ? 'Link copied' : 'Copy Link'}</span>
              <Copy size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </SettingsShell>
  )
}

export function PrivacyScreen() {
  const navigate = useNavigate()
  const [privateMode, setPrivateMode] = useState(true)

  return (
    <SettingsShell title="Privacy" backTo="/profile">
      <button type="button" className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-brand">
        Snooze
      </button>
      <p className="mb-4 text-[12px] leading-snug text-muted border-b border-gray-100 pb-4">
        Pauses your account if you want to take a break from the app but don&apos;t want to delete your
        account.
      </p>

      <div className="flex items-center justify-between border-b border-gray-100 py-4">
        <p className="text-[15px] text-ink">
          Private mode <span className="text-muted text-xs">ⓘ</span>
        </p>
        <SettingsToggle checked={privateMode} onChange={setPrivateMode} />
      </div>
      <SettingsRow label="Blocked accounts" onClick={() => navigate('/profile/settings/privacy/blocked')} />
      <SettingsRow label="Safe meeting tips" onClick={() => navigate('/profile/settings/privacy/safe-tips')} />
      <SettingsRow
        label="User principles & expectations"
        onClick={() => navigate('/profile/settings/privacy/principles')}
      />
    </SettingsShell>
  )
}

export function BlockedAccountsScreen() {
  return (
    <SettingsShell title="Blocked accounts" backTo="/profile/settings/privacy">
      <p className="py-20 text-center text-[14px] text-muted">
        Accounts you block will appear here.
      </p>
    </SettingsShell>
  )
}

export function SafeTipsScreen() {
  return (
    <SettingsShell title="Safe meeting tips" backTo="/profile/settings/privacy">
      <div className="space-y-4 text-[14px] leading-relaxed text-[#555]">
        <p>Meet in public places for first plans whenever you can.</p>
        <p>Tell a friend where you&apos;re going and when you expect to be back.</p>
        <p>Trust your instincts — you can leave a plan anytime.</p>
        <p>Never share sensitive financial or personal identity information.</p>
      </div>
    </SettingsShell>
  )
}

export function PrinciplesScreen() {
  return (
    <SettingsShell title="User principles" backTo="/profile/settings/privacy">
      <div className="space-y-4 text-[14px] leading-relaxed text-[#555]">
        <p>
          <strong className="text-ink">Respect.</strong> Treat every member with kindness and consider
          their boundaries.
        </p>
        <p>
          <strong className="text-ink">Genuineness.</strong> Be authentic. Share who you really are when
          you plan.
        </p>
        <p>
          <strong className="text-ink">Safety.</strong> Look out for each other and report anything that
          feels off.
        </p>
        <p>
          <strong className="text-ink">Reliability.</strong> Show up when you say you will.
        </p>
      </div>
    </SettingsShell>
  )
}

export function HelpScreen() {
  const navigate = useNavigate()
  return (
    <SettingsShell title="Help Center" backTo="/profile">
      <SettingsRow label="Report a problem" onClick={() => navigate('/profile/settings/help/report')} />
      <SettingsRow label="FAQ" onClick={() => navigate('/profile/settings/help/faq')} />
      <SettingsRow label="Support requests" onClick={() => navigate('/profile/settings/help/support')} />
    </SettingsShell>
  )
}

export function ReportProblemScreen() {
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const ready = text.trim().length > 0

  return (
    <SettingsShell
      title="Report a problem"
      backTo="/profile/settings/help"
      footer={
        <button
          type="button"
          disabled={!ready && !submitted}
          onClick={() => setSubmitted(true)}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold',
            submitted
              ? 'bg-[#6fcf76] text-white'
              : ready
                ? 'bg-ink text-white'
                : 'bg-onboard-disabled text-[#c7c7cc]',
          ].join(' ')}
        >
          {submitted ? (
            <>
              <Check size={18} /> Submitted
            </>
          ) : (
            'Submit'
          )}
        </button>
      }
    >
      <textarea
        value={text}
        onChange={(e) => {
          setSubmitted(false)
          setText(e.target.value)
        }}
        rows={6}
        placeholder="Describe the problem…"
        className="mb-4 w-full resize-none rounded-2xl bg-onboard-input px-4 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
      />
      {photo ? (
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=200&h=200&fit=crop"
          alt=""
          className="mb-3 h-24 w-24 rounded-xl object-cover"
        />
      ) : null}
      <button
        type="button"
        onClick={() => setPhoto(true)}
        className="flex items-center gap-2 text-[14px] font-medium text-brand"
      >
        <CloudUpload size={18} />
        Upload photo
      </button>
    </SettingsShell>
  )
}

export function FaqScreen() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <SettingsShell title="FAQ" backTo="/profile/settings/help">
      {FAQ_ITEMS.map((item) => {
        const isOpen = open === item.q
        return (
          <div key={item.q} className="border-b border-gray-100 py-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpen(isOpen ? null : item.q)}
            >
              <span className="text-[15px] font-bold text-ink">{item.q}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white text-lg leading-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen ? <p className="mt-3 text-[14px] leading-relaxed text-muted">{item.a}</p> : null}
          </div>
        )
      })}
    </SettingsShell>
  )
}

export function SupportRequestsScreen() {
  return (
    <SettingsShell title="Reports" backTo="/profile/settings/help">
      <p className="py-24 text-center text-[14px] text-muted">
        Reports that you&apos;ve submitted
        <br />
        will appear here.
      </p>
    </SettingsShell>
  )
}

export function LegalScreen() {
  const navigate = useNavigate()
  return (
    <SettingsShell title="Legal" backTo="/profile">
      <SettingsRow
        label="Privacy policy"
        onClick={() => navigate('/profile/settings/legal/privacy-policy')}
      />
      <SettingsRow label="Terms of service" onClick={() => navigate('/profile/settings/legal/terms')} />
      <SettingsRow
        label="Download my data"
        onClick={() => navigate('/profile/settings/legal/download-data')}
      />
    </SettingsShell>
  )
}

function LegalDoc({ title, back }: { title: string; back: string }) {
  const paras = useMemo(
    () =>
      Array.from({ length: 6 }).map(
        (_, i) =>
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Section ${i + 1} explains how StealthApp handles your information and rights.`,
      ),
    [],
  )
  return (
    <SettingsShell title={title} backTo={back}>
      <div className="space-y-4 text-[14px] leading-relaxed text-[#666]">
        {paras.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </SettingsShell>
  )
}

export function PrivacyPolicyScreen() {
  return <LegalDoc title="Privacy policy" back="/profile/settings/legal" />
}
export function TermsScreen() {
  return <LegalDoc title="Terms of service" back="/profile/settings/legal" />
}
export function DownloadDataScreen() {
  return <LegalDoc title="Download my data" back="/profile/settings/legal" />
}

export function ContactScreen() {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const ready = text.trim().length > 0

  return (
    <SettingsShell
      title="Contact"
      backTo="/profile"
      footer={
        <button
          type="button"
          disabled={!ready && !submitted}
          onClick={() => setSubmitted(true)}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold',
            submitted
              ? 'bg-[#6fcf76] text-white'
              : ready
                ? 'bg-ink text-white'
                : 'bg-onboard-disabled text-[#c7c7cc]',
          ].join(' ')}
        >
          {submitted ? (
            <>
              <Check size={18} /> Submitted
            </>
          ) : (
            'Submit'
          )}
        </button>
      }
    >
      <textarea
        value={text}
        onChange={(e) => {
          setSubmitted(false)
          setText(e.target.value)
        }}
        rows={5}
        placeholder="Provide details"
        className="w-full resize-none rounded-2xl bg-onboard-input px-4 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
      />
    </SettingsShell>
  )
}
