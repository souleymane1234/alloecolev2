import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const PaymentReturn = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ref = params.get('ref');
    if (!ref) {
      navigate('/'); // ou redirige vers la liste des votes
      return;
    }

    // Récupère les détails de la transaction depuis Laravel 
    axios.get( `${apiUrl}/payment/return?ref=${ref}`)
      .then(res => {
        // Affiche les messages de succès/échec dans ton app
        alert(res.data.message);
        navigate('/'); // ou /transactions, ou autre
      })
      .catch(() => {
        alert("Erreur lors de la vérification du paiement.");
        navigate('/');
      });
  }, []);

  return <div>Redirection en cours...</div>;
};

export default PaymentReturn;
