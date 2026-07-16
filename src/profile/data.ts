/**
 * Profile module — 167 Profile/*.png mocks → unique interactive surfaces.
 * Variants = fill / empty / modal states of the same route.
 */
export type ProfileRouteId =
  | 'me'
  | 'settings'
  | 'photo-viewer'
  | 'change-photo'
  | 'verify-identity'
  | 'edit-hometown'
  | 'edit-company'
  | 'edit-ethnicity'
  | 'report-account'
  | 'report-post'
  | 'connections'

export const PROFILE_TABS = ['Photos', 'About', 'Activities', 'Friends'] as const
export type ProfileTab = (typeof PROFILE_TABS)[number]

export type ProfileUser = {
  name: string
  age: number
  username: string
  verified: boolean
  identityVerified: boolean
  avatar: string
  photos: string[]
  badges: { id: string; label: string; count: string; icon: 'respect' | 'safe' | 'genuine' | 'reliable' }[]
  hometown: string
  company: string
  job: string
  vaccination: string
  relationship: string
  gender: string
  sexuality: string
  pronoun: string
  children: string
  education: string
  school: string
  exercise: string
  ethnicity: string
  religion: string
  political: string
  habits: { label: string; value: string }[]
  height: string
  interests: { category: string; tags: string[] }[]
  important: { prompt: string; answer: string }[]
  activities: { title: string; plans: number }[]
  friends: { id: string; name: string; avatar: string; username: string }[]
}

export const DEMO_PROFILE: ProfileUser = {
  name: 'Herminia',
  age: 28,
  username: 'UI8799vvA',
  verified: true,
  identityVerified: false,
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
  photos: [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
  ],
  badges: [
    { id: 'respect', label: 'Respectful', count: '54', icon: 'respect' },
    { id: 'safe', label: 'Safe', count: '87', icon: 'safe' },
    { id: 'genuine', label: 'Genuine', count: '0', icon: 'genuine' },
    { id: 'reliable', label: 'Reliable', count: '1k', icon: 'reliable' },
  ],
  hometown: 'Los Angeles',
  company: 'Ninja Agency',
  job: 'Designer',
  vaccination: 'Fully Vaccinated',
  relationship: 'Single',
  gender: 'Woman',
  sexuality: 'Straight',
  pronoun: 'She',
  children: 'Want someday',
  education: 'Finished high school',
  school: 'French American International School',
  exercise: 'Sometimes',
  ethnicity: 'East Asian',
  religion: 'Hindu',
  political: 'Liberal',
  habits: [
    { label: 'Do you drink?', value: 'Sometimes' },
    { label: 'Do you smoke?', value: 'Sometimes' },
    { label: 'Do you smoke weed?', value: 'Sometimes' },
    { label: 'Do you use drugs?', value: 'Sometimes' },
  ],
  height: '5 ft. 3 in.',
  interests: [
    { category: 'Lifestyle & Wellness', tags: ['Dog walking', 'Shopping', 'Gardening'] },
    { category: 'Enrichment', tags: ['Reading'] },
    { category: 'Food', tags: ['Brunch'] },
    { category: 'Drinks', tags: ['Tea', 'Cocktails/Iced drinks'] },
  ],
  important: [
    { prompt: 'My Future', answer: '...answer 1' },
    { prompt: 'My Family', answer: '...answer 2' },
    { prompt: 'My Career', answer: '...answer 3' },
    { prompt: 'My Friends', answer: '...answer 4' },
    { prompt: 'My Growth', answer: '...answer 5' },
  ],
  activities: [
    { title: 'Art class', plans: 5 },
    { title: 'Volunteering & community service', plans: 5 },
    { title: 'Dog walking', plans: 3 },
  ],
  friends: [],
}
