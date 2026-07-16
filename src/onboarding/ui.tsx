import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getPrevStep, type OnboardingStepId } from './flow'

function BrandPanel() {
  return (
    <aside className="relative hidden md:flex md:w-[42%] lg:w-[46%] min-h-[100dvh] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#ff8a3d] via-[#ff9f2e] to-[#f5d547] p-10 lg:p-14 text-white">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%)]" />
      <div className="relative">
        <div className="font-display text-[36px] lg:text-[44px] leading-none">
          <span className="text-white">Stealth</span>
          <span className="text-ink/80">App</span>
        </div>
        <p className="mt-4 max-w-sm text-[15px] lg:text-[16px] leading-relaxed text-white/90">
          Make plans, meet people, and show up for the moments that matter.
        </p>
      </div>

      <div className="relative space-y-4">
        <div className="rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 p-5">
          <p className="font-script text-[32px] leading-none text-white">doers</p>
          <p className="mt-2 text-[14px] text-white/90">
            Respect · Genuineness · Safety · Reliability
          </p>
        </div>
        <p className="text-[13px] text-white/80">
          Have fun, StealthApp.
        </p>
      </div>
    </aside>
  )
}

export function OnboardingShell({
  children,
  footer,
  showBack,
  stepId,
  className = '',
  wide = false,
}: {
  children: ReactNode
  footer?: ReactNode
  showBack?: boolean
  stepId?: OnboardingStepId
  className?: string
  /** Use a wider form column (interest grids, etc.) */
  wide?: boolean
}) {
  const navigate = useNavigate()
  const prev = stepId ? getPrevStep(stepId) : null

  return (
    <div className="min-h-[100dvh] bg-feed-gap md:bg-white flex flex-col md:flex-row">
      <BrandPanel />

      <div className="flex flex-1 justify-center md:justify-stretch md:items-stretch bg-feed-gap md:bg-white">
        <div
          className={[
            'relative flex w-full min-h-[100dvh] md:min-h-0 flex-col bg-white',
            'md:shadow-none',
            'max-w-md mx-auto',
            wide ? 'md:max-w-xl lg:max-w-2xl' : 'md:max-w-lg lg:max-w-xl',
            'md:mx-0 md:w-full md:px-8 lg:px-14 xl:px-20',
            className,
          ].join(' ')}
        >
          {showBack && prev ? (
            <button
              type="button"
              aria-label="Back"
              onClick={() => navigate(prev.path)}
              className="absolute left-2 top-3 z-20 p-2 text-ink md:left-6 lg:left-10"
            >
              <ChevronLeft size={28} strokeWidth={2} />
            </button>
          ) : null}

          <div className="flex-1 flex flex-col px-5 sm:px-6 md:px-0 pt-14 md:pt-16 lg:pt-20 pb-4 md:max-w-none md:w-full">
            <div className={`w-full mx-auto ${wide ? 'max-w-2xl' : 'max-w-md md:max-w-lg'}`}>
              {children}
            </div>
          </div>

          {footer ? (
            <div className="px-5 sm:px-6 md:px-0 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-10 pt-2">
              <div className={`w-full mx-auto ${wide ? 'max-w-2xl' : 'max-w-md md:max-w-lg'}`}>
                {footer}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function StealthAppLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls =
    size === 'lg'
      ? 'text-[42px] md:text-[48px]'
      : size === 'sm'
        ? 'text-[22px]'
        : 'text-[28px] md:text-[32px]'
  return (
    <div className={`font-display text-center leading-none ${cls}`}>
      <span className="bg-gradient-to-b from-[#e8c878] to-[#1a1a1a] bg-clip-text text-transparent">
        Stealth
      </span>
      <span className="text-ink">App</span>
    </div>
  )
}

export function OnboardingTitle({
  children,
  subtitle,
}: {
  children: ReactNode
  subtitle?: ReactNode
}) {
  return (
    <div className="text-center mb-6 md:mb-8">
      <h1 className="text-[22px] sm:text-[24px] md:text-[28px] font-bold text-ink tracking-tight">
        {children}
      </h1>
      {subtitle ? (
        <p className="mt-2 md:mt-3 text-[14px] md:text-[15px] leading-snug text-[#8e8e93] max-w-md mx-auto">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

export function Field({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-2xl bg-onboard-input px-4 py-4 text-[16px] text-ink placeholder:text-[#aeaeb2] outline-none focus:ring-2 focus:ring-onboard-gold/40 ${className}`}
      {...props}
    />
  )
}

export function PrimaryButton({
  enabled = true,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { enabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={!enabled}
      className={[
        'w-full rounded-full py-4 md:py-[1.125rem] text-[16px] font-semibold transition-colors',
        enabled
          ? 'bg-ink text-white hover:bg-black'
          : 'bg-onboard-disabled text-[#c7c7cc] cursor-not-allowed',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function GoldLink({
  children,
  onClick,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-onboard-gold hover:opacity-80"
    >
      {icon}
      {children}
    </button>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
      <span className="text-[15px] text-[#6b6b70]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative h-[31px] w-[51px] rounded-full transition-colors shrink-0',
          checked ? 'bg-[#34c759]' : 'bg-[#e5e5ea]',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[20px]' : '',
          ].join(' ')}
        />
      </button>
    </label>
  )
}
