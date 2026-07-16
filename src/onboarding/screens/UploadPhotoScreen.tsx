import { useOnboarding } from '../OnboardingContext'
import { ProgressDots } from '../ProgressDots'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

/** Intermediate upload confirm used by Login "Upload photo" mocks. */
export function UploadPhotoScreen() {
  const { advance, busy } = useOnboarding()

  return (
    <OnboardingShell
      showBack
      stepId="upload-photo"
      footer={
        <PrimaryButton
          enabled={!busy}
          className="!bg-onboard-gold hover:!bg-[#d4922f]"
          onClick={() => void advance('upload-photo')}
        >
          {busy ? 'Saving…' : 'Continue'}
        </PrimaryButton>
      }
    >
      <ProgressDots active={2} icon="camera" />
      <OnboardingTitle subtitle="Looking good — next we’ll set your location so nearby plans can find you.">
        Photo saved
      </OnboardingTitle>
      <div className="mx-auto overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=700&fit=crop"
          alt=""
          className="h-72 w-full object-cover"
        />
      </div>
    </OnboardingShell>
  )
}
