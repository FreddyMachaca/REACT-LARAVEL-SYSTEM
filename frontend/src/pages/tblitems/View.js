import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TblitemsViewPage = (props) => {
    const app = useApp();
    const { pageid } = useParams();
    const [loading, setLoading] = useState(true);
    const [apiRequestError, setApiRequestError] = useState(null);
    const [item, setItem] = useState({});
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const response = await axios.get(`/tblitems/view/${pageid}`);
                const item = response.data;
                
                if (!item || !item.id) {
                    throw new Error("No se pudo cargar la información del item");
                }
                
                setItem(item);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching item details:", error);
                setApiRequestError(error.message || "Error al cargar los datos");
                setLoading(false);
            }
        };
        
        if (pageid) {
            fetchData();
        }
    }, [pageid]);
    
    function ActionButton(data){
        const items = [
        {
            label: "Edit",
            command: (event) => { app.navigate(`/tblitems/edit/${data.id}`) },
            icon: "pi pi-pencil"
        },
        {
            label: "Delete",
            command: (event) => { 
                if(confirm(props.msgBeforeDelete)) {
                    const id = typeof data === 'object' && data.id ? data.id : data;
                    
                    axios.delete(`/tblitems/delete/${id}`)
                        .then(() => {
                            app.flashMsg(props.msgTitle, props.msgAfterDelete);
                            app.navigate('/tblitems');
                        })
                        .catch(err => {
                            console.error("Error al eliminar: ", err);
                            app.flashMsg("Error", "No se pudo eliminar el registro", "error");
                        });
                }
            },
            icon: "pi pi-trash"
        }
    ]
        return (<Menubar className="p-0 " model={items} />);
    }

    function PageFooter() {
        if (props.showFooter && item.id) {
            return (
                <div className="flex justify-content-between">
                    <div className="flex justify-content-start">
                        {ActionButton(item)}
                    </div>
                </div>
            );
        }
        return null;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString();
    }
    
    if(loading){
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{width:'50px', height:'50px'}} />
            </div>
        );
    }
    
    if(apiRequestError){
        return (
            <div className="p-3 text-center">
                <div className="text-xl text-red-500 mb-3">Error al cargar los datos</div>
                <div>{apiRequestError}</div>
                <Button 
                    label="Volver" 
                    icon="pi pi-arrow-left" 
                    className="mt-3"
                    onClick={() => app.navigate('/tblitems')} 
                />
            </div>
        );
    }
    
    return (
        <div>
            <main id="TblitemsViewPage" className="main-page">
                <section className="page-section mb-3">
                    <div className="container">
                        <div className="grid justify-content-between align-items-center">
                            <div className="col-fixed">
                                <Button onClick={() => app.navigate('/tblitems')} label="" className="p-button p-button-text" icon="pi pi-arrow-left" />
                            </div>
                            <div className="col">
                                <Title title="Ver Item" titleClass="text-2xl text-primary font-bold" separator={false} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Información General */}
                <Card title="Información General" className="mb-3">
                    <div className="grid">
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Código Item</div>
                                    <div className="font-bold">{item.codigo || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Código Escalafón</div>
                                    <div className="font-bold">{item.escala_original?.es_escalafon || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Clase</div>
                                    <div className="font-bold">{item.nivel_original?.ns_clase || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Nivel</div>
                                    <div className="font-bold">{item.nivel_original?.ns_nivel || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Información del Cargo */}
                <Card title="Información del Cargo" className="mb-3">
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Tipo Item</div>
                                    <div className="font-bold">{item.tipo_item || item.tipo_item_descripcion || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Tipo Jornada</div>
                                    <div className="font-bold">
                                        {item.tipo_jornada === 'TT' ? 'Tiempo Completo' : 
                                         item.tipo_jornada === 'MT' ? 'Medio Tiempo' : 'No disponible'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Haber Básico</div>
                                    <div className="font-bold text-primary">
                                        {item.haber_basico ? 
                                            new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' })
                                                .format(item.haber_basico) : 'No disponible'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Información Organizacional */}
                <Card title="Información Organizacional" className="mb-3">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Unidad Organizacional</div>
                                    <div className="font-bold">{item.unidad_organizacional || 'No disponible'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Categoría Programática</div>
                                    <div className="font-bold">{item.categoria_programatica}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Información Adicional */}
                <Card title="Información Adicional" className="mb-3">
                    <div className="grid">
                        <div className="col-12">
                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                <div>
                                    <div className="text-500 font-medium mb-1">Fecha Creación</div>
                                    <div className="font-bold">
                                        {item.fecha_creacion ? 
                                            new Date(item.fecha_creacion).toLocaleDateString('es-BO', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            }) : 'No disponible'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
            <PageFooter />
        </div>
    );
}

TblitemsViewPage.defaultProps = {
    id: null,
    primaryKey: 'ca_id',
    pageName: 'tblitems',
    apiPath: 'tblmpcargo/view',
    routeName: 'tblitemsview',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Grabar eliminado con éxito",
    showHeader: true,
    showFooter: true,
    exportButton: true,
    isSubPage: false,
}

export default TblitemsViewPage;
