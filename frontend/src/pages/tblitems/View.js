import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import useViewPage from 'hooks/useViewPage';
import { PageRequestError } from 'components/PageRequestError';

const TblItemsView = (props) => {
    const { pageid } = useParams();
    const pageController = useViewPage({ props, pageId: pageid });
    const { pageReady, loading, apiRequestError, moveToNextRecord, moveToPreviousRecord, exportRecord, deleteRecord } = pageController;

    const convertToReadableDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    // Función para verificar si un registro está cargado correctamente
    const isRecordLoaded = (record) => {
        return record && Object.keys(record).length > 0;
    };
    
    if (loading) {
        return (
            <div className="p-4 text-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                <div>Cargando...</div>
            </div>
        );
    }
    
    if (apiRequestError) {
        return <PageRequestError error={apiRequestError} />;
    }
    
    if (!isRecordLoaded(pageController.record)) {
        return (
            <div className="p-4">
                <div className="card">
                    <div className="card-body text-center">
                        El elemento no fue encontrado
                    </div>
                </div>
            </div>
        );
    }
    
    if (pageReady) {
        const record = pageController.record;
        const recId = record.id || '';
        
        return (
            <div className="main-page">
                <section className="page-section mb-3">
                    <div className="container-fluid">
                        <div className="grid justify-content-between align-items-center">
                            <div className="col-fixed">
                                <Link to={`/tblitems`} className="p-button p-button-text">
                                    <i className="pi pi-arrow-left"></i> Volver
                                </Link>
                            </div>
                            <div className="col-fixed">
                                <div className="flex gap-2">
                                    <Button onClick={() => moveToPreviousRecord()} className="p-button-text" icon="pi pi-chevron-left" />
                                    <Button onClick={() => moveToNextRecord()} className="p-button-text" icon="pi pi-chevron-right" />
                                    <Button onClick={() => exportRecord()} className="p-button-text" icon="pi pi-download" />
                                    <Link to={`/tblitems/edit/${recId}`} className="p-button p-button-text p-button-warning">
                                        <i className="pi pi-pencil"></i>
                                    </Link>
                                    <Button onClick={() => deleteRecord()} className="p-button-text p-button-danger" icon="pi pi-trash" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="page-section">
                    <div className="container-fluid">
                        <div className="grid">
                            <div className="col-12 md:col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Detalles del Item</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid">
                                            <div className="col-12 md:col-6">
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">ID</label>
                                                    <div>{record.id}</div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Código Item</label>
                                                    <div>{record.codigo_item}</div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Cargo</label>
                                                    <div>{record.cargo}</div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Haber Básico</label>
                                                    <div>Bs. {parseFloat(record.haber_basico).toFixed(2)}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-6">
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Unidad Organizacional</label>
                                                    <div>{record.unidad_organizacional}</div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Tiempo Jornada</label>
                                                    <div>{record.tiempo_jornada}</div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Cantidad</label>
                                                    <div>{record.cantidad}</div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label className="font-medium mb-2">Fecha Creación</label>
                                                    <div>{convertToReadableDate(record.fecha_creacion)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
    return null;
}

TblItemsView.defaultProps = {
    primaryKey: 'id',
    pageName: 'tblitems',
    apiPath: 'tblitem/view',
    routeName: 'tblitemsview',
}

export default TblItemsView;