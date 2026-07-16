import type { ReactNode } from 'react'
import { Camera, CheckCheck, MapPin } from 'lucide-react'

const ICONS = {
  camera: Camera,
  pin: MapPin,
  check: CheckCheck,
} as const

export function ProgressDots({
  total = 15,
  active = 0,
  icon = 'camera',
}: {
  total?: number
  active?: number
  icon?: keyof typeof ICONS
}) {
  const Icon = ICONS[icon]
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-onboard-gold text-white shadow-sm">
        <Icon size={16} strokeWidth={2.25} />
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={[
              'h-1.5 w-1.5 rounded-full',
              i <= active ? 'bg-onboard-gold' : 'bg-[#e5e5ea]',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

export function ChoiceCard({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl bg-[#f0f2f9] px-4 py-8"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-onboard-gold text-onboard-gold">
        {icon}
      </span>
      <span className="text-[14px] font-bold text-onboard-gold">{label}</span>
    </button>
  )
}
