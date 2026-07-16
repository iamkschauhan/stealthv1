import { useState } from 'react'
import { Check, ChevronLeft, CloudUpload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export function ReportPostScreen() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const ready = text.trim().length > 0

  return (
    <div className="min-h-[100dvh] bg-feed-gap flex justify-center px-0 sm:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl min-h-[100dvh] md:min-h-[70dvh] md:my-8 bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 border-b border-gray-100 px-2 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/home')}
            className="rounded-lg p-2 hover:bg-feed-gap"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold pr-10">Report post</h1>
        </header>

        <div className="flex-1 px-5 py-5">
          <p className="mb-3 text-[12px] text-muted">Post #{postId}</p>
          <textarea
            value={text}
            onChange={(e) => {
              setSubmitted(false)
              setText(e.target.value)
            }}
            rows={6}
            placeholder="Provide details"
            className="mb-4 w-full resize-none rounded-2xl bg-onboard-input px-4 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
          />
          {photo ? (
            <img
              src="/images/golf.jpg"
              alt=""
              className="mb-3 h-24 w-24 rounded-xl object-cover"
            />
          ) : null}
          <button
            type="button"
            onClick={() => setPhoto(true)}
            className="flex items-center gap-2 text-[14px] font-medium text-brand"
          >
            <CloudUpload size={18} />
            Upload photo
          </button>
        </div>

        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            disabled={!ready && !submitted}
            onClick={() => setSubmitted(true)}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold',
              submitted
                ? 'bg-[#6fcf76] text-white'
                : ready
                  ? 'bg-ink text-white'
                  : 'bg-onboard-disabled text-[#c7c7cc]',
            ].join(' ')}
          >
            {submitted ? (
              <>
                <Check size={18} /> Submitted
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
