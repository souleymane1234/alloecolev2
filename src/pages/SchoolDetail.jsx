import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`https://alloecoleapi-dev.up.railway.app/api/v1/students/schools/${id}`);
      
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      
      const result = await response.json();
  
      if (result.success && result.data) {
        const apiData = result.data;
        const name = apiData.name.toLowerCase();
        
        let level = 'université';
        if (name.includes('primaire') || name.includes('école primaire')) level = 'primaire';
        else if (name.includes('collège') || name.includes('college')) level = 'collège';
        else if (name.includes('lycée') || name.includes('lycee')) level = 'lycée';
  
        const slogan = (apiData.slogan || '').toLowerCase();
        let filiere = 'général';
        if (name.includes('commerce') || slogan.includes('commerce') || slogan.includes('management')) filiere = 'commerce';
        else if (name.includes('technique') || name.includes('polytechnique') || name.includes('technologie') || slogan.includes('technologie')) filiere = 'technique';
        else if (name.includes('santé') || name.includes('sante') || name.includes('médecine')) filiere = 'santé';
        else if (name.includes('art') || name.includes('culture')) filiere = 'art';
  
        const formattedSchool = {
          id: apiData.id,
          name: apiData.name,
          level,
          filiere,
          logo: apiData.logoUrl || "/images/poster/ecole.png",
          banner: apiData.bannerUrl || "/images/poster/ecole.png",
          videoPresentationUrl: apiData.videoPresentationUrl || "/video/video.mp4",
          address: apiData.address || `${apiData.city}, ${apiData.region}`,
          phone: apiData.phone || null,
          email: apiData.email || null,
          website: apiData.website || null,
          description: apiData.description || apiData.slogan || "",
          foundedYear: apiData.createdAt ? new Date(apiData.createdAt).getFullYear() : null,
          director: apiData.directorWords?.directorName || "Direction",
          slogan: apiData.slogan,
          isVerified: apiData.isVerified,
          region: apiData.region,
          city: apiData.city,
          programs: apiData.programs || [],
          services: apiData.services || [],
          amenities: apiData.amenities || [],
          strengths: apiData.strengths || [],
          statistics: apiData.statistics || [],
          directorWords: apiData.directorWords || null,
          media: apiData.media || []
        };
  
        setSchool(formattedSchool);
      }
    } catch (err) {
      setError(err.message || "Impossible de charger les détails de l'école");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSchoolDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{`
          .loading { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fefaf8; }
          .spinner { width: 50px; height: 50px; border: 4px solid #f3f4f6; border-top-color: #ea580c; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="loading"><div className="spinner"></div></div>
      </>
    );
  }

  if (error || !school) {
    return (
      <>
        <style>{`
          .error { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fefaf8; text-align: center; }
          .back-btn { background: #ea580c; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; margin-top: 1rem; }
        `}</style>
        <div className="error">
          <div>
            <h2>Erreur</h2>
            <p>{error || "École non trouvée"}</p>
            <button onClick={() => navigate('/schools')} className="back-btn">Retour</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .page { min-height: 100vh; background: #fefaf8; padding: 2rem 0; width: 100%; }
        .container { max-width: 100%; width: 100%; margin: 0 auto; padding: 0 2rem; }
        .header { background: white; border-radius: 1rem; margin-bottom: 2rem; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .banner { height: 400px; background: linear-gradient(45deg, #ea580c, #f97316); overflow: hidden; }
        .banner video { width: 100%; height: 100%; object-fit: cover; }
        .info { padding: 2rem; }
        .name-container { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
        .logo { width: 120px; height: 120px; object-fit: contain; background: white; border-radius: 1rem; padding: 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .name { font-size: 2rem; font-weight: 700; color: #1f2937; }
        .badges { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
        .badge { padding: 0.4rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; }
        .level { background: #ea580c; color: white; }
        .verified { display: inline-flex; align-items: center; gap: 0.35rem; background: #10b981; color: white; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .section { background: #e8e8e8; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 700; color: #4a5568; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 3px solid #ea580c; }
        .section-title::before { content: '||'; color: #ea580c; font-weight: 900; font-size: 1.2rem; }
        .info-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .info-item { display: flex; align-items: flex-start; gap: 0.75rem; }
        .bullet { color: #ea580c; font-weight: 900; font-size: 1.2rem; }
        .label { font-weight: 600; color: #1f2937; min-width: 140px; }
        .value { color: #1f2937; background: #b8e6e6; padding: 0.4rem 0.75rem; border-radius: 0.35rem; font-style: italic; flex: 1; }
        .value.dark { background: #4a5568; color: white; font-style: normal; }
        .list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
        .list li { display: flex; align-items: flex-start; gap: 0.75rem; color: #1f2937; }
        .list li::before { content: '○'; color: #ea580c; font-weight: 900; }
        .right { display: flex; flex-direction: column; gap: 1.5rem; }
        .dir-wrap { display: flex; gap: 1.5rem; align-items: flex-start; }
        .dir-img { width: 140px; height: 140px; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .dir-img img { width: 100%; height: 100%; object-fit: cover; }
        .dir-text { flex: 1; }
        .dir-text p { color: #1f2937; line-height: 1.7; font-size: 0.95rem; }
        .read-more { color: #ea580c; font-weight: 600; cursor: pointer; }
        .echo { background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .card { background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-top: 1rem; }
        .card-img { position: relative; height: 200px; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; }
        .date-badge { position: absolute; top: 1rem; left: 1rem; background: #1f2937; color: white; padding: 0.5rem 0.75rem; border-radius: 0.35rem; display: flex; gap: 0.5rem; font-weight: 700; }
        .day { font-size: 1.25rem; }
        .month { background: #ea580c; padding: 0.25rem 0.75rem; border-radius: 0.25rem; }
        .card-content { padding: 1.25rem; }
        .card-title { font-size: 1.1rem; font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; }
        .card-text { color: #6b7280; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem; }
        @media (max-width: 1200px) { .grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .container { padding: 0 1rem; } .grid { grid-template-columns: 1fr; } .name-container { flex-direction: column; text-align: center; } .dir-wrap { flex-direction: column; } .dir-img { width: 100%; height: 200px; } .right { grid-template-columns: 1fr; } }
      `}</style>

      <div className="page">
        <div className="container">
          <div className="header">
            <div className="banner">
              <video controls autoPlay muted loop poster={school.banner}>
                <source src={school.videoPresentationUrl} type="video/mp4" />
              </video>
            </div>
            <div className="info">
              <div className="name-container">
                <img src={school.logo} alt={school.name} className="logo" />
                <div>
                  <h1 className="name">{school.name}</h1>
                  <div className="badges">
                    <span className="badge level">{school.level.charAt(0).toUpperCase() + school.level.slice(1)}</span>
                    {school.isVerified && <span className="badge verified"><i className="ph-check-circle-fill"></i> Vérifié</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="section">
              <h2 className="section-title">Info école</h2>
              <div className="info-list">
                <div className="info-item"><span className="bullet">○</span><span className="label">Slogan:</span><span className="value">{school.slogan || 'Aucune donnée'}</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Fondée par:</span><span className="value">Aucune donnée</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Directeur:</span><span className="value">Aucune donnée</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Fondée le:</span><span className="value">{school.foundedYear || 'Aucune donnée'}</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Contact:</span><span className="value">{school.phone || 'Aucune donnée'}</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Moyens d'accès:</span><span className="value dark">des cars de ramassage mis à disposition</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">E-Mail:</span><span className="value">{school.email || 'Aucune donnée'}</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Région:</span><span className="value dark">{school.region}</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Ville:</span><span className="value dark">{school.city}</span></div>
                <div className="info-item"><span className="bullet">○</span><span className="label">Localisation:</span><span className="value dark">{school.address}</span></div>
            </div>

              <h2 className="section-title" style={{marginTop: '2rem'}}>Filières & Formations</h2>
              {school.programs?.length > 0 ? (
                <ul className="list">
                  {school.programs.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
              ) : <p style={{color: '#6b7280', fontStyle: 'italic'}}>Aucune donnée</p>}

              <h2 className="section-title" style={{marginTop: '2rem'}}>Autres Infos</h2>
              <div className="info-list">
                {school.services?.length > 0 && (
                  <div className="info-item">
                    <span className="bullet">○</span>
                    <span className="label">Services:</span>
                    <span className="value">{school.services.map(s => s.name).join(', ')}</span>
                  </div>
                )}
                {school.amenities?.length > 0 && (
                  <div className="info-item">
                    <span className="bullet">○</span>
                    <span className="label">Commodités:</span>
                    <span className="value">{school.amenities.map(a => a.name).join(', ')}</span>
                  </div>
                )}
                {school.strengths?.length > 0 && (
                  <div className="info-item">
                    <span className="bullet">○</span>
                    <span className="label">Atouts:</span>
                    <span className="value">{school.strengths.map(s => s.name).join(', ')}</span>
                  </div>
                )}
                {(!school.services?.length && !school.amenities?.length && !school.strengths?.length) && (
                  <p style={{color: '#6b7280', fontStyle: 'italic'}}>Aucune donnée</p>
                )}
              </div>

              <h2 className="section-title" style={{marginTop: '2rem'}}>{school.name} en chiffre</h2>
              {school.statistics?.length > 0 ? (
                <div className="info-list">
                  {school.statistics.map((stat, index) => (
                    <div key={index} className="info-item">
                      <span className="bullet">○</span>
                      <span className="label">{stat.name}:</span>
                      <span className="value dark">{stat.value}</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{color: '#6b7280', fontStyle: 'italic'}}>Aucune donnée</p>}

              <h2 className="section-title" style={{marginTop: '2rem'}}>Médiatèque</h2>
              {school.media?.length > 0 ? (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem'}}>
                  {school.media.map((item, index) => (
                    <div key={index} style={{position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                      {item.type === 'IMAGE' ? (
                        <img src={item.url} alt={`Média ${index + 1}`} style={{width: '100%', height: '150px', objectFit: 'cover'}} />
                      ) : item.type === 'VIDEO' ? (
                        <video src={item.url} style={{width: '100%', height: '150px', objectFit: 'cover'}} controls />
                      ) : (
                        <div style={{width: '100%', height: '150px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <i className="ph-file" style={{fontSize: '2rem', color: '#9ca3af'}}></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p style={{color: '#6b7280', fontStyle: 'italic'}}>Aucune donnée</p>}
            </div>

            <div className="right">
              {school.directorWords && (
                <div className="section">
                  <h2 className="section-title">Mot du Directeur</h2>
                  <div className="dir-wrap">
                    <div className="dir-img"><img src={school.logo} alt="Directeur" /></div>
                    <div className="dir-text">
                      <p>{school.directorWords.content?.substring(0, 200)}... <span className="read-more">Voir Plus ⊙</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="section">
                <h2 className="section-title">Services de l'école</h2>
                <p style={{color: '#6b7280', fontStyle: 'italic'}}>{school.services?.length > 0 ? school.services.map(s => s.name).join(', ') : 'Aucune donnée'}</p>
              </div>

              <div className="section">
                <h2 className="section-title">Atouts de l'école</h2>
                {school.strengths?.length > 0 ? (
                  <ul className="list">
                    {school.strengths.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                ) : <p style={{color: '#6b7280', fontStyle: 'italic'}}>Aucune donnée</p>}
              </div>

              <div className="section">
                <h2 className="section-title">Commodités de l'école</h2>
                {school.amenities?.length > 0 ? (
                  <ul className="list">
                    {school.amenities.map(a => <li key={a.id}>{a.name}</li>)}
                  </ul>
                ) : <p style={{color: '#6b7280', fontStyle: 'italic'}}>Aucune donnée</p>}
              </div>

              <div className="echo">
                <h2 className="section-title">Echo école</h2>
                <div className="card">
                  <div className="card-img">
                    <img src={school.media[0]?.url || school.banner} alt="Article" />
                    <div className="date-badge"><span className="day">01</span><span className="month">Juillet</span></div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">552 115 Candidats Au CEPE Cette Année</h3>
                    <p className="card-text">Les épreuves écrites de la session 2019 du CEPE qui enregistrent 552 115 candidats...</p>
                    <span className="read-more">Voir Plus ⊙</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <button onClick={() => navigate('/schools')} style={{background: '#ea580c', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600}}>
              ← Retour aux écoles
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolDetail;