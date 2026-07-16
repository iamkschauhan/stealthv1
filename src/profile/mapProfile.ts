import type { UserProfile } from '../data/types'
import type { ProfileUser } from './data'
import { DEMO_PROFILE } from './data'

function ageFromBirthday(birthday?: string): number {
  if (!birthday) return DEMO_PROFILE.age
  const d = new Date(birthday)
  if (Number.isNaN(d.getTime())) return DEMO_PROFILE.age
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return Math.max(0, age)
}

function ls(profile: UserProfile, key: string, fallback = ''): string {
  const v = profile.lifestyle?.[key]
  if (Array.isArray(v)) return v[0] || fallback
  return (v as string) || fallback
}

export function mapUserToProfile(profile: UserProfile | null): ProfileUser {
  if (!profile) return { ...DEMO_PROFILE, name: 'You', photos: [], activities: [], friends: [] }

  const photos = [
    ...(profile.avatarUrl ? [profile.avatarUrl] : []),
    ...(profile.photoUrls || []),
  ].filter((u, i, arr) => arr.indexOf(u) === i)

  const interestsRaw = profile.interests || []
  const interests =
    interestsRaw.length > 0
      ? [{ category: 'Interests', tags: interestsRaw }]
      : DEMO_PROFILE.interests.map((g) => ({ ...g, tags: [] })).filter(() => false)

  return {
    name: profile.displayName || 'You',
    age: ageFromBirthday(profile.birthday),
    username: profile.uid.slice(0, 8),
    verified: !!profile.verified,
    identityVerified: !!profile.identityVerified || !!profile.verified,
    avatar:
      profile.avatarUrl ||
      DEMO_PROFILE.avatar,
    photos: photos.length ? photos : [],
    badges: DEMO_PROFILE.badges.map((b) => ({ ...b, count: '0' })),
    hometown: profile.hometown || '',
    company: profile.company || '',
    job: profile.job || ls(profile, 'job'),
    vaccination: ls(profile, 'vaccination', 'Prefer not to say'),
    relationship: ls(profile, 'relationship', ''),
    gender: profile.identity || ls(profile, 'gender', ''),
    sexuality: ls(profile, 'sexuality', ''),
    pronoun: Array.isArray(profile.pronouns)
      ? profile.pronouns.join(', ')
      : profile.pronouns || '',
    children: ls(profile, 'children', ''),
    education: ls(profile, 'education', ''),
    school: ls(profile, 'school', ''),
    exercise: ls(profile, 'exercise', ''),
    ethnicity: profile.ethnicity || ls(profile, 'ethnicity', ''),
    religion: ls(profile, 'religion', ''),
    political: ls(profile, 'political', ''),
    habits: [
      { label: 'Do you drink?', value: ls(profile, 'drink', '—') },
      { label: 'Do you smoke?', value: ls(profile, 'smoke', '—') },
      { label: 'Do you smoke weed?', value: ls(profile, 'weed', '—') },
      { label: 'Do you use drugs?', value: ls(profile, 'drugs', '—') },
    ],
    height: ls(profile, 'height', ''),
    interests: interests.length ? interests : [],
    important: profile.bio
      ? [{ prompt: 'About me', answer: profile.bio }]
      : [],
    activities: [],
    friends: (profile.friends || []).map((f) => ({
      id: f.uid,
      name: f.name,
      avatar: f.avatarUrl || DEMO_PROFILE.avatar,
      username: f.username || f.uid.slice(0, 6),
    })),
  }
}

export function planTypeLabelToDb(label: string): 'friendship' | 'dating' | 'casual' | null {
  if (label === 'Friendships') return 'friendship'
  if (label === 'Dating') return 'dating'
  if (label === 'Something casual') return 'casual'
  return null
}

export function planTypeDbToLabel(t: string): string {
  if (t === 'friendship') return 'Friendships'
  if (t === 'dating') return 'Dating'
  if (t === 'casual') return 'Something casual'
  return t
}
