import { ChevronDown } from 'lucide-react'
import { useOnboarding } from '../OnboardingContext'
import { usePhoneAuthActions } from '../usePhoneAuthActions'
import { OnboardingShell, StealthAppLogo, OnboardingTitle, Field, PrimaryButton } from '../ui'

export function PhoneScreen() {
  const { data, patch, error, busy } = useOnboarding()
  const { sendCode } = usePhoneAuthActions()
  const digits = data.phone.replace(/\D/g, '')
  const ready = digits.length >= 10 && !busy

  return (
    <OnboardingShell
      showBack
      stepId="phone"
      footer={
        <PrimaryButton enabled={ready} onClick={() => ready && void sendCode()}>
          {busy ? 'Sending…' : 'Send code'}
        </PrimaryButton>
      }
    >
      <StealthAppLogo />
      <div className="mt-10">
        <OnboardingTitle>What&apos;s your phone number?</OnboardingTitle>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-2xl bg-onboard-input px-3 py-4 text-[15px] font-medium text-ink shrink-0"
        >
          <span className="text-base" aria-hidden>
            🇺🇸
          </span>
          +1
          <ChevronDown size={16} className="text-[#8e8e93]" />
        </button>
        <Field
          type="tel"
          inputMode="numeric"
          placeholder="Phone number"
          value={data.phone}
          onChange={(e) => patch({ phone: e.target.value, countryCode: '+1' })}
          className="flex-1"
        />
      </div>

      {error ? (
        <p className="mt-3 text-[13px] text-red-500 leading-snug">{error}</p>
      ) : (
        <p className="mt-3 text-[12px] text-[#aeaeb2] leading-snug">
          We care about your privacy and use your number only to verify you.
        </p>
      )}

      {/* Invisible reCAPTCHA mount point */}
      <div id="recaptcha-container" />
    </OnboardingShell>
  )
}
