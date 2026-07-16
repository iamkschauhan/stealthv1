export type NotifAction = { label: string; kind: 'primary' | 'secondary' }

export type NotificationItem = {
  id: string
  avatar: string
  avatarKind?: 'user' | 'plan' | 'system'
  parts: { text: string; bold?: boolean }[]
  time: string
  actions?: NotifAction[]
}

export type ChatMessage = {
  id: string
  senderId: string
  text?: string
  time: string
  images?: string[]
}

export type Thread = {
  id: string
  title: string
  avatar: string
  lastSender: string
  time: string
  preview: string
  unread: number
  planLabel?: string
  messages: ChatMessage[]
}

export const ME = {
  id: 'me',
  name: 'You',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
}

export const PEOPLE: Record<string, { name: string; avatar: string }> = {
  travis: {
    name: 'Travis',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  },
  bill: {
    name: 'Bill',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
  },
  john: {
    name: 'John',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
  },
  jamie: {
    name: 'Jamie',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
  },
  zack: {
    name: 'Zack',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop',
  },
  jessie: {
    name: 'Jessie',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
  },
}

const AP =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#207dff"/><text x="32" y="40" text-anchor="middle" font-family="Inter,Arial" font-size="22" font-weight="700" fill="white">ap</text></svg>`,
  )

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    avatar: PEOPLE.john.avatar,
    parts: [
      { text: 'John', bold: true },
      { text: ' changed the location of his ' },
      { text: 'Golf', bold: true },
      { text: ' plan to Riverside Course.' },
    ],
    time: '1h',
  },
  {
    id: 'n2',
    avatar:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=120&h=120&fit=crop',
    avatarKind: 'plan',
    parts: [
      { text: 'The ' },
      { text: 'Tennis', bold: true },
      { text: " plan you're hosting is now closed." },
    ],
    time: '1h',
  },
  {
    id: 'n3',
    avatar: PEOPLE.jamie.avatar,
    parts: [
      { text: 'Jamie', bold: true },
      { text: ' has requested to add you as a friend.' },
    ],
    time: '1h',
    actions: [
      { label: 'Deny', kind: 'secondary' },
      { label: 'Accept', kind: 'primary' },
    ],
  },
  {
    id: 'n4',
    avatar: PEOPLE.zack.avatar,
    parts: [
      { text: 'Zack', bold: true },
      { text: ' liked your ' },
      { text: 'Concert', bold: true },
      { text: ' photo!' },
    ],
    time: '1d',
  },
  {
    id: 'n5',
    avatar: PEOPLE.jessie.avatar,
    parts: [
      { text: 'Your account is now linked with ' },
      { text: "Jessie's", bold: true },
      { text: '.' },
    ],
    time: '1d',
  },
  {
    id: 'n6',
    avatar: PEOPLE.jessie.avatar,
    parts: [
      { text: 'Jessie', bold: true },
      { text: ' has requested to link accounts with you as a couple.' },
    ],
    time: '1d',
    actions: [
      { label: 'Deny', kind: 'secondary' },
      { label: 'Accept', kind: 'primary' },
    ],
  },
  {
    id: 'n7',
    avatar:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=120&h=120&fit=crop',
    avatarKind: 'plan',
    parts: [
      { text: 'The ' },
      { text: 'Tennis', bold: true },
      { text: " plan you're watching is closing soon. Would you like to join?" },
    ],
    time: '1d',
    actions: [{ label: 'Join', kind: 'primary' }],
  },
  {
    id: 'n8',
    avatar: PEOPLE.bill.avatar,
    parts: [
      { text: 'Bill', bold: true },
      { text: ' has invited you to join his ' },
      { text: 'Tennis', bold: true },
      { text: ' plan.' },
    ],
    time: '1d',
    actions: [
      { label: 'Deny', kind: 'secondary' },
      { label: 'Join', kind: 'primary' },
    ],
  },
  {
    id: 'n9',
    avatar: AP,
    avatarKind: 'system',
    parts: [
      { text: "Congrats! You've been verified. Your trusted badge is now live." },
    ],
    time: '2d',
  },
  {
    id: 'n10',
    avatar: AP,
    avatarKind: 'system',
    parts: [
      {
        text: 'We were unable to verify your identity. Please try again with clearer photos.',
      },
    ],
    time: '2d',
  },
  {
    id: 'n11',
    avatar: PEOPLE.bill.avatar,
    parts: [
      { text: "Bill's ", bold: true },
      { text: 'Tennis', bold: true },
      { text: ' plan begins in 24 hours!' },
    ],
    time: '2d',
  },
  {
    id: 'n12',
    avatar:
      'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=120&h=120&fit=crop',
    avatarKind: 'plan',
    parts: [
      { text: 'A spot opened in ' },
      { text: 'Golf', bold: true },
      { text: '. Tap Join to claim it.' },
    ],
    time: '3d',
    actions: [{ label: 'Join', kind: 'primary' }],
  },
]

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.'

