import { useState } from 'react'
import { Check, Copy, Link2, MessageSquare, X } from 'lucide-react'
import {
  SHARE_COPY,
  copyShare,
  nativeShare,
  type ShareKind,
} from './messages'

export function ShareModal({
  open,
  onClose,
  kind,
  url,
  showAppInvite = false,
}: {
  open: boolean
  onClose: () => void
  kind: ShareKind
  url: string
  /** Past joiner mock: “Invite friends through StealthApp” */
  showAppInvite?: boolean
}) {
  const [copied, setCopied] = useState(false)
  if (!open) return null

  const { title, message } = SHARE_COPY[kind]

  async function onCopy() {
    try {
      await copyShare(kind, url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  async function onSocial() {
    const shared = await nativeShare(kind, url)
    if (!shared) await onCopy()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center px-0 sm:px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-0">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted hover:bg-feed-gap"
        >
          <X size={18} />
        </button>
        <p className="px-2 pt-2 text-center text-[16px] font-bold leading-snug text-ink">
          {title}
        </p>
        <p className="mt-3 px-2 text-center text-[13px] leading-snug text-muted">{message}</p>
        <div className="mt-5 flex justify-center gap-4">
          {[
            { label: 'f', bg: 'bg-[#1877f2]' },
            { label: 'ig', bg: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]' },
            { label: 'X', bg: 'bg-[#1da1f2]' },
            { label: 'msg', bg: 'bg-[#25d366]' },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              aria-label={`Share via ${s.label}`}
              onClick={onSocial}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-bold text-white ${s.bg}`}
            >
              {s.label === 'msg' ? <MessageSquare size={20} /> : s.label === 'ig' ? '◎' : s.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-onboard-input px-3 py-3">
          <Link2 size={16} className="shrink-0 text-muted" />
          <p className="min-w-0 flex-1 truncate text-[12px] text-ink">{url}</p>
          <button
            type="button"
            aria-label="Copy share message and link"
            onClick={onCopy}
            className="shrink-0 rounded-lg p-1.5 text-brand hover:bg-white"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        {showAppInvite ? (
          <button
            type="button"
            onClick={onCopy}
            className="mt-4 w-full text-center text-[14px] font-semibold text-brand"
          >
            Invite friends through StealthApp
          </button>
        ) : null}
      </div>
    </div>
  )
}
