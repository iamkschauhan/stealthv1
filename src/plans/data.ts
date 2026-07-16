export type PlansTab = 'Watching' | 'Requested' | 'Upcoming' | 'Past'

export type PlanCard = {
  id: string
  title: string
  date: string
  time: string
  location: string
  host: string
  hostAvatar: string
  image: string
  badge: string
  planType?: 'Friendship' | 'Dating' | 'Something casual'
  spots?: string
  details?: string
  hostedByMe?: boolean
  joinUntil?: string
  closesHours?: number
  startsHours?: number
  confirmed?: boolean
  closesOn?: string
  coHost?: string
  coHostAvatar?: string
  artist?: string
  full?: boolean
  couples?: boolean
  invitePending?: boolean
}

export const PAST_SORT_OPTIONS = [
  'Most recently added',
  'Name of activity',
  'Plans I hosted',
] as const

export const REQUESTED_SORT_OPTIONS = [
  'Closing time',
  'Most recently added',
  'Name of activity',
] as const

export const UPCOMING_SORT_OPTIONS = [
  'Starting time',
  "Plans I'm hosting",
  'Most recently added',
  'Name of activity',
] as const

export const DEFAULT_SORT_OPTIONS = [
  'Most recently added',
  'Name of activity',
] as const

export type SortOption =
  | (typeof PAST_SORT_OPTIONS)[number]
  | (typeof REQUESTED_SORT_OPTIONS)[number]
  | (typeof UPCOMING_SORT_OPTIONS)[number]

/** @deprecated use sortOptionsForTab */
export const SORT_OPTIONS = PAST_SORT_OPTIONS

export function sortOptionsForTab(tab: PlansTab): readonly SortOption[] {
  if (tab === 'Past') return PAST_SORT_OPTIONS
  if (tab === 'Requested' || tab === 'Watching') return REQUESTED_SORT_OPTIONS
  if (tab === 'Upcoming') return UPCOMING_SORT_OPTIONS
  return DEFAULT_SORT_OPTIONS
}

export const PAST_PLANS: PlanCard[] = [
  {
    id: 'past-golf',
    title: 'Golf',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop',
    badge: 'Ended',
    planType: 'Friendship',
    spots: '3/4 spots filled',
    details: "Let's meet on the putting green 30 mins before!",
  },
  {
    id: 'past-photo',
    title: 'Photography',
    date: 'Sat, Dec 19',
    time: '7:00 PM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
    badge: 'Ended',
    planType: 'Friendship',
    spots: '4/5 spots filled',
    details: 'Bring your camera and meet by the fountain.',
    hostedByMe: true,
  },
]

export const UPCOMING_PLANS: PlanCard[] = [
  {
    id: 'up-golf',
    title: 'Golf',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop',
    badge: 'Starts — in 21 hours',
    planType: 'Friendship',
    spots: '3/4 spots filled',
    details:
      "Let's meet on the putting green 30 mins before! Everybody take yellow umbrellas.",
    closesOn: 'Dec 12 at 3:00 PM',
    startsHours: 21,
    confirmed: true,
  },
  {
    id: 'up-photo',
    title: 'Photography',
    date: 'Sat, Dec 19',
    time: '7:00 PM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
    badge: 'Starts — in 2 days',
    planType: 'Friendship',
    spots: '4/5 spots filled',
    details: 'Bring your camera and meet by the fountain.',
    closesOn: 'Dec 14 at 5:00 PM',
    startsHours: 48,
    confirmed: false,
  },
]

export const REQUESTED_PLANS: PlanCard[] = [
  {
    id: 'req-golf',
    title: 'Golf',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop',
    badge: 'Closes — in 21 hours',
    planType: 'Friendship',
    spots: '3/4 spots filled',
    details:
      "Let's meet on the putting green 30 mins before! Everybody take yellow umbrellas.",
    joinUntil: 'Dec 12 at 3:00 PM',
    closesHours: 21,
  },
  {
    id: 'req-photo',
    title: 'Photography',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
    badge: 'Closes — in 2 days',
    planType: 'Friendship',
    spots: '2/5 spots filled',
    details: 'Bring your camera and meet by the fountain.',
    joinUntil: 'Dec 14 at 5:00 PM',
    closesHours: 48,
  },
]

