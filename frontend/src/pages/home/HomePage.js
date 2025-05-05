import { useState, useEffect } from "react";
import { Title } from "components/Title";
import Alert from "pages/alerta/Alert";
import useAuth from 'hooks/useAuth';
import axios from "axios";

export default function HomePage() {
     const { user, logout } = useAuth();
        const personaId = user?.us_per_id;
        console.log("codigo persona home ",personaId);
  const [pageReady, setPageReady] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPendingAlerts();

    const interval = setInterval(() => {
      checkPendingAlerts();
    }, 300000); // Cada 5 minutos

    return () => clearInterval(interval);
  }, []);
  const checkPendingAlerts  = async () => {
  
    if (!personaId || isNaN(personaId)) {
      console.error('ID de autorización inválido:', personaId);
      setShowAuthPopup(false);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.get(`/licencias/pending-authorizations/${personaId}`);
      console.log("home ....",response.data.data);
      const alerts = response.data?.data || [];
      setPendingAlerts(alerts);
      setShowAuthPopup(alerts.length > 0);
    } catch (error) {
        console.error("Error al verificar alertas:", error);
        setError("Error al cargar alertas");
        setShowAuthPopup(false);
      } finally {
        setIsLoading(false);
      }
  };
  /*
  const checkPendingAlerts = async (personaId) => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await axios.get(`/licencias/pending-authorizations/${personaId}`);
      const alerts = response.data?.data || [];

      setPendingAlerts(alerts);
      setShowAuthPopup(alerts.length > 0);
    } catch (error) {
      console.error("Error al verificar alertas:", error);
      setError("Error al cargar alertas");
      setShowAuthPopup(false);
    } finally {
      setIsLoading(false);
    }
  };
*/
  const handleCloseAlert = () => {
    setShowAuthPopup(false);
  };

  const handleOpenAuthDetail = (licenseData) => {
    // Implementa lógica para mostrar detalles
    console.log("Detalles de autorización:", licenseData);
  };

  const handleAuthorizationComplete = () => {
    // Volver a verificar si quedan más alertas
    checkPendingAlerts();
  };

  return (
    <main id="HomePage" className="main-page">
      <section className="page-section q-pa-md">
        <div className="container-fluid">
          <div className="grid ">
            <div className="col comp-grid">
              <Title
                title="Home"
                titleClass="text-lg font-bold text-primary"
                subTitleClass="text-500"
                separator={false}
              />

              {showAuthPopup && pendingAlerts.length > 0 && (
                <Alert
                  onClose={handleCloseAlert}
                  onOpenAuthDetail={handleOpenAuthDetail}
                  onAuthorizationComplete={handleAuthorizationComplete}
                  initialAlerts={pendingAlerts}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
