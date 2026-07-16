import { useMemo, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { useOnboarding } from '../OnboardingContext'
import { usePhoneAuthActions } from '../usePhoneAuthActions'
import {
  COUNTRY_DIALS,
  findCountryByDial,
  minNationalDigits,
} from '../countryCodes'
import {
  OnboardingShell,
  StealthAppLogo,
  OnboardingTitle,
  Field,
  PrimaryButton,
} from '../ui'

export function PhoneScreen() {
  const { data, patch, error, busy } = useOnboarding()
  const { sendCode } = usePhoneAuthActions()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = findCountryByDial(data.countryCode || '+1')
  const digits = data.phone.replace(/\D/g, '')
  const ready = digits.length >= minNationalDigits(selected.dial) && !busy

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRY_DIALS
    return COUNTRY_DIALS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <OnboardingShell
      showBack
      stepId="phone"
      footer={
        <PrimaryButton enabled={ready} onClick={() => ready && void sendCode()}>
          {busy ? 'Sending…' : 'Send code'}
        </PrimaryButton>
      }
    >
      <StealthAppLogo />
      <div className="mt-10">
        <OnboardingTitle>What&apos;s your phone number?</OnboardingTitle>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Select country code"
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-onboard-input px-3 py-4 text-[15px] font-medium text-ink shrink-0"
        >
          <span className="text-base" aria-hidden>
            {selected.flag}
          </span>
          {selected.dial}
          <ChevronDown size={16} className="text-[#8e8e93]" />
        </button>
        <Field
          type="tel"
          inputMode="numeric"
          placeholder="Phone number"
          value={data.phone}
          onChange={(e) =>
            patch({ phone: e.target.value, countryCode: selected.dial })
          }
          className="flex-1"
        />
      </div>

      {error ? (
        <p className="mt-3 text-[13px] text-red-500 leading-snug">{error}</p>
      ) : (
        <p className="mt-3 text-[12px] text-[#aeaeb2] leading-snug">
          We care about your privacy and use your number only to verify you.
          {import.meta.env.DEV ? (
            <>
              {' '}
              Dev tip: use US (+1) test number <span className="font-semibold text-ink">5555550100</span>{' '}
              / code <span className="font-semibold text-ink">123456</span>.
            </>
          ) : null}
        </p>
      )}

      <div
        id="recaptcha-container"
        className="mt-4 flex min-h-0 justify-center empty:hidden"
      />

      {pickerOpen ? (
        <div className="fixed inset-0 z-[80] flex flex-col bg-white">
          <header className="flex items-center gap-2 border-b border-gray-100 px-3 py-3">
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                setPickerOpen(false)
                setQuery('')
              }}
              className="rounded-lg p-2 hover:bg-feed-gap"
            >
              <X size={22} />
            </button>
            <h2 className="flex-1 text-center text-[17px] font-bold pr-10">
              Country code
            </h2>
          </header>

          <div className="px-4 py-3">
            <div className="flex items-center gap-2 rounded-2xl bg-onboard-input px-3 py-2.5">
              <Search size={16} className="text-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code"
                className="w-full bg-transparent text-[15px] outline-none"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto px-2 pb-8">
            {filtered.map((c) => {
              const active = c.iso === selected.iso
              return (
                <li key={`${c.iso}-${c.dial}-${c.name}`}>
                  <button
                    type="button"
                    onClick={() => {
                      patch({ countryCode: c.dial })
                      setPickerOpen(false)
                      setQuery('')
                    }}
                    className={[
                      'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left hover:bg-feed-gap',
                      active ? 'bg-pill' : '',
                    ].join(' ')}
                  >
                    <span className="text-[22px]" aria-hidden>
                      {c.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-[15px] font-semibold text-muted">
                      {c.dial}
                    </span>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 ? (
              <li className="px-4 py-10 text-center text-[14px] text-muted">
                No countries match that search.
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </OnboardingShell>
  )
}
