import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  Info,
  MapPin,
  MoreHorizontal,
  Share2,
  Timer,
  User,
  UserRoundPlus,
  Users,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  GOING_PEOPLE,
  SUGGESTED,
  findRequestedPlan,
} from './data'
import { PlansShell, SharePlanModal, Sheet } from './shell'

export function RequestedPlanDetail() {
  const { id = '' } = useParams()
  const plan = findRequestedPlan(id)
  const navigate = useNavigate()
  const [seeMore, setSeeMore] = useState(false)
  const [pendingOpen, setPendingOpen] = useState(false)
  const [goingOpen, setGoingOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  if (!plan) return <Navigate to="/plans?tab=Requested" replace />

  const details =
    plan.details ||
    "Let's meet on the putting green 30 mins before! Everybody take yellow umbrellas."
  const short = details.length > 42 ? `${details.slice(0, 42)}…` : details
  const type = plan.planType || 'Friendship'

  return (
    <PlansShell tip="Pending join request — cancel from Requested, chat unlocks when accepted.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center gap-1 border-b border-gray-100 bg-white px-2 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/plans?tab=Requested')}
            className="rounded-lg p-2 text-ink hover:bg-feed-gap text-2xl leading-none"
          >
            ‹
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold truncate">{plan.title}</h1>
          <span className="w-10" />
        </header>

        <div className="flex-1 overflow-y-auto">
          <img src={plan.image} alt="" className="w-full aspect-[16/10] object-cover" />

          <div className="px-4 sm:px-5 py-4 space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand/25 bg-[#e8f1ff] py-3.5 text-[15px] font-semibold text-brand"
              >
                <UserRoundPlus size={18} />
                Requested
              </button>
              <button
                type="button"
                aria-label="More"
                onClick={() => setMenuOpen(true)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pill text-brand"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            <ul className="space-y-2.5 text-[14px] text-ink">
              <li className="flex flex-wrap items-center gap-3 text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={16} /> {plan.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} /> {plan.time}
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-muted">
                <MapPin size={16} className="shrink-0" />
                {plan.location}
              </li>
              <li className="flex items-start gap-1.5 text-muted">
                <Timer size={16} className="mt-0.5 shrink-0" />
                You can join up until {plan.joinUntil || 'Dec 12 at 3:00 PM'}
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setGoingOpen(true)}
                  className="inline-flex items-center gap-1.5 font-semibold text-brand underline underline-offset-2"
                >
                  <Users size={16} /> {plan.spots || '3/4 spots filled'}
                </button>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <User size={16} />
                Type
                <span
                  className={[
                    'rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
                    type === 'Friendship'
                      ? 'bg-[#fdf6d2] text-[#c99214]'
                      : type === 'Dating'
                        ? 'bg-[#fee2e2] text-[#ef4444]'
                        : 'bg-[#ede9fe] text-[#7c3aed]',
                  ].join(' ')}
                >
                  {type}
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-muted">
                <Flag size={16} /> Hosted by{' '}
                <span className="font-semibold text-ink">{plan.host}</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setPendingOpen((v) => !v)}
              className="flex w-full items-start gap-2 rounded-xl bg-pill px-3.5 py-3 text-left"
            >
              <Info size={16} className="mt-0.5 shrink-0 text-muted" />
              <span className="flex-1 text-[13px] leading-relaxed text-ink">
                {pendingOpen ? (
                  <>
                    <span className="font-semibold">Your request to join is pending.</span>{' '}
                    You&apos;ll receive a notification as soon as the host accepts or denies
                    your request.
                  </>
                ) : (
                  'Your request to join is pending.'
                )}
              </span>
              {pendingOpen ? (
                <ChevronUp size={16} className="mt-0.5 shrink-0 text-muted" />
              ) : (
                <ChevronDown size={16} className="mt-0.5 shrink-0 text-muted" />
              )}
            </button>

            <section>
              <h2 className="mb-1 text-[15px] font-bold">Details</h2>
              <p className="text-[14px] leading-relaxed text-muted">
                {seeMore ? details : short}{' '}
                {details.length > 42 ? (
                  <button
                    type="button"
                    onClick={() => setSeeMore((v) => !v)}
                    className="font-semibold text-brand"
                  >
                    {seeMore ? 'see less' : 'see more'}
                  </button>
                ) : null}
              </p>
            </section>

            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[#e8e8ed] py-3.5 text-[15px] font-semibold text-[#b0b0b8]"
            >
              Chat
            </button>

            <section className="pb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-bold">Suggested Plans</h2>
                <button type="button" className="text-[13px] font-semibold text-brand">
                  See All
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {SUGGESTED.map((s) => (
                  <article
                    key={s.id}
                    className="w-[260px] shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <img src={s.image} alt="" className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <h3 className="text-[15px] font-bold">{s.title}</h3>
                      <p className="mt-1 text-[12px] text-muted">
                        {s.date} · {s.time}
                      </p>
                      <p className="truncate text-[12px] text-muted">{s.location}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={s.hostAvatar}
                          alt=""
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold">{s.host}</p>
                          <p className="text-[10px] text-muted">Host</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          className="flex-1 rounded-full bg-brand py-2 text-[12px] font-semibold text-white"
                        >
                          Join
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-full border border-brand py-2 text-[12px] font-semibold text-brand"
                        >
                          Watch
                        </button>
                        <button
                          type="button"
                          aria-label="Share"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-pill text-muted"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Sheet open={goingOpen} title="Going" onClose={() => setGoingOpen(false)}>
        <ul className="px-4 py-2 pb-6">
          {GOING_PEOPLE.map((p) => (
            <li key={p.name} className="flex items-center gap-3 py-3">
              <img src={p.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <p className="text-[15px] font-semibold">
                {p.name}
                {p.role ? (
                  <span className="font-normal text-muted"> · {p.role}</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </Sheet>

      <Sheet open={menuOpen} title="Manage" onClose={() => setMenuOpen(false)}>
        <ul className="px-2 py-2 pb-4">
          <li>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setShareOpen(true)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <Share2 size={20} />
              <span className="text-[15px]">Share plan</span>
            </button>
          </li>
        </ul>
      </Sheet>

      <SharePlanModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        kind="found"
        planId={plan.id}
      />

      {cancelOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setCancelOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-5 py-5 text-center">
              <h3 className="text-[17px] font-bold">Cancel request to join</h3>
              <p className="mt-2 text-[14px] text-[#6b6b70]">
                Are you sure you want to cancel your request to join?
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-200">
              <button
                type="button"
                className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
                onClick={() => setCancelOpen(false)}
              >
                No
              </button>
              <button
                type="button"
                className="py-3.5 text-[15px] font-semibold text-brand"
                onClick={() => navigate('/plans?tab=Requested')}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PlansShell>
  )
}
