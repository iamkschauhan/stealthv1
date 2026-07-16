import { doc } from 'firebase/firestore'
import { createPlan, getPlan, updatePlan, plansCol } from './plans'
import {
  listMembers,
  upsertMember,
  setMemberRole,
  removeMember,
} from './joins'
import { createNotification } from './notifications'
import { ensureThreadForPlan } from './threads'
import { draftToPlanFields, newInviteToken } from '../create/mapPlan'
import type { CreatePlanDraft } from '../create/data'
import type { Plan, PlanMember } from './types'

export async function publishPlanFromDraft(
  draft: CreatePlanDraft,
  hostId: string,
): Promise<Plan> {
  const planId = doc(plansCol()).id
  const fields = draftToPlanFields(draft, hostId)
  const plan = await createPlan(planId, {
    ...fields,
    inviteToken: newInviteToken(),
  })
  const now = Date.now()
  await upsertMember(planId, hostId, {
    role: 'host',
    displayName: draft.host,
    avatarUrl: draft.hostAvatar,
    createdAt: now,
    updatedAt: now,
  })
  try {
    await ensureThreadForPlan(planId)
  } catch (err) {
    console.warn('Thread create after publish skipped:', err)
  }
  return plan
}

export async function savePlanDraftEdits(
  planId: string,
  draft: CreatePlanDraft,
  hostId: string,
): Promise<void> {
  const fields = draftToPlanFields(draft, hostId)
  await updatePlan(planId, {
    hostName: fields.hostName,
    hostAvatarUrl: fields.hostAvatarUrl,
    title: fields.title,
    activity: fields.activity,
    activitySub: fields.activitySub,
    details: fields.details,
    locationLabel: fields.locationLabel,
    startsAt: fields.startsAt,
    startDateLabel: fields.startDateLabel,
    startTimeLabel: fields.startTimeLabel,
    joinUntilAt: fields.joinUntilAt,
    joinUntilDateLabel: fields.joinUntilDateLabel,
    joinUntilTimeLabel: fields.joinUntilTimeLabel,
    planType: fields.planType,
    spotsTotal: fields.spotsTotal,
    category: fields.category,
    couplesOnly: fields.couplesOnly,
    audience: fields.audience,
    allowLocationEdit: fields.allowLocationEdit,
    allowTimeEdit: fields.allowTimeEdit,
    allowSpotsEdit: fields.allowSpotsEdit,
  })
}

export async function cancelPlan(planId: string): Promise<void> {
  await updatePlan(planId, { status: 'cancelled' })
}

export async function loadPlanBundle(planId: string): Promise<{
  plan: Plan
  members: PlanMember[]
} | null> {
  const plan = await getPlan(planId)
  if (!plan) return null
  const members = await listMembers(planId)
  return { plan, members }
}

export async function acceptJoinRequest(
  planId: string,
  memberUid: string,
  hostId: string,
): Promise<void> {
  const plan = await getPlan(planId)
  if (!plan) throw new Error('Plan not found')
  await setMemberRole(planId, memberUid, 'going')
  const taken = Math.min(plan.spotsTotal, (plan.spotsTaken || 1) + 1)
  await updatePlan(planId, {
    spotsTaken: taken,
    status: taken >= plan.spotsTotal ? 'full' : plan.status,
  })
  await createNotification(`n_${Date.now()}_${memberUid.slice(0, 6)}`, {
    userId: memberUid,
    type: 'join_accepted',
    title: 'Request accepted',
    body: `You're going to ${plan.title}`,
    actorId: hostId,
    planId,
    actionState: 'accepted',
    read: false,
    createdAt: Date.now(),
  })
  await ensureThreadForPlan(planId)
}

export async function denyJoinRequest(
  planId: string,
  memberUid: string,
  hostId: string,
): Promise<void> {
  await removeMember(planId, memberUid)
  const plan = await getPlan(planId)
  await createNotification(`n_${Date.now()}_${memberUid.slice(0, 6)}`, {
    userId: memberUid,
    type: 'join_denied',
    title: 'Request declined',
    body: plan
      ? `Your request for ${plan.title} was declined`
      : 'Request declined',
    actorId: hostId,
    planId,
    actionState: 'denied',
    read: false,
    createdAt: Date.now(),
  })
}

export { getPlan, updatePlan, listMembers, upsertMember, removeMember }
