import { ACTIVITY_BANNERS } from '../create/data'
import type { Plan } from '../data/types'
import type { PlanCard } from './data'
import { mapDbPlanType } from '../create/mapPlan'

const FALLBACK =
  'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop'
const AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'

function hoursUntil(ms: number) {
  return Math.max(0, Math.round((ms - Date.now()) / (60 * 60 * 1000)))
}

export function planToCard(
  plan: Plan,
  opts: {
    badge: string
    hostedByMe?: boolean
    confirmed?: boolean
    full?: boolean
  },
): PlanCard {
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
  const joinUntil = plan.joinUntilAt ?? plan.startsAt
  const closesH = hoursUntil(joinUntil)
  const startsH = hoursUntil(plan.startsAt)

  return {
    id: plan.id,
    title: plan.activity || plan.title,
    date,
    time,
    location: plan.locationLabel,
    host: plan.hostName || 'Host',
    hostAvatar: plan.hostAvatarUrl || AVATAR,
    image: plan.coverUrl || ACTIVITY_BANNERS[plan.activity] || FALLBACK,
    badge: opts.badge,
    planType: mapDbPlanType(plan.planType),
    spots: `${Math.max(0, (plan.spotsTaken || 1) - 1)}/${plan.spotsTotal} spots filled`,
    details: plan.details,
    hostedByMe: opts.hostedByMe,
    joinUntil: plan.joinUntilDateLabel
      ? `${plan.joinUntilDateLabel} · ${plan.joinUntilTimeLabel || ''}`
      : undefined,
    closesHours: closesH,
    startsHours: startsH,
    confirmed: opts.confirmed,
    full: opts.full ?? plan.status === 'full',
    couples: plan.couplesOnly || plan.audience === 'Couples',
    artist: plan.activitySub,
  }
}

export function isPlanPast(plan: Plan): boolean {
  if (plan.status === 'past' || plan.status === 'cancelled') return true
  return plan.startsAt < Date.now() - 2 * 60 * 60 * 1000
}

export function isPlanUpcoming(plan: Plan): boolean {
  return !isPlanPast(plan) && plan.status !== 'cancelled'
}
