import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { PICKER_PHOTOS } from './data'

export function PhotoPicker({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (urls: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  if (!open) return null

  const preview = selected[0] ?? PICKER_PHOTOS[0]

  function toggle(url: string) {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    )
  }

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      <header className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            setSelected([])
            onClose()
          }}
          className="p-2 rounded-lg hover:bg-feed-gap"
        >
          <X size={22} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold">Select photos</h1>
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => {
            onAdd(selected)
            setSelected([])
            onClose()
          }}
          className={[
            'px-3 py-1.5 text-[15px] font-semibold',
            selected.length ? 'text-brand' : 'text-[#c7c7cc]',
          ].join(' ')}
        >
          Add
        </button>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="aspect-square md:aspect-auto md:w-1/2 md:min-h-[320px] bg-black/5 shrink-0">
          <img src={preview} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <button
            type="button"
            className="flex items-center gap-1 py-3 text-[15px] font-semibold text-ink"
          >
            Recent <ChevronDown size={16} />
          </button>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-1">
            {PICKER_PHOTOS.map((url) => {
              const idx = selected.indexOf(url)
              const active = idx >= 0
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => toggle(url)}
                  className="relative aspect-square overflow-hidden"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <span
                    className={[
                      'absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-[4px] text-[11px] font-bold',
                      active
                        ? 'bg-brand text-white'
                        : 'border-2 border-white bg-black/10',
                    ].join(' ')}
                  >
                    {active ? idx + 1 : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
