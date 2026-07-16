/**
 * Dev seed helpers — after signing in as a host in the browser console:
 *
 *   const { seedDemoBundle } = await import('/src/data/seed.ts')
 *   await seedDemoBundle('<your-uid>', { displayName: 'Alex', guestUid: '<optional-guest-uid>' })
 */
import { createPlan, updatePlan } from './plans'
import { upsertMember } from './joins'
import { ensureThreadForPlan } from './threads'
import { createNotification } from './notifications'
import type { Plan } from './types'

export async function seedDemoPlan(
  hostId: string,
  opts?: {
    title?: string
    activity?: string
    hoursFromNow?: number
    hostName?: string
  },
): Promise<Plan> {
  const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const now = Date.now()
  const startsAt = now + (opts?.hoursFromNow ?? 24) * 60 * 60 * 1000
  const activity = opts?.activity || 'Coffee'
  const hostName = opts?.hostName || 'Host'
  const plan = await createPlan(id, {
    hostId,
    hostName,
    title: opts?.title || `${activity} & walk`,
    activity,
    details: 'Seeded demo plan for StealthApp screenshots',
    locationLabel: 'Downtown',
    startsAt,
    startDateLabel: new Date(startsAt).toLocaleDateString(),
    startTimeLabel: new Date(startsAt).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    }),
    planType: 'friendship',
    spotsTotal: 4,
    spotsTaken: 1,
    status: 'open',
    category: activity,
    createdAt: now,
    updatedAt: now,
  })
  await upsertMember(id, hostId, {
    role: 'host',
    displayName: hostName,
    createdAt: now,
    updatedAt: now,
  })
  return plan
}

/** Seed 2 open plans + 1 past plan for the signed-in host. */
export async function seedDemoBundle(
  hostId: string,
  opts?: { displayName?: string; guestUid?: string },
): Promise<{ open: Plan[]; past: Plan }> {
  const name = opts?.displayName || 'Host'
  const openA = await seedDemoPlan(hostId, {
    title: 'Coffee meetup',
    activity: 'Coffee',
    hoursFromNow: 12,
    hostName: name,
  })
  const openB = await seedDemoPlan(hostId, {
    title: 'Sunset hike',
    activity: 'Hike',
    hoursFromNow: 48,
    hostName: name,
  })

  const pastId = `demo_past_${Date.now()}`
  const now = Date.now()
  const pastStarts = now - 3 * 24 * 60 * 60 * 1000
  const past = await createPlan(pastId, {
    hostId,
    hostName: name,
    title: 'Board game night',
    activity: 'Games',
    details: 'Seeded past plan',
    locationLabel: 'Community center',
    startsAt: pastStarts,
    planType: 'casual',
    spotsTotal: 4,
    spotsTaken: opts?.guestUid ? 2 : 1,
    status: 'past',
    category: 'Games',
    createdAt: pastStarts - 86400000,
    updatedAt: now,
  })
  await upsertMember(pastId, hostId, {
    role: 'host',
    displayName: name,
    createdAt: pastStarts,
    updatedAt: now,
  })

  if (opts?.guestUid) {
    await upsertMember(openA.id, opts.guestUid, {
      role: 'going',
      displayName: 'Guest',
      createdAt: now,
      updatedAt: now,
    })
    await updatePlan(openA.id, { spotsTaken: 2 })
    await upsertMember(pastId, opts.guestUid, {
      role: 'going',
      displayName: 'Guest',
      createdAt: pastStarts,
      updatedAt: now,
    })
    await ensureThreadForPlan(openA.id)
    await createNotification(`n_seed_join_${openA.id}_${opts.guestUid}`, {
      userId: hostId,
      type: 'joined',
      title: 'Someone joined',
      body: 'Guest is going to Coffee meetup',
      actorId: opts.guestUid,
      actorName: 'Guest',
      planId: openA.id,
      actionState: 'joined',
      read: false,
      createdAt: now,
    })
  }

  return { open: [openA, openB], past }
}
