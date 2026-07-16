import { useState } from 'react'
import { Camera, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getNextStep } from '../flow'
import { ChoiceCard, ProgressDots } from '../ProgressDots'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

export function VerifyYourselfScreen() {
  const navigate = useNavigate()
  const [uploaded, setUploaded] = useState(false)
  const [selfie, setSelfie] = useState(false)
  const ready = uploaded && selfie

  return (
    <OnboardingShell
      showBack
      stepId="verify-yourself"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && navigate(getNextStep('verify-yourself')!.path)}
        >
          Verify yourself
        </PrimaryButton>
      }
    >
      <ProgressDots active={14} total={15} icon="check" />
      <OnboardingTitle>
        Verify yourself
      </OnboardingTitle>
      <p className="mb-2 text-center text-[14px] leading-snug text-[#8e8e93]">
        Everyone on StealthApp is verified to provide a safe, reliable, and genuine
        experience.
      </p>
      <p className="mb-6 text-center text-[14px] leading-snug text-[#8e8e93]">
        Upload a clear photo of yourself, and take a quick selfie. We&apos;ll
        compare them to confirm that you&apos;re you!
      </p>

      <div className="mb-4 flex gap-3">
        <ChoiceCard
          icon={<Plus size={22} />}
          label={uploaded ? 'Photo added' : 'Upload photo'}
          onClick={() => setUploaded(true)}
        />
        <ChoiceCard
          icon={<Camera size={22} />}
          label={selfie ? 'Selfie taken' : 'Take selfie'}
          onClick={() => setSelfie(true)}
        />
      </div>

      <p className="text-center text-[12px] text-[#aeaeb2]">
        Your photo will never be uploaded to your profile or shared with anyone
        else.
      </p>
    </OnboardingShell>
  )
}
