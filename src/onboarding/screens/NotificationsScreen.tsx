import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import { ProgressDots } from '../ProgressDots'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

export function NotificationsScreen() {
  const navigate = useNavigate()
  const { patch } = useOnboarding()
  const next = getNextStep('notifications')!.path

  function choose(enabled: boolean) {
    patch({ notificationsEnabled: enabled })
    navigate(next)
  }

  return (
    <OnboardingShell showBack stepId="notifications">
      <ProgressDots active={4} icon="pin" />
      <OnboardingTitle subtitle="Stay in the loop when friends invite you or plans go live near you.">
        Notifications
      </OnboardingTitle>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="px-5 py-6 text-center">
          <h2 className="text-[18px] font-bold text-ink">Notifications</h2>
          <p className="mt-2 text-[14px] leading-snug text-ink">
            You won&apos;t want to miss these plans! Enable notifications so that
            you&apos;re never left out.
          </p>
        </div>
        <div className="grid grid-cols-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => choose(false)}
            className="border-r border-gray-200 py-3.5 text-[15px] text-onboard-gold"
          >
            Disable
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="py-3.5 text-[15px] font-bold text-onboard-gold"
          >
            Enable
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <PrimaryButton enabled onClick={() => choose(true)}>
          Continue
        </PrimaryButton>
      </div>
    </OnboardingShell>
  )
}
