import { Check, ChevronLeft, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCreate } from './CreateContext'
import { CreateShell } from './ui'

export function RequestsScreen() {
  const navigate = useNavigate()
  const { requests, resolveRequest } = useCreate()

  return (
    <CreateShell tip="Accept or deny join requests and change requests for location, time, or spots.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center gap-2 border-b border-gray-100 bg-white px-2 py-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate('/create/plan')}
            className="rounded-lg p-2 hover:bg-feed-gap"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold pr-10">Requests</h1>
        </header>

        {requests.length === 0 ? (
          <p className="flex-1 flex items-center justify-center text-[14px] text-muted px-6 py-20 text-center">
            No pending requests.
          </p>
        ) : (
          <ul className="flex-1 divide-y divide-gray-50">
            {requests.map((r) => {
              const boldMatch = r.detail.match(/^(.*?:\s*)(.+)$/)
              return (
                <li key={r.id} className="flex items-start gap-3 px-4 sm:px-5 py-4">
                  <img
                    src={r.avatar}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-snug text-ink">
                      <strong className="font-bold">{r.name}</strong>{' '}
                      {r.kind === 'join' ? (
                        <span>{r.detail}</span>
                      ) : boldMatch ? (
                        <>
                          {boldMatch[1]}
                          <strong className="font-bold">{boldMatch[2]}</strong>
                        </>
                      ) : (
                        r.detail
                      )}
                    </p>
                    <p className="mt-1 text-[12px] text-muted">{r.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Deny"
                      onClick={() => void resolveRequest(r.id, false)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-pill text-brand"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      aria-label="Accept"
                      onClick={() => void resolveRequest(r.id, true)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white"
                    >
                      <Check size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </CreateShell>
  )
}
