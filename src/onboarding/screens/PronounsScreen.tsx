import { useState } from 'react'
import { MessageSquareWarning } from 'lucide-react'
import { useOnboarding } from '../OnboardingContext'
import {
  GoldLink,
  OnboardingShell,
  OnboardingTitle,
  PrimaryButton,
  Toggle,
} from '../ui'

const SEXUALITY = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Asexual',
  'Pansexual',
  'Queer',
  'Questioning',
  'Prefer not to say',
  'Not listed',
]

const PRONOUNS = [
  'She',
  'Her',
  'Hers',
  'He',
  'Him',
  'His',
  'They',
  'Them',
  'Theirs',
  'Prefer not to say',
]

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
        selected ? 'bg-onboard-gold text-white' : 'bg-[#f0f2f9] text-ink',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function PronounsScreen() {
  const { data, patch, advance, busy } = useOnboarding()
  const [sexuality, setSexuality] = useState('')
  const [showSex, setShowSex] = useState(true)
  const [showPronouns, setShowPronouns] = useState(true)

  const ready = sexuality.length > 0 && data.pronouns.length > 0 && !busy

  function togglePronoun(p: string) {
    const cur = data.pronouns
    if (cur.includes(p)) {
      patch({ pronouns: cur.filter((x) => x !== p) })
      return
    }
    if (cur.length >= 3) return
    patch({ pronouns: [...cur, p] })
  }

  return (
    <OnboardingShell
      showBack
      stepId="pronouns"
      footer={
        <PrimaryButton
          enabled={ready}
          onClick={() => ready && void advance('pronouns')}
        >
          {busy ? 'Saving…' : 'Continue'}
        </PrimaryButton>
      }
    >
      <OnboardingTitle>What&apos;s your sexuality?</OnboardingTitle>
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {SEXUALITY.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={sexuality === s}
            onClick={() => setSexuality(s)}
          />
        ))}
      </div>
      <div className="flex justify-center mb-2">
        <GoldLink icon={<MessageSquareWarning size={14} />}>
          Suggest another option
        </GoldLink>
      </div>
      <Toggle
        label="Show on my profile"
        checked={showSex}
        onChange={setShowSex}
      />

      <div className="border-t border-gray-100 my-6" />

      <OnboardingTitle
        subtitle={
          <>
            Select <span className="font-semibold text-onboard-gold">up to 3</span>.
          </>
        }
      >
        Choose your pronouns
      </OnboardingTitle>
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {PRONOUNS.map((p) => (
          <Chip
            key={p}
            label={p}
            selected={data.pronouns.includes(p)}
            onClick={() => togglePronoun(p)}
          />
        ))}
      </div>
      <Toggle
        label="Show on my profile"
        checked={showPronouns}
        onChange={setShowPronouns}
      />
    </OnboardingShell>
  )
}
