import { useState } from 'react'
import {
  Calendar,
  Check,
  Clock,
  Flag,
  MapPin,
  Pencil,
  Share2,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFeed, parseSpots } from './FeedContext'
import { ShareModal as AppShareModal } from '../share/ShareModal'
import { planShareUrl } from '../share/messages'

export function ConfirmModal({
  open,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  onCancel,
  onConfirm,
  children,
}: {
  open: boolean
  title: string
  message?: string
  cancelLabel?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  children?: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0">
      <button type="button" aria-label="Dismiss" className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="px-5 py-5 text-center">
          <h3 className="text-[17px] font-bold text-ink">{title}</h3>
          {message ? <p className="mt-2 text-[14px] leading-snug text-[#6b6b70]">{message}</p> : null}
          {children}
        </div>
        {cancelLabel === confirmLabel ? (
          <button
            type="button"
            className="w-full border-t border-gray-200 py-3.5 text-[15px] font-semibold text-brand"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        ) : (
          <div className="grid grid-cols-2 border-t border-gray-200">
            <button type="button" className="border-r border-gray-200 py-3.5 text-[15px] text-brand" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className="py-3.5 text-[15px] font-semibold text-brand" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function JoinConfirmModal() {
  const { joinConfirmId, setJoinConfirmId, confirmJoin, items } = useFeed()
  const item = items.find((i) => i.id === joinConfirmId)
  const full =
    item?.type === 'activity' ? parseSpots(item.spots).full : false
  const [busy, setBusy] = useState(false)

  return (
    <ConfirmModal
      open={!!joinConfirmId}
      title={
        full
          ? 'Join the waiting pool?'
          : "Confirm that you'd like to join this plan"
      }
      message={
        full
          ? "You'll move in automatically if a spot opens before the plan closes."
          : "You can always leave before the plan's closing time."
      }
      confirmLabel={busy ? 'Joining…' : full ? 'Join waiting pool' : 'Join'}
      onCancel={() => !busy && setJoinConfirmId(null)}
      onConfirm={() => {
        if (!joinConfirmId || busy) return
        setBusy(true)
        void confirmJoin(joinConfirmId)
          .catch((err) => console.error(err))
          .finally(() => {
            setBusy(false)
            setJoinConfirmId(null)
          })
      }}
    />
  )
}

const EDIT_OPTIONS = ['Start time', 'Location', 'Available spots'] as const

export function RequestEditModal() {
  const { editRequestId, setEditRequestId, requestEdit } = useFeed()
  const [value, setValue] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!editRequestId) return null

  return (
    <>
      <ConfirmModal
        open={!pickerOpen}
        title="Request to edit plan"
        message="You will automatically join this plan if the host accepts your request."
        confirmLabel={busy ? 'Sending…' : 'Submit'}
        onCancel={() => {
          if (busy) return
          setEditRequestId(null)
          setValue('')
        }}
        onConfirm={() => {
          if (!value) {
            setPickerOpen(true)
            return
          }
          setBusy(true)
          void requestEdit(editRequestId, value)
            .then(() => {
              setEditRequestId(null)
              setValue('')
            })
            .catch((err) => console.error(err))
            .finally(() => setBusy(false))
        }}
      >
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-onboard-input px-4 py-3 text-left"
        >
          <span className={value ? 'text-ink text-[15px]' : 'text-muted text-[15px]'}>
            {value || 'Please select'}
          </span>
          <span className="text-muted">▾</span>
        </button>
      </ConfirmModal>

      {pickerOpen ? (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end md:items-center md:justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setPickerOpen(false)}
          />
          <div className="relative z-10 w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl">
            <div className="flex justify-end px-4 py-3 border-b border-gray-100">
              <button
                type="button"
                className="text-[15px] font-semibold text-brand"
                onClick={() => setPickerOpen(false)}
              >
                Done
              </button>
            </div>
            <ul className="py-2 pb-6">
              {EDIT_OPTIONS.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      setValue(opt)
                      setPickerOpen(false)
                    }}
                    className={[
                      'w-full px-4 py-3.5 text-center text-[17px]',
                      value === opt ? 'bg-pill font-semibold text-ink' : 'text-ink/70',
                    ].join(' ')}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}

export function RequestSentModal() {
  const { requestSentOpen, setRequestSentOpen } = useFeed()
  return (
    <ConfirmModal
      open={requestSentOpen}
      title="Request sent!"
      message="You'll receive a notification as soon as the host accepts or denies your request."
      cancelLabel="Okay"
      confirmLabel="Okay"
      onCancel={() => setRequestSentOpen(false)}
      onConfirm={() => setRequestSentOpen(false)}
    />
  )
}

export function ShareModal() {
  const { shareId, setShareId } = useFeed()
  if (!shareId) return null

  return (
    <AppShareModal
      open
      onClose={() => setShareId(null)}
      kind="found"
      url={planShareUrl(shareId)}
    />
  )
}

export function PostMenuSheet() {
  const { menuId, setMenuId, setShareId, setEditRequestId, hideFromFeed } = useFeed()
  const navigate = useNavigate()
  if (!menuId) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-0 md:px-6">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setMenuId(null)} />
      <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <div className="pt-3 pb-2">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
        </div>
        <ul className="px-2 pb-4">
          <li>
            <button
              type="button"
              onClick={() => {
                setShareId(menuId)
                setMenuId(null)
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
                setEditRequestId(menuId)
                setMenuId(null)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <Pencil size={20} />
              <span className="text-[15px]">Request to edit plan</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                const id = menuId
                setMenuId(null)
                navigate(`/home/report/${id}`)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-red-500 hover:bg-red-50"
            >
              <Flag size={20} />
              <span className="text-[15px]">Report post</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => void hideFromFeed(menuId)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-muted hover:bg-feed-gap"
            >
              <Trash2 size={20} />
              <span className="text-[15px]">Not interested</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export function PeopleJoinedSheet() {
  const { peopleId, setPeopleId, peopleList } = useFeed()
  const people = peopleList
  const count = people.filter((p) => p.role !== 'Host').length

  if (!peopleId) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-0 md:px-6">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setPeopleId(null)} />
      <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl max-h-[80dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-gray-50">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
          <h2 className="text-center text-[17px] font-bold text-ink">
            {count} {count === 1 ? 'person' : 'people'} joined
          </h2>
        </div>
        {people.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-muted">No one has joined yet.</p>
        ) : (
          <ul className="px-2 py-2">
            {people.map((p) => (
              <li key={p.uid || p.name} className="flex items-center gap-3 px-4 py-3">
                {p.avatar ? (
                  <img src={p.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pill text-[12px] font-bold text-muted">
                    {(p.name[0] || '?').toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-[15px] font-semibold text-ink">{p.name}</span>
                  {p.role ? (
                    <p className="text-[12px] text-muted">{p.role}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function ExpandedPlanSheet() {
  const { expandId, setExpandId, items, setJoinConfirmId, joinStates } = useFeed()
  const item = items.find((i) => i.id === expandId && i.type === 'activity')
  if (!item || item.type !== 'activity') return null
  const state = joinStates[item.id] ?? (item.joined ? 'joined' : 'none')
  const { full } = parseSpots(item.spots)

  return (
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center px-0 md:px-6">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setExpandId(null)} />
      <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col">
        <div className="relative">
          <img src={item.image} alt="" className="w-full aspect-[16/10] object-cover" />
          <span className="absolute left-4 bottom-4 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-brand">
            {item.category}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setExpandId(null)}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 pb-6">
          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-gray-200 md:hidden" />
          {item.title ? <p className="mb-3 text-[17px] font-bold">{item.title}</p> : null}
          <div className="space-y-2.5 text-[14px] text-ink">
            <p className="flex items-center gap-2 text-muted">
              <Calendar size={16} /> {item.date}
              <Clock size={16} className="ml-2" /> {item.time}
            </p>
            <p className="flex items-center gap-2 text-muted">
              <MapPin size={16} /> {item.location}
            </p>
            <p className="flex items-start gap-2 text-muted">
              <Users size={16} className="mt-0.5 shrink-0" />
              You can join up until Dec 12 at 3:00 PM
            </p>
            <p className="flex items-start gap-2 text-muted">
              <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-muted text-[10px] shrink-0">
                i
              </span>
              Let&apos;s meet on the putting green 30 mins early.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-[13px] text-muted">{item.spots}</span>
            <button
              type="button"
              disabled={state === 'joined' || state === 'waiting' || state === 'requested'}
              onClick={() => {
                setExpandId(null)
                setJoinConfirmId(item.id)
              }}
              className={[
                'rounded-xl px-4 py-2.5 text-[13px] font-semibold',
                state === 'joined'
                  ? 'bg-pill text-brand'
                  : state === 'waiting'
                    ? 'border border-brand text-brand bg-white'
                    : state === 'requested'
                      ? 'bg-pill text-brand'
                      : 'bg-brand text-white',
              ].join(' ')}
            >
              {state === 'joined' ? (
                <span className="inline-flex items-center gap-1">
                  <Check size={14} /> Going
                </span>
              ) : state === 'waiting' ? (
                'Joined waiting pool'
              ) : state === 'requested' ? (
                'Request sent'
              ) : full ? (
                'Join waiting pool'
              ) : (
                'Join'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeedOverlays() {
  return (
    <>
      <JoinConfirmModal />
      <RequestEditModal />
      <RequestSentModal />
      <ShareModal />
      <PostMenuSheet />
      <PeopleJoinedSheet />
      <ExpandedPlanSheet />
    </>
  )
}
