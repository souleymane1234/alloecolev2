import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ForkKnife, FileText, Bus, DotsThree, MagnifyingGlass, X, CreditCard } from 'phosphor-react';
import './Paiement.css';

const Paiement = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    studentName: '',
    studentId: '',
    phone: '',
    email: ''
  });

  // Catégories de paiement
  const paymentCategories = [
    {
      id: 'scolarite',
      label: "Frais de scolarité",
      Icon: GraduationCap,
      color: "#EA580C", // Orange principal
      bgColor: "#FED7AA"
    },
    {
      id: 'cantine',
      label: "Cantine",
      Icon: ForkKnife,
      color: "#F97316", // Orange clair
      bgColor: "#FFEDD5"
    },
    {
      id: 'pre-inscription',
      label: "Pré-inscription",
      Icon: FileText,
      color: "#F05623", // Orange vif
      bgColor: "#FEE2E2"
    },
    {
      id: 'transport',
      label: "Frais de transport",
      Icon: Bus,
      color: "#E04D1F", // Orange foncé
      bgColor: "#FEF3C7"
    },
    {
      id: 'suivi',
      label: "Suivi élève",
      Icon: MagnifyingGlass,
      color: "#FB923C", // Orange moyen
      bgColor: "#FFF7ED"
    },
    {
      id: 'autre',
      label: "Autre frais",
      Icon: DotsThree,
      color: "#F97316", // Orange clair
      bgColor: "#FFEDD5"
    },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setPaymentData({
      amount: '',
      studentName: '',
      studentId: '',
      phone: '',
      email: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique pour traiter le paiement
    console.log('Données de paiement:', {
      category: selectedCategory,
      ...paymentData
    });
    // Après traitement, fermer le modal
    // handleCloseModal();
  };

  const selectedCategoryData = paymentCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">
          <i className="ph ph-credit-card"></i>
          Paiement
        </h1>
      </div>

      <div className="page-content">
        <div className="section-header">
          <h2 className="section-title">Choisissez une catégorie de paiement</h2>
        </div>

        <div className="payment-categories-grid">
          {paymentCategories.map((category) => (
            <div
              key={category.id}
              className="payment-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div 
                className="payment-card-icon" 
                style={{ 
                  backgroundColor: category.bgColor, 
                  color: category.color 
                }}
              >
                <category.Icon size={28} weight="regular" />
              </div>
              <h3 className="payment-card-title">{category.label}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de paiement */}
      {showModal && selectedCategoryData && (
        <div className="payment-modal-overlay" onClick={handleCloseModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <div className="payment-modal-icon" style={{ backgroundColor: selectedCategoryData.bgColor, color: selectedCategoryData.color }}>
                <selectedCategoryData.Icon size={32} weight="regular" />
              </div>
              <button className="payment-modal-close" onClick={handleCloseModal}>
                <X size={24} weight="bold" />
              </button>
            </div>

            <div className="payment-modal-content">
              <h2 className="payment-modal-title">{selectedCategoryData.label}</h2>
              <p className="payment-modal-description">
                Veuillez remplir les informations ci-dessous pour procéder au paiement.
              </p>

              <form onSubmit={handleSubmitPayment} className="payment-form">
                <div className="form-group">
                  <label htmlFor="amount">Montant (FCFA) *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={paymentData.amount}
                    onChange={handleInputChange}
                    placeholder="Ex: 50000"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentName">Nom de l'élève *</label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={paymentData.studentName}
                    onChange={handleInputChange}
                    placeholder="Nom complet de l'élève"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentId">Numéro d'identification</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={paymentData.studentId}
                    onChange={handleInputChange}
                    placeholder="Numéro d'élève (optionnel)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Téléphone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={paymentData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: +225 07 12 34 56 78"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemple.com (optionnel)"
                  />
                </div>

                <div className="payment-modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-pay">
                    <CreditCard size={20} weight="bold" />
                    Payer maintenant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Paiement;