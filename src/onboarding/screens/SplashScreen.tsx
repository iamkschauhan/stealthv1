import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNextStep } from '../flow'

export function SplashScreen() {
  const navigate = useNavigate()
  const next = getNextStep('splash')!.path

  useEffect(() => {
    const t = window.setTimeout(() => navigate(next), 1800)
    return () => window.clearTimeout(t)
  }, [navigate, next])

  return (
    <button
      type="button"
      onClick={() => navigate(next)}
      className="flex min-h-[100dvh] w-full cursor-pointer items-center justify-center bg-gradient-to-b from-[#ff8a3d] via-[#ff9f2e] to-[#f5d547] md:bg-gradient-to-br"
    >
      <div className="relative select-none px-6 text-center">
        <span
          aria-hidden
          className="absolute inset-0 font-display text-[56px] sm:text-[64px] md:text-[88px] text-[#c4a574]"
          style={{ transform: 'translate(3px, 4px)' }}
        >
          StealthApp
        </span>
        <span
          aria-hidden
          className="absolute inset-0 font-display text-[56px] sm:text-[64px] md:text-[88px] text-ink"
          style={{ transform: 'translate(1.5px, 2px)' }}
        >
          StealthApp
        </span>
        <span className="relative font-display text-[56px] sm:text-[64px] md:text-[88px] text-white">
          StealthApp
        </span>
        <p className="relative mt-6 hidden md:block text-[16px] text-white/90">
          Tap anywhere to continue
        </p>
      </div>
    </button>
  )
}
