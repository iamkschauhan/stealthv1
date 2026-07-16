import {
  deleteNotification,
  listNotifications,
  markNotificationRead,
  updateNotificationAction,
} from '../data/notifications'
import {
  acceptJoinRequest,
  denyJoinRequest,
} from '../data/planActions'
import { getPlan } from '../data/plans'
import { getMember, removeMember } from '../data/joins'
import { createNotification } from '../data/notifications'
import { joinPlanAsUser } from '../feed/feedActions'
import {
  ensureThreadForPlan,
  getThread,
  hideThreadForUser,
  listMessages,
  listThreadsForUser,
  markThreadReadForUser,
  sendMessage,
} from '../data/threads'
import { uploadChatPhoto } from '../data/storage'
import type { AppNotification } from '../data/types'
import type { ChatMessage as UiMessage, Thread as UiThread } from './data'
import { formatMessageTime, formatThreadTime, mapAppNotification } from './mapNotify'

const AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'

export async function loadInbox(uid: string) {
  const rows = await listNotifications(uid)
  return {
    raw: rows,
    items: rows.map(mapAppNotification),
  }
}

export async function loadThreadList(uid: string): Promise<UiThread[]> {
  const threads = await listThreadsForUser(uid)
  return threads.map((t) => ({
    id: t.id,
    title: t.title || 'Plan chat',
    avatar: t.avatarUrl || AVATAR,
    lastSender: t.lastSenderId === uid ? 'You' : 'Someone',
    time: formatThreadTime(t.updatedAt),
    preview: t.lastMessage || '',
    unread: t.unreadBy?.[uid] || 0,
    planLabel: t.title,
    planId: t.planId,
    messages: [],
  }))
}

export async function loadThreadMessages(
  threadId: string,
  myUid: string,
): Promise<UiMessage[]> {
  const msgs = await listMessages(threadId)
  return msgs.map((m) => ({
    id: m.id,
    senderId: m.senderId === myUid ? 'me' : m.senderId,
    text: m.text,
    time: formatMessageTime(m.createdAt),
    images: m.photoUrl ? [m.photoUrl] : undefined,
  }))
}

export async function handleNotifAction(opts: {
  notif: AppNotification
  label: string
  uid: string
  displayName?: string
  avatarUrl?: string
}): Promise<void> {
  const { notif, label, uid } = opts
  const planId = notif.planId
  const actorId = notif.actorId

  if (notif.type === 'join_request' && planId && actorId) {
    if (label === 'Accept') {
      await acceptJoinRequest(planId, actorId, uid)
      await ensureThreadForPlan(planId)
      await updateNotificationAction(notif.id, 'accepted')
      return
    }
    if (label === 'Deny') {
      await denyJoinRequest(planId, actorId, uid)
      await updateNotificationAction(notif.id, 'denied')
      return
    }
  }

  if (notif.type === 'invite' && planId) {
    if (label === 'Join') {
      await joinPlanAsUser({
        planId,
        uid,
        displayName: opts.displayName,
        avatarUrl: opts.avatarUrl,
      })
      await ensureThreadForPlan(planId)
      await updateNotificationAction(notif.id, 'joined')
      return
    }
    if (label === 'Deny') {
      await removeMember(planId, uid)
      await updateNotificationAction(notif.id, 'denied')
      return
    }
  }

  if (notif.type === 'friend_request') {
    await updateNotificationAction(
      notif.id,
      label === 'Accept' ? 'accepted' : 'denied',
    )
    return
  }

  await markNotificationRead(notif.id)
}

export async function removeInboxItem(id: string) {
  await deleteNotification(id)
}

export async function hideChat(threadId: string, uid: string) {
  await hideThreadForUser(threadId, uid)
}

export async function markChatRead(threadId: string, uid: string) {
  await markThreadReadForUser(threadId, uid)
}

export async function postChatMessage(opts: {
  threadId: string
  uid: string
  text?: string
  imageBlobs?: Blob[]
}): Promise<void> {
  let thread = await getThread(opts.threadId)
  if (!thread) {
    await ensureThreadForPlan(opts.threadId)
    thread = await getThread(opts.threadId)
  }
  if (!thread) throw new Error('Chat not available yet')
  if (!thread.memberIds.includes(opts.uid)) {
    throw new Error('You are not a member of this chat')
  }

  const now = Date.now()
  if (opts.imageBlobs?.length) {
    for (let i = 0; i < opts.imageBlobs.length; i++) {
      const blob = opts.imageBlobs[i]
      const url = await uploadChatPhoto(
        opts.threadId,
        opts.uid,
        `${opts.uid}_${now}_${i}`,
        blob,
      )
      await sendMessage(opts.threadId, {
        senderId: opts.uid,
        text: i === 0 ? opts.text : undefined,
        photoUrl: url,
        createdAt: now + i,
      })
    }
    return
  }

  if (opts.text?.trim()) {
    await sendMessage(opts.threadId, {
      senderId: opts.uid,
      text: opts.text.trim(),
      createdAt: now,
    })
  }
}

export async function notifyInvite(opts: {
  inviteeUid: string
  hostId: string
  hostName?: string
  hostAvatar?: string
  planId: string
  planTitle: string
}): Promise<void> {
  if (
    opts.inviteeUid.startsWith('invite_') ||
    opts.inviteeUid.startsWith('reserved_')
  ) {
    return
  }
  const now = Date.now()
  await createNotification(`n_invite_${opts.planId}_${opts.inviteeUid}`, {
    userId: opts.inviteeUid,
    type: 'invite',
    title: 'Plan invite',
    body: `${opts.hostName || 'Someone'} invited you to ${opts.planTitle}`,
    actorId: opts.hostId,
    actorName: opts.hostName,
    actorAvatarUrl: opts.hostAvatar,
    planId: opts.planId,
    actionState: 'pending',
    read: false,
    createdAt: now,
  })
}

export async function resolvePlanPath(planId: string, uid: string): Promise<string> {
  const plan = await getPlan(planId)
  if (!plan) return '/plans'
  if (plan.hostId === uid) return `/create/plan/${planId}`
  const member = await getMember(planId, uid)
  if (member?.role === 'going' || member?.role === 'host') {
    return `/plans/upcoming/${planId}`
  }
  return `/plans/watching/${planId}`
}

export { ensureThreadForPlan }
