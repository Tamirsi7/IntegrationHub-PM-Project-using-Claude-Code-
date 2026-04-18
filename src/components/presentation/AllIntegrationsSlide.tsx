import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { INTEGRATIONS } from '@/data/integrations'
import { IntegrationCard } from '@/components/gallery/IntegrationCard'
import { GalleryHeader } from '@/components/gallery/GalleryHeader'
import { FilterPanel } from '@/components/gallery/FilterPanel'
import { MissingIntegrationCard } from '@/components/gallery/MissingIntegrationCard'
import { type IntegrationCategory } from '@/data/integrations'

interface AllIntegrationsSlideProps {
  onBack: () => void
  onConnectSlack: () => void
}

export function AllIntegrationsSlide({ onBack, onConnectSlack }: AllIntegrationsSlideProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<IntegrationCategory>>(new Set())
  const [remediationOnly, setRemediationOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'category'>('status')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const hasActiveFilters = search.trim().length > 0 || selectedCategories.size > 0 || remediationOnly

  function handleClearAll() {
    setSearch('')
    setSelectedCategories(new Set())
    setRemediationOnly(false)
  }

  function applyFilters(list: typeof INTEGRATIONS) {
    let result = list
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.tagline.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
      )
    }
    if (selectedCategories.size > 0) {
      result = result.filter(i => selectedCategories.has(i.category))
    }
    return result
  }

  const connected = applyFilters(INTEGRATIONS.filter(i => i.connectionStatus === 'connected'))
  const available = applyFilters(INTEGRATIONS.filter(i => i.connectionStatus !== 'connected'))

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={14} />
        Back to Integration Hub
      </button>

      <div className="flex gap-5">
        {/* Filter panel */}
        <FilterPanel
          search={search}
          onSearchChange={setSearch}
          selectedCategories={selectedCategories}
          onCategoryToggle={(cat) => setSelectedCategories(prev => {
            const next = new Set(prev)
            if (next.has(cat)) next.delete(cat)
            else next.add(cat)
            return next
          })}
          remediationOnly={remediationOnly}
          onRemediationToggle={() => setRemediationOnly(v => !v)}
          activeSyncedOnly={false}
          onActiveSyncedToggle={() => {}}
          hasActiveFilters={hasActiveFilters}
          onClearAll={handleClearAll}
          collapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed(v => !v)}
        />

        {/* Right: content */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <GalleryHeader
            activeTab="all"
            onTabChange={() => {}}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filteredCount={connected.length + available.length}
            totalCount={INTEGRATIONS.length}
            connectedCount={connected.length}
          />

          {/* Connected section */}
          {connected.length > 0 && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Connected ({connected.length})
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="flex flex-wrap gap-6">
                {connected.map((integration, i) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    index={i}
                    onConnect={() => {}}
                    onConfigure={() => {}}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Available section */}
          {available.length > 0 && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Available to Connect ({available.length})
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="flex flex-wrap gap-6">
                {available.map((integration, i) => {
                  if (integration.id === 'slack') {
                    // Highlight Slack with a conspicuous connect ring + CTA
                    return (
                      <div key={integration.id} className="relative">
                        {/* Conspicuous ring overlay */}
                        <div className="absolute inset-0 z-10 flex items-start justify-center pointer-events-none pt-3 pl-3">
                          <div className="h-36 w-36 rounded-full ring-4 ring-linx-orange ring-offset-2 animate-pulse" />
                        </div>
                        <IntegrationCard
                          integration={integration}
                          index={connected.length + i}
                          onConnect={onConnectSlack}
                          onConfigure={() => {}}
                        />
                        {/* CTA label below */}
                        <button
                          onClick={onConnectSlack}
                          className="mt-1 w-full rounded-lg bg-linx-orange px-3 py-1.5 text-[10px] font-bold text-white shadow-offset-orange transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                          Start Sync →
                        </button>
                      </div>
                    )
                  }
                  return (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      index={connected.length + i}
                      onConnect={() => {}}
                      onConfigure={() => {}}
                    />
                  )
                })}
                <MissingIntegrationCard />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
