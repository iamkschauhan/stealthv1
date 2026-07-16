export type FeedItem =
  | {
      type: 'activity'
      id: string
      user: { name: string; avatar: string; subtitle?: string; avatars?: string[] }
      image: string
      category: string
      status?: string
      title?: string
      date: string
      time: string
      location: string
      spots: string
      spotsBorder?: string
      likes: number
      joined?: boolean
    }
  | {
      type: 'social'
      id: string
      text: string
      highlight: string
      likes: number
    }
  | {
      type: 'photo'
      id: string
      user: { name: string; avatar: string }
      image: string
      category: string
      status?: string
      caption?: string
      likes: number
      slides?: number
    }

export const categories = [
  'Creative',
  'Events & Outings',
  'Food & Drinks',
  'Games',
  'Sports & Fitness',
  'Nightlife',
]

export const feed: FeedItem[] = [
  {
    type: 'activity',
    id: '1',
    user: {
      name: 'Nick',
      avatar: '/images/avatar-nick.jpg',
    },
    image: '/images/golf.jpg',
    category: 'GOLF',
    date: 'Sat, Dec 23',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    spots: '3/5 spots filled',
    likes: 54,
  },
  {
    type: 'activity',
    id: '2',
    user: {
      name: 'Sarah',
      avatar: '/images/avatar-sarah.jpg',
    },
    image: '/images/concert.jpg',
    category: 'CONCERT',
    title: 'Taylor Swift',
    date: 'Sat, Dec 23',
    time: '7:00 AM',
    location: 'TD Garden',
    spots: '0/5 spots filled',
    spotsBorder: '#e87a8a',
    likes: 54,
  },
  {
    type: 'social',
    id: '3',
    text: 'Alexander and 2 others made',
    highlight: 'augmented reality (AR) game',
    likes: 22,
  },
  {
    type: 'activity',
    id: '4',
    user: {
      name: 'Kyle & Jassie',
      subtitle: 'Couples plan',
      avatar: '/images/avatar-kyle.jpg',
      avatars: ['/images/avatar-kyle.jpg', '/images/avatar-jassie.jpg'],
    },
    image: '/images/mexican.jpg',
    category: 'MEXICAN FOOD',
    date: 'Sat, Dec 23',
    time: '7:00 AM',
    location: 'Plaza Azteca',
    spots: '3/5 spots filled',
    likes: 54,
  },
  {
    type: 'activity',
    id: '4b',
    user: {
      name: 'Jassie',
      avatar: '/images/avatar-jassie.jpg',
    },
    image: '/images/mexican.jpg',
    category: 'MEXICAN FOOD',
    date: 'Sat, Dec 23',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    spots: '5/5 spots filled',
    likes: 54,
  },
  {
    type: 'photo',
    id: '5',
    user: {
      name: 'Jimme',
      avatar: '/images/avatar-jimme.jpg',
    },
    image: '/images/golf.jpg',
    category: 'GOLF',
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    likes: 54,
    slides: 5,
  },
  {
    type: 'activity',
    id: '6',
    user: {
      name: 'Zack',
      avatar: '/images/avatar-zack.jpg',
    },
    image: '/images/football.jpg',
    category: 'FLAG FOOTBALL',
    status: 'Closing soon',
    date: 'Sat, Dec 23',
    time: '7:00 AM',
    location: 'Laurel Lanes Country Club',
    spots: '3/5 spots filled',
    likes: 54,
  },
]
