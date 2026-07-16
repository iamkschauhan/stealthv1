import { useEffect, useRef, useState } from 'react'
import { Pencil, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep, getPrevStep } from '../flow'
import {
  OnboardingShell,
  StealthAppLogo,
  OnboardingTitle,
  PrimaryButton,
  GoldLink,
} from '../ui'

export function VerifyCodeScreen() {
  const navigate = useNavigate()
  const { data } = useOnboarding()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [seconds, setSeconds] = useState(59)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (seconds <= 0) return
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [seconds])

  const value = code.join('')
  const ready = value.length === 6

  function setDigit(i: number, char: string) {
    const d = char.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = d
    setCode(next)
    if (d && i < 5) refs.current[i + 1]?.focus()
  }

  function onKeyDown(i: number, key: string) {
    if (key === 'Backspace' && !code[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const phoneDisplay = data.phone
    ? `+1 (${data.phone.replace(/\D/g, '').slice(0, 3)}) ${data.phone.replace(/\D/g, '').slice(3, 6)}-${data.phone.replace(/\D/g, '').slice(6, 10)}`
    : '+1 (805) 675-9890'

  return (
    <OnboardingShell
      showBack
      stepId="verify-code"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && navigate(getNextStep('verify-code')!.path)}
        >
          Verify code
        </PrimaryButton>
      }
    >
      <StealthAppLogo />
      <div className="mt-8">
        <OnboardingTitle
          subtitle={
            <>
              Sent to {phoneDisplay}
              <br />
              Expires in <span className="font-bold text-ink">{seconds}</span> seconds
            </>
          }
        >
          Enter your verification code
        </OnboardingTitle>
      </div>

      <div className="flex justify-center mb-6">
        <GoldLink
          icon={<Pencil size={14} />}
          onClick={() => navigate(getPrevStep('verify-code')!.path)}
        >
          Edit
        </GoldLink>
      </div>

      <div className="flex justify-between gap-2 mb-8">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e.key)}
            className="h-14 w-12 rounded-2xl bg-onboard-input text-center text-[20px] font-semibold text-ink outline-none focus:ring-2 focus:ring-onboard-gold/40"
          />
        ))}
      </div>

      <div className="flex justify-center">
        <GoldLink
          icon={<RefreshCw size={14} />}
          onClick={() => setSeconds(59)}
        >
          Didn&apos;t get a code?
        </GoldLink>
      </div>
    </OnboardingShell>
  )
}
