import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

export function BirthdayConfirmScreen() {
  const navigate = useNavigate()
  const { data } = useOnboarding()

  return (
    <OnboardingShell
      showBack
      stepId="birthday-confirm"
      footer={
        <div className="flex flex-col gap-3">
          <PrimaryButton
            enabled
            onClick={() => navigate(getNextStep('birthday-confirm')!.path)}
          >
            Confirm
          </PrimaryButton>
          <button
            type="button"
            className="w-full py-3 text-[15px] font-medium text-[#8e8e93]"
            onClick={() => navigate('/onboarding/personal-info')}
          >
            Edit birthday
          </button>
        </div>
      }
    >
      <OnboardingTitle subtitle="Please confirm this is correct. You won't be able to change it later.">
        Confirm your birthday
      </OnboardingTitle>

      <div className="rounded-2xl bg-onboard-input px-4 py-6 text-center">
        <p className="text-[28px] font-bold text-ink">
          {data.birthday || 'Jan 1, 2000'}
        </p>
        {data.firstName ? (
          <p className="mt-2 text-[14px] text-[#8e8e93]">
            Welcome, {data.firstName}
          </p>
        ) : null}
      </div>
    </OnboardingShell>
  )
}
