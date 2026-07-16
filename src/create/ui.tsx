import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { BottomNav, SideNav } from '../components/BottomNav'
import { BrandMark } from '../components/Brand'

export function CreateShell({
  children,
  tip,
  tipTitle = 'Create plan',
  hideNav = false,
}: {
  children: ReactNode
  tip?: string
  tipTitle?: string
  hideNav?: boolean
}) {
  const navigate = useNavigate()

  function goNav(id: string) {
    if (id === 'home') navigate('/home')
    if (id === 'profile') navigate('/profile')
    if (id === 'alerts') navigate('/notifications')
    if (id === 'create') navigate('/create')
    if (id === 'calendar') navigate('/plans')
  }

  return (
    <div className="min-h-[100dvh] bg-feed-gap">
      <div className="hidden md:block sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-3">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="text-left"
          >
            <BrandMark />
          </button>
          <span className="text-[13px] text-muted">Create plan</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-start gap-0 lg:gap-6">
          {!hideNav ? <SideNav active="create" onChange={goNav} /> : null}

          <main className="flex-1 min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-10 md:pt-5">
            {children}
          </main>

          {tip ? (
            <aside className="hidden xl:block w-80 shrink-0 sticky top-[73px] py-5">
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <h2 className="text-[15px] font-bold text-ink mb-2">{tipTitle}</h2>
                <p className="text-[13px] text-muted leading-relaxed">{tip}</p>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {!hideNav ? <BottomNav active="create" onChange={goNav} /> : null}
    </div>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="mb-1.5 text-[12px] font-medium text-muted">{children}</p>
}

export function SearchField({
  value,
  placeholder,
  onClick,
  onClear,
}: {
  value: string
  placeholder: string
  onClick: () => void
  onClear?: () => void
}) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-onboard-input px-3 py-3.5">
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <Search size={16} className="text-muted shrink-0" />
        <span
          className={
            value
              ? 'text-[15px] text-ink flex-1 truncate'
              : 'text-[15px] text-muted flex-1'
          }
        >
          {value || placeholder}
        </span>
      </button>
      {value && onClear ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={onClear}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/30 text-muted shrink-0"
        >
          <X size={12} />
        </button>
      ) : null}
    </div>
  )
}

export function SelectField({
  value,
  placeholder,
  onClick,
}: {
  value: string
  placeholder: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl bg-onboard-input px-4 py-3.5 text-left"
    >
      <span className={value ? 'text-[15px] text-ink' : 'text-[15px] text-muted'}>
        {value || placeholder}
      </span>
      <span className="text-muted text-sm">▾</span>
    </button>
  )
}

export function PlanTypePills({
  value,
  onChange,
}: {
  value: string
  onChange: (v: 'Friendship' | 'Dating' | 'Something casual') => void
}) {
  const tones = {
    Friendship: 'bg-[#fdf6d2] text-[#c99214]',
    Dating: 'bg-[#fee2e2] text-[#ef4444]',
    'Something casual': 'bg-[#ede9fe] text-[#7c3aed]',
  } as const

  return (
    <div className="flex flex-wrap gap-2">
      {(['Friendship', 'Dating', 'Something casual'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={[
            'rounded-full px-4 py-2.5 text-[13px] font-medium',
            value === t ? tones[t] : 'bg-pill text-ink',
          ].join(' ')}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

export function AllowCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="mt-2 flex items-start gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-[18px] w-[18px] rounded accent-brand shrink-0"
      />
      <span className="text-[13px] leading-snug text-muted">{label}</span>
    </label>
  )
}
