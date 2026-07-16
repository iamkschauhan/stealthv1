import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { getDb } from '../firebase'
import { getPlan, listHostedPlans, updatePlan } from '../data/plans'
import {
  clearWatch,
  getMember,
  listMembers,
  removeMember,
} from '../data/joins'
import { joinPlanAsUser, listHiddenPlanIds, submitEditRequest } from '../feed/feedActions'
import { uploadImage } from '../data/storage'
import type { Plan, PlanMember, PlanRating } from '../data/types'
import type { PlanCard, PlansTab } from './data'
import { isPlanPast, isPlanUpcoming, planToCard } from './mapPlan'

export type MyPlansBundle = {
  watching: PlanCard[]
  requested: PlanCard[]
  upcoming: PlanCard[]
  past: PlanCard[]
  plansById: Record<string, Plan>
}

async function fetchWatchedPlans(uid: string): Promise<Plan[]> {
  const snap = await getDocs(
    query(collection(getDb(), 'watches'), where('userId', '==', uid), limit(50)),
  )
  const plans: Plan[] = []
  for (const d of snap.docs) {
    const planId = (d.data() as { planId: string }).planId
    const plan = await getPlan(planId)
    if (plan && !isPlanPast(plan) && plan.status !== 'cancelled') plans.push(plan)
  }
  return plans
}

async function fetchMemberships(uid: string): Promise<{ planId: string; member: PlanMember }[]> {
  try {
    const snap = await getDocs(
      query(collectionGroup(getDb(), 'members'), where('userId', '==', uid), limit(80)),
    )
    return snap.docs.map((d) => {
      const planId = d.ref.parent.parent?.id || ''
      return {
        planId,
        member: { uid: d.id, ...(d.data() as Omit<PlanMember, 'uid'>) },
      }
    }).filter((x) => x.planId)
  } catch (err) {
    console.warn('members collectionGroup query failed; falling back', err)
    return []
  }
}

export async function loadMyPlans(uid: string): Promise<MyPlansBundle> {
  const plansById: Record<string, Plan> = {}
  const watching: PlanCard[] = []
  const requested: PlanCard[] = []
  const upcoming: PlanCard[] = []
  const past: PlanCard[] = []

  const [watched, hosted, memberships, hidden] = await Promise.all([
    fetchWatchedPlans(uid),
    listHostedPlans(uid),
    fetchMemberships(uid),
    listHiddenPlanIds(uid),
  ])

  const memberByPlan = new Map(memberships.map((m) => [m.planId, m.member]))

  for (const p of hosted) {
    plansById[p.id] = p
  }

  for (const p of watched) {
    const mem = memberByPlan.get(p.id)
    if (
      mem &&
      (mem.role === 'going' ||
        mem.role === 'host' ||
        mem.role === 'requested' ||
        mem.role === 'waiting')
    ) {
      continue
    }
    plansById[p.id] = p
    const joinUntil = p.joinUntilAt ?? p.startsAt
    const h = Math.max(0, Math.round((joinUntil - Date.now()) / 3600000))
    watching.push(
      planToCard(p, {
        badge: `Closes — in ${h} hours`,
        hostedByMe: p.hostId === uid,
        full: p.status === 'full',
      }),
    )
  }

  for (const { planId, member } of memberships) {
    let plan = plansById[planId]
    if (!plan) {
      const loaded = await getPlan(planId)
      if (!loaded) continue
      plan = loaded
      plansById[planId] = plan
    }

    if (member.role === 'requested' || member.role === 'waiting') {
      if (isPlanUpcoming(plan)) {
        const joinUntil = plan.joinUntilAt ?? plan.startsAt
        const h = Math.max(0, Math.round((joinUntil - Date.now()) / 3600000))
        requested.push(
          planToCard(plan, {
            badge: `Closes — in ${h} hours`,
            full: plan.status === 'full',
          }),
        )
      }
    }

    if (member.role === 'going' || member.role === 'host') {
      if (isPlanPast(plan)) {
        if (!hidden.has(planId)) {
          past.push(
            planToCard(plan, {
              badge: 'Ended',
              hostedByMe: plan.hostId === uid,
            }),
          )
        }
      } else if (isPlanUpcoming(plan)) {
        const h = Math.max(0, Math.round((plan.startsAt - Date.now()) / 3600000))
        upcoming.push(
          planToCard(plan, {
            badge: `Starts — in ${h} hours`,
            hostedByMe: plan.hostId === uid,
            confirmed: plan.status === 'confirmed',
          }),
        )
      }
    }
  }

  // Hosted upcoming/past not already covered via membership (host member may exist)
  for (const p of hosted) {
    const inUpcoming = upcoming.some((c) => c.id === p.id)
    const inPast = past.some((c) => c.id === p.id)
    if (isPlanPast(p) && !inPast && !hidden.has(p.id)) {
      past.push(planToCard(p, { badge: 'Ended', hostedByMe: true }))
    } else if (isPlanUpcoming(p) && !inUpcoming) {
      const h = Math.max(0, Math.round((p.startsAt - Date.now()) / 3600000))
      upcoming.push(
        planToCard(p, {
          badge: `Starts — in ${h} hours`,
          hostedByMe: true,
          confirmed: p.status === 'confirmed',
        }),
      )
    }
  }

  const dedupe = (list: PlanCard[]) => {
    const seen = new Set<string>()
    return list.filter((c) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })
  }

  return {
    watching: dedupe(watching),
    requested: dedupe(requested),
    upcoming: dedupe(upcoming),
    past: dedupe(past),
    plansById,
  }
}

