import React from 'react';
import EmissionBanner from '../components/EmissionBanner';
import CompetCard from '../components/CompetCard';
import './EmissionDetail.css';

const EmissionsDetails = () => {
  return (
    <div className="emission-detail-page">
      <EmissionBanner />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CompetCard />
      </div>
    </div>
  );
};

export default EmissionsDetails;