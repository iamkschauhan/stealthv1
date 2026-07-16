import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreate } from './CreateContext'

export function PostingScreen() {
  const navigate = useNavigate()
  const { draft, setPostedPlanId } = useCreate()

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPostedPlanId(`plan-${Date.now()}`)
      navigate('/create/plan', { replace: true })
    }, 1600)
    return () => window.clearTimeout(t)
  }, [navigate, setPostedPlanId])

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
