import { useNavigate } from 'react-router-dom'
import { BottomNav, SideNav } from '../components/BottomNav'
import { BrandMark } from '../components/Brand'
import { useProfile } from './ProfileContext'
import {
  ProfileHeader,
  ProfileTabs,
  PhotosTab,
  AboutTab,
  ActivitiesTab,
  FriendsTab,
} from './ProfileParts'
import { SettingsSheet, PhotoViewer } from './Overlays'

function ProfileBody() {
  const { tab } = useProfile()
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-feed-gap">
      {/* Compact top bar only on desktop — profile has own header */}
      <div className="hidden md:block sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-3">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="text-left"
          >
            <BrandMark />
          </button>
          <span className="text-[13px] text-muted">Profile</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-start gap-0 lg:gap-6">
          <SideNav
            active="profile"
            onChange={(id) => {
              if (id === 'home') navigate('/home')
              if (id === 'profile') navigate('/profile')
              if (id === 'alerts') navigate('/notifications')
              if (id === 'create') navigate('/create')
              if (id === 'calendar') navigate('/plans')
            }}
          />

          <main className="flex-1 min-w-0 pb-24 md:pb-10 md:pt-5">
            <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden">
              <ProfileHeader />
              <ProfileTabs />
              {tab === 'Photos' ? <PhotosTab /> : null}
              {tab === 'About' ? <AboutTab /> : null}
              {tab === 'Activities' ? <ActivitiesTab /> : null}
              {tab === 'Friends' ? <FriendsTab /> : null}
            </div>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 sticky top-[73px] py-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <h2 className="text-[15px] font-bold text-ink mb-2">Profile tips</h2>
              <ul className="space-y-2 text-[13px] text-muted">
                <li>Add at least 3 photos to get more plan invites.</li>
                <li>Verify your identity for a trusted badge.</li>
                <li>Fill About details to improve matches.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <BottomNav
        active="profile"
        onChange={(id) => {
          if (id === 'home') navigate('/home')
          if (id === 'profile') navigate('/profile')
          if (id === 'alerts') navigate('/notifications')
          if (id === 'create') navigate('/create')
          if (id === 'calendar') navigate('/plans')
        }}
      />

      <SettingsSheet />
      <PhotoViewer />
    </div>
  )
}

export function ProfilePage() {
  return <ProfileBody />
}
