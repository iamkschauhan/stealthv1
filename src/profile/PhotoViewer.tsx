import { useProfile } from './ProfileContext'

export function PhotoViewer() {
  const {
    user,
    viewingPhoto,
    setViewingPhoto,
    deleteConfirm,
    setDeleteConfirm,
    removeGalleryPhoto,
  } = useProfile()

  if (viewingPhoto === null) return null
  const src = user.photos[viewingPhoto]
  if (!src) return null

  function remove() {
    void removeGalleryPhoto(src).then(() => {
      setDeleteConfirm(false)
      setViewingPhoto(null)
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 text-white">
        <button type="button" onClick={() => setViewingPhoto(null)} className="p-2 text-2xl">
          ‹
        </button>
        <button
          type="button"
          onClick={() => setDeleteConfirm(true)}
          className="p-2 text-xl"
          aria-label="More"
        >
          ···
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <img src={src} alt="" className="max-h-[70dvh] w-auto max-w-full rounded-lg object-contain" />
      </div>

      <div className="flex justify-center gap-2 px-4 pb-8">
        {user.photos.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => setViewingPhoto(i)}
            className={[
              'h-14 w-14 overflow-hidden rounded-lg border-2',
              i === viewingPhoto ? 'border-brand' : 'border-transparent opacity-70',
            ].join(' ')}
          >
            <img src={p} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {deleteConfirm ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-8">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white">
            <div className="px-5 py-5 text-center">
              <h3 className="text-[17px] font-bold text-ink">Delete photo</h3>
              <p className="mt-1 text-[14px] text-ink">
                Are you sure you want to delete this photo?
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-200">
              <button
                type="button"
                className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-3.5 text-[15px] font-semibold text-red-500"
                onClick={remove}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