export const GOING_PEOPLE = [
  {
    name: 'Nick',
    role: 'Host',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  },
  {
    name: 'Sarah',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
]

export const UPCOMING_GOING = [
  {
    name: 'Nick',
    role: 'Host',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  },
  {
    name: 'Mike',
    role: 'You',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
  },
  {
    name: 'Sarah',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
]

export const WATCHING_PLANS: PlanCard[] = [
  {
    id: 'watch-golf',
    title: 'Golf',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop',
    badge: 'Closes — in 21 hours',
    planType: 'Friendship',
    spots: '3/4 spots filled',
    details:
      "Let's meet on the putting green 30 mins before! Everybody take yellow umbrellas.",
    joinUntil: 'Dec 12 at 3:00 PM',
    closesHours: 21,
  },
  {
    id: 'watch-photo',
    title: 'Photography',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    coHost: 'Adi',
    coHostAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
    badge: 'Closes — in 2 days',
    planType: 'Friendship',
    spots: '4/4 spots filled',
    details: 'Bring your camera and meet by the fountain.',
    joinUntil: 'Dec 14 at 5:00 PM',
    closesHours: 48,
    full: true,
  },
  {
    id: 'watch-concert',
    title: 'Concert',
    date: 'Sat, Dec 19',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    host: 'Nick',
    hostAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    coHost: 'Adi',
    coHostAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
    badge: 'Closes — in 3 days',
    planType: 'Friendship',
    spots: '3/4 spots filled',
    details: "Let's meet near the main entrance 30 mins before.",
    joinUntil: 'Dec 12 at 3:00 PM',
    closesHours: 72,
    artist: 'Taylor Swift',
    couples: true,
  },
]

export const WATCHING_GOING = [
  {
    names: 'Nick & Adi',
    role: 'Hosts',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    ],
  },
  {
    names: 'Sarah & Kyle',
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    ],
  },
  {
    names: 'Mary & Anthony',
    avatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    ],
  },
]

export const SUGGESTED = [
  {
    id: 'sug-concert',
    title: 'Concert',
    date: 'Sat, Dec 26',
    time: '8:00 PM',
    location: 'TD Garden',
    host: 'Lana',
    hostAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
  },
  {
    id: 'sug-concert-2',
    title: 'Concert',
    date: 'Sun, Dec 27',
    time: '7:00 PM',
    location: 'House of Blues',
    host: 'Mike',
    hostAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
  },
]

export const PAST_PARTICIPANTS = [
  {
    name: 'Nick',
    role: 'Host',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  },
  {
    name: 'Mike',
    role: 'You',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
  },
  {
    name: 'Sarah',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
  {
    name: 'John',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
  },
]

export const RATE_PEOPLE = [
  {
    name: 'Nick',
    role: 'Host',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  },
  {
    name: 'Jassica',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
  {
    name: 'John',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
  },
  {
    name: 'Sarah',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
  },
  {
    name: 'Natali',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
  },
]

export const TAG_FRIENDS = [
  {
    name: 'Mike',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
  },
  {
    name: 'Sarah',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
  {
    name: 'John',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
  },
  {
    name: 'Natali',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
  },
]

export const UPLOAD_PHOTOS = [
  'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
]

export const PICKER_PHOTOS = [
  'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop',
]

export function findPlan(id: string): PlanCard | undefined {
  return (
    PAST_PLANS.find((p) => p.id === id) ??
    UPCOMING_PLANS.find((p) => p.id === id) ??
    REQUESTED_PLANS.find((p) => p.id === id) ??
    WATCHING_PLANS.find((p) => p.id === id)
  )
}

export function findPastPlan(id: string): PlanCard | undefined {
  return findPlan(id)
}

export function findRequestedPlan(id: string): PlanCard | undefined {
  return REQUESTED_PLANS.find((p) => p.id === id)
}

export function findUpcomingPlan(id: string): PlanCard | undefined {
  return UPCOMING_PLANS.find((p) => p.id === id)
}

export function findWatchingPlan(id: string): PlanCard | undefined {
  return WATCHING_PLANS.find((p) => p.id === id)
}

export const EMPTY_COPY: Record<PlansTab, string> = {
  Watching: "Plans you're watching will appear here.",
  Requested: "Plans you've requested to join will appear here.",
  Upcoming: "Plans you're going to will appear here.",
  Past: "Plans that you've attended will appear here.",
}

export function plansForTab(tab: PlansTab): PlanCard[] {
  if (tab === 'Past') return PAST_PLANS
  if (tab === 'Upcoming') return UPCOMING_PLANS
  if (tab === 'Requested') return REQUESTED_PLANS
  return WATCHING_PLANS
}

export function defaultSort(tab: PlansTab): SortOption {
  if (tab === 'Requested' || tab === 'Watching') return 'Closing time'
  if (tab === 'Upcoming') return 'Starting time'
  return 'Most recently added'
}

export function planDetailPath(tab: PlansTab, id: string): string {
  if (tab === 'Past') return `/plans/past/${id}`
  if (tab === 'Requested') return `/plans/requested/${id}`
  if (tab === 'Upcoming') return `/plans/upcoming/${id}`
  return `/plans/watching/${id}`
}

export const TAB_TIPS: Record<PlansTab, string> = {
  Watching: "Plans you're watching — join when a spot opens.",
  Requested: "Pending join requests — cancel anytime, chat unlocks when accepted.",
  Upcoming: "Plans you're going to — manage and chat before they start.",
  Past: "Past plans you've attended — upload photos, rate the plan, and revisit chats.",
}
