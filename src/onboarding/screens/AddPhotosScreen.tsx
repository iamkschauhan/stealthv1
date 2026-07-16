import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../../auth'
import { uploadUserGalleryPhoto } from '../../data/storage'
import { useOnboarding } from '../OnboardingContext'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'
import { ProgressDots } from '../ProgressDots'

const DEMOS = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522673607200-164a2e07c292?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop',
]

export function AddPhotosScreen() {
  const { data, patch, advance, busy, setBusy, setError } = useOnboarding()
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const slots = [0, 1, 2, 3, 4, 5]
  const pickSlot = useRef(0)

  async function onFile(file: File | undefined) {
    const i = pickSlot.current
    if (!file) {
      const demo = DEMOS[i % DEMOS.length]
      const next = [...data.photos]
      next[i] = demo
      patch({ photos: next.filter(Boolean) })
      return
    }
    if (!user) return
    setBusy(true)
    setError(null)
    try {
      const id = `${Date.now()}_${i}`
      const url = await uploadUserGalleryPhoto(user.uid, id, file)
      const next = [...data.photos]
      next[i] = url
      patch({ photos: next.filter(Boolean) })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  function toggleSlot(i: number) {
    if (data.photos[i]) {
      const next = data.photos.filter((_, idx) => idx !== i)
      patch({ photos: next })
      return
    }
    pickSlot.current = i
    inputRef.current?.click()
  }

  const ready = data.photos.length >= 1 && !busy

  return (
    <OnboardingShell
      showBack
      stepId="add-photos"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && void advance('add-photos')}
        >
          {busy ? 'Saving…' : 'Next'}
        </PrimaryButton>
      }
    >
      <ProgressDots active={1} icon="camera" />
      <OnboardingTitle subtitle="Add at least one photo. You can always change these later.">
        Add photos
      </OnboardingTitle>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />

      <div className="grid grid-cols-3 gap-3">
        {slots.map((i) => {
          const src = data.photos[i]
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleSlot(i)}
              className="relative aspect-square overflow-hidden rounded-2xl bg-[#f0f2f9]"
            >
              {src ? (
                <img src={src} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-onboard-gold">
                  <Plus size={28} />
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-center text-[12px] text-[#aeaeb2]">
        Tap empty slot to upload · tap filled slot to remove
      </p>
    </OnboardingShell>
  )
}
