import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { ConnectFlow } from '@/components/integration/ConnectFlow'
import { type IntegrationMode } from '@/components/integration/Step2Permissions'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { IntegrationGallery } from '@/components/gallery/IntegrationGallery'
import { PresentationDeck } from '@/components/presentation/PresentationDeck'
import { IntegrationRequestForm } from '@/components/presentation/IntegrationRequestForm'
import { DASHBOARD_BY_ID, OKTA_DASHBOARD } from '@/data/mockData'
import { INTEGRATIONS } from '@/data/integrations'

type View = 'gallery' | 'integrations' | 'dashboard' | 'presentation' | 'request-form'

export function App() {
  const [view, setView] = useState<View>('gallery')
  const [connectStep] = useState<string>('Connect')
  const [hasNotification, setHasNotification] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [integrationMode, setIntegrationMode] = useState<IntegrationMode>('visibility')
  const [integrationId, setIntegrationId] = useState<string>('okta')

  const integrationName = INTEGRATIONS.find(i => i.id === integrationId)?.name ?? integrationId
  const dashboardData = DASHBOARD_BY_ID[integrationId] ?? OKTA_DASHBOARD

  // Build clickable breadcrumb based on current view
  const breadcrumb =
    view === 'dashboard'
      ? [
          { label: 'Integrations', onClick: () => setView('gallery') },
          { label: integrationName, onClick: () => setView('integrations') },
          { label: 'Dashboard' },
        ]
      : view === 'integrations'
      ? [
          { label: 'Integrations', onClick: () => setView('gallery') },
          { label: integrationName, onClick: undefined },
          { label: connectStep },
        ]
      : view === 'request-form'
      ? [
          { label: 'Integrations', onClick: () => setView('gallery') },
          { label: 'Request Integration' },
        ]
      : [
          { label: 'Integrations' },
        ]

  function handleNavigate(page: string) {
    if (page === 'integrations') {
      setView('gallery')
    } else if (page === 'dashboard') {
      setView('dashboard')
    }
  }

  function handleSyncComplete() {
    setHasNotification(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 6000)
  }

  function handleBellClick() {
    setShowToast((prev) => !prev)
    setHasNotification(false)
  }

  function handleToastDismiss() {
    setShowToast(false)
  }

  if (view === 'presentation') {
    return <PresentationDeck onExit={() => setView('gallery')} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar activePage={view === 'dashboard' ? 'dashboard' : 'integrations'} onNavigate={handleNavigate} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          breadcrumb={breadcrumb}
          hasNotification={hasNotification}
          showToast={showToast}
          onBellClick={handleBellClick}
          onToastDismiss={handleToastDismiss}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {view === 'gallery' && (
            <IntegrationGallery
              onConnect={(_id) => { setIntegrationId('slack'); setView('integrations') }}
              onConfigure={(id) => { setIntegrationId(id); setView('dashboard') }}
              onPresent={() => setView('presentation')}
              onRequestIntegration={() => setView('request-form')}
            />
          )}
          {view === 'integrations' && (
            <ConnectFlow
              onComplete={(mode) => { setIntegrationMode(mode); setView('dashboard') }}
              onSyncComplete={handleSyncComplete}
            />
          )}
          {view === 'dashboard' && (
            <Dashboard mode={integrationMode} data={dashboardData} />
          )}
          {view === 'request-form' && (
            <IntegrationRequestForm
              onBack={() => setView('gallery')}
              onSubmitted={() => setView('gallery')}
            />
          )}
        </main>
      </div>
    </div>
  )
}
