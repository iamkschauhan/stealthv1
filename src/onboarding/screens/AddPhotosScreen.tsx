import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../OnboardingContext'
import { getNextStep } from '../flow'
import { ProgressDots } from '../ProgressDots'
import { OnboardingShell, OnboardingTitle, PrimaryButton } from '../ui'

const DEMOS = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522673607200-164a2e07c292?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop',
]

export function AddPhotosScreen() {
  const navigate = useNavigate()
  const { data, patch } = useOnboarding()
  const slots = [0, 1, 2, 3, 4, 5]

  function toggleSlot(i: number) {
    const cur = [...data.photos]
    if (cur[i]) {
      cur.splice(i, 1)
      patch({ photos: cur.filter(Boolean) })
    } else {
      patch({ photos: [...cur, DEMOS[i % DEMOS.length]].slice(0, 6) })
    }
  }

  const ready = data.photos.length >= 1

  return (
    <OnboardingShell
      showBack
      stepId="add-photos"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && navigate(getNextStep('add-photos')!.path)}
        >
          Next
        </PrimaryButton>
      }
    >
      <ProgressDots active={1} icon="camera" />
      <OnboardingTitle subtitle="Add at least one photo. You can always change these later.">
        Add photos
      </OnboardingTitle>

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
    </OnboardingShell>
  )
}
