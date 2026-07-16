import { useEffect, useState } from 'react'
import {
  Shield,
  ThumbsUp,
  Umbrella,
  UserRoundCheck,
  X,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { usePlans, type GoingPerson } from './PlansContext'
import { PlansShell } from './shell'

const TRAITS = [
  { id: 'respectful', label: 'Respectful', Icon: ThumbsUp },
  { id: 'safe', label: 'Safe', Icon: Shield },
  { id: 'genuine', label: 'Genuine', Icon: UserRoundCheck },
  { id: 'reliable', label: 'Reliable', Icon: Umbrella },
] as const

type TraitId = (typeof TRAITS)[number]['id']

export function RatePlanScreen() {
  const { id = '' } = useParams()
  const { loading, getCard, ratePlan, loadPeople } = usePlans()
  const plan = getCard(id)
  const navigate = useNavigate()
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [didNotAttend, setDidNotAttend] = useState(false)
  const [noShows, setNoShows] = useState<string[]>([])
  const [friendReq, setFriendReq] = useState<string[]>([])
  const [traits, setTraits] = useState<Record<string, TraitId[]>>({})
  const [people, setPeople] = useState<GoingPerson[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (id) void loadPeople(id).then(setPeople)
  }, [id, loadPeople])

  if (loading && !plan) {
    return (
      <PlansShell tip="Loading…">
        <p className="mx-auto max-w-xl py-20 text-center text-muted">Loading…</p>
      </PlansShell>
    )
  }

  if (!plan) return <Navigate to="/plans" replace />

  const max = 300

  function toggleTrait(uid: string, trait: TraitId) {
    setTraits((prev) => {
      const cur = prev[uid] ?? []
      return {
        ...prev,
        [uid]: cur.includes(trait) ? cur.filter((t) => t !== trait) : [...cur, trait],
      }
    })
  }

  async function submit() {
    setBusy(true)
    try {
      const flatTraits = Object.entries(traits).flatMap(([uid, list]) =>
        list.map((t) => `${uid}:${t}`),
      )
      await ratePlan(plan!.id, {
        score: didNotAttend ? 0 : score || 5,
        feedback: feedback || undefined,
        traits: flatTraits,
        noShow: noShows.length > 0,
        didNotAttend,
      })
      navigate(`/plans/past/${plan!.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <PlansShell tip="Rate the plan and people anonymously after it ends.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-3">
          <button
            type="button"
            aria-label="Close"
            onClick={() => navigate(`/plans/past/${plan.id}`)}
            className="rounded-lg p-2 hover:bg-feed-gap"
          >
            <X size={22} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold">Rate plan</h1>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="px-2 py-1.5 text-[15px] font-semibold text-brand disabled:opacity-50"
          >
            Done
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[15px] text-ink">How were your plans?</p>
              <button
                type="button"
                onClick={() => setDidNotAttend((v) => !v)}
                className={[
                  'text-[14px] font-semibold',
                  didNotAttend ? 'text-muted' : 'text-accent',
                ].join(' ')}
              >
                {didNotAttend ? 'Undo' : 'Did not attend'}
              </button>
            </div>

            {!didNotAttend ? (
              <>
                <div className="mb-1 flex justify-between text-[12px] text-muted">
                  <span>Lousy</span>
                  <span>Awesome!</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={score || 5}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full accent-brand"
                />
                <div className="mt-1 flex justify-between px-0.5 text-[12px] text-muted">
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => setScore(i + 1)}
                      className={score === i + 1 ? 'font-bold text-brand' : ''}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="relative mt-4">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value.slice(0, max))}
                    rows={4}
                    placeholder="Provide more feedback"
                    className="w-full resize-none rounded-xl bg-onboard-input px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted"
                  />
                  <span className="pointer-events-none absolute bottom-3 right-3 text-[12px] text-muted">
                    {max - feedback.length}
                  </span>
                </div>
              </>
            ) : (
              <p className="rounded-xl bg-pill px-4 py-3 text-[14px] text-muted">
                Thanks — we&apos;ll skip plan ratings since you didn&apos;t attend.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-center text-[16px] font-bold">
              How were the others in your plan?
            </h2>
            <p className="mt-1 text-center text-[12px] text-muted leading-relaxed">
              Your response is anonymous and helps keep StealthApp safe and fun.
            </p>

            <ul className="mt-4 divide-y divide-gray-100">
              {people.map((p) => {
                const selected = traits[p.uid] ?? []
                const noShow = noShows.includes(p.uid)
                const requested = friendReq.includes(p.uid)
                return (
                  <li key={p.uid} className="py-4">
                    <div className="flex items-start gap-3">
                      {p.avatar ? (
                        <img
                          src={p.avatar}
                          alt=""
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pill text-[14px] font-bold">
                          {p.name.slice(0, 1)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[15px] font-bold">
                              {p.name}
                              {p.role ? (
                                <span className="font-normal text-muted"> · {p.role}</span>
                              ) : null}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                setFriendReq((f) =>
                                  requested
                                    ? f.filter((n) => n !== p.uid)
                                    : [...f, p.uid],
                                )
                              }
                              className="mt-0.5 text-[13px] font-semibold text-brand"
                            >
                              {requested ? 'Cancel request' : 'Add friend'}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setNoShows((n) =>
                                noShow
                                  ? n.filter((x) => x !== p.uid)
                                  : [...n, p.uid],
                              )
                            }
                            className="text-[13px] font-semibold text-accent"
                          >
                            {noShow ? 'Undo' : 'No-show'}
                          </button>
                        </div>

                        {!noShow ? (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {TRAITS.map(({ id: tid, label, Icon }) => {
                              const on = selected.includes(tid)
                              return (
                                <button
                                  key={tid}
                                  type="button"
                                  onClick={() => toggleTrait(p.uid, tid)}
                                  className="flex flex-col items-center gap-1"
                                >
                                  <span
                                    className={[
                                      'flex h-11 w-11 items-center justify-center rounded-full',
                                      on
                                        ? 'bg-brand text-white'
                                        : 'bg-pill text-ink',
                                    ].join(' ')}
                                  >
                                    <Icon size={18} />
                                  </span>
                                  <span
                                    className={[
                                      'text-[11px]',
                                      on ? 'font-semibold text-brand' : 'text-muted',
                                    ].join(' ')}
                                  >
                                    {label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>
    </PlansShell>
  )
}
