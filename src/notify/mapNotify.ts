import type { AppNotification } from '../data/types'
import type { NotificationItem, NotifAction } from './data'

const FALLBACK_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#207dff"/><text x="32" y="40" text-anchor="middle" font-family="Inter,Arial" font-size="22" font-weight="700" fill="white">ap</text></svg>`,
  )

function relativeTime(ms: number): string {
  const mins = Math.max(0, Math.round((Date.now() - ms) / 60000))
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.round(hrs / 24)
  return `${days}d`
}

function actionsFor(n: AppNotification): NotifAction[] | undefined {
  if (n.actionState !== 'pending') return undefined
  if (n.type === 'join_request') {
    return [
      { label: 'Deny', kind: 'secondary' },
      { label: 'Accept', kind: 'primary' },
    ]
  }
  if (n.type === 'invite') {
    return [
      { label: 'Deny', kind: 'secondary' },
      { label: 'Join', kind: 'primary' },
    ]
  }
  if (n.type === 'friend_request') {
    return [
      { label: 'Deny', kind: 'secondary' },
      { label: 'Accept', kind: 'primary' },
    ]
  }
  return undefined
}

export function mapAppNotification(n: AppNotification): NotificationItem {
  const name = n.actorName || 'Someone'
  const body = n.body || n.title || 'New notification'
  const parts: NotificationItem['parts'] = n.actorName
    ? [{ text: name, bold: true }, { text: ` — ${body}` }]
    : [{ text: body }]

  return {
    id: n.id,
    avatar: n.actorAvatarUrl || FALLBACK_AVATAR,
    avatarKind: n.actorId ? 'user' : 'system',
    parts,
    time: relativeTime(n.createdAt),
    actions: actionsFor(n),
  }
}

export function formatMessageTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function formatThreadTime(ms: number): string {
  return relativeTime(ms)
}
