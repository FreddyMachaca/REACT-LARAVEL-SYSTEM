import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';

const TblItemsAddPage = (props) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Redirigir a la estructura organizacional
        navigate('/tblitems/estructura-organizacional');
    }, [navigate]);

    return (
        <div className="flex align-items-center justify-content-center" style={{ height: '80vh' }}>
            <ProgressSpinner style={{width:'50px', height:'50px'}} />
            <div className="ml-3">Redirigiendo...</div>
        </div>
    );
};

export default TblItemsAddPage;
