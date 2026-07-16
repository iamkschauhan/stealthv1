import { useNavigate } from 'react-router-dom'
import { getNextStep, type OnboardingStepId } from '../flow'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

/** Temporary interactive stub until the full screen is built from Login mocks. */
export function PlaceholderScreen({
  stepId,
  title,
  hint,
}: {
  stepId: OnboardingStepId
  title: string
  hint?: string
}) {
  const navigate = useNavigate()
  const next = getNextStep(stepId)

  return (
    <OnboardingShell
      showBack
      stepId={stepId}
      footer={
        <PrimaryButton
          enabled
          onClick={() => {
            if (next) navigate(next.path)
            else navigate('/home')
          }}
        >
          {next ? 'Next' : 'Go to Home'}
        </PrimaryButton>
      }
    >
      <OnboardingTitle subtitle={hint ?? 'Screen coming next — tap Next to continue the flow.'}>
        {title}
      </OnboardingTitle>
      <div className="rounded-2xl border border-dashed border-[#d1d1d6] bg-onboard-input/60 px-4 py-10 text-center text-[13px] text-[#8e8e93]">
        Placeholder for <span className="font-semibold text-ink">{stepId}</span>
      </div>
    </OnboardingShell>
  )
}
