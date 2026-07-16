import { useOnboarding } from '../OnboardingContext'
import { MultiChipScreen, SingleSelectScreen } from './SelectScreens'

const INTEREST_CATEGORIES = [
  {
    name: 'Lifestyle & Wellness',
    items: [
      'Dog walking',
      'Self-care',
      'Cooking',
      'Baking',
      'Mindfulness',
      'Gardening',
      'Shopping',
    ],
  },
  {
    name: 'Food & Drinks',
    items: [
      'Brunch',
      'Sushi',
      'Pizza',
      'Coffee',
      'Cocktails/mixed drinks',
      'Trying new restaurants',
      'Vegetarian',
    ],
  },
  {
    name: 'Adventures & Outings',
    items: [
      'Concerts',
      'Comedy shows',
      'Beaches',
      'Nightlife',
      'Museums',
      'Live sports games',
      'Festivals',
    ],
  },
  {
    name: 'Fitness & Sports',
    items: [
      'Hiking',
      'Yoga',
      'Running',
      'Gym',
      'Cycling',
      'Soccer',
      'Basketball',
      'Golf',
    ],
  },
  {
    name: 'Creative & Games',
    items: [
      'Photography',
      'Painting',
      'Music',
      'Reading',
      'Board games',
      'Video games',
      'Karaoke',
    ],
  },
]

export function InterestsScreen() {
  const { data, patch } = useOnboarding()
  return (
    <MultiChipScreen
      stepId="interests"
      title="What are your interests?"
      subtitle={
        <>
          Displaying your interests allows others to get to know you better and
          increases compatibility. Select{' '}
          <span className="font-semibold text-onboard-gold">up to 10</span>.
        </>
      }
      categories={INTEREST_CATEGORIES}
      values={data.interests}
      onChange={(interests) => patch({ interests })}
      max={10}
      activeDot={1}
      allowSkip
    />
  )
}

export function YourLifeScreen() {
  const { data, patch } = useOnboarding()
  return (
    <MultiChipScreen
      stepId="your-life"
      title="What about your life?"
      subtitle="Pick a few tags that feel like you right now."
      options={[
        'New in town',
        'Remote worker',
        'Student',
        'Entrepreneur',
        'Pet parent',
        'Night owl',
        'Early bird',
        'Foodie',
        'Traveler',
        'Homebody',
      ]}
      values={data.lifeTags}
      onChange={(lifeTags) => patch({ lifeTags })}
      max={5}
      activeDot={5}
      allowSkip
    />
  )
}

export function RelationshipScreen() {
  const { data, patch } = useOnboarding()
  return (
    <SingleSelectScreen
      stepId="relationship"
      title="What's your relationship status?"
      subtitle="This is important to some people looking for friendships. You can always change this later."
      options={[
        'Single',
        'Dating',
        'In a relationship',
        "It's complicated",
        'Engaged',
        'Domestic partnership',
        'Married',
        'Divorced',
        'Widowed',
        'Prefer not to say',
      ]}
      value={data.relationship}
      onChange={(relationship) => patch({ relationship })}
      activeDot={6}
    />
  )
}

export function ChildrenScreen() {
  const { data, patch } = useOnboarding()
  return (
    <SingleSelectScreen
      stepId="children"
      title="How about children?"
      options={[
        'Pregnant',
        'Want someday',
        "Don't want",
        'Have and want more',
        "Have and don't want more",
        'Not sure yet',
        'Prefer not to say',
      ]}
      value={data.children}
      onChange={(children) => patch({ children })}
      activeDot={8}
    />
  )
}

export function EducationScreen() {
  const { data, patch } = useOnboarding()
  return (
    <SingleSelectScreen
      stepId="education"
      title="What's your level of education?"
      options={[
        'High school',
        'Trade/tech school',
        'Undergraduate degree',
        'Postgraduate degree',
        'In school',
        'Going back to school',
        'Prefer not to say',
      ]}
      value={data.education}
      onChange={(education) => patch({ education })}
      activeDot={10}
    />
  )
}

export function EthnicityScreen() {
  const { data, patch } = useOnboarding()
  return (
    <MultiChipScreen
      stepId="ethnicity"
      title="What's your ethnicity?"
      subtitle="Select all that apply."
      options={[
        'Asian',
        'Black / African descent',
        'Hispanic / Latino',
        'Indigenous',
        'Middle Eastern',
        'Pacific Islander',
        'South Asian',
        'White / Caucasian',
        'Other',
        'Prefer not to say',
      ]}
      values={data.ethnicity}
      onChange={(ethnicity) => patch({ ethnicity })}
      max={10}
      activeDot={11}
      allowSkip
    />
  )
}

export function ExerciseScreen() {
  const { data, patch } = useOnboarding()
  return (
    <SingleSelectScreen
      stepId="exercise"
      title="How often do you exercise?"
      options={[
        'Every day',
        'Often',
        'Sometimes',
        'Rarely',
        'Never',
        'Prefer not to say',
      ]}
      value={data.exercise}
      onChange={(exercise) => patch({ exercise })}
      activeDot={12}
    />
  )
}

export function HabitsScreen() {
  const { data, patch } = useOnboarding()
  return (
    <MultiChipScreen
      stepId="habits"
      title="Habits"
      subtitle="Select any that apply."
      options={[
        'Non-smoker',
        'Smoker',
        'Social smoker',
        'Drink socially',
        "Don't drink",
        'Sober',
        '420 friendly',
        'Prefer not to say',
      ]}
      values={data.habits}
      onChange={(habits) => patch({ habits })}
      max={6}
      activeDot={13}
      allowSkip
    />
  )
}

export function PoliticalScreen() {
  const { data, patch } = useOnboarding()
  return (
    <SingleSelectScreen
      stepId="political"
      title="What are your political beliefs?"
      options={[
        'Liberal',
        'Moderate',
        'Conservative',
        'Not political',
        'Other',
        'Prefer not to say',
      ]}
      value={data.political}
      onChange={(political) => patch({ political })}
      activeDot={14}
    />
  )
}
