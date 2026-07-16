/** Shared Firestore / domain types for StealthApp v1. */

export type PlanStatus =
  | 'draft'
  | 'open'
  | 'full'
  | 'confirmed'
  | 'past'
  | 'cancelled'

export type PlanType = 'friendship' | 'dating' | 'casual'

export type MemberRole =
  | 'host'
  | 'going'
  | 'invited'
  | 'waiting'
  | 'requested'

export type OnboardingStepKey = string

export type UserProfile = {
  uid: string
  phone?: string
  displayName?: string
  birthday?: string
  identity?: string
  pronouns?: string | string[]
  lookingFor?: string[]
  bio?: string
  hometown?: string
  company?: string
  ethnicity?: string
  location?: {
    label?: string
    lat?: number
    lng?: number
  }
  interests?: string[]
  lifestyle?: Record<string, string | string[]>
  avatarUrl?: string
  photoUrls?: string[]
  job?: string
  friends?: { uid: string; name: string; avatarUrl?: string; username?: string }[]
  verified?: boolean
  identityVerified?: boolean
  coupleLinkedUid?: string | null
  onboardingComplete: boolean
  onboardingStep?: OnboardingStepKey
  notificationPrefs?: NotificationPrefs
  planTypePrefs?: PlanType[]
  theme?: 'light' | 'dark' | 'system'
  privateMode?: boolean
  showAge?: boolean
  /** Local draft snapshot for resume mid-flow. */
  onboardingDraft?: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

export type NotificationPrefs = {
  joining?: { push?: boolean; email?: boolean }
  hosting?: { push?: boolean; email?: boolean }
  photos?: { push?: boolean; email?: boolean }
  friends?: { push?: boolean; email?: boolean }
  stealth?: { push?: boolean; email?: boolean }
}

export type UserPhoto = {
  id: string
  url: string
  order: number
  createdAt: number
}

export type Plan = {
  id: string
  hostId: string
  hostName?: string
  hostAvatarUrl?: string
  title: string
  activity: string
  activitySub?: string
  details?: string
  locationLabel: string
  locationLat?: number
  locationLng?: number
  startsAt: number
  endsAt?: number
  startDateLabel?: string
  startTimeLabel?: string
  joinUntilAt?: number
  joinUntilDateLabel?: string
  joinUntilTimeLabel?: string
  planType: PlanType
  spotsTotal: number
  spotsTaken: number
  status: PlanStatus
  coverUrl?: string
  category?: string
  couplesOnly?: boolean
  audience?: 'Individuals' | 'Couples'
  allowLocationEdit?: boolean
  allowTimeEdit?: boolean
  allowSpotsEdit?: boolean
  lastMinute?: boolean
  inviteToken?: string
  pastPhotoUrls?: string[]
  pastCaption?: string
  createdAt: number
  updatedAt: number
}

export type PlanMember = {
  uid: string
  userId?: string
  role: MemberRole
  displayName?: string
  avatarUrl?: string
  /** Join / edit request metadata for host inbox */
  requestKind?: 'join' | 'location' | 'time' | 'spots'
  requestDetail?: string
  expiresAt?: number
  reserved?: boolean
  createdAt: number
  updatedAt: number
}

export type PlanRating = {
  uid: string
  score: number
  feedback?: string
  traits?: string[]
  noShow?: boolean
  createdAt: number
}

export type Watch = {
  id: string
  userId: string
  planId: string
  createdAt: number
}

export type Report = {
  id: string
  reporterId: string
  targetType: 'plan' | 'account'
  targetId: string
  reason?: string
  details?: string
  photoUrl?: string
  createdAt: number
}

export type EditRequest = {
  id: string
  planId: string
  hostId: string
  requesterId: string
  field?: string
  note?: string
  status: 'pending' | 'accepted' | 'denied'
  createdAt: number
  updatedAt: number
}

export type AppNotification = {
  id: string
  userId: string
  type: string
  title?: string
  body?: string
  actorId?: string
  actorName?: string
  actorAvatarUrl?: string
  planId?: string
  threadId?: string
  actionState?: 'pending' | 'accepted' | 'denied' | 'joined' | 'none'
  read: boolean
  createdAt: number
}

export type Thread = {
  id: string
  planId: string
  memberIds: string[]
  title?: string
  avatarUrl?: string
  lastMessage?: string
  lastSenderId?: string
  /** Per-user unread counts */
  unreadBy?: Record<string, number>
  /** Soft-delete / hide for these users */
  hiddenFor?: string[]
  updatedAt: number
  createdAt: number
}

export type ChatMessage = {
  id: string
  senderId: string
  text?: string
  photoUrl?: string
  createdAt: number
}

export type SupportTicket = {
  id: string
  userId: string
  kind: 'contact' | 'report_problem'
  subject?: string
  body: string
  createdAt: number
}