const GOLF_IMGS = [
  'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
]

export const PICKER_PHOTOS = [
  'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop',
]

export const INITIAL_THREADS: Thread[] = [
  {
    id: 'golf',
    title: 'Golf',
    avatar:
      'https://images.unsplash.com/photo-1535131749006-b7f58c990fdb?w=160&h=160&fit=crop',
    lastSender: 'John',
    time: '45m',
    preview: 'Lorem ipsum dolor sit amet, c…',
    unread: 1,
    planLabel: 'Golf',
    messages: [
      {
        id: 'm1',
        senderId: 'travis',
        text: LOREM,
        time: '1:23 AM',
      },
      {
        id: 'm2',
        senderId: 'travis',
        text: 'Anyone bringing clubs, or renting on site?',
        time: '1:24 AM',
      },
      {
        id: 'm3',
        senderId: 'bill',
        text: LOREM,
        time: '1:25 AM',
      },
      {
        id: 'm4',
        senderId: 'me',
        text: LOREM,
        time: '1:29 AM',
      },
      {
        id: 'm5',
        senderId: 'me',
        text: 'I’ll grab a few shots from the course.',
        time: '1:30 AM',
        images: [GOLF_IMGS[0], GOLF_IMGS[1]],
      },
    ],
  },
  {
    id: 'italian',
    title: 'Italian food',
    avatar:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=160&h=160&fit=crop',
    lastSender: 'Jamie',
    time: '1h',
    preview: 'Lorem ipsum dolor sit amet, c…',
    unread: 2,
    planLabel: 'Italian food',
    messages: [
      {
        id: 'im1',
        senderId: 'jamie',
        text: 'Reservation is under Jamie at 7pm.',
        time: '12:10 PM',
      },
      {
        id: 'im2',
        senderId: 'me',
        text: 'Perfect — see you there!',
        time: '12:12 PM',
      },
    ],
  },
  {
    id: 'concert',
    title: 'Concert',
    avatar:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&h=160&fit=crop',
    lastSender: 'Zack',
    time: '1h',
    preview: 'Lorem ipsum dolor sit amet, c…',
    unread: 4,
    planLabel: 'Concert',
    messages: [
      {
        id: 'cm1',
        senderId: 'zack',
        text: 'Meet by the west gate at 6:30.',
        time: '11:02 AM',
      },
    ],
  },
  {
    id: 'tennis',
    title: 'Tennis',
    avatar:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=160&h=160&fit=crop',
    lastSender: 'Bill',
    time: '1d',
    preview: 'Lorem ipsum dolor sit amet, c…',
    unread: 0,
    planLabel: 'Tennis',
    messages: [
      {
        id: 'tm1',
        senderId: 'bill',
        text: 'Courts are booked for Saturday morning.',
        time: 'Yesterday',
      },
    ],
  },
]
