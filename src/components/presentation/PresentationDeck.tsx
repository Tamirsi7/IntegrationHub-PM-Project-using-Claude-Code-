import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SLIDES, MAIN_FLOW, type SlideId, type SlideDef } from './slideData'
import { Hotspot } from './Hotspot'
import { IntegrationGallery } from '@/components/gallery/IntegrationGallery'
import { Step1Connect } from '@/components/integration/Step1Connect'
import { Step2Permissions } from '@/components/integration/Step2Permissions'
import { Step3Config } from '@/components/integration/Step3Config'
import { Step4Syncing } from '@/components/integration/Step4Syncing'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { SyncSettingsModal } from '@/components/dashboard/SyncSettingsModal'
import { OKTA_DASHBOARD, type DashboardData } from '@/data/mockData'
import { IntegrationRequestForm } from './IntegrationRequestForm'
import { AllIntegrationsSlide } from './AllIntegrationsSlide'

interface PresentationDeckProps {
  onExit: () => void
}

const SLACK_DASHBOARD_DATA: DashboardData = {
  ...OKTA_DASHBOARD,
  supportsWebhook: true,
  integrationName: 'Slack',
  health: {
    ...OKTA_DASHBOARD.health,
    status: 'Healthy',
    lastSync: '2 min ago',
    nextSync: 'in 3:58 hrs',
    apiCallsUsed: 847,
    apiCallsTotal: 10000,
  },
  entityCounts: {
    accounts:       { total: 247, human: 218, nhi: 29 },
    groups:         38,
    roles:          12,
    resources:      156,
    groupsLabel:    'Channels & teams',
    rolesLabel:     'Privilege levels',
    resourcesLabel: 'Channels & apps',
  },
}

// ─── Slide content renderer ────────────────────────────────────────────────
interface SlideContentProps {
  slide: SlideDef
  onNavigate: (id: SlideId, opts?: { visibleHotspots?: number }) => void
}

function SlideContent({ slide, onNavigate }: SlideContentProps) {
  const noop = () => {}
  const noopMode = (_mode: unknown) => {}

  const connectCard = (children: React.ReactNode) => (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-offset">
        {children}
      </div>
    </div>
  )

  switch (slide.id) {
    case 'gallery':
      return <IntegrationGallery onConnect={noop} onConfigure={noop} />

    case 'connect':
      return connectCard(<Step1Connect onNext={() => onNavigate('permissions')} />)

    case 'gallery-all':
      return (
        <AllIntegrationsSlide
          onBack={() => onNavigate('gallery')}
          onConnectSlack={() => onNavigate('connect')}
        />
      )

    case 'request-form':
      return (
        <IntegrationRequestForm
          onBack={() => onNavigate('gallery')}
          onSubmitted={() => onNavigate('gallery', { visibleHotspots: 4 })}
        />
      )

    case 'permissions':
      return connectCard(<Step2Permissions onNext={noopMode} onBack={noop} />)

    case 'permissions-remediation':
      // initialMode="remediation" auto-selects Active Remediation on mount
      return connectCard(<Step2Permissions onNext={noopMode} onBack={noop} initialMode="remediation" />)

    case 'config':
      return connectCard(<Step3Config onNext={noop} onBack={noop} />)

    case 'syncing':
      // key="syncing" ensures a fresh mount every time we land on this slide
      return connectCard(<Step4Syncing key="syncing" onComplete={noop} frozen={true} frozenPhase="syncing" />)

    case 'success':
      // key="success" ensures a fresh mount — fixes the "shows syncing" bug
      return connectCard(<Step4Syncing key="success" onComplete={noop} frozen={true} frozenPhase="success" />)

    case 'dashboard':
      return <Dashboard mode="visibility" data={SLACK_DASHBOARD_DATA} />
  }
}

