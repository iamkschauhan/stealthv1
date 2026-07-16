import { useRef } from 'react'
import { Camera, History, Plus, RotateCcw, User } from 'lucide-react'
import { useAuth } from '../../auth'
import { uploadUserAvatar } from '../../data/storage'
import { useOnboarding } from '../OnboardingContext'
import { GoldLink, OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'
import { ProgressDots } from '../ProgressDots'

const DEMO_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face'

export function AddProfilePhotoScreen() {
  const { data, patch, advance, busy, setBusy, setError } = useOnboarding()
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const hasPhoto = !!data.profilePhoto

  async function onFile(file: File | undefined) {
    if (!file || !user) {
      patch({ profilePhoto: DEMO_AVATAR })
      return
    }
    setBusy(true)
    setError(null)
    try {
      const url = await uploadUserAvatar(user.uid, file)
      patch({ profilePhoto: url })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      patch({ profilePhoto: DEMO_AVATAR })
    } finally {
      setBusy(false)
    }
  }

  return (
    <OnboardingShell
      showBack
      stepId="add-profile-photo"
      footer={
        hasPhoto ? (
          <div className="flex flex-col items-center gap-3">
            <PrimaryButton
              enabled={!busy}
              className="!bg-onboard-gold hover:!bg-[#d4922f]"
              onClick={() => void advance('add-profile-photo')}
            >
              {busy ? 'Saving…' : 'Save'}
            </PrimaryButton>
            <GoldLink
              icon={<RotateCcw size={14} />}
              onClick={() => patch({ profilePhoto: '' })}
            >
              Reset
            </GoldLink>
            <GoldLink
              icon={<History size={14} />}
              onClick={() => void advance('add-profile-photo')}
            >
              Create later
            </GoldLink>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-onboard-gold py-4 text-[16px] font-semibold text-white disabled:opacity-60"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/80">
                <Plus size={14} />
              </span>
              {busy ? 'Uploading…' : 'Upload photo'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void onFile(undefined)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[16px] font-semibold text-white disabled:opacity-60"
            >
              <Camera size={18} />
              Use demo photo
            </button>
            <div className="flex justify-center pt-1">
              <GoldLink
                icon={<History size={14} />}
                onClick={() => void advance('add-profile-photo')}
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
