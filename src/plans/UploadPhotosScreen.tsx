import { useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Users,
  X,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PICKER_PHOTOS, TAG_FRIENDS, findPastPlan } from './data'
import { PlansShell, Sheet } from './shell'

export function UploadPhotosScreen() {
  const { id = '' } = useParams()
  const plan = findPastPlan(id)
  const navigate = useNavigate()
  const [step, setStep] = useState<'picker' | 'compose' | 'tap-tag'>('picker')
  const [selected, setSelected] = useState<string[]>([])
  const [tagged, setTagged] = useState<string[]>(['Mike'])
  const [shareFeed, setShareFeed] = useState(true)
  const [caption, setCaption] = useState('It was a great game of golf.')
  const [friendsOpen, setFriendsOpen] = useState(false)
  const [pendingTags, setPendingTags] = useState<string[]>([])

  if (!plan) return <Navigate to="/plans" replace />

  const preview = selected[0] ?? PICKER_PHOTOS[0]
  const maxCaption = 300

  function togglePhoto(url: string) {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    )
  }

  if (step === 'picker') {
    return (
      <PlansShell tip="Pick photos from this past plan to share.">
        <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
          <header className="flex items-center gap-2 border-b border-gray-100 px-3 py-3">
            <button
              type="button"
              aria-label="Close"
              onClick={() => navigate(`/plans/past/${plan.id}`)}
              className="rounded-lg p-2 hover:bg-feed-gap"
            >
              <X size={22} />
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold">Upload photos</h1>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => setStep('compose')}
              className={[
                'px-3 py-1.5 text-[15px] font-semibold',
                selected.length ? 'text-brand' : 'text-[#c7c7cc]',
              ].join(' ')}
            >
              Next
            </button>
          </header>

          <div className="aspect-square bg-black/5 shrink-0">
            <img src={preview} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <button
              type="button"
              className="flex items-center gap-1 py-3 text-[15px] font-semibold text-ink"
            >
              Recent <ChevronDown size={16} />
            </button>
            <div className="grid grid-cols-4 gap-1">
              {PICKER_PHOTOS.map((url) => {
                const idx = selected.indexOf(url)
                const active = idx >= 0
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => togglePhoto(url)}
                    className="relative aspect-square overflow-hidden"
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <span
                      className={[
                        'absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
                        active
                          ? 'bg-brand text-white'
                          : 'border-2 border-white bg-black/20',
                      ].join(' ')}
                    >
                      {active ? idx + 1 : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </PlansShell>
    )
  }

  if (step === 'tap-tag') {
    return (
      <PlansShell tip="Tap the photo to place tags on friends.">
        <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
          <header className="flex items-center gap-2 border-b border-gray-100 px-3 py-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => setStep('compose')}
              className="rounded-lg p-2 text-2xl leading-none hover:bg-feed-gap"
            >
              ‹
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold">Tag friends</h1>
            <span className="w-10" />
          </header>

          <button
            type="button"
            onClick={() => {
              setPendingTags([...tagged])
              setFriendsOpen(true)
            }}
            className="relative aspect-square w-full overflow-hidden"
          >
            <img src={preview} alt="" className="h-full w-full object-cover" />
          </button>
          <p className="flex-1 px-6 py-10 text-center text-[15px] text-muted">
            Tap the photo to tag friends.
          </p>
        </div>

        <Sheet open={friendsOpen} title="Friends" onClose={() => setFriendsOpen(false)}>
          <ul className="px-4 py-2">
            {TAG_FRIENDS.map((f) => {
              const on = pendingTags.includes(f.name)
              return (
                <li key={f.name}>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingTags((t) =>
                        on ? t.filter((n) => n !== f.name) : [...t, f.name],
                      )
                    }
                    className="flex w-full items-center gap-3 py-3"
                  >
                    <img
                      src={f.avatar}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <span className="flex-1 text-left text-[15px] font-semibold">
                      {f.name}
                    </span>
                    <span
                      className={[
                        'flex h-6 w-6 items-center justify-center rounded-md border-2',
                        on ? 'border-brand bg-brand text-white' : 'border-gray-300',
                      ].join(' ')}
                    >
                      {on ? <Check size={14} strokeWidth={3} /> : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="px-4 pb-6 pt-2">
            <button
              type="button"
              onClick={() => {
                setTagged(pendingTags)
                setFriendsOpen(false)
                setStep('compose')
              }}
              className="w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white"
            >
              Tag
            </button>
          </div>
        </Sheet>
      </PlansShell>
    )
  }

  return (
    <PlansShell tip="Add a caption, tag friends, and share photos to the feed.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="flex items-center gap-2 border-b border-gray-100 px-3 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => setStep('picker')}
            className="rounded-lg p-2 text-2xl leading-none hover:bg-feed-gap"
          >
            ‹
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold">Upload photos</h1>
          <span className="w-10" />
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-0.5">
            {(selected.length ? selected : UPLOAD_FALLBACK).slice(0, 3).map((url) => (
              <img key={url} src={url} alt="" className="aspect-square w-full object-cover" />
            ))}
          </div>

          <div className="px-4 sm:px-5 py-4 space-y-4">
            <button
              type="button"
              onClick={() => setStep('tap-tag')}
              className="flex w-full items-center gap-3 py-1"
            >
              <Users size={20} className="text-ink" />
              <span className="flex-1 text-left text-[15px]">Tag friends</span>
              <ChevronRight size={18} className="text-muted" />
            </button>

            {tagged.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tagged.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-md bg-ink px-2.5 py-1 text-[13px] font-semibold text-white"
                  >
                    {name}
                    <button
                      type="button"
                      aria-label={`Remove ${name}`}
                      onClick={() => setTagged((t) => t.filter((n) => n !== name))}
                      className="opacity-80 hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <div className="border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShareFeed((v) => !v)}
                className="flex w-full items-center justify-between"
              >
                <span className="text-[15px]">Share to feed</span>
                <span
                  className={[
                    'flex h-6 w-6 items-center justify-center rounded-md border-2',
                    shareFeed ? 'border-brand bg-brand text-white' : 'border-gray-300',
                  ].join(' ')}
                >
                  {shareFeed ? <Check size={14} strokeWidth={3} /> : null}
                </span>
              </button>
            </div>

            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, maxCaption))}
                rows={4}
                placeholder="Write a caption…"
                className="w-full resize-none rounded-xl bg-onboard-input px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 text-[12px] text-muted">
                {maxCaption - caption.length}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 sm:px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => navigate(`/plans/past/${plan.id}`)}
            className="w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white"
          >
            Post
          </button>
        </div>
      </div>
    </PlansShell>
  )
}

const UPLOAD_FALLBACK = PICKER_PHOTOS.slice(0, 3)
