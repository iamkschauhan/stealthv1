import { useEffect, useState } from 'react'
import {
  Calendar,
  Clock,
  Flag,
  MapPin,
  MessageSquareMore,
  MoreHorizontal,
  Settings,
  Timer,
  User,
  Users,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ACTIVITY_BANNERS } from './data'
import { useCreate } from './CreateContext'
import { CreateShell } from './ui'
import { ManageOverlays } from './ManageOverlays'

export function HostPlanScreen() {
  const navigate = useNavigate()
  const { planId: routePlanId } = useParams()
  const {
    draft,
    going,
    invited,
    requests,
    setManageTarget,
    ensureSamplePlan,
    postedPlanId,
    reloadPlan,
    livePlan,
    busy,
  } = useCreate()
  const [manageOpen, setManageOpen] = useState(false)
  const [goingSheet, setGoingSheet] = useState(false)
  const [invitedSheet, setInvitedSheet] = useState(false)
  const [seeMore, setSeeMore] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const activeId = routePlanId || postedPlanId

  useEffect(() => {
    if (!activeId) {
      ensureSamplePlan()
      return
    }
    void reloadPlan(activeId).catch((err) => {
      console.error(err)
      setLoadError(err instanceof Error ? err.message : 'Failed to load plan')
    })
  }, [activeId, ensureSamplePlan, reloadPlan])

  const banner =
    livePlan?.coverUrl ||
    ACTIVITY_BANNERS[draft.activity || 'Golf'] ||
    'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop'
  const guests = going.filter((p) => p.role !== 'Host')
  const filled = guests.length
  const total = Number(draft.spots) || livePlan?.spotsTotal || 4
  const spotsLabel = `${filled}/${total} spots filled`
  const details = draft.details || 'Let’s meet on the putting green 30 mins before!'
  const short = details.length > 42 ? `${details.slice(0, 42)}…` : details
  const title = draft.activity || livePlan?.activity || 'Plan'
  const chatPath = activeId ? `/messages/${activeId}` : '/messages'

  if (loadError) {
    return (
      <CreateShell>
        <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 px-6">
          <p className="text-[15px] text-red-500">{loadError}</p>
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            Create a plan
          </button>
        </div>
      </CreateShell>
    )
  }

  return (
    <CreateShell tip="Manage invites, share, edit, review requests, and remove people from your plan.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center gap-1 border-b border-gray-100 bg-white px-2 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/home')}
            className="rounded-lg p-2 text-ink hover:bg-feed-gap text-2xl leading-none"
          >
            ‹
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold truncate">
            {busy && !draft.activity ? 'Loading…' : title}
          </h1>
          <Link
            to={chatPath}
            className="relative rounded-lg p-2 text-ink hover:bg-feed-gap"
            aria-label="Messages"
          >
            <MessageSquareMore size={20} />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto">
          <img src={banner} alt="" className="w-full aspect-[16/10] object-cover" />

          <div className="px-4 sm:px-5 py-4 space-y-4">
            <button
              type="button"
              onClick={() => setManageOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white"
            >
              <Settings size={18} />
              Manage
            </button>

            {requests.length > 0 ? (
              <button
                type="button"
                onClick={() => navigate('/create/requests')}
                className="flex w-full items-center justify-between rounded-xl bg-pill px-4 py-3 text-left"
              >
                <span className="text-[14px] font-semibold text-ink">
                  {requests.length} pending request{requests.length === 1 ? '' : 's'}
                </span>
                <span className="text-[13px] font-semibold text-brand">Review →</span>
              </button>
            ) : null}

            <ul className="space-y-2.5 text-[14px] text-ink">
              <li className="flex flex-wrap items-center gap-3 text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={16} /> Sat, {draft.startDate || 'Dec 19'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} /> {draft.startTime || '7:00 AM'}
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-muted">
                <MapPin size={16} className="shrink-0" />
                {draft.location || 'Laurel Lanes Country Club'}
              </li>
              <li className="flex items-start gap-1.5 text-muted">
                <Timer size={16} className="mt-0.5 shrink-0" />
                Others can join up until {draft.joinUntilDate || 'Dec 12'} at{' '}
                {draft.joinUntilTime || '3:00 PM'}
              </li>
              <li className="flex items-center gap-1.5 text-muted">
                <Users size={16} /> {spotsLabel}
              </li>
              <li className="flex items-center gap-2 text-muted">
                <User size={16} />
                Type
                <span
                  className={[
                    'rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
                    (draft.planType || 'Friendship') === 'Friendship'
                      ? 'bg-[#fdf6d2] text-[#c99214]'
                      : draft.planType === 'Dating'
                        ? 'bg-[#fee2e2] text-[#ef4444]'
                        : 'bg-[#ede9fe] text-[#7c3aed]',
                  ].join(' ')}
                >
                  {draft.planType || 'Friendship'}
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-muted">
                <Flag size={16} /> Hosted by {draft.host || 'Nick'}
              </li>
            </ul>

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

            <div className="space-y-2.5 pt-1">
              <Link
                to={chatPath}
                className="flex w-full items-center justify-center rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white"
              >
                Chat
              </Link>
              <button
                type="button"
                className="w-full rounded-full border-2 border-brand py-3.5 text-[15px] font-semibold text-brand"
              >
                Add to calendar
              </button>
            </div>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[15px] font-bold">Going</h2>
                <button
                  type="button"
                  onClick={() => setGoingSheet(true)}
                  className="text-[13px] font-semibold text-brand"
                >
                  View All
                </button>
              </div>
              <ul>
                {guests.slice(0, 3).map((p) => (
                  <li key={p.uid || p.name} className="flex items-center gap-3 py-2.5">
                    <img src={p.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                    <span className="flex-1 text-[15px] font-semibold">{p.name}</span>
                    <button
                      type="button"
                      aria-label={`Manage ${p.name}`}
                      onClick={() => setManageTarget({ kind: 'going', person: p })}
                      className="p-1 text-muted"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pb-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[15px] font-bold">Invited</h2>
                <button
                  type="button"
                  onClick={() => setInvitedSheet(true)}
                  className="text-[13px] font-semibold text-brand"
                >
                  View All
                </button>
              </div>
              <ul>
                {invited.slice(0, 3).map((p) => (
                  <li key={p.uid || p.name} className="flex items-center gap-3 py-2.5">
                    {p.reserved ? (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pill text-[12px] font-bold text-muted">
                        ···
                      </span>
                    ) : (
                      <img src={p.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold">{p.name}</p>
                      {p.expires ? (
                        <p className="text-[12px] text-brand/70">{p.expires}</p>
                      ) : null}
                    </div>
                    {!p.reserved ? (
                      <button
                        type="button"
                        className="p-1 text-muted"
                        aria-label={`Manage ${p.name}`}
                        onClick={() => setManageTarget({ kind: 'invited', person: p })}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      <ManageOverlays
        manageOpen={manageOpen}
        setManageOpen={setManageOpen}
        goingSheet={goingSheet}
        setGoingSheet={setGoingSheet}
        invitedSheet={invitedSheet}
        setInvitedSheet={setInvitedSheet}
      />
    </CreateShell>
  )
}
