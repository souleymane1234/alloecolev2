import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

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
    axios.get(`http://localhost:9002/api/payment/return?ref=${ref}`)
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
