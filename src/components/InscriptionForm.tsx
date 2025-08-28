import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
  competitionCode?: any;
};

const InscriptionForm = ({ competitionCode }: Props) => {
  interface User {
    code_user_account?: string;
    login_number?: string;
    telephone?: string;
    localisation?: string;
    ville?: string;
    pays?: string;
    nom?: string;
  }
  
  const [user, setUser] = React.useState<User | null>(null);
  const [formData, setFormData] = useState({
    nom_correct: '',
    nom_presentation: '',
    description_presentation: '',
    url_photo_identite: null,
    url_video: null,
  });

  const navigate = useNavigate();


  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUser(storedUser);
    } else {
      alert('Veuillez vous connecter avant de vous inscrire.');
      navigate('/login');
    }
  }, [navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if ((e.target as HTMLInputElement).files) {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).files![0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!user) {
      alert('Veuillez vous connecter.');
      return;
    }
  
    const data = new FormData();
    
    // Champs requis du formulaire
    data.append('nom_correct', formData.nom_correct);
    data.append('nom_presentation', formData.nom_presentation);
    data.append('description_presentation', formData.description_presentation);
    
    // Fichiers (optionnels)
    if (formData.url_photo_identite) {
      data.append('url_photo_identite', formData.url_photo_identite);
    }
    if (formData.url_video) {
      data.append('url_video', formData.url_video);
    }
  
    // Champs requis avec les bonnes valeurs/types
    data.append('code_user_account', user.code_user_account || '');
    data.append('code_competition', competitionCode);
    data.append('code_statut', '2');
    data.append('url_project_file', ''); // URL vide acceptable
    data.append('login_number', user.login_number || user.telephone || '');
    data.append('localisation', user.localisation || user.ville || user.pays || '');
    
    // Champs boolean (envoyés comme string puis convertis côté serveur)
    data.append('preselectionne', '0');
    data.append('finaliste', '0');
    
    // Champs integer
    data.append('nbre_vote', '0');
    data.append('nbre_point', '0');
    
    data.append('user_update', user.nom || 'System');
  
    // NE PAS envoyer les champs générés automatiquement côté serveur
    // code_participant, code_localisation, code_categorie, reference, 
    // keyword, returnPassword, code_candidat sont générés côté backend
  
    try {
      const res = await axios.post(`${apiUrl}/competition/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Vérifiez la réponse JSON du serveur
      if (res.data && res.data.success) {
        alert('Inscription réussie');
        navigate('/dashboard'); // ou autre redirection
      } else {
        alert('Erreur lors de l\'inscription: ' + (res.data.message || 'Erreur inconnue'));
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Réponse serveur:', (err as any).response?.data);
      
      if ((err as any).response?.data?.errors) {
        // Afficher les erreurs de validation
        if (axios.isAxiosError(err) && err.response?.data?.errors) {
          const errors = Object.values(err.response.data.errors).flat();
           alert('Erreurs de validation:\n' + errors.join('\n')); // Removed redundant alert
        }
        const errors = (err as any).response?.data?.errors
          ? Object.values((err as any).response.data.errors).flat()
          : [];
        alert('Erreurs de validation:\n' + errors.join('\n'));
      } else {
        if (axios.isAxiosError(err)) {
          alert('Une erreur est survenue: ' + (err.response?.data?.message || err.message));
        } else {
          alert('Une erreur est survenue: ' + String(err));
        }
      }
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#12091A] text-white rounded-xl shadow-lg p-6 md:p-10 max-w-7xl mx-auto mt-10 mb-10">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-yellow-400 mb-8 uppercase">
        Inscrivez-vous !
      </h2>

      <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 text-white shadow-sm">Nom</label>
          <input
            type="text"
            name="nom_correct"
            value={formData.nom_correct}
            onChange={handleChange}
            placeholder="Votre nom"
            className="w-full p-3 rounded-md text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-white shadow-sm">Pseudo</label>
          <input
            type="text"
            name="nom_presentation"
            value={formData.nom_presentation}
            onChange={handleChange}
            placeholder="Votre pseudo"
            className="w-full p-3 rounded-md text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-white shadow-sm">Description de votre présentation</label>
          <textarea
            name="description_presentation"
            value={formData.description_presentation}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-md text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-white shadow-sm">
            Vidéo <span className="text-orange-500 italic text-sm">(max 20 Mo)</span>
          </label>
          <input
            type="file"
            name="url_video"
            accept="video/*"
            onChange={handleChange}
            className="w-1/2 bg-gray-700 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="block mb-2 text-white shadow-sm">Photo</label>
          <input
            type="file"
            name="url_photo_identite"
            accept="image/*"
            onChange={handleChange}
            className="w-1/2 bg-gray-700 rounded-md cursor-pointer"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-8 rounded-md w-full md:w-1/3"
          >
            S’inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default InscriptionForm;
