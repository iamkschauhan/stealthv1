import { Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import { ProgressDots } from '../ProgressDots'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

export function LocationScreen() {
  const navigate = useNavigate()
  const { data, patch } = useOnboarding()
  const ready = !!data.location

  return (
    <OnboardingShell
      showBack
      stepId="location"
      footer={
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => patch({ location: 'Brooklyn, NY' })}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-onboard-gold py-4 text-[16px] font-semibold text-white"
          >
            <Navigation size={18} />
            Go to current location
          </button>
          <PrimaryButton
            enabled={ready}
            onClick={() => ready && navigate(getNextStep('location')!.path)}
          >
            Continue
          </PrimaryButton>
        </div>
      }
    >
      <ProgressDots active={3} icon="pin" />
      <OnboardingTitle subtitle="Your location is used only to show you nearby plans. It is not visible to other users, and you'll still be able to search for plans in other areas.">
        Where are you located?
      </OnboardingTitle>

      <div className="relative mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-[#e8eef5]">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=500&fit=crop"
          alt="Map"
          className="h-56 md:h-72 w-full object-cover opacity-90"
        />
        {data.location ? (
          <div className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow">
            {data.location}
          </div>
        ) : null}
      </div>
    </OnboardingShell>
  )
}