// ─── Deck ──────────────────────────────────────────────────────────────────
export function PresentationDeck({ onExit }: PresentationDeckProps) {
  // currentSlide indexes into SLIDES (includes satellites)
  const [currentSlideId, setCurrentSlideId] = useState<SlideId>('gallery')
  const [visibleHotspots, setVisibleHotspots] = useState(1)
  const [flashNext, setFlashNext] = useState(false)
  const [showSyncSettings, setShowSyncSettings] = useState(false)

  const slide = SLIDES.find(s => s.id === currentSlideId)!

  // flashNext stays true until user clicks Next or navigates away (cleared in navigateTo/goNext)

  // The main-flow index for the dot nav & slide counter
  const mainFlowIndex = MAIN_FLOW.findIndex(s => s.id === currentSlideId)
  // For satellites, show parent main-flow slide as "current" in dots
  const dotIndex = mainFlowIndex >= 0 ? mainFlowIndex : -1

  function navigateTo(id: SlideId, opts?: { visibleHotspots?: number }) {
    setCurrentSlideId(id)
    setVisibleHotspots(opts?.visibleHotspots ?? 1)
    setFlashNext(false)
  }

  // Call after advancing visibleHotspots — triggers Next flash when all hotspots done
  function maybeFlashNext(newVisible: number, totalHotspots: number) {
    if (newVisible > totalHotspots) setFlashNext(true)
  }

  function goNext() {
    // If currently on a satellite, return to its parent main-flow slide
    if (slide.satellite) {
      // Find the main-flow slide that comes right after the satellite's "origin"
      // For now satellites always return via their own back button; Next goes to next main-flow
      const originMainIdx = MAIN_FLOW.findIndex(s => s.id === currentSlideId)
      if (originMainIdx === -1) {
        // satellite — go to next main-flow slide after the slide that launched it
        // We store the "return-to" slide via the slideData order
        const satelliteIdx = SLIDES.findIndex(s => s.id === currentSlideId)
        // find next non-satellite after this position
        const next = SLIDES.slice(satelliteIdx + 1).find(s => !s.satellite)
        if (next) navigateTo(next.id)
        return
      }
    }
    const idx = MAIN_FLOW.findIndex(s => s.id === currentSlideId)
    if (idx < MAIN_FLOW.length - 1) {
      navigateTo(MAIN_FLOW[idx + 1].id)
    }
  }

  function goPrev() {
    if (slide.satellite) {
      // Back from satellite — find previous main-flow slide
      const satelliteIdx = SLIDES.findIndex(s => s.id === currentSlideId)
      const prev = SLIDES.slice(0, satelliteIdx).reverse().find(s => !s.satellite)
      if (prev) navigateTo(prev.id)
      return
    }
    const idx = MAIN_FLOW.findIndex(s => s.id === currentSlideId)
    if (idx > 0) {
      navigateTo(MAIN_FLOW[idx - 1].id)
    }
  }

  // When a hotspot's close (green ✓) is triggered, reveal next hotspot
  // Special case: closing a hotspot that has an actionType also triggers that action
  function handleHotspotClose(number: number) {
    const hotspot = slide.hotspots.find(h => h.annotation.number === number)
    if (number >= visibleHotspots) {
      const next = number + 1
      setVisibleHotspots(next)
      maybeFlashNext(next, slide.hotspots.length)
    }
    // If this hotspot has a navigation action, closing it also triggers the navigation
    if (hotspot?.actionType === 'all-integrations') {
      navigateTo('gallery-all')
    } else if (hotspot?.actionSlide) {
      const startVisible = hotspot.actionSlide === 'permissions-remediation' ? 2 : 1
      navigateTo(hotspot.actionSlide, { visibleHotspots: startVisible })
    }
  }

  // When a hotspot's action button is clicked → navigate + also advance hotspot
  function handleHotspotAction(hotspotId: string) {
    const hotspot = slide.hotspots.find(h => h.id === hotspotId)
    if (!hotspot) return
    // Advance reveal counter — but don't flash since we're navigating away
    if (hotspot.annotation.number >= visibleHotspots) {
      setVisibleHotspots(hotspot.annotation.number + 1)
    }
    // Navigate
    if (hotspot.actionSlide) {
      // permissions-remediation starts at hotspot #2 since #1 already fired the action
      const startVisible = hotspot.actionSlide === 'permissions-remediation' ? 2 : 1
      navigateTo(hotspot.actionSlide, { visibleHotspots: startVisible })
    } else if (hotspot.actionType === 'request-form') {
      navigateTo('request-form')
    } else if (hotspot.actionType === 'all-integrations') {
      navigateTo('gallery-all')
    } else if (hotspot.actionType === 'sync-settings') {
      setShowSyncSettings(true)
    }
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
      else if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onExit, currentSlideId, visibleHotspots])

  // Slides whose content is interactive (pointer-events enabled)
  const isInteractiveSlide = slide.satellite || slide.id === 'connect'
  const hasHotspots = slide.hotspots.length > 0

  const isFirst = MAIN_FLOW[0].id === currentSlideId && !slide.satellite
  const isLast  = MAIN_FLOW[MAIN_FLOW.length - 1].id === currentSlideId && !slide.satellite

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-cream">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <line x1="10" y1="2"  x2="10" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="2"  y1="10" x2="18" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="4"  y1="4"  x2="16" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="16" y1="4"  x2="4"  y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-900">Linx — PM Annotated Mockup</span>
          <span className="rounded-full bg-linx-yellow px-2 py-0.5 text-[10px] font-black text-slate-900">
            PM Interview Deck
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Click <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">✨</kbd> hotspots · close with <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white text-[9px]">✓</span> to reveal next</span>
          <span className="mx-1">·</span>
          <span>Navigate <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px]">← →</kbd></span>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative mx-auto max-w-screen-xl px-6 py-6">
          <div className={isInteractiveSlide ? '' : 'pointer-events-none select-none'}>
            {/* key forces remount when slide changes — critical for Step4Syncing phase state */}
            <SlideContent key={currentSlideId} slide={slide} onNavigate={navigateTo} />
          </div>

          {hasHotspots && (
            <div className="pointer-events-none absolute inset-0">
              {slide.hotspots.map((hotspot) => {
                const isVisible = hotspot.annotation.number <= visibleHotspots
                const hasAction = hotspot.actionSlide || hotspot.actionType
                const actionLabel =
                  hotspot.actionType === 'request-form'      ? '→ Open Request Form' :
                  hotspot.actionType === 'all-integrations'  ? '→ View All Integrations' :
                  hotspot.actionType === 'sync-settings'     ? '→ Open Sync Settings' :
                  hotspot.actionSlide === 'permissions-remediation' ? '→ See Active Remediation Mode' :
                  hotspot.actionSlide === 'connect'          ? '→ Start Slack Integration' :
                  undefined

                return (
                  <Hotspot
                    key={hotspot.id}
                    def={hotspot}
                    visible={isVisible}
                    onClose={() => handleHotspotClose(hotspot.annotation.number)}
                    actionButton={hasAction && actionLabel ? {
                      label: actionLabel,
                      onClick: () => handleHotspotAction(hotspot.id),
                    } : undefined}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 border-t border-slate-200 bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Left: title */}
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {dotIndex >= 0 ? `Slide ${dotIndex + 1} of ${MAIN_FLOW.length}` : slide.title}
            </span>
            <span className="text-sm font-bold text-slate-900 truncate">{slide.title}</span>
            <span className="text-xs text-slate-500 truncate">{slide.subtitle}</span>
          </div>

          {/* Center: Back / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-offset transition-all hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              ← Back
            </button>
            <button
              onClick={goNext}
              disabled={isLast}
              className={cn(
                'flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-offset transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
                flashNext && !isLast && 'animate-pulse ring-2 ring-linx-yellow ring-offset-2',
              )}
            >
              Next →
            </button>
          </div>

          {/* Right: dots + exit */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {MAIN_FLOW.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => navigateTo(s.id)}
                  title={s.title}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === dotIndex
                      ? 'w-6 bg-linx-yellow shadow-sm'
                      : 'w-2 bg-slate-300 hover:bg-slate-400',
                  )}
                />
              ))}
            </div>
            <button
              onClick={onExit}
              className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
            >
              ✕ Exit
            </button>
          </div>
        </div>
      </nav>

      {showSyncSettings && (
        <SyncSettingsModal
          integrationName="Slack"
          supportsWebhook={true}
          onClose={() => setShowSyncSettings(false)}
        />
      )}
    </div>
  )
}
