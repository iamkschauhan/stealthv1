import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Link2,
  MessageSquare,
  Share2,
  SquarePen,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FRIENDS, INVITE_LINK, type Person } from './data'
import { useCreate } from './CreateContext'
import { ShareModal } from '../share/ShareModal'
import { copyShare, sharePayload, smsHref } from '../share/messages'

function SheetShell({
  open,
  title,
  onClose,
  children,
  back,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  back?: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-0 md:px-6">
      <button type="button" aria-label="Dismiss" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl max-h-[88dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 bg-white pt-3 pb-2 border-b border-gray-50 z-10">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
          <div className="relative flex items-center px-4">
            {back ? (
              <button type="button" onClick={back} className="absolute left-3 p-1 text-2xl leading-none">
                ‹
              </button>
            ) : null}
            <h2 className="w-full text-center text-[17px] font-bold">{title}</h2>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function ConfirmPersonModal({
  open,
  person,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean
  person: Person | null
  title: string
  message: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open || !person) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="px-5 py-5 text-center">
          {person.avatar ? (
            <img
              src={person.avatar}
              alt=""
              className="mx-auto mb-3 h-14 w-14 rounded-full object-cover border-2 border-avatar-ring"
            />
          ) : null}
          <h3 className="text-[17px] font-bold text-ink">{title}</h3>
          <p className="mt-2 text-[14px] leading-snug text-[#6b6b70]">{message}</p>
        </div>
        <div className="grid grid-cols-2 border-t border-gray-200">
          <button
            type="button"
            className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-3.5 text-[15px] font-semibold text-red-500"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ManageOverlays({
  manageOpen,
  setManageOpen,
  goingSheet,
  setGoingSheet,
  invitedSheet,
  setInvitedSheet,
}: {
  manageOpen: boolean
  setManageOpen: (v: boolean) => void
  goingSheet: boolean
  setGoingSheet: (v: boolean) => void
  invitedSheet: boolean
  setInvitedSheet: (v: boolean) => void
}) {
  const navigate = useNavigate()
  const {
    draft,
    resetDraft,
    going,
    invited,
    removeGoing,
    removeInvited,
    addInvites,
    addReservedSlots,
    manageTarget,
    setManageTarget,
  } = useCreate()

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteMode, setInviteMode] = useState<'menu' | 'friends' | 'link' | 'created'>('menu')
  const [inviteCount, setInviteCount] = useState(2)
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['John', 'Mike'])
  const [shareOpen, setShareOpen] = useState(false)
  const [deletePlanOpen, setDeletePlanOpen] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState(false)
  const [deleteInviteConfirm, setDeleteInviteConfirm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [countPicker, setCountPicker] = useState(false)

  const spotsAvailable = Math.max(
    0,
    (Number(draft.spots) || 4) - Math.max(0, going.filter((p) => p.role !== 'Host').length),
  )

  function openInvite() {
    setManageOpen(false)
    setInviteMode('menu')
    setInviteOpen(true)
    setCopied(false)
  }

  function toggleFriend(name: string) {
    setSelectedFriends((list) =>
      list.includes(name) ? list.filter((n) => n !== name) : [...list, name],
    )
  }

  async function copyLink() {
    try {
      await copyShare('inviteReserved', INVITE_LINK)
    } catch {
      /* ignore */
    }
    setCopied(true)
  }

  return (
    <>
      <SheetShell open={manageOpen} title="Manage" onClose={() => setManageOpen(false)}>
        <ul className="px-2 py-2 pb-4">
          <li>
            <button
              type="button"
              onClick={() => {
                setManageOpen(false)
                navigate('/create/edit')
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <SquarePen size={20} />
              <span className="text-[15px]">Edit plan</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={openInvite}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <UserPlus size={20} />
              <span className="text-[15px]">Invite friends and reserve spots</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setManageOpen(false)
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
                setManageOpen(false)
                navigate('/create/requests')
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <Users size={20} />
              <span className="text-[15px]">Requests</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setManageOpen(false)
                setDeletePlanOpen(true)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-red-500 hover:bg-red-50"
            >
              <Trash2 size={20} />
              <span className="text-[15px]">Delete plan</span>
            </button>
          </li>
        </ul>
      </SheetShell>

      <SheetShell open={!!manageTarget} title="Manage" onClose={() => setManageTarget(null)}>
        <div className="px-2 pb-4">
          {manageTarget?.kind === 'going' ? (
            <button
              type="button"
              onClick={() => setRemoveConfirm(true)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <UserMinus size={20} />
              <span className="text-[15px]">Remove</span>
            </button>
          ) : null}
          {manageTarget?.kind === 'invited' ? (
            <button
              type="button"
              onClick={() => setDeleteInviteConfirm(true)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <UserMinus size={20} />
              <span className="text-[15px]">Delete invite</span>
            </button>
          ) : null}
        </div>
      </SheetShell>

      <ConfirmPersonModal
        open={removeConfirm}
        person={manageTarget?.kind === 'going' ? manageTarget.person : null}
        title={manageTarget?.person.name ?? ''}
        message="Are you sure you want to remove this person? They've already been notified that you've accepted them into your plan."
        confirmLabel="Remove"
        onCancel={() => setRemoveConfirm(false)}
        onConfirm={() => {
          if (manageTarget?.kind === 'going') removeGoing(manageTarget.person.name)
          setRemoveConfirm(false)
        }}
      />

      <ConfirmPersonModal
        open={deleteInviteConfirm}
        person={manageTarget?.kind === 'invited' ? manageTarget.person : null}
        title={manageTarget?.person.name ?? ''}
        message="Are you sure you want to delete this invite? This person has already been notified that you've invited them to your plan."
        confirmLabel="Delete"
        onCancel={() => setDeleteInviteConfirm(false)}
        onConfirm={() => {
          if (manageTarget?.kind === 'invited') removeInvited(manageTarget.person.name)
          setDeleteInviteConfirm(false)
        }}
      />

      {deletePlanOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeletePlanOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-5 py-5 text-center">
              <h3 className="text-[17px] font-bold">Delete plan</h3>
              <p className="mt-2 text-[14px] text-[#6b6b70]">
                Are you sure you want to delete this plan?
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-200">
              <button
                type="button"
                className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
                onClick={() => setDeletePlanOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-3.5 text-[15px] font-semibold text-red-500"
                onClick={() => {
                  setDeletePlanOpen(false)
                  resetDraft()
                  navigate('/home')
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {shareOpen ? (
        <ShareModal
          open
          onClose={() => setShareOpen(false)}
          kind="hosting"
          url={INVITE_LINK}
        />
      ) : null}

      <SheetShell
        open={inviteOpen}
        title={
          inviteMode === 'friends'
            ? 'Invite from friends list'
            : inviteMode === 'link'
              ? 'Invite via link'
              : inviteMode === 'created'
                ? 'Link created'
                : 'Invite'
        }
        onClose={() => setInviteOpen(false)}
        back={
          inviteMode === 'menu'
            ? undefined
            : () => setInviteMode(inviteMode === 'created' ? 'link' : 'menu')
        }
      >
        {inviteMode === 'menu' ? (
          <ul className="px-2 py-2 pb-4">
            <li>
              <button
                type="button"
                onClick={() => setInviteMode('friends')}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
              >
                <Users size={20} />
                <span className="text-[15px]">Invite from friends list</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setInviteMode('link')}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
              >
                <Link2 size={20} />
                <span className="text-[15px]">Invite via link</span>
              </button>
            </li>
          </ul>
        ) : null}

        {inviteMode === 'friends' ? (
          <div className="px-4 py-4 space-y-4">
            <p className="text-center text-[13px] text-muted leading-snug">
              Each invite will reserve a spot for 1 hour. You can always delete an invite or send
              another.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] text-ink">Invites:</span>
              <button
                type="button"
                onClick={() => setCountPicker(true)}
                className="flex items-center gap-1 rounded-lg bg-onboard-input px-3 py-1.5 text-[14px] font-semibold"
              >
                {inviteCount} <ChevronDown size={14} />
              </button>
              <span className="ml-auto text-[13px] text-muted">
                <span className="font-bold text-brand">{spotsAvailable}</span> spots available
              </span>
            </div>

            {selectedFriends.length ? (
              <div>
                <p className="mb-2 text-[14px] font-bold">Selected</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {FRIENDS.filter((f) => selectedFriends.includes(f.name)).map((f) => (
                    <div key={f.name} className="flex w-14 flex-col items-center gap-1 shrink-0">
                      <img
                        src={f.avatar}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover border-2 border-avatar-ring"
                      />
                      <span className="truncate text-[11px]">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="mb-1 text-[14px] font-bold">All friends</p>
              <ul>
                {FRIENDS.map((f) => {
                  const on = selectedFriends.includes(f.name)
                  return (
                    <li key={f.name} className="flex items-center gap-3 py-3 border-b border-gray-50">
                      <img src={f.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                      <span className="flex-1 text-[15px] font-semibold">{f.name}</span>
                      <button
                        type="button"
                        aria-label={on ? 'Deselect' : 'Select'}
                        onClick={() => toggleFriend(f.name)}
                        className={[
                          'flex h-6 w-6 items-center justify-center rounded-[5px] border-2',
                          on ? 'border-brand bg-brand text-white' : 'border-gray-300',
                        ].join(' ')}
                      >
                        {on ? <Check size={14} strokeWidth={3} /> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <button
              type="button"
              disabled={selectedFriends.length === 0}
              onClick={() => {
                addInvites(FRIENDS.filter((f) => selectedFriends.includes(f.name)))
                setInviteOpen(false)
                setInviteMode('menu')
              }}
              className={[
                'w-full rounded-xl py-3.5 text-[15px] font-semibold',
                selectedFriends.length ? 'bg-brand text-white' : 'bg-onboard-disabled text-[#c7c7cc]',
              ].join(' ')}
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="w-full py-2 text-[14px] font-semibold text-brand"
            >
              Skip →
            </button>
          </div>
        ) : null}

        {inviteMode === 'link' ? (
          <div className="px-4 py-4 space-y-4">
            <p className="text-center text-[13px] text-muted leading-snug">
              Each invite will reserve a spot for 1 hour. You can always delete an invite or send
              another.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[14px]">Invites:</span>
              <button
                type="button"
                onClick={() => setCountPicker(true)}
                className="flex items-center gap-1 rounded-lg bg-onboard-input px-3 py-2 text-[14px] font-semibold"
              >
                {inviteCount} <ChevronDown size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                addReservedSlots(inviteCount)
                setInviteMode('created')
                void copyLink()
              }}
              className="w-full rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white"
            >
              Submit and get link
            </button>
            <button
              type="button"
              disabled
              className="w-full rounded-xl bg-onboard-disabled py-3.5 text-[15px] font-semibold text-[#c7c7cc]"
            >
              Submit
            </button>
          </div>
        ) : null}

        {inviteMode === 'created' ? (
          <div className="px-4 py-4 space-y-4">
            <div className="rounded-2xl bg-pill p-4">
              <div className="flex items-start gap-2">
                <Link2 size={18} className="text-brand mt-0.5 shrink-0" />
                <div>
                  <p className="text-[14px] font-bold break-all">{INVITE_LINK}</p>
                  <p className="mt-1 text-[12px] text-muted leading-snug">
                    Anyone with this link can see your plan and join a reserved spot.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-muted">⏱ This link expires in 1 hour.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = smsHref('inviteReserved', INVITE_LINK)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-3 hover:bg-feed-gap"
            >
              <MessageSquare size={20} />
              <span className="text-[15px]">Share via text</span>
            </button>
            <p className="px-2 text-[12px] text-muted leading-snug">
              {sharePayload('inviteReserved', INVITE_LINK)}
            </p>
            {copied ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-[#34c759] py-3.5 text-white font-semibold">
                <Link2 size={18} />
                Copied
              </div>
            ) : null}
          </div>
        ) : null}
      </SheetShell>

      {countPicker ? (
        <div className="fixed inset-0 z-[75] flex flex-col justify-end md:items-center md:justify-center">
          <button type="button" className="absolute inset-0 bg-black/30" onClick={() => setCountPicker(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl">
            <div className="flex justify-end px-4 py-3 border-b border-gray-100">
              <button
                type="button"
                className="text-[15px] font-semibold text-brand"
                onClick={() => setCountPicker(false)}
              >
                Done
              </button>
            </div>
            <ul className="py-2 pb-6 max-h-60 overflow-y-auto">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => {
                      setInviteCount(n)
                      setCountPicker(false)
                    }}
                    className={[
                      'w-full py-3 text-center text-[17px]',
                      inviteCount === n ? 'bg-pill font-semibold' : 'text-ink/70',
                    ].join(' ')}
                  >
                    {n}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <SheetShell open={goingSheet} title="Going" onClose={() => setGoingSheet(false)}>
        <ul className="px-4 py-2 pb-6">
          {going.map((p) => (
            <li key={p.name} className="flex items-center gap-3 py-3">
              <img
                src={p.avatar}
                alt=""
                className="h-11 w-11 rounded-full object-cover border-2 border-avatar-ring"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold">
                  {p.name}
                  {p.role ? <span className="font-normal text-muted"> · {p.role}</span> : null}
                </p>
              </div>
              {!p.role ? (
                <button
                  type="button"
                  aria-label={`Manage ${p.name}`}
                  onClick={() => {
                    setGoingSheet(false)
                    setManageTarget({ kind: 'going', person: p })
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-pill text-brand text-lg leading-none"
                >
                  ···
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </SheetShell>

      <SheetShell open={invitedSheet} title="Invited" onClose={() => setInvitedSheet(false)}>
        <ul className="px-4 py-2 pb-6">
          {invited.map((p) => (
            <li key={p.name} className="flex items-center gap-3 py-3">
              {p.reserved ? (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pill text-muted">
                  ···
                </span>
              ) : (
                <img
                  src={p.avatar}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover border-2 border-avatar-ring"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold">{p.name}</p>
                {p.expires ? <p className="text-[12px] text-brand/70">{p.expires}</p> : null}
              </div>
              {!p.reserved ? (
                <button
                  type="button"
                  aria-label={`Manage ${p.name}`}
                  onClick={() => {
                    setInvitedSheet(false)
                    setManageTarget({ kind: 'invited', person: p })
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-pill text-brand text-lg leading-none"
                >
                  ···
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </SheetShell>
    </>
  )
}
