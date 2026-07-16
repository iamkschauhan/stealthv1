/**
 * SETTINGS/ mocks (78) → unique interactive routes.
 * Many files are misnamed "Personal Info first name (N)".
 */
export type SettingsRouteId =
  | 'preferences'
  | 'theme'
  | 'type-of-plans'
  | 'security'
  | 'change-password'
  | 'notifications'
  | 'notif-joining'
  | 'notif-hosting'
  | 'notif-photos'
  | 'notif-friends'
  | 'notif-stealth'
  | 'invite'
  | 'privacy'
  | 'blocked'
  | 'safe-tips'
  | 'principles'
  | 'help'
  | 'report-problem'
  | 'faq'
  | 'support'
  | 'legal'
  | 'privacy-policy'
  | 'terms'
  | 'download-data'
  | 'contact'

export const SETTINGS_MENU = [
  { id: 'preferences' as const, label: 'Preferences', path: '/profile/settings/preferences' },
  { id: 'security' as const, label: 'Security & Login', path: '/profile/settings/security' },
  { id: 'notifications' as const, label: 'Notifications', path: '/profile/settings/notifications' },
  { id: 'invite' as const, label: 'Invite Friends to StealthApp', path: '/profile/settings/invite' },
  { id: 'privacy' as const, label: 'Privacy', path: '/profile/settings/privacy' },
  { id: 'help' as const, label: 'Help Center', path: '/profile/settings/help' },
  { id: 'legal' as const, label: 'Legal', path: '/profile/settings/legal' },
  { id: 'contact' as const, label: 'Contact', path: '/profile/settings/contact' },
]

export const FAQ_ITEMS = [
  {
    q: 'How do I block an account?',
    a: 'Go to Privacy → Blocked accounts, or open a profile and use Report / Block.',
  },
  {
    q: 'How do I remove a friend?',
    a: 'Open Friends on your profile, tap ··· next to their name, then Remove friend.',
  },
  {
    q: 'How do I enable private mode?',
    a: 'Open Settings → Privacy and turn on Private mode.',
  },
  {
    q: 'How do I report a user, plan, photo, or post?',
    a: 'Use the ··· menu on the content, then choose Report.',
  },
]

export const JOINING_NOTIFS = [
  "When a plan you're watching is closing soon",
  'When a spot opens up to the waiting pool',
  "When you've been invited to a plan",
  'When you are accepted into or denied from a plan',
  "When a change is made to a plan you've joined",
  "When someone sends a message in the plan's chat",
]

export const HOSTING_NOTIFS = [
  'When someone requests to join your plan',
  'When someone leaves your plan',
  'When someone messages in your plan chat',
  'When your plan is about to start',
]

export const PHOTO_NOTIFS = [
  'When someone likes your photo',
  'When someone comments on your photo',
  'When someone tags you in a photo',
]

export const FRIEND_NOTIFS = [
  'When someone requests to add you as a friend',
  'When someone accepts your friend request',
  'When someone requests to link accounts with you',
  "When your account has been linked with another user's",
]

export const STEALTH_NOTIFS = [
  'Product updates and new features',
  'Tips to get more out of StealthApp',
  'Promotions and partnerships',
]
