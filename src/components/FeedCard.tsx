import {
  Calendar,
  Clock,
  MapPin,
  UserPlus,
  Heart,
  Eye,
  Star,
  Users,
  Check,
  Share2,
} from 'lucide-react'
import { useState } from 'react'
import { UserHeader } from './UserHeader'
import type { FeedItem } from '../data'
import { parseSpots, useFeed } from '../feed/FeedContext'

function CategoryBadge({ label, className = 'bottom-14' }: { label: string; className?: string }) {
  return (
    <span
      className={`absolute left-4 z-10 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-brand shadow-sm ${className}`}
    >
      {label}
    </span>
  )
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="absolute top-3 right-3 z-10 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
      {label}
    </span>
  )
}

function EngagementBar({
  likes,
  onShare,
}: {
  likes: number
  onShare?: () => void
}) {
  const [liked, setLiked] = useState(true)
  const [count, setCount] = useState(likes)
  const [watching, setWatching] = useState(false)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <button
        type="button"
        className="flex items-center gap-1.5"
        onClick={() => {
          setLiked((v) => !v)
          setCount((c) => (liked ? c - 1 : c + 1))
        }}
      >
        <Heart
          size={18}
          className={liked ? 'fill-brand text-brand' : 'text-muted'}
          strokeWidth={liked ? 0 : 2}
        />
        <span className="text-[13px] font-medium text-ink">{count} likes</span>
      </button>
      <div className="flex items-center gap-3">
        {onShare ? (
          <button
            type="button"
            aria-label="Share"
            onClick={onShare}
            className="text-muted hover:text-ink p-0.5"
          >
            <Share2 size={17} strokeWidth={1.75} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setWatching((v) => !v)}
          className={[
            'flex items-center gap-1.5',
            watching ? 'text-brand' : 'text-muted',
          ].join(' ')}
        >
          <Eye size={18} strokeWidth={1.75} />
          <span className="text-[13px]">{watching ? 'watching' : 'watch'}</span>
        </button>
      </div>
    </div>
  )
}

function ActivitySheet({
  item,
}: {
  item: Extract<FeedItem, { type: 'activity' }>
}) {
  const {
    joinStates,
    setJoinConfirmId,
    setPeopleId,
    setExpandId,
  } = useFeed()
  const state = joinStates[item.id] ?? (item.joined ? 'joined' : 'none')
  const { full } = parseSpots(item.spots)

  const label =
    state === 'joined'
      ? 'Going'
      : state === 'waiting'
        ? 'Joined waiting pool'
        : state === 'requested'
          ? 'Request sent'
          : full
            ? 'Join waiting pool'
            : 'Join'

  return (
    <div className="relative -mt-8 bg-white rounded-t-[28px] pt-3 px-4 pb-1">
      <button
        type="button"
        aria-label="More details"
        onClick={() => setExpandId(item.id)}
        className="mx-auto mb-3 block h-1 w-9 rounded-full bg-gray-200 hover:bg-gray-300"
      />

      {item.title ? (
        <div className="flex items-center gap-2 mb-2.5">
          <Star size={16} className="text-muted shrink-0" strokeWidth={1.75} />
          <span className="text-[15px] font-semibold text-ink">{item.title}</span>
        </div>
      ) : null}

      <div className="flex items-center gap-5 text-[13px] text-muted mb-2">
        <span className="flex items-center gap-1.5">
          <Calendar size={15} strokeWidth={1.75} />
          {item.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={15} strokeWidth={1.75} />
          {item.time}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[13px] text-muted mb-3">
        <MapPin size={15} strokeWidth={1.75} className="shrink-0" />
        <span className="truncate">{item.location}</span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-1">
        <button
          type="button"
          onClick={() => setPeopleId(item.id)}
          className="flex items-center gap-2 min-w-0 text-left"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] shrink-0"
            style={{ borderColor: item.spotsBorder ?? '#e8c96a' }}
          >
            <Users size={14} className="text-muted" strokeWidth={1.75} />
          </span>
          <span className="text-[13px] text-muted truncate">{item.spots}</span>
        </button>
        <button
          type="button"
          disabled={state !== 'none'}
          onClick={() => setJoinConfirmId(item.id)}
          className={[
            'flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold shrink-0 transition-colors',
            state === 'joined'
              ? 'bg-pill text-brand'
              : state === 'waiting'
                ? 'border border-brand bg-white text-brand'
                : state === 'requested'
                  ? 'bg-pill text-brand'
                  : 'bg-brand text-white hover:bg-brand-dark',
          ].join(' ')}
        >
          {state === 'joined' ? (
            <Check size={15} strokeWidth={2.25} />
          ) : (
            <UserPlus size={15} strokeWidth={2.25} />
          )}
          {label}
        </button>
      </div>
    </div>
  )
}

