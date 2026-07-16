import { useMemo, useState } from 'react'
import {
  ArrowDownUp,
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  EMPTY_COPY,
  TAB_TIPS,
  defaultSort,
  planDetailPath,
  sortOptionsForTab,
  type PlanCard,
  type PlansTab,
  type SortOption,
} from './data'
import { usePlans } from './PlansContext'
import { PlansShell, SharePlanModal, Sheet } from './shell'
import { LoadingState } from '../ui/LoadingState'

const TABS: PlansTab[] = ['Watching', 'Requested', 'Upcoming', 'Past']

function sortPlans(list: PlanCard[], sort: SortOption) {
  const copy = [...list]
  if (sort === 'Name of activity') {
    copy.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sort === 'Plans I hosted' || sort === "Plans I'm hosting") {
    copy.sort((a, b) => Number(!!b.hostedByMe) - Number(!!a.hostedByMe))
  } else if (sort === 'Closing time') {
    copy.sort((a, b) => (a.closesHours ?? 999) - (b.closesHours ?? 999))
  } else if (sort === 'Starting time') {
    copy.sort((a, b) => (a.startsHours ?? 999) - (b.startsHours ?? 999))
  }
  return copy
}

function BadgeLabel({ badge }: { badge: string }) {
  if (badge.startsWith('Closes')) {
    return (
      <>
        <span className="text-brand">Closes</span>
        <span className="text-muted">{badge.slice(6)}</span>
      </>
    )
  }
  if (badge.startsWith('Starts')) {
    return (
      <>
        <span className="text-brand">Starts</span>
        <span className="text-muted">{badge.slice(6)}</span>
      </>
    )
  }
  return <span className="text-brand">{badge}</span>
}

