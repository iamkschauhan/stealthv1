import { useRef, useState } from 'react'
import { Camera, Plus } from 'lucide-react'
import { useAuth } from '../../auth'
import { uploadImage } from '../../data/storage'
import { useOnboarding } from '../OnboardingContext'
import { ChoiceCard, ProgressDots } from '../ProgressDots'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

export function VerifyYourselfScreen() {
  const { advance, busy, setBusy, setError } = useOnboarding()
  const { user } = useAuth()
  const [uploaded, setUploaded] = useState(false)
  const [selfie, setSelfie] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)
  const ready = uploaded && selfie && !busy

  async function handleFile(
    kind: 'id' | 'selfie',
    file: File | undefined,
  ) {
    if (!file) {
      if (kind === 'id') setUploaded(true)
      else setSelfie(true)
      return
    }
    if (!user) return
    setBusy(true)
    setError(null)
    try {
      await uploadImage(`users/${user.uid}/verify/${kind}_${Date.now()}`, file, {
        contentType: file.type || 'image/jpeg',
      })
      if (kind === 'id') setUploaded(true)
      else setSelfie(true)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      if (kind === 'id') setUploaded(true)
      else setSelfie(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <OnboardingShell
      showBack
      stepId="verify-yourself"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && void advance('verify-yourself')}
        >
          {busy ? 'Saving…' : 'Verify yourself'}
        </PrimaryButton>
      }
    >
      <ProgressDots active={14} total={15} icon="check" />
      <OnboardingTitle>Verify yourself</OnboardingTitle>
      <p className="mb-2 text-center text-[14px] leading-snug text-[#8e8e93]">
        Everyone on StealthApp is verified to provide a safe, reliable, and genuine
        experience.
      </p>
      <p className="mb-6 text-center text-[14px] leading-snug text-[#8e8e93]">
        Upload a clear photo of yourself, and take a quick selfie. We&apos;ll
        compare them to confirm that you&apos;re you!
      </p>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile('id', e.target.files?.[0])}
      />
      <input
        ref={selfieRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => void handleFile('selfie', e.target.files?.[0])}
      />

      <div className="mb-4 flex gap-3">
        <ChoiceCard
          icon={<Plus size={22} />}
          label={uploaded ? 'Photo added' : 'Upload photo'}
          onClick={() => uploadRef.current?.click()}
        />
        <ChoiceCard
          icon={<Camera size={22} />}
          label={selfie ? 'Selfie taken' : 'Take selfie'}
          onClick={() => selfieRef.current?.click()}
        />
      </div>

      <p className="text-center text-[12px] text-[#aeaeb2]">
        Your photo will never be uploaded to your profile or shared with anyone
        else.
      </p>
    </OnboardingShell>
  )
}
