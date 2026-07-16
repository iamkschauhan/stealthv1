import { MoreHorizontal, Users } from 'lucide-react'
import { useFeed } from '../feed/FeedContext'

type UserHeaderProps = {
  name: string
  avatar: string
  subtitle?: string
  avatars?: string[]
  postId?: string
}

export function UserHeader({ name, avatar, subtitle, avatars, postId }: UserHeaderProps) {
  const { setMenuId } = useFeed()

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {avatars && avatars.length > 1 ? (
          <div className="flex -space-x-3 shrink-0">
            {avatars.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-9 w-9 rounded-full object-cover border-2 border-white"
                style={{ zIndex: avatars.length - i }}
              />
            ))}
          </div>
        ) : (
          <img
            src={avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover border-[2.5px] border-avatar-ring shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-ink truncate leading-tight">{name}</p>
          {subtitle ? (
            <p className="flex items-center gap-1 text-[12px] text-muted mt-0.5">
              <Users size={12} strokeWidth={2} />
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        aria-label="More options"
        onClick={() => postId && setMenuId(postId)}
        className="text-ink p-1 shrink-0"
      >
        <MoreHorizontal size={20} strokeWidth={2} />
      </button>
    </div>
  )
}
