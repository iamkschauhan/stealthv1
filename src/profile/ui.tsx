import type { ReactNode } from 'react'
import {
  ThumbsUp,
  Shield,
  Users,
  Umbrella,
  Heart,
} from 'lucide-react'
import type { ProfileUser } from './data'

export function BadgeIcon({
  icon,
  className = '',
}: {
  icon: ProfileUser['badges'][number]['icon']
  className?: string
}) {
  const props = { size: 22, strokeWidth: 2, className }
  switch (icon) {
    case 'respect':
      return <ThumbsUp {...props} />
    case 'safe':
      return <Shield {...props} />
    case 'genuine':
      return <Users {...props} />
    case 'reliable':
      return <Umbrella {...props} />
    default:
      return <Heart {...props} />
  }
}

export function ProfilePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-brand px-3 py-1 text-[12px] font-medium text-white">
      {children}
    </span>
  )
}

export function SoftPill({
  children,
  tone = 'blue',
}: {
  children: ReactNode
  tone?: 'blue' | 'green'
}) {
  return (
    <span
      className={[
        'inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium',
        tone === 'green'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-pill text-brand',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export function AboutSection({
  title,
  onEdit,
  children,
  showToggle = true,
}: {
  title: string
  onEdit?: () => void
  children: ReactNode
  showToggle?: boolean
}) {
  return (
    <section className="border-b border-gray-100 py-5">
      <button
        type="button"
        onClick={onEdit}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <h3 className="text-[16px] font-bold text-ink">{title}</h3>
        <span className="text-muted text-lg leading-none">›</span>
      </button>
      <div className="mb-3">{children}</div>
      {showToggle ? (
        <label className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-muted">Show on my profile</span>
          <span className="relative h-[28px] w-[46px] rounded-full bg-[#34c759]">
            <span className="absolute top-[2px] right-[2px] h-[24px] w-[24px] rounded-full bg-white shadow" />
          </span>
        </label>
      ) : null}
    </section>
  )
}
