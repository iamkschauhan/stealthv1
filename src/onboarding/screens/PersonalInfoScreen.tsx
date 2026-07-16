import { useState } from 'react'
import { Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import {
  OnboardingShell,
  OnboardingTitle,
  Field,
  PrimaryButton,
  Toggle,
} from '../ui'

export function PersonalInfoScreen() {
  const navigate = useNavigate()
  const { data, patch } = useOnboarding()
  const [showTip, setShowTip] = useState(false)
  const ready = data.firstName.trim().length >= 1 && data.birthday.trim().length >= 4

  return (
    <OnboardingShell
      showBack
      stepId="personal-info"
      footer={
        <>
          <Toggle
            label="Show age on my profile"
            checked={data.showAge}
            onChange={(v) => patch({ showAge: v })}
          />
          <PrimaryButton
            enabled={ready}
            className="mt-3"
            onClick={() => ready && navigate(getNextStep('personal-info')!.path)}
          >
            Next
          </PrimaryButton>
        </>
      }
    >
      <OnboardingTitle subtitle="Make sure you know who you are! You won't be able to change this later.">
        What&apos;s your first name?
      </OnboardingTitle>

      <Field
        placeholder="Your first name"
        value={data.firstName}
        onChange={(e) => patch({ firstName: e.target.value })}
        autoFocus
      />
      <p className="mt-2 mb-6 text-center text-[12px] text-[#aeaeb2]">
        Your name will be shown on your profile.
      </p>

      <div className="border-t border-gray-100 pt-6">
        <OnboardingTitle>When&apos;s your birthday?</OnboardingTitle>
        <div className="relative">
          {showTip ? (
            <div className="absolute -top-2 left-0 right-0 -translate-y-full mb-2 z-10">
              <div className="rounded-xl bg-[#2d2d2d] px-3 py-2.5 text-[12px] text-white leading-snug">
                Providing your birthday not only improves the features and ads
                you see, but it also helps us keep the StealthApp community safe.
                You can find your birthday in your account settings.
              </div>
              <div className="mx-auto h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#2d2d2d]" />
            </div>
          ) : null}
          <Field
            type="text"
            placeholder="Your birthday"
            value={data.birthday}
            onChange={(e) => patch({ birthday: e.target.value })}
            onFocus={() => setShowTip(false)}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowTip((v) => !v)}
          className="mt-3 flex items-center gap-1.5 text-[13px] text-[#aeaeb2]"
        >
          Why do I need to provide my birthday?
          <Info size={14} className="text-onboard-gold" />
        </button>
      </div>
    </OnboardingShell>
  )
}
