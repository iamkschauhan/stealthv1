import { useEffect, useState } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Flag,
  Info,
  MapPin,
  MoreHorizontal,
  Pencil,
  Share2,
  Star,
  Timer,
  User,
  UserPlus,
  Users,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth'
import { SUGGESTED } from './data'
import { usePlans, type GoingPerson } from './PlansContext'
import { ConfirmDialog, PlansShell, SharePlanModal, Sheet } from './shell'

type JoinStatus = 'idle' | 'waiting' | 'requested' | 'joined'

const EDIT_FIELDS = ['Available spots', 'Start time', 'Location'] as const

export function WatchingPlanDetail() {
  const { id = '' } = useParams()
  const { loading, getCard, stopWatch, joinFromWatch, requestEdit, loadPeople, leaveOrCancel } =
    usePlans()
  const { profile } = useAuth()
  const plan = getCard(id)
  const navigate = useNavigate()
  const [seeMore, setSeeMore] = useState(false)
  const [pendingInfoOpen, setPendingInfoOpen] = useState(false)
  const [goingOpen, setGoingOpen] = useState(false)
  const [people, setPeople] = useState<GoingPerson[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [joinStatus, setJoinStatus] = useState<JoinStatus>('idle')
  const [joinConfirm, setJoinConfirm] = useState(false)
  const [waitConfirm, setWaitConfirm] = useState(false)
  const [coupleConfirm, setCoupleConfirm] = useState(false)
  const [unableOpen, setUnableOpen] = useState(false)
  const [sentOpen, setSentOpen] = useState(false)
  const [leaveWaitOpen, setLeaveWaitOpen] = useState(false)
  const [stopWatchOpen, setStopWatchOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editField, setEditField] = useState<(typeof EDIT_FIELDS)[number]>('Available spots')
  const [editNote, setEditNote] = useState('')
  const [editPicker, setEditPicker] = useState(false)
  const [busy, setBusy] = useState(false)

  const linked = !!profile?.coupleLinkedUid

  useEffect(() => {
    if (goingOpen && id) void loadPeople(id).then(setPeople)
  }, [goingOpen, id, loadPeople])

  if (loading && !plan) {
    return (
      <PlansShell tip="Loading…">
        <p className="mx-auto max-w-xl py-20 text-center text-muted">Loading plan…</p>
      </PlansShell>
    )
  }

  if (!plan) return <Navigate to="/plans?tab=Watching" replace />

  const isFull = !!plan.full
  const isCouples = !!plan.couples
  const details =
    plan.details ||
    "Let's meet on the putting green 30 mins before! Everybody take yellow umbrellas."
  const short = details.length > 42 ? `${details.slice(0, 42)}…` : details
  const type = plan.planType || 'Friendship'
  const hostLabel = plan.coHost ? `${plan.host} & ${plan.coHost}` : plan.host

  function onPrimaryJoin() {
    if (joinStatus === 'waiting') {
      setLeaveWaitOpen(true)
      return
    }
    if (joinStatus === 'requested' || joinStatus === 'joined') return
    if (isCouples && !linked) {
      setUnableOpen(true)
      return
    }
    if (isCouples && linked) {
      setCoupleConfirm(true)
      return
    }
    if (isFull) {
      setWaitConfirm(true)
      return
    }
    setJoinConfirm(true)
  }

  async function completeJoin() {
    setJoinConfirm(false)
    setWaitConfirm(false)
    setCoupleConfirm(false)
    setBusy(true)
    try {
      const state = await joinFromWatch(plan!.id)
      if (state === 'joined') {
        setJoinStatus('joined')
        navigate(`/plans/upcoming/${plan!.id}`)
        return
      }
      if (state === 'waiting') {
        setJoinStatus('waiting')
        return
      }
      setJoinStatus('requested')
      setSentOpen(true)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  const primaryLabel =
    joinStatus === 'waiting'
      ? 'Joined waiting pool'
      : joinStatus === 'requested'
        ? 'Requested'
        : joinStatus === 'joined'
          ? 'Going'
          : isFull
            ? 'Join waiting pool'
            : 'Join'

  return (
    <PlansShell tip="Watching a plan — join, join the waiting pool, or request an edit while you wait.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center gap-1 border-b border-gray-100 bg-white px-2 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/plans?tab=Watching')}
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
                onClick={onPrimaryJoin}
                disabled={joinStatus === 'requested' || joinStatus === 'joined' || busy}
                className={[
                  'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-[13px] sm:text-[14px] font-semibold',
                  joinStatus === 'waiting' || joinStatus === 'requested'
                    ? 'border-2 border-brand/25 bg-[#e8f1ff] text-brand'
                    : 'bg-brand text-white',
                  joinStatus === 'requested' ? 'opacity-90' : '',
                ].join(' ')}
              >
                {joinStatus === 'idle' ? <UserPlus size={16} /> : null}
                {primaryLabel}
              </button>
              <button
                type="button"
                onClick={() => setStopWatchOpen(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-brand/25 bg-[#e8f1ff] py-3 text-[13px] sm:text-[14px] font-semibold text-brand"
              >
                <Eye size={16} />
                Watching
              </button>
              <button
                type="button"
                aria-label="More"
                onClick={() => setMenuOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pill text-brand"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            <ul className="space-y-2.5 text-[14px] text-ink">
              {plan.artist ? (
                <li className="flex items-center gap-1.5 text-muted">
                  <Star size={16} /> {plan.artist}
                </li>
              ) : null}
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
                <span className="font-semibold text-ink">{hostLabel}</span>
              </li>
            </ul>

            {joinStatus === 'requested' ? (
              <button
                type="button"
                onClick={() => setPendingInfoOpen((v) => !v)}
                className="flex w-full items-start gap-2 rounded-xl bg-pill px-3.5 py-3 text-left"
              >
                <Info size={16} className="mt-0.5 shrink-0 text-muted" />
                <span className="flex-1 text-[13px] leading-relaxed text-ink">
                  {pendingInfoOpen ? (
                    <>
                      <span className="font-semibold">Your request to join is pending.</span>{' '}
                      You&apos;ll receive a notification as soon as the host accepts or denies
                      your request.
                    </>
                  ) : (
                    'Your request to join is pending.'
                  )}
                </span>
                {pendingInfoOpen ? (
                  <ChevronUp size={16} className="mt-0.5 shrink-0 text-muted" />
                ) : (
                  <ChevronDown size={16} className="mt-0.5 shrink-0 text-muted" />
                )}
              </button>
            ) : null}

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
          {people.length === 0 ? (
            <li className="py-6 text-center text-[14px] text-muted">No one yet</li>
          ) : (
            people.map((p) => (
              <li key={p.uid} className="flex items-center gap-3 py-3">
                {p.avatar ? (
                  <img src={p.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pill text-[14px] font-bold">
                    {p.name.slice(0, 1)}
                  </span>
                )}
                <p className="text-[15px] font-semibold">
                  {p.name}
                  {p.role ? (
                    <span className="font-normal text-muted"> · {p.role}</span>
                  ) : null}
                </p>
              </li>
            ))
          )}
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
          <li>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setEditOpen(true)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <Pencil size={20} />
              <span className="text-[15px]">Request to edit plan</span>
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

      <ConfirmDialog
        open={joinConfirm}
        title="Confirm that you'd like to join this plan"
        message="You can always leave before the plan's closing time."
        confirmLabel="Join"
        onCancel={() => setJoinConfirm(false)}
        onConfirm={() => void completeJoin()}
      />

      <ConfirmDialog
        open={waitConfirm}
        title="Join the waiting pool?"
        message="You'll move in automatically if a spot opens before the plan closes."
        confirmLabel="Join waiting pool"
        onCancel={() => setWaitConfirm(false)}
        onConfirm={() => void completeJoin()}
      />

      <ConfirmDialog
        open={coupleConfirm}
        title="Confirm that you'd like to join this plan as a couple"
        message="You can always leave before the plan's closing time."
        confirmLabel="Join"
        onCancel={() => setCoupleConfirm(false)}
        onConfirm={() => void completeJoin()}
      />

      <ConfirmDialog
        open={unableOpen}
        title="Unable to join"
        message="You must be linked with another user to join plans with couples."
        cancelLabel="Cancel"
        confirmLabel="Link account"
        onCancel={() => setUnableOpen(false)}
        onConfirm={() => {
          setUnableOpen(false)
          navigate('/profile')
        }}
      />

      <ConfirmDialog
        open={sentOpen}
        title="Request sent!"
        message="You'll receive a notification as soon as the host accepts or denies your request."
        cancelLabel="Okay"
        confirmLabel="Okay"
        onCancel={() => setSentOpen(false)}
        onConfirm={() => setSentOpen(false)}
      />

      <ConfirmDialog
        open={leaveWaitOpen}
        title="Leave waiting pool"
        message="Are you sure you want to leave the waiting pool?"
        confirmLabel="Leave"
        onCancel={() => setLeaveWaitOpen(false)}
        onConfirm={() => {
          setLeaveWaitOpen(false)
          void leaveOrCancel(plan.id).then(() => {
            setJoinStatus('idle')
            navigate('/plans?tab=Watching')
          })
        }}
      />

      <ConfirmDialog
        open={stopWatchOpen}
        title="Stop watching?"
        message="This plan will be removed from your Watching list."
        confirmLabel="Stop watching"
        onCancel={() => setStopWatchOpen(false)}
        onConfirm={() => {
          setStopWatchOpen(false)
          void stopWatch(plan.id).then(() => navigate('/plans?tab=Watching'))
        }}
      />

      <ConfirmDialog
        open={editOpen}
        title="Request to edit plan"
        message="You will automatically join this plan if the host accepts your request."
        confirmLabel="Submit"
        onCancel={() => {
          setEditOpen(false)
          setEditNote('')
        }}
        onConfirm={() => {
          void requestEdit(plan.id, editField, editNote)
            .then(() => {
              setEditOpen(false)
              setEditNote('')
              setJoinStatus('requested')
              setSentOpen(true)
            })
            .catch(console.error)
        }}
      >
        <div className="mt-4 space-y-3 text-left">
          <button
            type="button"
            onClick={() => setEditPicker(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-[14px]"
          >
            <span>{editField}</span>
            <ChevronDown size={16} className="text-muted" />
          </button>
          <input
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            placeholder="Enter change here"
            className="w-full rounded-xl border border-gray-200 bg-onboard-input px-3 py-3 text-[14px] outline-none"
          />
        </div>
      </ConfirmDialog>

      <Sheet open={editPicker} title="Edit field" onClose={() => setEditPicker(false)}>
        <ul className="px-2 py-2 pb-4">
          {EDIT_FIELDS.map((f) => (
            <li key={f}>
              <button
                type="button"
                onClick={() => {
                  setEditField(f)
                  setEditPicker(false)
                }}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 hover:bg-feed-gap"
              >
                <span className="text-[15px]">{f}</span>
                <span
                  className={[
                    'flex h-5 w-5 items-center justify-center rounded-full border-2',
                    editField === f ? 'border-brand' : 'border-gray-300',
                  ].join(' ')}
                >
                  {editField === f ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </PlansShell>
  )
}
