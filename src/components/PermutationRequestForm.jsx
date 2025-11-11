import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, AlertCircle, CheckCircle, Search, MessageCircle, Building, ArrowRight } from 'lucide-react';

// Configuration de l'API
const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';

// Utilitaire pour récupérer le token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Utilitaire pour les headers avec authentification
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Service API
const permutationService = {
  // Créer une nouvelle demande de permutation
  createPermutation: async (data) => {
    const response = await fetch(`${API_BASE_URL}/students/transfers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        sourceInstitution: data.sourceInstitution,
        targetInstitution: data.targetInstitution
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de la demande');
    }
    
    return await response.json();
  },

  // Récupérer toutes les permutations
  getAllPermutations: async () => {
    const response = await fetch(`${API_BASE_URL}/students/transfers/public`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des permutations');
    }
    
    return await response.json();
  }
};

// Hook personnalisé pour créer une permutation
const useCreatePermutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: permutationService.createPermutation,
    onSuccess: () => {
      // Invalider et refetch les permutations après création
      queryClient.invalidateQueries({ queryKey: ['permutations'] });
    }
  });
};

// Hook personnalisé pour récupérer les permutations
const usePermutations = () => {
  return useQuery({
    queryKey: ['permutations'],
    queryFn: permutationService.getAllPermutations,
    staleTime: 30000,
    retry: 2,
    select: (data) => {
      // Adapter la réponse de l'API pour toujours retourner un tableau
      if (Array.isArray(data)) {
        return data;
      }
      if (data?.data) {
        return Array.isArray(data.data) ? data.data : [];
      }
      if (data?.transfers) {
        return Array.isArray(data.transfers) ? data.transfers : [];
      }
      if (data?.content) {
        return Array.isArray(data.content) ? data.content : [];
      }
      return [];
    }
  });
};

// Composant Formulaire de Demande
const PermutationRequestForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    sourceInstitution: '',
    targetInstitution: ''
  });

  const createPermutation = useCreatePermutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createPermutation.mutateAsync(formData);
      
      // Réinitialiser le formulaire
      setFormData({
        sourceInstitution: '',
        targetInstitution: ''
      });

      // Appeler le callback de succès
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Demande de Permutation
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Créez une demande de permutation entre établissements
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
            {/* Établissements */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', paddingBottom: '0.75rem', borderBottom: '2px solid #f97316' }}>
                <Building size={24} style={{ marginRight: '0.75rem', color: '#f97316' }} />
                Établissements
              </h2>
              
              <div style={{ display: 'grid', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                    Établissement actuel <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sourceInstitution"
                    value={formData.sourceInstitution}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
                    placeholder="Nom de votre établissement actuel"
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                  <ArrowRight size={24} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                    Établissement souhaité <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="targetInstitution"
                    value={formData.targetInstitution}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
                    placeholder="Nom de l'établissement souhaité"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="submit"
                disabled={createPermutation.isPending}
                style={{
                  background: createPermutation.isPending ? '#d1d5db' : '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: createPermutation.isPending ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {createPermutation.isPending ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Publier ma demande
                  </>
                )}
              </button>

              {createPermutation.isSuccess && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#dcfce7',
                  color: '#166534',
                  border: '1px solid #bbf7d0'
                }}>
                  <CheckCircle size={20} />
                  Votre demande a été publiée avec succès !
                </div>
              )}

              {createPermutation.isError && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca'
                }}>
                  <AlertCircle size={20} />
                  {createPermutation.error?.message || 'Une erreur est survenue. Veuillez réessayer.'}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

// Composant Liste des Permutations
const PermutationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: permutations = [], isLoading, isError, error, refetch } = usePermutations();
  
  const filteredPermutations = Array.isArray(permutations) ? permutations.filter(permutation => {
    const matchesSearch =
      (permutation.sourceInstitution || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permutation.targetInstitution || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || permutation.status === selectedFilter;

    return matchesSearch && matchesFilter;
  }) : [];

  const sortedPermutations = [...filteredPermutations].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (isLoading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #f97316',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Chargement des permutations...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <AlertCircle size={64} style={{ margin: '0 auto 1rem', color: '#dc2626' }} />
        <div style={{ fontSize: '1.5rem', color: '#dc2626', marginBottom: '1rem' }}>
          {error?.message || 'Impossible de charger les permutations'}
        </div>
        <button
          onClick={() => refetch()}
          style={{
            background: '#f97316',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Demandes de Permutation
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Consultez les demandes de permutation entre établissements
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} size={20} />
              <input
                type="text"
                placeholder="Rechercher par établissement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
              />
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{ padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem', background: 'white', cursor: 'pointer' }}
            >
              <option value="all">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ACCEPTEE">Acceptée</option>
              <option value="REFUSEE">Refusée</option>
            </select>
          </div>
        </div>

        {sortedPermutations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
            <Search size={64} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucune demande trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
            {sortedPermutations.map((permutation) => (
              <div
                key={permutation.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  borderLeft: '4px solid #f97316',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}>
                      {permutation.studentId ? permutation.studentId.slice(0, 2).toUpperCase() : 'ET'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                        Permutation 
                      </h3>
                    </div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: permutation.status === 'EN_ATTENTE' ? '#fef3c7' : permutation.status === 'ACCEPTEE' ? '#dcfce7' : '#fee2e2',
                    color: permutation.status === 'EN_ATTENTE' ? '#92400e' : permutation.status === 'ACCEPTEE' ? '#166534' : '#dc2626'
                  }}>
                    {permutation.status === 'EN_ATTENTE' ? 'En attente' : permutation.status === 'ACCEPTEE' ? 'Acceptée' : 'Refusée'}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#f97316',
                      borderRadius: '50%',
                      marginTop: '0.5rem',
                      marginRight: '1rem',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Établissement actuel
                      </div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>
                        {permutation.sourceInstitution}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0', color: '#f97316' }}>
                    <ArrowRight size={20} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#f97316',
                      borderRadius: '50%',
                      marginTop: '0.5rem',
                      marginRight: '1rem',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Établissement souhaité
                      </div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>
                        {permutation.targetInstitution}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#ea580c'}
                  onMouseLeave={(e) => e.target.style.background = '#f97316'}
                  onClick={() => {
                    // Action de contact à définir
                    console.log('Contacter pour la permutation:', permutation.id);
                  }}
                >
                  <MessageCircle size={16} />
                  Contacter
                </button>

                {permutation.createdAt && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                    Publié le {new Date(permutation.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

// Composant Principal
const PermutationSystem = () => {
  const [activeView, setActiveView] = useState('list'); // 'list' ou 'form'
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmitSuccess = (result) => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setActiveView('list');
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navigation */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveView('list')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeView === 'list' ? '#f97316' : 'white',
              color: activeView === 'list' ? 'white' : '#6b7280',
              border: `2px solid ${activeView === 'list' ? '#f97316' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Liste des demandes
          </button>
          <button
            onClick={() => setActiveView('form')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeView === 'form' ? '#f97316' : 'white',
              color: activeView === 'form' ? 'white' : '#6b7280',
              border: `2px solid ${activeView === 'form' ? '#f97316' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Créer une demande
          </button>
        </div>
      </div>

      {/* Message de succès global */}
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '5rem',
          right: '1rem',
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle size={20} />
          Demande créée avec succès ! Redirection vers la liste...
        </div>
      )}

      {/* Contenu */}
      {activeView === 'list' ? (
        <PermutationList />
      ) : (
        <PermutationRequestForm onSubmitSuccess={handleSubmitSuccess} />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          [style*="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PermutationSystem;