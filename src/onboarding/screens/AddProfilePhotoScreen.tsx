import { Camera, History, Plus, RotateCcw, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import { ProgressDots } from '../ProgressDots'
import { GoldLink, OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

const DEMO_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face'

export function AddProfilePhotoScreen() {
  const navigate = useNavigate()
  const { data, patch } = useOnboarding()
  const hasPhoto = !!data.profilePhoto

  function uploadDemo() {
    patch({ profilePhoto: DEMO_AVATAR })
  }

  return (
    <OnboardingShell
      showBack
      stepId="add-profile-photo"
      footer={
        hasPhoto ? (
          <div className="flex flex-col items-center gap-3">
            <PrimaryButton
              enabled
              className="!bg-onboard-gold hover:!bg-[#d4922f]"
              onClick={() => navigate(getNextStep('add-profile-photo')!.path)}
            >
              Save
            </PrimaryButton>
            <GoldLink
              icon={<RotateCcw size={14} />}
              onClick={() => patch({ profilePhoto: '' })}
            >
              Reset
            </GoldLink>
            <GoldLink
              icon={<History size={14} />}
              onClick={() => navigate(getNextStep('add-profile-photo')!.path)}
            >
              Create later
            </GoldLink>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={uploadDemo}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-onboard-gold py-4 text-[16px] font-semibold text-white"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/80">
                <Plus size={14} />
              </span>
              Upload photo
            </button>
            <button
              type="button"
              onClick={uploadDemo}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[16px] font-semibold text-white"
            >
              <Camera size={18} />
              Take selfie
            </button>
            <div className="flex justify-center pt-1">
              <GoldLink
                icon={<History size={14} />}
                onClick={() => navigate(getNextStep('add-profile-photo')!.path)}
              >
                Create later
              </GoldLink>
            </div>
          </div>
        )
      }
    >
      <ProgressDots active={0} icon="camera" />
      <OnboardingTitle subtitle="Your avatar is used to interact with others. Make sure it represents your true self!">
        Primary profile photo
      </OnboardingTitle>

      <div className="mx-auto mb-4 flex h-56 w-56 md:h-72 md:w-72 items-center justify-center overflow-hidden rounded-full bg-[#eef2ff]">
        {hasPhoto ? (
          <img src={data.profilePhoto} alt="" className="h-full w-full object-cover" />
        ) : (
          <User size={96} className="text-[#c5cce0]" strokeWidth={1.25} />
        )}
      </div>
    </OnboardingShell>
  )
}