export function PlansPage() {
  const { loading, error, listForTab, hidePast, getCard, refresh } = usePlans()
  const [params, setParams] = useSearchParams()
  const tabParam = params.get('tab')
  const tab: PlansTab =
    tabParam === 'Watching' ||
    tabParam === 'Requested' ||
    tabParam === 'Upcoming' ||
    tabParam === 'Past'
      ? tabParam
      : 'Past'

  const [sort, setSort] = useState<SortOption>(defaultSort(tab))
  const [sortOpen, setSortOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [sharePlanId, setSharePlanId] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const sortOptions = sortOptionsForTab(tab)

  const items = useMemo(() => {
    return sortPlans(listForTab(tab), sort)
  }, [tab, sort, listForTab])

  function setTab(next: PlansTab) {
    setParams(next === 'Past' ? {} : { tab: next })
    setSort(defaultSort(next))
  }

  return (
    <PlansShell tip={TAB_TIPS[tab]}>
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm min-h-[70dvh] overflow-hidden flex flex-col">
        <header className="px-4 sm:px-5 pt-5 pb-3">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight">My Plans</h1>
            <button
              type="button"
              aria-label="Search"
              onClick={() => navigate('/home')}
              className="rounded-lg p-2 text-ink hover:bg-feed-gap"
            >
              <Search size={22} />
            </button>
          </div>

          <div className="flex rounded-full bg-pill p-1 gap-0.5 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const active = t === tab
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={[
                    'shrink-0 flex-1 min-w-[4.5rem] rounded-full py-2.5 px-2 text-[12px] sm:text-[13px] font-semibold transition-colors',
                    active ? 'bg-brand text-white shadow-sm' : 'text-ink/70',
                  ].join(' ')}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </header>

        <div className="flex items-center justify-between px-4 sm:px-5 pb-3">
          <p className="text-[13px] text-muted">
            Sort by <span className="font-bold text-ink">{sort}</span>
          </p>
          <button
            type="button"
            aria-label="Sort"
            onClick={() => setSortOpen(true)}
            className="rounded-full p-2 text-muted hover:bg-feed-gap hover:text-ink"
          >
            <ArrowDownUp size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center px-8 py-20">
            <LoadingState label="Loading plans…" />
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-20">
            <p className="text-center text-[14px] text-red-500">{error}</p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="flex-1 flex items-center justify-center px-8 py-20 text-center text-[14px] text-muted">
            {EMPTY_COPY[tab]}
          </p>
        ) : (
          <ul className="flex-1 px-4 sm:px-5 pb-6 space-y-3">
            {items.map((plan) => (
              <li key={plan.id}>
                <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="rounded-full bg-pill px-2.5 py-1 text-[11px] font-semibold">
                      <BadgeLabel badge={plan.badge} />
                    </span>
                    <button
                      type="button"
                      aria-label="More"
                      onClick={() => setMenuId(plan.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-pill text-brand"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  <Link to={planDetailPath(tab, plan.id)} className="block">
                    <h2 className="text-[18px] font-bold text-ink">{plan.title}</h2>
                    <p className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={14} /> {plan.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} /> {plan.time}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
                      <MapPin size={14} className="shrink-0" /> {plan.location}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      {plan.coHost && plan.coHostAvatar ? (
                        <div className="relative h-9 w-12 shrink-0">
                          <img
                            src={plan.hostAvatar}
                            alt=""
                            className="absolute left-0 h-9 w-9 rounded-full object-cover ring-2 ring-white"
                          />
                          <img
                            src={plan.coHostAvatar}
                            alt=""
                            className="absolute left-3 h-9 w-9 rounded-full object-cover ring-2 ring-white"
                          />
                        </div>
                      ) : (
                        <img
                          src={plan.hostAvatar}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-[14px] font-bold">
                          {plan.coHost ? `${plan.host} & ${plan.coHost}` : plan.host}
                        </p>
                        <p className="text-[12px] text-muted">
                          {plan.coHost ? 'Hosts' : 'Host'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet open={sortOpen} title="Sort by" onClose={() => setSortOpen(false)}>
        <ul className="px-2 py-2 pb-4">
          {sortOptions.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  setSort(opt)
                  setSortOpen(false)
                }}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 hover:bg-feed-gap"
              >
                <span className="text-[15px]">{opt}</span>
                <span
                  className={[
                    'flex h-5 w-5 items-center justify-center rounded-full border-2',
                    sort === opt ? 'border-brand' : 'border-gray-300',
                  ].join(' ')}
                >
                  {sort === opt ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Sheet>

      <Sheet open={!!menuId} title="Manage" onClose={() => setMenuId(null)}>
        <ul className="px-2 py-2 pb-4">
          <li>
            <button
              type="button"
              onClick={() => {
                setSharePlanId(menuId)
                setMenuId(null)
                setShareOpen(true)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
            >
              <Share2 size={20} />
              <span className="text-[15px]">Share plan</span>
            </button>
          </li>
          {tab === 'Past' ? (
            <li>
              <button
                type="button"
                onClick={() => {
                  const id = menuId
                  setMenuId(null)
                  if (id) navigate(`/plans/past/${id}/rate`)
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-feed-gap"
              >
                <span className="text-[15px]">Rate plan</span>
              </button>
            </li>
          ) : null}
          {tab === 'Past' ? (
            <li>
              <button
                type="button"
                onClick={() => {
                  setPendingDeleteId(menuId)
                  setMenuId(null)
                  setDeleteOpen(true)
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={20} />
                <span className="text-[15px]">Delete plan</span>
              </button>
            </li>
          ) : null}
        </ul>
      </Sheet>

      <SharePlanModal
        open={shareOpen}
        onClose={() => {
          setShareOpen(false)
          setSharePlanId(null)
        }}
        kind={
          tab === 'Upcoming'
            ? 'going'
            : tab === 'Past'
              ? getCard(sharePlanId || '')?.hostedByMe
                ? 'hostedPast'
                : 'went'
              : 'found'
        }
        planId={sharePlanId ?? undefined}
        showAppInvite={tab === 'Past'}
      />

      {deleteOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setDeleteOpen(false)
              setPendingDeleteId(null)
            }}
          />
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="px-5 py-5 text-center">
              <h3 className="text-[17px] font-bold">Delete plan</h3>
              <p className="mt-2 text-[14px] text-[#6b6b70]">
                Are you sure you want to delete this plan?
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-200">
              <button
                type="button"
                className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
                onClick={() => {
                  setDeleteOpen(false)
                  setPendingDeleteId(null)
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                className="py-3.5 text-[15px] font-semibold text-red-500 disabled:opacity-50"
                onClick={() => {
                  const id = pendingDeleteId
                  if (!id) return
                  setBusy(true)
                  void hidePast(id)
                    .then(() => {
                      setPendingDeleteId(null)
                      setDeleteOpen(false)
                    })
                    .finally(() => setBusy(false))
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PlansShell>
  )
}
