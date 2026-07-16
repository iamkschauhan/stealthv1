/** Share copy from `sharemessage/` flow diagrams. */

export type ShareKind =
  | 'found'
  | 'hosting'
  | 'inviteReserved'
  | 'hostedPast'
  | 'going'
  | 'went'
  | 'profile'
  | 'appInvite'

export type ShareCopy = {
  /** Prefill body for SMS / email / native share / clipboard */
  message: string
  /** Modal headline shown above social icons */
  title: string
}

export const SHARE_COPY: Record<ShareKind, ShareCopy> = {
  found: {
    message: 'Check out this awesome plan I found on StealthApp!',
    title: "Share this plan and let others know what you're up to!",
  },
  hosting: {
    message: "Check out this awesome plan I'm hosting on StealthApp!",
    title: "Share this plan with your friends and let them know what you're up to!",
  },
  inviteReserved: {
    message:
      "Hey! I've reserved a spot for you in my plan on StealthApp. Grab it within the hour to join!",
    title: 'Link created',
  },
  hostedPast: {
    message: 'Check out this awesome plan I hosted on StealthApp!',
    title: "Share this plan for others to see what you've done!",
  },
  going: {
    message: "Check out this awesome plan I'm going to on StealthApp!",
    title: 'Share this plan with your friends and invite them to join you!',
  },
  went: {
    message: 'Check out this awesome plan I went to on StealthApp!',
    title: 'Share as a link via other apps or with your friends on StealthApp.',
  },
  profile: {
    message: "Check out what I've been up to on StealthApp!",
    title: 'Your profile link is ready to share with your friends!',
  },
  appInvite: {
    message: 'Come join me and start making plans on StealthApp!',
    title: 'Invite friends to StealthApp',
  },
}

export const APP_INVITE_URL = 'https://stealthapp.app/invite/UI8799vvA'
export const PROFILE_SHARE_URL = 'https://stealthapp.app/u/me'

export function planShareUrl(id: string): string {
  return `https://stealthapp.app/g/${id}`
}

export function sharePayload(kind: ShareKind, url: string): string {
  return `${SHARE_COPY[kind].message}\n${url}`
}

export async function copyShare(kind: ShareKind, url: string): Promise<void> {
  await navigator.clipboard.writeText(sharePayload(kind, url))
}

export function smsHref(kind: ShareKind, url: string): string {
  return `sms:?&body=${encodeURIComponent(sharePayload(kind, url))}`
}

export function mailtoHref(kind: ShareKind, url: string): string {
  const subject = encodeURIComponent('Join me on StealthApp')
  const body = encodeURIComponent(sharePayload(kind, url))
  return `mailto:?subject=${subject}&body=${body}`
}

export async function nativeShare(kind: ShareKind, url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false
  try {
    await navigator.share({
      title: 'StealthApp',
      text: SHARE_COPY[kind].message,
      url,
    })
    return true
  } catch {
    return false
  }
}
