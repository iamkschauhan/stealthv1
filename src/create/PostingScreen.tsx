import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreate } from './CreateContext'

export function PostingScreen() {
  const navigate = useNavigate()
  const { draft, publishDraft, error } = useCreate()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const id = await publishDraft()
          if (!cancelled) navigate(`/create/plan/${id}`, { replace: true })
        } catch {
          if (!cancelled) setFailed(true)
        }
      })()
    }, 900)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [navigate, publishDraft])

  if (failed) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6">
        <h1 className="text-[20px] font-extrabold text-ink text-center">
          Couldn&apos;t post your plan
        </h1>
        <p className="mt-2 text-[14px] text-red-500 text-center">
          {error || 'Something went wrong. Try again.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/create')}
          className="mt-6 rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white"
        >
          Back to form
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand">
        <span className="text-[28px] font-extrabold tracking-tight">
          <span className="text-brand">a</span>
          <span className="text-ink">p</span>
        </span>
      </div>
      <h1 className="mt-6 text-[22px] font-extrabold text-ink text-center">
        Posting your plan…
      </h1>
      <p className="mt-2 text-[14px] text-muted text-center">
        Nothing but good times ahead!
      </p>
      <p className="mt-6 text-[12px] text-muted/70">{draft.activity || 'Your plan'}</p>
    </div>
  )
}
