import { useState } from 'react'
import { Bell, Mail, MoreHorizontal, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotify } from './NotifyContext'
import { ManageSheet, NotifyShell } from './shell'
import type { NotificationItem } from './data'

function NotifText({ parts }: { parts: NotificationItem['parts'] }) {
  return (
    <p className="text-[14px] sm:text-[15px] leading-snug text-ink">
      {parts.map((p, i) =>
        p.bold ? (
          <strong key={i} className="font-bold">
            {p.text}
          </strong>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </p>
  )
}

export function NotificationsPage() {
  const { notifications, unreadMessages, removeNotification, clearNotificationActions } =
    useNotify()
  const [manageId, setManageId] = useState<string | null>(null)
  const empty = notifications.length === 0

  return (
    <NotifyShell tip="Accept invites, friend requests, and plan updates here. Tap the mail icon for Messages.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm min-h-[70dvh] md:min-h-[75dvh] overflow-hidden flex flex-col">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center justify-between gap-3 bg-white px-4 sm:px-5 py-4 border-b border-gray-50">
          <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight text-ink">
            Notifications
          </h1>
          <Link
            to="/messages"
            aria-label="Messages"
            className="relative rounded-xl p-2 text-ink hover:bg-feed-gap"
          >
            <Mail size={24} strokeWidth={1.75} />
            {unreadMessages > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            ) : null}
          </Link>
        </header>

        {empty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <Bell size={72} strokeWidth={1.25} className="text-brand/25" />
            <p className="mt-4 text-[14px] text-muted text-center">
              You don&apos;t have any notifications yet.
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-transparent">
            {notifications.map((n) => (
              <li key={n.id} className="flex gap-3 px-4 sm:px-5 py-4">
                <img
                  src={n.avatar}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full object-cover bg-pill"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <NotifText parts={n.parts} />
                      <p className="mt-1 text-[12px] text-muted">{n.time}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Manage notification"
                      onClick={() => setManageId(n.id)}
                      className="shrink-0 p-1 text-brand/70 hover:text-brand"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  {n.actions?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.actions.map((a) => (
                        <button
                          key={a.label}
                          type="button"
                          onClick={() => clearNotificationActions(n.id)}
                          className={[
                            'min-w-[88px] rounded-xl px-4 py-2 text-[13px] font-semibold',
                            a.kind === 'primary'
                              ? 'bg-brand text-white'
                              : 'bg-pill text-brand',
                          ].join(' ')}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
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
            if (manageId) removeNotification(manageId)
            setManageId(null)
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left hover:bg-feed-gap"
        >
          <Trash2 size={20} />
          <span className="text-[15px]">Remove notification</span>
        </button>
      </ManageSheet>
    </NotifyShell>
  )
}
