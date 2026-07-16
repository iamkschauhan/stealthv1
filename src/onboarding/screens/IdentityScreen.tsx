import { useState } from 'react'
import { Info, MessageSquareWarning, User } from 'lucide-react'
import { useOnboarding } from '../OnboardingContext'
import {
  GoldLink,
  OnboardingShell,
  OnboardingTitle,
  PrimaryButton,
  Toggle,
} from '../ui'

const OPTIONS = ['Woman', 'Man', 'Non-binary'] as const

export function IdentityScreen() {
  const { data, patch, advance, busy } = useOnboarding()
  const [showOnProfile, setShowOnProfile] = useState(true)
  const ready = !!data.identity && !busy

  return (
    <OnboardingShell
      showBack
      stepId="identity"
      footer={
        <>
          <Toggle
            label="Show on my profile"
            checked={showOnProfile}
            onChange={setShowOnProfile}
          />
          <PrimaryButton
            enabled={ready && !busy}
            className="mt-3"
            onClick={() => ready && void advance('identity')}
          >
            {busy ? 'Saving…' : 'Next'}
          </PrimaryButton>
        </>
      }
    >
      <OnboardingTitle subtitle="Everyone's included here!">
        Which gender best describes you?
      </OnboardingTitle>

      <div className="flex flex-col gap-3 mb-6">
        {OPTIONS.map((opt) => {
          const selected = data.identity === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => patch({ identity: opt })}
              className={[
                'w-full rounded-full py-3.5 text-[15px] font-medium transition-colors',
                selected
                  ? 'bg-onboard-gold text-white'
                  : 'bg-[#f0f2f9] text-ink',
              ].join(' ')}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <GoldLink icon={<User size={15} />}>
          More gender options
          <Info size={14} className="text-[#aeaeb2] ml-1" />
        </GoldLink>
        <div className="w-full border-t border-gray-100" />
        <GoldLink icon={<MessageSquareWarning size={15} />}>
          Suggest another option
        </GoldLink>
      </div>
    </OnboardingShell>
  )
}
