import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PageRequestError } from 'components/PageRequestError';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import useViewPage from 'hooks/useViewPage';

const TblItemsViewPage = (props) => {
    const app = useApp();
    const navigate = useNavigate();
    const { id } = useParams();

    const pageController = useViewPage({ 
        props, 
        id,
        exportFormats: [] 
    });
    
    const { pageReady, loading, record, apiRequestError } = pageController;
    
    const formateDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
        });
    };

    if(apiRequestError){
        return (
            <PageRequestError error={apiRequestError} />
        );
    }
    
    if(loading){
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{width:'50px', height:'50px'}} />
                <div>Cargando...</div>
            </div>
        );
    }
    
    if(pageReady){
        return (
            <main id="TblItemsViewPage" className="main-page">
                {props.showHeader && (
                    <section className="page-section mb-3" >
                        <div className="container">
                            <div className="grid justify-content-between align-items-center">
                                <div className="col-fixed " >
                                    <Button onClick={() => app.navigate(-1)} label=""  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                                </div>
                                <div className="col" >
                                    <Title title="Ver Ítem de Contrato" titleClass="text-2xl text-primary font-bold" subTitleClass="text-500" separator={false} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                <section className="page-section" >
                    <div className="container">
                        <div className="grid">
                            <div className="col-12 md:col-12">
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="p-4">
                                                <div className="grid">
                                                    <div className="col-12 md:col-6">
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Código Item
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {record.codigo_item}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Cargo
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {record.cargo}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Haber Básico
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(record.haber_basico || 0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-12 md:col-6">
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Unidad Organizacional
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {record.unidad_organizacional}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Tiempo Jornada
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {record.tiempoJornada}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Cantidad
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {record.cantidad}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid mb-3">
                                                            <div className="col-12 md:col-4 font-bold">
                                                                Fecha Creación
                                                            </div>
                                                            <div className="col-12 md:col-8">
                                                                {formateDate(record.fecha_creacion)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-content-end">
                                                    <Button 
                                                        label="Editar" 
                                                        icon="pi pi-pencil" 
                                                        className="p-button-primary" 
                                                        onClick={() => app.navigate(`/tblitems/edit/${id}`)} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }
    
    return null;
}

TblItemsViewPage.defaultProps = {
    primaryKey: 'id',
    pageName: 'tblitem',
    apiPath: 'tblitem/view',
    routeName: 'tblitemsview',
    msgTitle: "Ver Item",
    showHeader: true,
    exportData: false
}

export default TblItemsViewPage;