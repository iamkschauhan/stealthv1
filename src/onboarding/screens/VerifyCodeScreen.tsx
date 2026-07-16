import { useEffect, useRef, useState } from 'react'
import { Pencil, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { usePhoneAuthActions } from '../usePhoneAuthActions'
import { getPrevStep } from '../flow'
import {
  OnboardingShell,
  StealthAppLogo,
  OnboardingTitle,
  PrimaryButton,
  GoldLink,
} from '../ui'

export function VerifyCodeScreen() {
  const navigate = useNavigate()
  const { data, error, busy } = useOnboarding()
  const { verifyCode, resend } = usePhoneAuthActions()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [seconds, setSeconds] = useState(59)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (seconds <= 0) return
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [seconds])

  const value = code.join('')
  const ready = value.length === 6 && !busy

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

  const digits = data.phone.replace(/\D/g, '')
  const phoneDisplay = digits
    ? `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    : ''

  return (
    <OnboardingShell
      showBack
      stepId="verify-code"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && void verifyCode(value)}
        >
          {busy ? 'Verifying…' : 'Verify code'}
        </PrimaryButton>
      }
    >
      <StealthAppLogo />
      <div className="mt-8">
        <OnboardingTitle
          subtitle={
            <>
              Sent to {phoneDisplay || 'your phone'}
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

      <div className="flex justify-between gap-2 mb-4">
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

      {error ? (
        <p className="mb-4 text-center text-[13px] text-red-500">{error}</p>
      ) : null}

      <div className="flex justify-center">
        {seconds > 0 ? (
          <p className="text-[13px] text-muted">
            Resend available in <span className="font-semibold text-ink">{seconds}</span>s
          </p>
        ) : (
          <GoldLink
            icon={<RefreshCw size={14} />}
            onClick={() => {
              if (busy) return
              setSeconds(59)
              void resend()
            }}
          >
            Didn&apos;t get a code?
          </GoldLink>
        )}
      </div>

      <div id="recaptcha-container" />
    </OnboardingShell>
  )
}
