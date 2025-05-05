import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthorizationPopup from './AuthorizationPopup';
import AutorizacionDetalle from './LicensePopup';
import useAuth from 'hooks/useAuth';

function Alert() {
    const { user, logout } = useAuth();
    //const autorizaId = user?.us_per_id;
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showAuthDetail, setShowAuthDetail] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const autorizaId = user?.us_per_id;
    checkPendingAuthorizations(autorizaId);
  }, []);
  
  const checkPendingAuthorizations = async (autorizaId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/licencias/pending-authorizations/${autorizaId}`);
      console.log("alert......",response.data.data);
      // Ajusta la verificación según la nueva estructura de respuesta
      if (response.data?.success && response.data?.count > 0) {
        setShowAuthPopup(true);
      } else {
        setShowAuthPopup(false);
      }
    } catch (error) {
      console.error('Error verificando autorizaciones:', error);
      setShowAuthPopup(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowAuthPopup(false);
  };

  const handleOpenAuthDetail = (licenseData) => {
    setSelectedLicense(licenseData);
    setShowAuthDetail(true);
  };

  const handleCloseAuthDetail = () => {
    setShowAuthDetail(false);
    setSelectedLicense(null);
  };

  const handleAuthorizationComplete = () => {
    setShowAuthDetail(false);
    setSelectedLicense(null);
    checkPendingAuthorizations(); // Verificar si quedan más autorizaciones
  };

  return (
    <div className="app-container">
            
      {isLoading ? (
        <p>Cargando autorizaciones pendientes...</p>
      ) : (
        <>
          {showAuthPopup && (
            <AuthorizationPopup
              onClose={handleClose}
              onOpenAuthDetail={handleOpenAuthDetail}
            />
          )}
          
          {showAuthDetail && selectedLicense && (
            <AutorizacionDetalle
              licenseData={selectedLicense}
              onClose={handleCloseAuthDetail}
              onAuthorize={handleAuthorizationComplete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Alert;