import type { CreatePlanDraft, PlanType as DraftPlanType } from './data'
import type { Plan, PlanType } from '../data/types'

export function mapUiPlanType(t: DraftPlanType | ''): PlanType {
  switch (t) {
    case 'Dating':
      return 'dating'
    case 'Something casual':
      return 'casual'
    case 'Friendship':
    default:
      return 'friendship'
  }
}

export function mapDbPlanType(t: PlanType): DraftPlanType {
  switch (t) {
    case 'dating':
      return 'Dating'
    case 'casual':
      return 'Something casual'
    case 'friendship':
    default:
      return 'Friendship'
  }
}

/** Parse UI labels like "Dec 19" + "7:00 AM" into epoch ms. */
export function parseDraftDateTime(dateStr: string, timeStr: string): number {
  if (!dateStr || !timeStr) return Date.now() + 24 * 60 * 60 * 1000
  const year = new Date().getFullYear()
  let ms = Date.parse(`${dateStr}, ${year} ${timeStr}`)
  if (Number.isNaN(ms)) {
    ms = Date.parse(`${dateStr} ${year} ${timeStr}`)
  }
  if (Number.isNaN(ms)) return Date.now() + 24 * 60 * 60 * 1000
  // If date already passed this year, roll to next year
  if (ms < Date.now() - 7 * 24 * 60 * 60 * 1000) {
    const next = Date.parse(`${dateStr}, ${year + 1} ${timeStr}`)
    if (!Number.isNaN(next)) return next
  }
  return ms
}

export function draftToPlanFields(
  draft: CreatePlanDraft,
  hostId: string,
): Omit<Plan, 'id'> {
  const now = Date.now()
  const spotsTotal = Math.max(1, Number(draft.spots) || 2)
  return {
    hostId,
    hostName: draft.host,
    hostAvatarUrl: draft.hostAvatar,
    title: draft.activitySub
      ? `${draft.activity} · ${draft.activitySub}`
      : draft.activity,
    activity: draft.activity,
    activitySub: draft.activitySub || '',
    details: draft.details || '',
    locationLabel: draft.location,
    startsAt: parseDraftDateTime(draft.startDate, draft.startTime),
    startDateLabel: draft.startDate,
    startTimeLabel: draft.startTime,
    joinUntilAt: parseDraftDateTime(draft.joinUntilDate, draft.joinUntilTime),
    joinUntilDateLabel: draft.joinUntilDate,
    joinUntilTimeLabel: draft.joinUntilTime,
    planType: mapUiPlanType(draft.planType),
    spotsTotal,
    spotsTaken: 1,
    status: 'open',
    category: draft.activity,
    couplesOnly: draft.audience === 'Couples',
    audience: draft.audience || 'Individuals',
    allowLocationEdit: draft.allowLocationEdit,
    allowTimeEdit: draft.allowTimeEdit,
    allowSpotsEdit: draft.allowSpotsEdit,
    createdAt: now,
    updatedAt: now,
  }
}

export function planToDraft(plan: Plan): CreatePlanDraft {
  return {
    host: plan.hostName || 'Host',
    hostAvatar:
      plan.hostAvatarUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    activity: plan.activity,
    activitySub: plan.activitySub || '',
    location: plan.locationLabel,
    allowLocationEdit: plan.allowLocationEdit ?? true,
    startDate: plan.startDateLabel || '',
    startTime: plan.startTimeLabel || '',
    allowTimeEdit: plan.allowTimeEdit ?? false,
    joinUntilDate: plan.joinUntilDateLabel || '',
    joinUntilTime: plan.joinUntilTimeLabel || '',
    spots: String(plan.spotsTotal || ''),
    audience: plan.audience || (plan.couplesOnly ? 'Couples' : 'Individuals'),
    allowSpotsEdit: plan.allowSpotsEdit ?? true,
    planType: mapDbPlanType(plan.planType),
    details: plan.details || '',
  }
}

export function newInviteToken(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8)
}
