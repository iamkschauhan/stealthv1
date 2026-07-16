import { useState } from 'react'
import { ChevronLeft, MessageSquareText, MoreHorizontal, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotify } from './NotifyContext'
import { ManageSheet, NotifyShell } from './shell'

export function MessagesPage() {
  const { threads, deleteThread } = useNotify()
  const navigate = useNavigate()
  const [manageId, setManageId] = useState<string | null>(null)
  const empty = threads.length === 0

  return (
    <NotifyShell tip="Plan chats live here. Open a thread to message the group or view the plan.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm min-h-[70dvh] md:min-h-[75dvh] overflow-hidden flex flex-col">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center gap-2 border-b border-gray-100 bg-white px-2 sm:px-3 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/notifications')}
            className="rounded-lg p-2 text-ink hover:bg-feed-gap"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold text-ink pr-10">
            Messages
          </h1>
        </header>

        {empty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <MessageSquareText size={72} strokeWidth={1.25} className="text-brand/25" />
            <p className="mt-4 text-[14px] text-muted text-center">
              You don&apos;t have any messages.
            </p>
          </div>
        ) : (
          <ul>
            {threads.map((t) => (
              <li key={t.id}>
                <div
                  className={[
                    'flex items-start gap-3 border-b border-gray-100 px-4 sm:px-5 py-4',
                    t.unread > 0 ? 'bg-[#f5f7ff]' : 'bg-white',
                  ].join(' ')}
                >
                  <Link to={`/messages/${t.id}`} className="contents">
                    <img
                      src={t.avatar}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-full object-cover bg-pill"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-ink">{t.title}</p>
                      <p className="mt-0.5 text-[13px]">
                        <span className="font-semibold text-ink">{t.lastSender}</span>{' '}
                        <span className="text-muted">{t.time}</span>
                      </p>
                      <p className="mt-0.5 truncate text-[13px] text-muted">{t.preview}</p>
                    </div>
                  </Link>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={`Manage ${t.title}`}
                      onClick={() => setManageId(t.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-pill text-brand"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {t.unread > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-white">
                        {t.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ManageSheet open={!!manageId} onClose={() => setManageId(null)}>
        <button
          type="button"
          onClick={() => {
            if (manageId) deleteThread(manageId)
            setManageId(null)
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left hover:bg-feed-gap"
        >
          <Trash2 size={20} />
          <span className="text-[15px]">Delete chat</span>
        </button>
      </ManageSheet>
    </NotifyShell>
  )
}
