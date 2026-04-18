import { Check, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { cn } from '@/lib/utils'
import { type IntegrationCategory, ALL_CATEGORIES } from '@/data/integrations'

interface FilterPanelProps {
  search: string
  onSearchChange: (v: string) => void
  selectedCategories: Set<IntegrationCategory>
  onCategoryToggle: (c: IntegrationCategory) => void
  remediationOnly: boolean
  onRemediationToggle: () => void
  activeSyncedOnly: boolean
  onActiveSyncedToggle: () => void
  hasActiveFilters: boolean
  onClearAll: () => void
  collapsed: boolean
  onCollapseToggle: () => void
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </div>
  )
}

interface CheckboxRowProps {
  label: string
  checked: boolean
  onChange: () => void
}

function CheckboxRow({ label, checked, onChange }: CheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-50">
      <div
        onClick={onChange}
        className={cn(
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors',
          checked ? 'border-slate-900 bg-slate-900' : 'border-slate-200 bg-white',
        )}
      >
        {checked && <Check size={10} className="text-white" />}
      </div>
      <span>{label}</span>
    </label>
  )
}

export function FilterPanel({
  search,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  remediationOnly,
  onRemediationToggle,
  activeSyncedOnly,
  onActiveSyncedToggle,
  hasActiveFilters,
  onClearAll,
  collapsed,
  onCollapseToggle,
}: FilterPanelProps) {
  return (
    <div className={cn('flex-shrink-0 transition-all duration-300', collapsed ? 'w-10' : 'w-56')}>
      <div className="sticky top-0 flex flex-col gap-3">
        {collapsed ? (
          /* Collapsed state — slim icon strip */
          <OffsetCard padding="p-2" className="flex flex-col items-center gap-3">
            <button
              onClick={onCollapseToggle}
              title="Expand filters"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronRight size={15} />
            </button>
            <div className="h-px w-full bg-slate-100" />
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400">
              <SlidersHorizontal size={14} />
            </div>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-linx-orange" title="Active filters" />
            )}
          </OffsetCard>
        ) : (
          /* Expanded state — full filter panel */
          <OffsetCard padding="p-4" className="flex flex-col gap-4">

            {/* Header row: label + collapse button */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filters</span>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={onClearAll}
                    className="text-[10px] font-semibold text-linx-orange transition-colors hover:underline"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onCollapseToggle}
                  title="Collapse filters"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                placeholder="Search integrations..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>

            {/* Category */}
            <FilterSection label="Category">
              {ALL_CATEGORIES.map(cat => (
                <CheckboxRow
                  key={cat}
                  label={cat}
                  checked={selectedCategories.has(cat)}
                  onChange={() => onCategoryToggle(cat)}
                />
              ))}
            </FilterSection>

            {/* Status / Capability toggles */}
            <FilterSection label="Status">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-2.5">
                <span className="text-[11px] leading-snug text-slate-600">Active synced only</span>
                <button
                  onClick={onActiveSyncedToggle}
                  role="switch"
                  aria-checked={activeSyncedOnly}
                  className={cn(
                    'relative h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200',
                    activeSyncedOnly ? 'bg-green-500' : 'bg-slate-200',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                      activeSyncedOnly ? 'translate-x-4' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>
            </FilterSection>

            <FilterSection label="Capability">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-2.5">
                <span className="text-[11px] leading-snug text-slate-600">Active Remediation only</span>
                <button
                  onClick={onRemediationToggle}
                  role="switch"
                  aria-checked={remediationOnly}
                  className={cn(
                    'relative h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200',
                    remediationOnly ? 'bg-linx-purple' : 'bg-slate-200',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                      remediationOnly ? 'translate-x-4' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>
            </FilterSection>

          </OffsetCard>
        )}
      </div>
    </div>
  )
}
