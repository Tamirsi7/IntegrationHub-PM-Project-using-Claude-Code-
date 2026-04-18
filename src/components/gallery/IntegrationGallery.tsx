import { useMemo, useState } from 'react'
import { Plug, Search } from 'lucide-react'
import {
  INTEGRATIONS,
  GALLERY_STATS,
  type IntegrationCategory,
} from '@/data/integrations'
import { IntegrationCard } from './IntegrationCard'
import { FilterPanel } from './FilterPanel'
import { GalleryHeader } from './GalleryHeader'
import { MissingIntegrationCard } from './MissingIntegrationCard'

interface IntegrationGalleryProps {
  onConnect: (id: string) => void
  onConfigure: (id: string) => void
  onPresent?: () => void
  onRequestIntegration?: () => void
}

export function IntegrationGallery({ onConnect, onConfigure, onPresent, onRequestIntegration }: IntegrationGalleryProps) {
  const [activeTab, setActiveTab] = useState<'mine' | 'all'>('mine')
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<IntegrationCategory>>(new Set())
  const [remediationOnly, setRemediationOnly] = useState(false)
  const [activeSyncedOnly, setActiveSyncedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'category'>('status')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedCategories.size > 0 ||
    remediationOnly ||
    activeSyncedOnly

  function handleCategoryToggle(cat: IntegrationCategory) {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function handleClearAll() {
    setSearch('')
    setSelectedCategories(new Set())
    setRemediationOnly(false)
    setActiveSyncedOnly(false)
  }

  // Apply search + category + remediation + active-synced filters
  function applyFilters(list: typeof INTEGRATIONS) {
    let result = list
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.tagline.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      )
    }
    if (selectedCategories.size > 0) {
      result = result.filter(i => selectedCategories.has(i.category))
    }
    if (remediationOnly) {
      // Only apply to connected integrations — non-connected ones pass through regardless
      result = result.filter(
        i => i.connectionStatus !== 'connected' || i.remediationCapability === 'one-click-remediation',
      )
    }
    if (activeSyncedOnly) {
      result = result.filter(
        i => i.connectionStatus === 'connected' && (i.health === 'healthy' || i.health === 'syncing'),
      )
    }
    return result
  }

  const statusOrder = { connected: 0, 'not-connected': 1, 'coming-soon': 2 } as const
  function applySort(list: typeof INTEGRATIONS) {
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return statusOrder[a.connectionStatus] - statusOrder[b.connectionStatus]
    })
  }

  // "Mine" tab — only connected
  const myIntegrations = useMemo(
    () => applySort(applyFilters(INTEGRATIONS.filter(i => i.connectionStatus === 'connected'))),
    [search, selectedCategories, remediationOnly, sortBy],
  )

  // "All" tab — split into connected vs available
  const allConnected = useMemo(
    () => applySort(applyFilters(INTEGRATIONS.filter(i => i.connectionStatus === 'connected'))),
    [search, selectedCategories, remediationOnly, sortBy],
  )
  const allAvailable = useMemo(
    () => applySort(applyFilters(INTEGRATIONS.filter(i => i.connectionStatus !== 'connected'))),
    [search, selectedCategories, remediationOnly, sortBy],
  )

  const baseListForTab =
    activeTab === 'mine'
      ? INTEGRATIONS.filter(i => i.connectionStatus === 'connected')
      : INTEGRATIONS

  const filteredCount =
    activeTab === 'mine'
      ? myIntegrations.length
      : allConnected.length + allAvailable.length

  return (
    <div className="flex gap-5 animate-fade-in">
      {/* Left: Filter panel (collapsible) */}
      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        remediationOnly={remediationOnly}
        onRemediationToggle={() => setRemediationOnly(v => !v)}
        activeSyncedOnly={activeSyncedOnly}
        onActiveSyncedToggle={() => setActiveSyncedOnly(v => !v)}
        hasActiveFilters={hasActiveFilters}
        onClearAll={handleClearAll}
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(v => !v)}
      />

      {/* Right: Header + grid */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <GalleryHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredCount={filteredCount}
          totalCount={baseListForTab.length}
          connectedCount={GALLERY_STATS.connected}
          onPresent={onPresent}
          onRequestIntegration={onRequestIntegration}
        />

        {/* ── MY INTEGRATIONS tab ── */}
        {activeTab === 'mine' && (
          <>
            {myIntegrations.length === 0 && !hasActiveFilters && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Plug size={24} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">No integrations connected yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Connect your first app to start building your identity graph.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-xs font-semibold text-linx-orange hover:underline"
                >
                  Browse all integrations →
                </button>
              </div>
            )}

            {myIntegrations.length === 0 && hasActiveFilters && (
              <EmptyFiltered onClear={handleClearAll} />
            )}

            {myIntegrations.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {myIntegrations.map((integration, i) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    index={i}
                    onConnect={onConnect}
                    onConfigure={onConfigure}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ALL INTEGRATIONS tab ── */}
        {activeTab === 'all' && (
          <>
            {allConnected.length === 0 && allAvailable.length === 0 && (
              <EmptyFiltered onClear={handleClearAll} />
            )}

            {/* Connected section */}
            {allConnected.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Connected ({allConnected.length})
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="flex flex-wrap gap-6">
                  {allConnected.map((integration, i) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      index={i}
                      onConnect={onConnect}
                      onConfigure={onConfigure}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Available / Coming Soon section */}
            {allAvailable.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Available to Connect ({allAvailable.length})
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="flex flex-wrap gap-6">
                  {allAvailable.map((integration, i) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      index={allConnected.length + i}
                      onConnect={onConnect}
                      onConfigure={onConfigure}
                    />
                  ))}
                  <MissingIntegrationCard onRequest={onRequestIntegration} />
                </div>
              </section>
            )}

            {/* Edge case: no available but show request card anyway */}
            {allAvailable.length === 0 && allConnected.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Available to Connect
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="flex flex-wrap gap-6">
                  <MissingIntegrationCard onRequest={onRequestIntegration} />
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyFiltered({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Search size={24} className="text-slate-300" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">No integrations match your filters</p>
        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filter criteria.</p>
      </div>
      <button onClick={onClear} className="text-xs font-semibold text-linx-orange hover:underline">
        Clear all filters
      </button>
    </div>
  )
}
