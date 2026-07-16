import { ACTIVITY_BANNERS } from '../create/data'
import type { FeedItem } from '../data'
import type { Plan, PlanMember } from '../data/types'

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop'
const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'

export function planToFeedItem(plan: Plan): Extract<FeedItem, { type: 'activity' }> {
  const taken = plan.spotsTaken ?? 1
  const total = plan.spotsTotal || 2
  const date =
    plan.startDateLabel ||
    new Date(plan.startsAt).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  const time =
    plan.startTimeLabel ||
    new Date(plan.startsAt).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })

  return {
    type: 'activity',
    id: plan.id,
    user: {
      name: plan.hostName || 'Host',
      avatar: plan.hostAvatarUrl || FALLBACK_AVATAR,
      subtitle: plan.couplesOnly || plan.audience === 'Couples' ? 'Couples plan' : undefined,
    },
    image:
      plan.coverUrl ||
      ACTIVITY_BANNERS[plan.activity] ||
      FALLBACK_COVER,
    category: (plan.category || plan.activity || 'PLAN').toUpperCase(),
    status: plan.lastMinute ? 'Last-minute' : plan.status === 'full' ? 'Full' : undefined,
    title: plan.activitySub || undefined,
    date,
    time,
    location: plan.locationLabel,
    spots: `${Math.max(0, taken - 1)}/${total} spots filled`,
    spotsBorder: taken >= total ? '#e87a8a' : undefined,
    likes: Math.max(12, taken * 7),
    joined: false,
  }
}

export function membersToPeople(members: PlanMember[]) {
  return members
    .filter((m) => m.role === 'host' || m.role === 'going')
    .map((m) => ({
      uid: m.uid,
      name: m.displayName || (m.role === 'host' ? 'Host' : 'Guest'),
      avatar:
        m.avatarUrl ||
        FALLBACK_AVATAR,
      role: m.role === 'host' ? 'Host' : undefined,
    }))
}
