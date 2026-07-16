import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import { OnboardingShell, StealthAppLogo, OnboardingTitle, Field, PrimaryButton } from '../ui'

export function PhoneScreen() {
  const navigate = useNavigate()
  const { data, patch } = useOnboarding()
  const digits = data.phone.replace(/\D/g, '')
  const ready = digits.length >= 10

  return (
    <OnboardingShell
      showBack
      stepId="phone"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && navigate(getNextStep('phone')!.path)}
        >
          Send code
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
          onChange={(e) => patch({ phone: e.target.value })}
          className="flex-1"
        />
      </div>

      <p className="mt-3 text-[12px] text-[#aeaeb2] leading-snug">
        We care about your privacy and use your number only to verify you.
      </p>
    </OnboardingShell>
  )
}
