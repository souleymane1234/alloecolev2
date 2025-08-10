import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false)

  useEffect(() => {
    const handler = (e: Event) => {
      // Empêcher l'affichage automatique du navigateur
      e.preventDefault()
      // Stocker l'événement pour l'utiliser plus tard
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false)
    }

    // Vérifier si déjà refusé précédemment
    const dismissed = localStorage.getItem('installPromptDismissed')
    if (dismissed) {
      setShowInstallButton(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt) return

    try {
      // Afficher l'invite d'installation
      await deferredPrompt.prompt()

      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('Utilisateur a accepté l\'installation')
      } else {
        console.log('Utilisateur a refusé l\'installation')
      }

      // Nettoyer
      setDeferredPrompt(null)
      setShowInstallButton(false)
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error)
    }
  }

  const handleDismiss = (): void => {
    setShowInstallButton(false)
    // Stocker dans localStorage pour ne pas réafficher pendant 7 jours
    const dismissUntil = new Date()
    dismissUntil.setDate(dismissUntil.getDate() + 7)
    localStorage.setItem('installPromptDismissed', dismissUntil.toISOString())
  }

  if (!showInstallButton) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #e0e0e0',
      zIndex: 1000,
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px', marginRight: '8px' }}>📱</span>
          <strong style={{ fontSize: '16px' }}>Installer l'application</strong>
        </div>
        <p style={{ 
          margin: '0', 
          fontSize: '14px', 
          color: '#666',
          lineHeight: '1.4'
        }}>
          Installez notre app pour une expérience optimale : accès rapide, notifications et utilisation hors ligne !
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Plus tard
        </button>
        <button 
          onClick={handleInstallClick}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff'
          }}
        >
          🚀 Installer
        </button>
      </div>
    </div>
  )
}

export default InstallPrompt