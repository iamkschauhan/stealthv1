export type PlanType = 'Friendship' | 'Dating' | 'Something casual'
export type Audience = 'Individuals' | 'Couples'

export type CreatePlanDraft = {
  host: string
  hostAvatar: string
  activity: string
  activitySub: string
  location: string
  allowLocationEdit: boolean
  startDate: string
  startTime: string
  allowTimeEdit: boolean
  joinUntilDate: string
  joinUntilTime: string
  spots: string
  audience: Audience | ''
  allowSpotsEdit: boolean
  planType: PlanType | ''
  details: string
}

export const DEFAULT_DRAFT: CreatePlanDraft = {
  host: 'Nick',
  hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  activity: '',
  activitySub: '',
  location: '',
  allowLocationEdit: true,
  startDate: '',
  startTime: '',
  allowTimeEdit: false,
  joinUntilDate: '',
  joinUntilTime: '',
  spots: '',
  audience: '',
  allowSpotsEdit: true,
  planType: '',
  details: '',
}

export const FILLED_DRAFT: CreatePlanDraft = {
  ...DEFAULT_DRAFT,
  activity: 'Golf',
  location: 'Laurel Lanes Country Club',
  startDate: 'Dec 19',
  startTime: '7:00 AM',
  joinUntilDate: 'Dec 12',
  joinUntilTime: '3:00 PM',
  spots: '10',
  audience: 'Individuals',
  planType: 'Dating',
  details: "Let's meet on the putting green 30 mins before!",
}

export const ACTIVITY_BANNERS: Record<string, string> = {
  Golf: 'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=800&h=400&fit=crop',
  Concert: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
  Tennis: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=400&fit=crop',
  'Mexican food': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
}

export const ACTIVITY_CATEGORIES = [
  {
    id: 'creative',
    label: 'Creative',
    items: ['Painting', 'Photography', 'Writing workshop'],
  },
  {
    id: 'events',
    label: 'Events & Outings',
    items: ['Concert', 'Museum', 'Boat show'],
  },
  {
    id: 'food',
    label: 'Food & Drinks',
    items: ['Mexican food', 'Italian food', 'Coffee'],
  },
  {
    id: 'games',
    label: 'Games',
    items: ['Board games', 'Video games', 'Trivia night'],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle & Enrichment',
    items: ['Book club', 'Language exchange', 'Meditation'],
  },
  {
    id: 'sports',
    label: 'Sports & Outdoors',
    items: ['Golf', 'Tennis', 'Hiking', 'Flag football'],
  },
  {
    id: 'travel',
    label: 'Travel & Seasonal',
    items: ['Road trip', 'Skiing', 'Beach day'],
  },
] as const

export const LOCATION_SUGGESTIONS = [
  'Laurel Lanes Country Club',
  'TD Garden',
  'Plaza Azteca',
  'Central Park',
  'Brooklyn Bridge Park',
]

export const SPOT_OPTIONS = ['2', '3', '4', '5', '6', '8', '10', '12']
export const TIME_OPTIONS = [
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '11:30 AM',
  '12:00 PM',
  '2:15 PM',
  '3:00 PM',
  '5:00 PM',
  '7:00 PM',
  '11:00 PM',
]

export type Person = {
  name: string
  avatar: string
  role?: string
  expires?: string
  reserved?: boolean
}

export type PlanRequest = {
  id: string
  name: string
  avatar: string
  kind: 'join' | 'location' | 'time' | 'spots'
  detail: string
  time: string
}

export const GOING: Person[] = [
  { name: 'Nick', role: 'Host', avatar: DEFAULT_DRAFT.hostAvatar },
  {
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
  {
    name: 'Mary',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
  },
  {
    name: 'Natali',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
  },
]

export const INVITED: Person[] = [
  {
    name: 'Jessica',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
    expires: 'Expires in 27 mins',
  },
  {
    name: 'John',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    expires: 'Expires in 27 mins',
  },
  { name: 'Reserved', avatar: '', expires: 'Expires in 27 mins', reserved: true },
]

export const FRIENDS: Person[] = [
  {
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
  {
    name: 'John',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
  },
  {
    name: 'Mike',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
  },
  {
    name: 'Jamie',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
  },
  {
    name: 'Zack',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop',
  },
]

export const PLAN_REQUESTS: PlanRequest[] = [
  {
    id: 'r1',
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    kind: 'join',
    detail: 'would like to join your plan',
    time: '1h',
  },
  {
    id: 'r2',
    name: 'Alessandro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    kind: 'location',
    detail: 'Location change: Laurel Lanes Country Club',
    time: '1h',
  },
  {
    id: 'r3',
    name: 'Travis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    kind: 'time',
    detail: 'Time change: 8:00 AM',
    time: '2h',
  },
  {
    id: 'r4',
    name: 'Mike',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    kind: 'spots',
    detail: 'Available spots change: 8',
    time: '3h',
  },
]

export const INVITE_LINK = 'http://stealthapp.app/g/1iDea9X9l/2Zlz6Kry'

export function draftReady(d: CreatePlanDraft) {
  return !!(
    d.activity &&
    d.location &&
    d.startDate &&
    d.startTime &&
    d.joinUntilDate &&
    d.joinUntilTime &&
    d.spots &&
    d.audience &&
    d.planType
  )
}
