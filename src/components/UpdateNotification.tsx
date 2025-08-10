import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const UpdateNotification: React.FC = () => {
  const [showUpdateBar, setShowUpdateBar] = useState<boolean>(false)
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW enregistré: ', r)
    },
    onRegisterError(error) {
      console.log('Erreur SW: ', error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      setShowUpdateBar(true)
    }
  }, [needRefresh])

  const close = (): void => {
    setOfflineReady(false)
    setNeedRefresh(false)
    setShowUpdateBar(false)
  }

  const handleUpdate = (): void => {
    updateServiceWorker(true)
    setShowUpdateBar(false)
  }

  if (offlineReady) {
    return (
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: '#28a745',
        color: 'white',
        padding: '12px',
        textAlign: 'center',
        zIndex: 1000,
        fontSize: '14px'
      }}>
        <span>🌐 App prête pour une utilisation hors ligne</span>
        <button 
          onClick={close}
          style={{
            marginLeft: '12px',
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✕
        </button>
      </div>
    )
  }

  if (showUpdateBar && needRefresh) {
    return (
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: '#007bff',
        color: 'white',
        padding: '12px',
        textAlign: 'center',
        zIndex: 1000,
        fontSize: '14px'
      }}>
        <span>🚀 Une nouvelle version est disponible</span>
        <button 
          onClick={handleUpdate}
          style={{
            marginLeft: '12px',
            background: 'white',
            color: '#007bff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          Mettre à jour
        </button>
        <button 
          onClick={close}
          style={{
            marginLeft: '8px',
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Plus tard
        </button>
      </div>
    )
  }

  return null
}

export default UpdateNotification