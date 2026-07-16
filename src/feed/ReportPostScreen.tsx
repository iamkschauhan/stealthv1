import { useRef, useState } from 'react'
import { Check, ChevronLeft, CloudUpload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth'
import { uploadImage } from '../data/storage'
import { submitReport } from '../feed/feedActions'

export function ReportPostScreen() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const ready = text.trim().length > 0 && !busy

  async function onFile(file: File | undefined) {
    if (!file || !user) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadImage(
        `reports/${user.uid}/${Date.now()}`,
        file,
        { contentType: file.type || 'image/jpeg' },
      )
      setPhotoUrl(url)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  async function submit() {
    if (!user || !postId || !ready) return
    setBusy(true)
    setError(null)
    try {
      await submitReport({
        reporterId: user.uid,
        planId: postId,
        details: text.trim(),
        photoUrl: photoUrl ?? undefined,
      })
      setSubmitted(true)
      window.setTimeout(() => navigate('/home'), 900)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

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
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              className="mb-3 h-24 w-24 rounded-xl object-cover"
            />
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 text-[14px] font-medium text-brand disabled:opacity-60"
          >
            <CloudUpload size={18} />
            Upload photo
          </button>
          {error ? (
            <p className="mt-3 text-[13px] text-red-500">{error}</p>
          ) : null}
        </div>

        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            disabled={!ready && !submitted}
            onClick={() => void submit()}
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
            ) : busy ? (
              'Submitting…'
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
