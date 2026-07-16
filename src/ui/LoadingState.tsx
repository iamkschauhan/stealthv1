import loadingRun from '../assets/loading-run.png'

type Props = {
  label?: string
  /** Full viewport boot screen vs inline section placeholder */
  fullScreen?: boolean
  className?: string
}

/** Shared loading UI — running character bob across the app. */
export function LoadingState({
  label = 'Loading…',
  fullScreen = false,
  className = '',
}: Props) {
  const body = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <img
        src={loadingRun}
        alt=""
        width={120}
        height={120}
        className="loading-run h-[88px] w-[88px] object-contain sm:h-[110px] sm:w-[110px]"
        draggable={false}
      />
      {label ? (
        <p className="text-[13px] font-medium text-muted">{label}</p>
      ) : null}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        {body}
      </div>
    )
  }

  return body
}
