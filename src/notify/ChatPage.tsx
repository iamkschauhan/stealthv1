import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUp,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MoreHorizontal,
  Paperclip,
  Search,
  Smile,
  X,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth'
import { ME } from './data'
import { useNotify } from './NotifyContext'
import { ensureThreadForPlan } from '../data/threads'
import { PhotoPicker } from './PhotoPicker'
import { ManageSheet, NotifyShell } from './shell'

export function ChatPage() {
  const { threadId = '' } = useParams()
  const { user, profile } = useAuth()
  const {
    loading,
    threads,
    markThreadRead,
    loadMessages,
    sendChat,
    viewPlanPath,
    refresh,
  } = useNotify()
  const navigate = useNavigate()
  const thread = threads.find((t) => t.id === threadId)

  const [text, setText] = useState('')
  const [pendingImages, setPendingImages] = useState<
    { url: string; blob?: Blob }[]
  >([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hitIndex, setHitIndex] = useState(0)
  const [planHref, setPlanHref] = useState('/plans')
  const [ready, setReady] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function boot() {
      if (!threadId || !user) return
      try {
        await ensureThreadForPlan(threadId)
        await refresh()
        await loadMessages(threadId)
        await markThreadRead(threadId)
        const href = await viewPlanPath(threadId)
        if (!cancelled) setPlanHref(href)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [threadId, user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages.length, pendingImages.length])

  const hits = useMemo(() => {
    if (!thread || !query.trim()) return []
    const q = query.trim().toLowerCase()
    return thread.messages.filter((m) => m.text?.toLowerCase().includes(q))
  }, [thread, query])

  useEffect(() => {
    setHitIndex(0)
  }, [query])

  useEffect(() => {
    const hit = hits[hitIndex]
    if (!hit) return
    document.getElementById(`msg-${hit.id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [hits, hitIndex])

  if ((loading || !ready) && !thread) {
    return (
      <NotifyShell tip="Loading chat…">
        <p className="mx-auto max-w-xl py-20 text-center text-muted">Loading…</p>
      </NotifyShell>
    )
  }

  if (ready && !thread) return <Navigate to="/messages" replace />

  const live = thread!

  const myAvatar = profile?.avatarUrl || ME.avatar

  async function send() {
    const trimmed = text.trim()
    if (!trimmed && pendingImages.length === 0) return
    setSending(true)
    try {
      const blobs: Blob[] = []
      for (const img of pendingImages) {
        if (img.blob) blobs.push(img.blob)
        else {
          const res = await fetch(img.url)
          blobs.push(await res.blob())
        }
      }
      await sendChat(live.id, trimmed, blobs.length ? blobs : undefined)
      setText('')
      setPendingImages([])
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  function highlight(body: string) {
    if (!query.trim()) return body
    const q = query.trim()
    const i = body.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return body
    return (
      <>
        {body.slice(0, i)}
        <mark className="bg-brand/25 text-ink rounded px-0.5">
          {body.slice(i, i + q.length)}
        </mark>
        {body.slice(i + q.length)}
      </>
    )
  }

  return (
    <NotifyShell
      tip="Search the thread, attach photos, or open View plan from Manage."
      tipTitle={live.title}
    >
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm min-h-[70dvh] md:min-h-[75dvh] max-h-[100dvh] md:max-h-[calc(100dvh-6rem)] overflow-hidden flex flex-col">
        {searchOpen ? (
          <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-onboard-input px-3 py-2">
              <Search size={16} className="text-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-[15px] outline-none"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} className="text-muted">
                  <X size={16} />
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false)
                setQuery('')
              }}
              className="text-[15px] font-semibold text-brand shrink-0 px-1"
            >
              Cancel
            </button>
          </header>
        ) : (
          <header className="sticky top-0 z-20 flex items-center gap-1 border-b border-gray-100 bg-white px-2 sm:px-3 py-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => navigate('/messages')}
              className="rounded-lg p-2 text-ink hover:bg-feed-gap"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold text-ink truncate">
              {live.title}
            </h1>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-ink hover:bg-feed-gap"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              aria-label="Manage"
              onClick={() => setManageOpen(true)}
              className="rounded-lg p-2 text-ink hover:bg-feed-gap"
            >
              <MoreHorizontal size={20} />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3">
          <p className="text-center text-[13px] font-semibold text-muted py-2">Today</p>

          {live.messages.map((m, idx) => {
            const mine = m.senderId === 'me'
            const prev = live.messages[idx - 1]
            const showAvatar = !prev || prev.senderId !== m.senderId
            const isHit = hits[hitIndex]?.id === m.id

            return (
              <div
                key={m.id}
                id={`msg-${m.id}`}
                className={[
                  'flex items-end gap-2',
                  mine ? 'justify-end' : 'justify-start',
                  isHit ? 'ring-2 ring-brand/40 rounded-2xl' : '',
                ].join(' ')}
              >
                {!mine ? (
                  <div className="w-8 shrink-0">
                    {showAvatar ? (
                      <img
                        src={live.avatar}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : null}
                  </div>
                ) : null}

                <div className={['max-w-[78%] space-y-1.5', mine ? 'items-end' : ''].join(' ')}>
                  {m.text ? (
                    <div
                      className={[
                        'rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug',
                        mine ? 'bg-brand text-white' : 'bg-[#f1f3f9] text-ink',
                      ].join(' ')}
                    >
                      {!mine ? (
                        <div className="mb-1 flex items-baseline justify-between gap-3">
                          <span className="text-[13px] font-bold">Member</span>
                          <span className="text-[11px] text-muted">{m.time}</span>
                        </div>
                      ) : (
                        <div className="mb-1 text-right text-[11px] text-white/80">{m.time}</div>
                      )}
                      <p>{highlight(m.text)}</p>
                    </div>
                  ) : null}

                  {m.images?.length ? (
                    <div
                      className={[
                        'grid gap-1.5',
                        m.images.length === 1
                          ? 'grid-cols-1 max-w-[220px]'
                          : m.images.length === 2
                            ? 'grid-cols-2 max-w-[260px]'
                            : 'grid-cols-2 max-w-[280px]',
                        mine ? 'ml-auto' : '',
                      ].join(' ')}
                    >
                      {m.images.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt=""
                          className={[
                            'rounded-2xl object-cover w-full',
                            m.images!.length === 1 ? 'aspect-[4/3]' : 'aspect-square',
                            m.images!.length > 2 && src === m.images![m.images!.length - 1]
                              ? 'col-span-2 aspect-[2/1]'
                              : '',
                          ].join(' ')}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                {mine ? (
                  <div className="w-8 shrink-0">
                    {showAvatar ? (
                      <img
                        src={myAvatar}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>

        {searchOpen ? (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-[13px] text-muted">
            <span>
              {hits.length ? `${hitIndex + 1} of ${hits.length}` : '0 results'}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={!hits.length}
                onClick={() =>
                  setHitIndex((i) => (i - 1 + hits.length) % hits.length)
                }
                className="p-2 rounded-lg hover:bg-feed-gap disabled:opacity-40"
                aria-label="Previous result"
              >
                <ChevronUp size={18} />
              </button>
              <button
                type="button"
                disabled={!hits.length}
                onClick={() => setHitIndex((i) => (i + 1) % hits.length)}
                className="p-2 rounded-lg hover:bg-feed-gap disabled:opacity-40"
                aria-label="Next result"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 bg-white px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {pendingImages.length ? (
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                {pendingImages.map((img) => (
                  <div key={img.url} className="relative h-20 w-20 shrink-0">
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() =>
                        setPendingImages((imgs) => imgs.filter((u) => u.url !== img.url))
                      }
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Attach"
                onClick={() => setPickerOpen(true)}
                className="p-1.5 text-muted hover:text-ink"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                aria-label="Emoji"
                onClick={() => setText((t) => `${t}😊`)}
                className="p-1.5 text-muted hover:text-ink"
              >
                <Smile size={20} />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void send()
                  }
                }}
                placeholder="Your message"
                className="flex-1 rounded-full bg-onboard-input px-4 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
              />
              <button
                type="button"
                aria-label="Send"
                disabled={sending || (!text.trim() && !pendingImages.length)}
                onClick={() => void send()}
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full shrink-0 disabled:opacity-50',
                  text.trim() || pendingImages.length
                    ? 'bg-brand text-white'
                    : 'bg-[#e5e5ea] text-white',
                ].join(' ')}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ManageSheet open={manageOpen} onClose={() => setManageOpen(false)}>
        <button
          type="button"
          onClick={() => {
            setManageOpen(false)
            navigate(planHref)
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left hover:bg-feed-gap"
        >
          <Calendar size={20} />
          <span className="text-[15px]">View plan</span>
        </button>
      </ManageSheet>

      <PhotoPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={(items) => setPendingImages((prev) => [...prev, ...items])}
      />
    </NotifyShell>
  )
}
