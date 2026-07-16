import { Search, Shield, ThumbsUp, Umbrella } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getNextStep } from '../flow'
import { OnboardingShell, PrimaryButton } from '../ui'

const PRINCIPLES = [
  {
    title: 'Respect',
    body: 'Treat every member with kindness and consider their boundaries.',
    Icon: ThumbsUp,
  },
  {
    title: 'Genuineness',
    body: 'Be authentic. Share who you really are when you plan.',
    Icon: Search,
  },
  {
    title: 'Safety',
    body: 'Look out for each other and report anything that feels off.',
    Icon: Shield,
  },
  {
    title: 'Reliability',
    body: 'Show up when you say you will. Plans work when people do.',
    Icon: Umbrella,
  },
]

export function PrinciplesScreen() {
  const navigate = useNavigate()

  return (
    <OnboardingShell
      showBack
      stepId="principles"
      footer={
        <PrimaryButton
          enabled
          onClick={() => navigate(getNextStep('principles')!.path)}
        >
          I agree
        </PrimaryButton>
      }
    >
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-ink leading-none">
          The place for
        </h1>
        <p className="font-script text-[44px] text-onboard-gold leading-none -mt-1">
          doers
        </p>
        <p className="mt-3 text-[14px] text-[#8e8e93]">
          Here we focus on four main principles:
        </p>
      </div>

      <ul className="flex flex-col gap-6 mb-8">
        {PRINCIPLES.map(({ title, body, Icon }) => (
          <li key={title} className="flex gap-4 items-start">
            <Icon className="text-onboard-gold shrink-0 mt-0.5" size={26} strokeWidth={1.75} />
            <div>
              <p className="text-[16px] font-bold text-onboard-gold">{title}</p>
              <p className="text-[13px] text-[#8e8e93] leading-snug mt-0.5">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-center text-[15px] font-bold text-onboard-gold mt-auto mb-2">
        We have one mission: Have fun, StealthApp!
      </p>
    </OnboardingShell>
  )
}