export function cardsForTab(bundle: MyPlansBundle, tab: PlansTab): PlanCard[] {
  if (tab === 'Watching') return bundle.watching
  if (tab === 'Requested') return bundle.requested
  if (tab === 'Upcoming') return bundle.upcoming
  return bundle.past
}

export async function stopWatching(uid: string, planId: string): Promise<void> {
  await clearWatch(uid, planId)
}

export async function cancelMembership(uid: string, planId: string): Promise<void> {
  const plan = await getPlan(planId)
  const member = await getMember(planId, uid)
  await removeMember(planId, uid)
  if (plan && member?.role === 'going') {
    await updatePlan(planId, {
      spotsTaken: Math.max(1, (plan.spotsTaken || 1) - 1),
      status: plan.status === 'full' ? 'open' : plan.status,
    })
  }
}

export async function joinFromWatching(opts: {
  planId: string
  uid: string
  displayName?: string
  avatarUrl?: string
}) {
  const state = await joinPlanAsUser(opts)
  await clearWatch(opts.uid, opts.planId)
  return state
}

export async function requestEditFromPlans(opts: {
  planId: string
  hostId: string
  requesterId: string
  field: string
  note?: string
}) {
  await submitEditRequest(opts)
}

export async function hidePastPlan(uid: string, planId: string): Promise<void> {
  await setDoc(doc(getDb(), 'feedHidden', uid, 'plans', planId), {
    planId,
    createdAt: Date.now(),
    source: 'my_plans',
  })
}

export async function submitPlanRating(
  planId: string,
  uid: string,
  data: Omit<PlanRating, 'uid' | 'createdAt'> & { didNotAttend?: boolean },
): Promise<void> {
  const now = Date.now()
  await setDoc(doc(getDb(), 'plans', planId, 'ratings', uid), {
    uid,
    score: data.score,
    feedback: data.feedback,
    traits: data.traits,
    noShow: data.noShow,
    didNotAttend: data.didNotAttend,
    createdAt: now,
  })
}

export async function uploadPastPlanPhotos(opts: {
  planId: string
  hostId: string
  uid: string
  files: Blob[]
  caption?: string
  shareToFeed?: boolean
}): Promise<string[]> {
  const urls: string[] = []
  for (let i = 0; i < opts.files.length; i++) {
    const file = opts.files[i]
    const path = `plans/${opts.planId}/past/${opts.uid}_${Date.now()}_${i}`
    const url = await uploadImage(path, file, {
      contentType: (file as File).type || 'image/jpeg',
      customMetadata: { hostId: opts.hostId, uploaderId: opts.uid },
    })
    urls.push(url)
  }
  const plan = await getPlan(opts.planId)
  const existing = plan?.pastPhotoUrls || []
  await updatePlan(opts.planId, {
    pastPhotoUrls: [...existing, ...urls],
    pastCaption: opts.caption,
  })
  return urls
}

export async function loadGoingPeople(planId: string) {
  const members = await listMembers(planId)
  return members
    .filter((m) => m.role === 'host' || m.role === 'going')
    .map((m) => ({
      name: m.displayName || (m.role === 'host' ? 'Host' : 'Guest'),
      avatar: m.avatarUrl || '',
      role: m.role === 'host' ? 'Host' : undefined,
      uid: m.uid,
    }))
}
