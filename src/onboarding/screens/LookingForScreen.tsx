import { useOnboarding } from '../OnboardingContext'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

const OPTIONS = ['Friendships', 'Dating', 'Something casual'] as const

export function LookingForScreen() {
  const { data, patch, advance, busy } = useOnboarding()
  const ready = data.lookingFor.length >= 1 && !busy

  function toggle(opt: string) {
    const cur = data.lookingFor
    if (cur.includes(opt)) patch({ lookingFor: cur.filter((x) => x !== opt) })
    else patch({ lookingFor: [...cur, opt] })
  }

  return (
    <OnboardingShell
      showBack
      stepId="looking-for"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && void advance('looking-for')}
        >
          {busy ? 'Saving…' : 'Next'}
        </PrimaryButton>
      }
    >
      <OnboardingTitle
        subtitle={
          <>
            Select{' '}
            <span className="font-semibold text-onboard-gold">at least one</span>
            . You&apos;ll be able to make and join plans that match your
            selections.
          </>
        }
      >
        What are you looking for?
      </OnboardingTitle>

      <div className="flex flex-wrap justify-center gap-2">
        {OPTIONS.map((opt) => {
          const selected = data.lookingFor.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={[
                'rounded-full px-5 py-3 text-[14px] font-medium transition-colors',
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
    </OnboardingShell>
  )
}
