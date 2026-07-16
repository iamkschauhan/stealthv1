import { useState, type ReactNode } from 'react'
import type { OnboardingStepId } from '../flow'
import { useOnboarding } from '../OnboardingContext'
import { ProgressDots } from '../ProgressDots'
import {
  GoldLink,
  OnboardingShell,
  OnboardingTitle,
  PrimaryButton,
  Toggle,
} from '../ui'

export function SingleSelectScreen({
  stepId,
  title,
  subtitle,
  options,
  value,
  onChange,
  activeDot,
  cta = 'Continue',
  allowSkip,
}: {
  stepId: OnboardingStepId
  title: string
  subtitle?: ReactNode
  options: string[]
  value: string
  onChange: (v: string) => void
  activeDot: number
  cta?: string
  allowSkip?: boolean
}) {
  const { advance, busy } = useOnboarding()
  const [show, setShow] = useState(true)
  const ready = !!value && !busy

  return (
    <OnboardingShell
      showBack
      stepId={stepId}
      wide
      footer={
        <>
          <Toggle
            label="Show on my profile"
            checked={show}
            onChange={setShow}
          />
          <PrimaryButton
            enabled={ready}
            className="mt-3"
            onClick={() => ready && void advance(stepId)}
          >
            {busy ? 'Saving…' : cta}
          </PrimaryButton>
          {allowSkip ? (
            <div className="mt-3 flex justify-center">
              <GoldLink onClick={() => void advance(stepId)}>Skip →</GoldLink>
            </div>
          ) : null}
        </>
      }
    >
      <ProgressDots active={activeDot} />
      <OnboardingTitle subtitle={subtitle}>{title}</OnboardingTitle>
      <div className="flex flex-col gap-3 pb-4">
        {options.map((opt) => {
          const selected = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={[
                'w-full rounded-full py-3.5 text-[15px] font-medium transition-colors',
                selected
                  ? 'bg-onboard-gold text-white'
                  : 'bg-[#f0f2f9] text-ink',
              ].join(' ')}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </OnboardingShell>
  )
}

export function MultiChipScreen({
  stepId,
  title,
  subtitle,
  options,
  values,
  onChange,
  max = 10,
  activeDot,
  allowSkip,
  categories,
}: {
  stepId: OnboardingStepId
  title: string
  subtitle?: ReactNode
  options?: string[]
  categories?: { name: string; items: string[] }[]
  values: string[]
  onChange: (v: string[]) => void
  max?: number
  activeDot: number
  allowSkip?: boolean
}) {
  const { advance, busy } = useOnboarding()
  const [show, setShow] = useState(true)
  const ready = values.length >= 1 && !busy

  function toggle(item: string) {
    if (values.includes(item)) onChange(values.filter((x) => x !== item))
    else if (values.length < max) onChange([...values, item])
  }

  const sections =
    categories ??
    (options ? [{ name: '', items: options }] : [])

  return (
    <OnboardingShell
      showBack
      stepId={stepId}
      wide
      footer={
        <>
          <Toggle
            label="Show on my profile"
            checked={show}
            onChange={setShow}
          />
          <PrimaryButton
            enabled={ready}
            className="mt-3"
            onClick={() => ready && void advance(stepId)}
          >
            {busy ? 'Saving…' : 'Continue'}
          </PrimaryButton>
          {allowSkip ? (
            <div className="mt-3 flex justify-center">
              <GoldLink onClick={() => void advance(stepId)}>Skip →</GoldLink>
            </div>
          ) : null}
        </>
      }
    >
      <ProgressDots active={activeDot} />
      <OnboardingTitle subtitle={subtitle}>{title}</OnboardingTitle>
      <div className="flex flex-col gap-6 pb-4">
        {sections.map((section) => (
          <div key={section.name || 'all'}>
            {section.name ? (
              <h2 className="mb-3 text-center text-[15px] font-bold text-ink">
                {section.name}
              </h2>
            ) : null}
            <div className="flex flex-wrap justify-center gap-2">
              {section.items.map((item) => {
                const selected = values.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(item)}
                    className={[
                      'rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
                      selected
                        ? 'border-onboard-gold bg-onboard-gold text-white'
                        : 'border-[#e5e5ea] bg-white text-ink',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </OnboardingShell>
  )
}
