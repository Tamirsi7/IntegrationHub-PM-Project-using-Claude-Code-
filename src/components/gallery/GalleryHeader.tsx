import { Monitor, PlusCircle } from 'lucide-react'
import { OffsetCard } from '@/components/ui/OffsetCard'
import { GALLERY_STATS } from '@/data/integrations'

interface GalleryHeaderProps {
  activeTab: 'mine' | 'all'
  onTabChange: (tab: 'mine' | 'all') => void
  sortBy: 'name' | 'status' | 'category'
  onSortChange: (sort: 'name' | 'status' | 'category') => void
  filteredCount: number
  totalCount: number
  connectedCount: number
  onPresent?: () => void
  onRequestIntegration?: () => void
}

export function GalleryHeader({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
  connectedCount,
  onPresent,
  onRequestIntegration,
}: GalleryHeaderProps) {
  const showingAll = filteredCount === totalCount

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Title + CTA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integration Hub</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Monitor your connected stack and discover new integrations to eliminate access blind spots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onPresent && (
            <button
              onClick={onPresent}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-offset transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <Monitor size={15} />
              Present
            </button>
          )}
          <button
            onClick={onRequestIntegration}
            className="flex items-center gap-2 rounded-xl bg-linx-orange px-5 py-2.5 text-sm font-semibold text-white shadow-offset-orange transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-offset active:shadow-none"
          >
            <PlusCircle size={15} />
            Request Integration
          </button>
        </div>
      </div>

      {/* Row 2: Stats bar */}
      <OffsetCard padding="px-4 py-2.5" className="flex items-center gap-5 w-fit">
        <span className="text-xs font-medium text-slate-500">
          <span className="font-bold text-slate-900">{GALLERY_STATS.connected}</span> Connected
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="text-xs font-medium text-slate-500">
          <span className="font-bold text-slate-900">{GALLERY_STATS.available}</span> Available
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="text-xs font-medium text-slate-500">
          <span className="font-bold text-slate-900">{GALLERY_STATS.categories}</span> Categories
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="text-xs font-medium text-slate-500">
          <span className="font-bold text-slate-900">{GALLERY_STATS.comingSoon}</span> Coming Soon
        </span>
      </OffsetCard>

      {/* Row 3: Tabs + filter count + sort */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center">
          <button
            onClick={() => onTabChange('mine')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'mine'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            My Integrations
            <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {connectedCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange('all')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            All Integrations
            <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {totalCount}
            </span>
          </button>

          {!showingAll && (
            <span className="ml-4 text-xs text-slate-400">
              Showing {filteredCount} of {totalCount}
            </span>
          )}
        </div>

        {/* Sort control */}
        <div className="flex items-center gap-2 pb-2">
          <span className="text-[11px] text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as 'name' | 'status' | 'category')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm outline-none focus:border-slate-400"
          >
            <option value="status">Status</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>
  )
}
