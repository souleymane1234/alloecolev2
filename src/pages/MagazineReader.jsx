import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowBack,
  ArrowForward,
  Close,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  PictureAsPdf,
  Download
} from '@mui/icons-material';
import { CircularProgress, Alert } from '@mui/material';
import magazineService from '../services/magazineService';
import './MagazineReader.css';

const MagazineReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const magazineFromState = location.state?.magazine;

  // Récupérer le magazine depuis l'API si pas dans le state
  const { data: magazineData, isLoading, error } = useQuery({
    queryKey: ['magazine', id],
    queryFn: () => magazineService.getMagazineById(id),
    enabled: !!id && !magazineFromState,
    staleTime: 5 * 60 * 1000,
  });

  const magazine = magazineFromState || magazineData;

  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' ou 'pages'
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pages du magazine avec contenu (fallback si pas de PDF)
  const totalPages = 32;
  
  // Générer du contenu pour chaque page
  const generatePageContent = (pageNum) => {
    const isLeftPage = pageNum % 2 === 1;
    const topics = [
      { title: 'Actualités Campus', color: '#2196F3' },
      { title: 'Sciences & Tech', color: '#4CAF50' },
      { title: 'Culture & Arts', color: '#E91E63' },
      { title: 'Sport & Bien-être', color: '#FF9800' },
      { title: 'Vie Étudiante', color: '#9C27B0' }
    ];
    const topic = topics[Math.floor((pageNum / 2) % topics.length)];
    
    return {
      number: pageNum,
      topic: topic,
      isLeftPage: isLeftPage
    };
  };

  const pages = Array.from({ length: totalPages }, (_, i) => 
    generatePageContent(i + 1)
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 2 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentPage(currentPage + 2);
        setIsFlipping(false);
        setFlipDirection('');
      }, 600);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentPage(currentPage - 2);
        setIsFlipping(false);
        setFlipDirection('');
      }, 600);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.25);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.25);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    navigate('/magazine');
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isFlipping]);

  if (isLoading) {
    return (
      <div className="magazine-reader">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="magazine-reader">
        <div className="reader-error">
          <Alert severity="error">
            {error?.message || 'Magazine non trouvé'}
          </Alert>
          <button onClick={handleClose} className="back-button">
            Retour aux magazines
          </button>
        </div>
      </div>
    );
  }

  // Formater la date de publication
  const formatPublishedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const publishedDate = formatPublishedDate(magazine.publishedAt);

  return (
    <div className="magazine-reader">
      {/* Header Controls */}
      <div className="reader-header">
        <div className="reader-info">
          <h2>{magazine.title}</h2>
          {publishedDate && <span>{publishedDate}</span>}
        </div>
        <div className="reader-controls">
          {magazine.pdfUrl && (
            <>
              <button 
                onClick={() => setViewMode(viewMode === 'pdf' ? 'pages' : 'pdf')} 
                className="control-btn"
                title={viewMode === 'pdf' ? 'Vue pages' : 'Vue PDF'}
              >
                <PictureAsPdf />
              </button>
              <a 
                href={magazine.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="control-btn"
                title="Télécharger le PDF"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Download />
              </a>
            </>
          )}
          <button onClick={handleZoomOut} className="control-btn" disabled={zoom <= 0.5}>
            <ZoomOut />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="control-btn" disabled={zoom >= 2}>
            <ZoomIn />
          </button>
          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </button>
          <button onClick={handleClose} className="control-btn close-btn">
            <Close />
          </button>
        </div>
      </div>

      {/* Magazine Container */}
      <div className="magazine-container">
        {viewMode === 'pdf' && magazine.pdfUrl ? (
          <div className="pdf-viewer" style={{ transform: `scale(${zoom})` }}>
            <iframe
              src={magazine.pdfUrl}
              title={magazine.title}
              className="pdf-iframe"
              style={{ width: '100%', height: 'calc(100vh - 200px)', border: 'none' }}
            />
          </div>
        ) : (
          <div className="magazine-book" style={{ transform: `scale(${zoom})` }}>
          {/* Page Gauche */}
          <div 
            className={`page page-left ${isFlipping && flipDirection === 'next' ? 'flipping-left' : ''}`}
            style={{ boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.2)' }}
          >
            <div className="page-content">
              <div className="page-header" style={{ borderColor: pages[currentPage]?.topic.color }}>
                <h3 style={{ color: pages[currentPage]?.topic.color }}>
                  {pages[currentPage]?.topic.title}
                </h3>
              </div>
              <div className="page-image" style={{ backgroundColor: pages[currentPage]?.topic.color + '20' }}>
                <div className="image-placeholder" style={{ color: pages[currentPage]?.topic.color }}>
                  📸
                </div>
              </div>
              <div className="page-text">
                <h4>Article {pages[currentPage]?.number}</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                </p>
              </div>
            </div>
            <div className="page-number">{pages[currentPage]?.number}</div>
          </div>

          {/* Page Droite */}
          <div 
            className={`page page-right ${isFlipping && flipDirection === 'prev' ? 'flipping-right' : ''}`}
            style={{ boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.2)' }}
          >
            <div className="page-content">
              <div className="page-header" style={{ borderColor: pages[currentPage + 1]?.topic.color }}>
                <h3 style={{ color: pages[currentPage + 1]?.topic.color }}>
                  {pages[currentPage + 1]?.topic.title}
                </h3>
              </div>
              <div className="page-text">
                <h4>Article {pages[currentPage + 1]?.number}</h4>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                </p>
                <div className="page-quote" style={{ borderLeftColor: pages[currentPage + 1]?.topic.color }}>
                  "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
                </div>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
                </p>
              </div>
              <div className="page-image small" style={{ backgroundColor: pages[currentPage + 1]?.topic.color + '20' }}>
                <div className="image-placeholder" style={{ color: pages[currentPage + 1]?.topic.color }}>
                  📷
                </div>
              </div>
            </div>
            <div className="page-number">{pages[currentPage + 1]?.number}</div>
          </div>

          {/* Page en cours de flip */}
          {isFlipping && flipDirection === 'next' && pages[currentPage + 1] && (
            <div className="page page-flipping flip-next">
              <div className="page-content">
                <div className="page-header" style={{ borderColor: pages[currentPage + 1]?.topic.color }}>
                  <h3 style={{ color: pages[currentPage + 1]?.topic.color }}>
                    {pages[currentPage + 1]?.topic.title}
                  </h3>
                </div>
                <div className="page-text">
                  <h4>Article {pages[currentPage + 1]?.number}</h4>
                  <p>Contenu en cours de chargement...</p>
                </div>
              </div>
              <div className="page-number">{pages[currentPage + 1]?.number}</div>
            </div>
          )}

          {isFlipping && flipDirection === 'prev' && pages[currentPage] && (
            <div className="page page-flipping flip-prev">
              <div className="page-content">
                <div className="page-header" style={{ borderColor: pages[currentPage]?.topic.color }}>
                  <h3 style={{ color: pages[currentPage]?.topic.color }}>
                    {pages[currentPage]?.topic.title}
                  </h3>
                </div>
                <div className="page-text">
                  <h4>Article {pages[currentPage]?.number}</h4>
                  <p>Contenu en cours de chargement...</p>
                </div>
              </div>
              <div className="page-number">{pages[currentPage]?.number}</div>
            </div>
          )}
          </div>
        )}

        {/* Navigation Buttons - seulement en mode pages */}
        {viewMode !== 'pdf' && (
          <>
            <button 
              className="nav-button nav-prev" 
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isFlipping}
            >
              <ArrowBack />
            </button>
            <button 
              className="nav-button nav-next" 
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 2 || isFlipping}
            >
              <ArrowForward />
            </button>
          </>
        )}
      </div>

      {/* Footer Controls */}
      {viewMode !== 'pdf' && (
        <div className="reader-footer">
          <div className="page-indicator">
            <span>Pages {currentPage + 1}-{currentPage + 2} sur {totalPages}</span>
          </div>
          <div className="page-slider">
            <input 
              type="range" 
              min="0" 
              max={totalPages - 2} 
              step="2"
              value={currentPage} 
              onChange={(e) => setCurrentPage(parseInt(e.target.value))}
              className="slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazineReader;