const cardShell =
  'bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm md:overflow-hidden'

export function ActivityCard({ item }: { item: Extract<FeedItem, { type: 'activity' }> }) {
  const { setShareId, setExpandId } = useFeed()
  return (
    <article className={cardShell}>
      <UserHeader
        name={item.user.name}
        avatar={item.user.avatar}
        subtitle={item.user.subtitle}
        avatars={item.user.avatars}
        postId={item.id}
      />
      <button
        type="button"
        className="relative mx-0 w-full overflow-hidden bg-gray-100 text-left"
        onClick={() => setExpandId(item.id)}
      >
        <img
          src={item.image}
          alt={item.category}
          className="w-full aspect-[5/4] md:aspect-[16/10] object-cover pointer-events-none"
        />
        <CategoryBadge label={item.category} />
        {item.status ? <StatusBadge label={item.status} /> : null}
      </button>
      <ActivitySheet item={item} />
      <EngagementBar likes={item.likes} onShare={() => setShareId(item.id)} />
    </article>
  )
}

export function PhotoCard({ item }: { item: Extract<FeedItem, { type: 'photo' }> }) {
  const { setShareId } = useFeed()
  return (
    <article className={cardShell}>
      <UserHeader name={item.user.name} avatar={item.user.avatar} postId={item.id} />
      <div className="relative">
        <img
          src={item.image}
          alt={item.category}
          className="w-full aspect-[4/3] md:aspect-[16/10] object-cover"
        />
        <CategoryBadge label={item.category} className="bottom-4" />
        {item.status ? <StatusBadge label={item.status} /> : null}
      </div>
      {item.caption ? (
        <p className="px-4 pt-3 text-[13px] leading-relaxed text-muted">{item.caption}</p>
      ) : null}
      <div className="relative">
        <EngagementBar likes={item.likes} onShare={() => setShareId(item.id)} />
        {item.slides ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1.5 pointer-events-none">
            {Array.from({ length: item.slides }).map((_, i) => (
              <span
                key={i}
                className={[
                  'h-1.5 w-1.5 rounded-full',
                  i === 0 ? 'bg-brand' : 'bg-gray-300',
                ].join(' ')}
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function SocialCard({ item }: { item: Extract<FeedItem, { type: 'social' }> }) {
  const [liked, setLiked] = useState(true)
  const [count, setCount] = useState(item.likes)

  return (
    <article className={`${cardShell} px-4 py-4`}>
      <div className="flex gap-3 rounded-2xl border border-gray-100 p-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">
          ap
        </div>
        <p className="text-[14px] leading-snug text-ink pt-1.5">
          {item.text}{' '}
          <span className="font-bold">{item.highlight}</span> plans!
        </p>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 mt-3 ml-1"
        onClick={() => {
          setLiked((v) => !v)
          setCount((c) => (liked ? c - 1 : c + 1))
        }}
      >
        <Heart
          size={18}
          className={liked ? 'fill-brand text-brand' : 'text-muted'}
          strokeWidth={liked ? 0 : 2}
        />
        <span className="text-[13px] font-medium text-ink">{count} likes</span>
      </button>
    </article>
  )
}

export function FeedCard({ item }: { item: FeedItem }) {
  if (item.type === 'activity') return <ActivityCard item={item} />
  if (item.type === 'photo') return <PhotoCard item={item} />
  return <SocialCard item={item} />
}
