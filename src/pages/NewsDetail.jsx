import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import './NewsDetail.css';

const transformNewsItem = (item) => {
  if (!item) return null;

  return {
    id: item.id,
    contentType: 'news',
    title: item.title || 'Actualité sans titre',
    image: item.mainImage || item.image || '/images/poster/ecole.png',
    summary: item.summary || item.excerpt || '',
    content: item.content || '',
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString('fr-FR')
      : item.date || 'Date inconnue',
    publishedAt: item.publishedAt,
    views: item.views || 0,
    category: item.category?.name || item.category || null,
    author: item.author || 'AlloEcole',
    slug: item.slug,
    sourceUrl: item.sourceUrl || null,
  };
};

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialItem = location.state?.item;

  const [news, setNews] = useState(() =>
    initialItem ? transformNewsItem(initialItem) : null
  );
  const [loading, setLoading] = useState(!initialItem);
  const [error, setError] = useState(null);

  const pageTitle = useMemo(
    () => (news?.title ? `${news.title} | Actualités` : 'Actualité | AlloEcole'),
    [news]
  );

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    if (initialItem) {
      // Données déjà fournies par la liste
      setLoading(false);
      return;
    }

    if (!slug) return;

    const controller = new AbortController();

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(
          'https://alloecoleapi-dev.up.railway.app/api/v1/news'
        );
        url.searchParams.set('module', 'news');
        url.searchParams.set('page', '1');
        url.searchParams.set('limit', '1');
        // On utilise la recherche texte sur le slug (ou id)
        url.searchParams.set('search', slug);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur (${response.status})`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error('Erreur API lors du chargement de l’actualité');
        }

        const item = Array.isArray(result.data) ? result.data[0] : null;
        const transformed = transformNewsItem(item);

        if (!transformed) {
          throw new Error("Actualité introuvable");
        }

        setNews(transformed);
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.error('Erreur chargement actualité:', e);
        setError(e.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      controller.abort();
    };
  }, [slug, initialItem]);

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-container">
          <div className="news-detail-header">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="icon-sm" />
              <span>Retour</span>
            </button>
          </div>

          <div className="news-detail-skeleton">
            <div className="skeleton-banner" />
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
            <div className="skeleton-paragraph" />
            <div className="skeleton-paragraph short" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-container">
          <div className="news-detail-header">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="icon-sm" />
              <span>Retour</span>
            </button>
          </div>
          <div className="news-detail-error">
            <p>{error || "Cette actualité n’est plus disponible."}</p>
            <Link to="/" className="back-home-link">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="news-detail-container">
        <div className="news-detail-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="icon-sm" />
            <span>Retour</span>
          </button>
        </div>

        <div className="news-detail-layout">
          <article className="news-main">
            {news.category && (
              <div className="news-category">{news.category}</div>
            )}

            <h1 className="news-title">{news.title}</h1>

            <div className="news-meta">
              <div className="meta-item">
                <Calendar className="icon-sm" />
                <span>{news.date}</span>
              </div>
              <div className="meta-item">
                <User className="icon-sm" />
                <span>{news.author}</span>
              </div>
              <div className="meta-item">
                <Eye className="icon-sm" />
                <span>{news.views} vues</span>
              </div>
            </div>

            {news.image && (
              <div className="news-cover">
                <img src={news.image} alt={news.title} />
              </div>
            )}

            {news.summary && (
              <p className="news-summary">{news.summary}</p>
            )}

            {news.content && (
              <div className="news-content">
                {news.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
            )}

            {news.sourceUrl && (
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="news-source-link"
              >
                Voir la source officielle
              </a>
            )}
          </article>

          <aside className="news-aside">
            <div className="news-aside-card">
              <h2>Continuer votre exploration</h2>
              <ul>
                <li>
                  <Link to="/bourses">Voir les bourses d’études</Link>
                </li>
                <li>
                  <Link to="/schools">Découvrir les écoles</Link>
                </li>
                <li>
                  <Link to="/webtv">Regarder la WebTV</Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;

