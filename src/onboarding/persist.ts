import type { OnboardingData } from './types'
import type { OnboardingStepId } from './flow'
import { getNextStep } from './flow'
import { updateUserProfile } from '../data/users'
import type { UserProfile } from '../data/types'

/** Map local onboarding draft → Firestore user fields. */
export function draftToProfilePatch(
  data: OnboardingData,
  step: OnboardingStepId,
): Partial<UserProfile> {
  return {
    displayName: data.firstName || undefined,
    phone: data.phone
      ? `${data.countryCode}${data.phone.replace(/\D/g, '')}`
      : undefined,
    birthday: data.birthday || undefined,
    showAge: data.showAge,
    identity: data.identity || undefined,
    pronouns: data.pronouns,
    lookingFor: data.lookingFor,
    avatarUrl: data.profilePhoto || undefined,
    photoUrls: data.photos.length ? data.photos : undefined,
    location: data.location ? { label: data.location } : undefined,
    notificationPrefs: {
      joining: { push: data.notificationsEnabled, email: false },
      hosting: { push: data.notificationsEnabled, email: false },
      photos: { push: data.notificationsEnabled, email: false },
      friends: { push: data.notificationsEnabled, email: false },
      stealth: { push: data.notificationsEnabled, email: true },
    },
    interests: data.interests,
    lifestyle: {
      lifeTags: data.lifeTags,
      relationship: data.relationship,
      children: data.children,
      education: data.education,
      ethnicity: data.ethnicity,
      exercise: data.exercise,
      habits: data.habits,
      political: data.political,
    },
    onboardingStep: getNextStep(step)?.id ?? 'done',
    onboardingDraft: data as unknown as Record<string, unknown>,
  }
}

export function profileToDraft(
  profile: UserProfile,
): Partial<OnboardingData> {
  const draft = profile.onboardingDraft as Partial<OnboardingData> | undefined
  if (draft && typeof draft === 'object') return draft

  const life = profile.lifestyle ?? {}
  return {
    firstName: profile.displayName ?? '',
    birthday: profile.birthday ?? '',
    showAge: profile.showAge ?? true,
    identity: profile.identity ?? '',
    pronouns: Array.isArray(profile.pronouns)
      ? profile.pronouns
      : profile.pronouns
        ? [profile.pronouns]
        : [],
    lookingFor: profile.lookingFor ?? [],
    profilePhoto: profile.avatarUrl ?? '',
    photos: profile.photoUrls ?? [],
    location: profile.location?.label ?? '',
    notificationsEnabled:
      profile.notificationPrefs?.joining?.push ?? true,
    interests: profile.interests ?? [],
    lifeTags: (life.lifeTags as string[]) ?? [],
    relationship: (life.relationship as string) ?? '',
    children: (life.children as string) ?? '',
    education: (life.education as string) ?? '',
    ethnicity: (life.ethnicity as string[]) ?? [],
    exercise: (life.exercise as string) ?? '',
    habits: (life.habits as string[]) ?? [],
    political: (life.political as string) ?? '',
  }
}

export async function persistOnboardingStep(
  uid: string,
  data: OnboardingData,
  step: OnboardingStepId,
): Promise<void> {
  await updateUserProfile(uid, draftToProfilePatch(data, step))
}

export async function finishOnboarding(
  uid: string,
  data: OnboardingData,
): Promise<void> {
  await updateUserProfile(uid, {
    ...draftToProfilePatch(data, 'political'),
    onboardingComplete: true,
    onboardingStep: 'done',
  })
}
