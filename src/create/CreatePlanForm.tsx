import { useState } from 'react'
import { Share2, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ACTIVITY_BANNERS, draftReady } from './data'
import { useCreate } from './CreateContext'
import {
  ActivityPicker,
  BottomPicker,
  DatePickerSheet,
  LocationPicker,
  TimePickerSheet,
  SPOT_OPTIONS,
} from './pickers'
import {
  AllowCheckbox,
  CreateShell,
  FieldLabel,
  PlanTypePills,
  SearchField,
  SelectField,
} from './ui'

type PickerKind =
  | null
  | 'activity'
  | 'location'
  | 'startDate'
  | 'startTime'
  | 'joinDate'
  | 'joinTime'
  | 'spots'
  | 'audience'

export function CreatePlanForm({ mode = 'create' }: { mode?: 'create' | 'edit' }) {
  const navigate = useNavigate()
  const { draft, patchDraft, resetDraft, setSuggestOpen } = useCreate()
  const [picker, setPicker] = useState<PickerKind>(null)
  const ready = draftReady(draft)
  const banner = ACTIVITY_BANNERS[draft.activity]

  function cancel() {
    if (mode === 'create') resetDraft()
    navigate(mode === 'edit' ? '/create/plan' : '/home')
  }

  return (
    <CreateShell tip="Fill activity, location, schedule, and spots. Post opens your host plan view.">
      <div className="mx-auto w-full max-w-xl lg:max-w-2xl bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden flex flex-col min-h-[70dvh]">
        <header className="sticky top-0 md:top-[57px] z-20 flex items-center border-b border-gray-100 bg-white px-4 py-3">
          {mode === 'edit' ? (
            <button
              type="button"
              aria-label="Back"
              onClick={() => navigate('/create/plan')}
              className="text-ink text-2xl leading-none px-1"
            >
              ‹
            </button>
          ) : (
            <span className="w-12" />
          )}
          <h1 className="flex-1 text-center text-[17px] font-bold text-ink">
            {mode === 'edit' ? 'Edit plan' : 'Create plan'}
          </h1>
          <button
            type="button"
            onClick={cancel}
            className="text-[15px] font-semibold text-brand w-14 text-right"
          >
            Cancel
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 pb-8 space-y-5">
          {mode === 'edit' && banner ? (
            <img src={banner} alt="" className="w-full aspect-[2/1] rounded-2xl object-cover" />
          ) : null}

          <section>
            <FieldLabel>Host</FieldLabel>
            <div className="flex items-center gap-2.5 rounded-xl bg-onboard-input px-3 py-2.5">
              <img
                src={draft.hostAvatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-[15px] font-semibold text-ink">{draft.host}</span>
            </div>
          </section>

          <section>
            <FieldLabel>Activity</FieldLabel>
            <SearchField
              value={draft.activity}
              placeholder="Choose an activity"
              onClick={() => setPicker('activity')}
              onClear={() => patchDraft({ activity: '', activitySub: '' })}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSuggestOpen(true)}
                className="text-[13px] font-medium text-brand"
              >
                Can&apos;t find what you&apos;re looking for?
              </button>
            </div>
            {draft.activity === 'Concert' ? (
              <div className="mt-3">
                <SearchField
                  value={draft.activitySub}
                  placeholder="Name of event"
                  onClick={() =>
                    patchDraft({
                      activitySub: draft.activitySub ? '' : 'Taylor Swift',
                    })
                  }
                  onClear={() => patchDraft({ activitySub: '' })}
                />
              </div>
            ) : null}
            {mode === 'create' && banner ? (
              <img
                src={banner}
                alt=""
                className="mt-3 w-full aspect-[2/1] rounded-2xl object-cover"
              />
            ) : null}
          </section>

          <section>
            <FieldLabel>Location</FieldLabel>
            <SearchField
              value={draft.location}
              placeholder="Choose a location"
              onClick={() => setPicker('location')}
              onClear={() => patchDraft({ location: '' })}
            />
            <AllowCheckbox
              checked={draft.allowLocationEdit}
              onChange={(v) => patchDraft({ allowLocationEdit: v })}
              label="Allow others to request a change to this plan's location"
            />
          </section>

          <section>
            <FieldLabel>Start date</FieldLabel>
            <SelectField
              value={draft.startDate}
              placeholder="Select date"
              onClick={() => setPicker('startDate')}
            />
          </section>

          <section>
            <FieldLabel>Start time</FieldLabel>
            <SelectField
              value={draft.startTime}
              placeholder="Select time"
              onClick={() => setPicker('startTime')}
            />
            <AllowCheckbox
              checked={draft.allowTimeEdit}
              onChange={(v) => patchDraft({ allowTimeEdit: v })}
              label="Allow others to request a change to this plan's start time"
            />
          </section>

          <section>
            <FieldLabel>Others can join your plan up until:</FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                value={draft.joinUntilDate}
                placeholder="Select date"
                onClick={() => setPicker('joinDate')}
              />
              <SelectField
                value={draft.joinUntilTime}
                placeholder="Select time"
                onClick={() => setPicker('joinTime')}
              />
            </div>
          </section>

          <section>
            <FieldLabel>Looking for:</FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-[11px] text-muted">Available spots</p>
                <SelectField
                  value={draft.spots}
                  placeholder="#"
                  onClick={() => setPicker('spots')}
                />
              </div>
              <div>
                <p className="mb-1.5 text-[11px] text-muted">Individuals/Couples</p>
                <SelectField
                  value={draft.audience}
                  placeholder="Please select"
                  onClick={() => setPicker('audience')}
                />
              </div>
            </div>
            <AllowCheckbox
              checked={draft.allowSpotsEdit}
              onChange={(v) => patchDraft({ allowSpotsEdit: v })}
              label="Allow others to request a change to this plan's number of available spots"
            />
          </section>

          {mode === 'edit' ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[15px] font-bold">Going</p>
                <button type="button" className="text-[13px] font-semibold text-brand">
                  View All
                </button>
              </div>
              <ul className="space-y-3">
                {[
                  { name: 'Nick', role: 'Host', avatar: draft.hostAvatar },
                  {
                    name: 'Sarah',
                    avatar:
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
                  },
                  {
                    name: 'Mary',
                    avatar:
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
                  },
                  {
                    name: 'Natali',
                    avatar:
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
                  },
                ].map((p) => (
                  <li key={p.name} className="flex items-center gap-3">
                    <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold">{p.name}</p>
                      {p.role ? <p className="text-[12px] text-muted">{p.role}</p> : null}
                    </div>
                    {!p.role ? (
                      <button type="button" className="text-muted px-1">
                        ···
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <FieldLabel>Type</FieldLabel>
            <PlanTypePills
              value={draft.planType}
              onChange={(v) => patchDraft({ planType: v })}
            />
          </section>

          <section>
            <FieldLabel>Details</FieldLabel>
            <div className="relative">
              <textarea
                value={draft.details}
                maxLength={300}
                onChange={(e) => patchDraft({ details: e.target.value })}
                rows={4}
                placeholder="Share any important details about your plan (ex. where to meet, what to bring, etc.)"
                className="w-full resize-none rounded-2xl bg-onboard-input px-4 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-brand/30"
              />
              <span className="absolute bottom-3 right-3 text-[12px] text-muted">
                {300 - draft.details.length}
              </span>
            </div>
          </section>

          <button
            type="button"
            className="flex items-center gap-2 text-[15px] font-medium text-brand"
          >
            <UserPlus size={18} />
            Invite friends and reserve spots
          </button>

          {mode === 'edit' ? (
            <button
              type="button"
              className="flex items-center gap-2 text-[15px] font-medium text-brand"
            >
              <Share2 size={18} />
              Share plan
            </button>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-gray-50 px-4 sm:px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2">
          {mode === 'edit' ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Delete this plan?')) {
                  resetDraft()
                  navigate('/home')
                }
              }}
              className="w-full rounded-full bg-red-50 py-4 text-[15px] font-semibold text-red-500"
            >
              Delete plan
            </button>
          ) : null}
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              if (!ready) return
              if (mode === 'edit') {
                navigate('/create/plan')
              } else {
                navigate('/create/posting')
              }
            }}
            className={[
              'w-full rounded-full py-4 text-[15px] font-semibold',
              ready ? 'bg-brand text-white' : 'bg-onboard-disabled text-[#c7c7cc]',
            ].join(' ')}
          >
            {mode === 'edit' ? 'Update' : 'Post'}
          </button>
        </div>
      </div>

      <ActivityPicker
        open={picker === 'activity'}
        onSelect={(a) =>
          patchDraft({
            activity: a,
            activitySub: a === 'Concert' ? 'Taylor Swift' : '',
          })
        }
        onClose={() => setPicker(null)}
        onSuggest={() => {
          setPicker(null)
          setSuggestOpen(true)
        }}
      />
      <LocationPicker
        open={picker === 'location'}
        onSelect={(l) => patchDraft({ location: l })}
        onClose={() => setPicker(null)}
      />
      <DatePickerSheet
        open={picker === 'startDate' || picker === 'joinDate'}
        onSelect={(label) =>
          patchDraft(
            picker === 'joinDate' ? { joinUntilDate: label } : { startDate: label },
          )
        }
        onClose={() => setPicker(null)}
      />
      <TimePickerSheet
        open={picker === 'startTime' || picker === 'joinTime'}
        value={picker === 'joinTime' ? draft.joinUntilTime : draft.startTime}
        onSelect={(t) =>
          patchDraft(picker === 'joinTime' ? { joinUntilTime: t } : { startTime: t })
        }
        onClose={() => setPicker(null)}
      />
      <BottomPicker
        open={picker === 'spots'}
        title="Available spots"
        options={SPOT_OPTIONS}
        value={draft.spots}
        onSelect={(v) => patchDraft({ spots: v })}
        onClose={() => setPicker(null)}
      />
      <BottomPicker
        open={picker === 'audience'}
        title="Individuals/Couples"
        options={['Individuals', 'Couples']}
        value={draft.audience}
        onSelect={(v) => patchDraft({ audience: v as 'Individuals' | 'Couples' })}
        onClose={() => setPicker(null)}
      />

      <SuggestModal />
    </CreateShell>
  )
}

function SuggestModal() {
  const { suggestOpen, setSuggestOpen } = useCreate()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  if (!suggestOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-4 sm:px-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => setSuggestOpen(false)}
      />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="px-5 py-5 text-center">
          <h3 className="text-[17px] font-bold text-ink">Suggest another option</h3>
          <p className="mt-2 text-[14px] leading-snug text-[#6b6b70]">
            Help us improve! We&apos;re always on the lookout for new activities to add, so
            we&apos;d love to hear from you.
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Other activity option"
            className="mt-4 w-full rounded-xl bg-onboard-input px-4 py-3 text-[15px] outline-none"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe activity option"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl bg-onboard-input px-4 py-3 text-[15px] outline-none"
          />
        </div>
        <div className="grid grid-cols-2 border-t border-gray-200">
          <button
            type="button"
            className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
            onClick={() => setSuggestOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-3.5 text-[15px] font-semibold text-brand"
            onClick={() => {
              setSuggestOpen(false)
              setName('')
              setDesc('')
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
