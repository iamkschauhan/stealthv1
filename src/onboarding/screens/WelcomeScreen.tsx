import { useNavigate } from 'react-router-dom'
import { getNextStep } from '../flow'
import { OnboardingShell, PrimaryButton } from '../ui'

const IMAGES = [
  'https://images.unsplash.com/photo-1522673607200-164a2e07c292?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1483728645580-7c2213d9e315?w=400&h=400&fit=crop',
]

export function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <OnboardingShell
      wide
      footer={
        <PrimaryButton
          enabled
          onClick={() => navigate(getNextStep('welcome')!.path)}
        >
          Let&apos;s go!
        </PrimaryButton>
      }
    >
      <div className="flex flex-col flex-1 justify-center gap-5 md:gap-6 -mt-6 md:mt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {IMAGES.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="aspect-square w-full rounded-[28px] object-cover"
            />
          ))}
        </div>

        <div className="text-center px-2 md:px-8">
          <h1 className="text-[28px] md:text-[36px] font-bold text-ink leading-tight">
            Create your profile
          </h1>
          <p className="mt-2 md:mt-3 text-[14px] md:text-[16px] text-[#8e8e93] leading-snug max-w-lg mx-auto">
            Detailed profiles increase compatibility and help you connect with
            others.
          </p>
        </div>
      </div>
    </OnboardingShell>
  )
}
