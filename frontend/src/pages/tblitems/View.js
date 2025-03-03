import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { ProgressSpinner } from 'primereact/progressspinner';
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
                
                // Fix URL to avoid duplicate /api prefix
                const cargoResponse = await axios.get(`/tblmpcargo/view/${pageid}`);
                const cargo = cargoResponse.data;
                
                if (!cargo || !cargo.ca_id) {
                    throw new Error("No se pudo cargar la información del cargo");
                }
                
                // Initialize combined item with cargo data
                let combinedItem = {
                    id: cargo.ca_id,
                    codigo: `${cargo.ca_eo_id || ''} ${cargo.ca_ti_item || ''}`,
                    cargo: '',
                    haber_basico: '',
                    unidad_organizacional: '',
                    fecha_creacion: cargo.ca_fecha_creacion || '',
                    cargo_original: cargo
                };
                
                // Fetch related data from other tables - all URLs fixed
                try {
                    if (cargo.ca_es_id) {
                        const escalaResponse = await axios.get(`/tblmpescalasalarial/view/${cargo.ca_es_id}`);
                        const escala = escalaResponse.data;
                        combinedItem.cargo = escala.es_descripcion || '';
                        combinedItem.escala_original = escala;
                        
                        if (escala.es_ns_id) {
                            const nivelResponse = await axios.get(`/tblmpnivelsalarial/view/${escala.es_ns_id}`);
                            combinedItem.haber_basico = nivelResponse.data.ns_haber_basico || '';
                            combinedItem.nivel_original = nivelResponse.data;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching escala/nivel data:", error);
                    // Continue with available data
                }
                
                try {
                    if (cargo.ca_eo_id) {
                        const estructuraResponse = await axios.get(`/tblmpestructuraorganizacional/view/${cargo.ca_eo_id}`);
                        combinedItem.unidad_organizacional = estructuraResponse.data.eo_descripcion || '';
                        combinedItem.estructura_original = estructuraResponse.data;
                    }
                } catch (error) {
                    console.error("Error fetching estructura data:", error);
                    // Continue with available data
                }
                
                setItem(combinedItem);
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
                    // Fix URL here as well
                    axios.delete(`/tblmpcargo/delete/${data.id}`)
                        .then(() => {
                            app.flashMsg(props.msgTitle, props.msgAfterDelete);
                            app.navigate('/tblitems');
                        })
                        .catch(err => {
                            console.error(err);
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
                { (props.showHeader) && 
                <section className="page-section mb-3" >
                    <div className="container">
                        <div className="grid justify-content-between align-items-center">
                            { !props.isSubPage && 
                            <div className="col-fixed " >
                                <Button onClick={() => app.navigate(-1)} label=""  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                            </div>
                            }
                            <div className="col " >
                                <Title title="Ver Item"   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                            </div>
                        </div>
                    </div>
                </section>
                }
                <section className="page-section " >
                    <div className="container">
                        <div className="grid ">
                            <div className="col comp-grid" >
                                <div >
                                    <div className="mb-3 grid ">
                                        <div className="col-12 md:col-4">
                                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                                <div className="">
                                                    <div className="text-400 font-medium mb-1">Código</div>
                                                    <div className="font-bold">{ item.codigo }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-4">
                                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                                <div className="">
                                                    <div className="text-400 font-medium mb-1">Cargo</div>
                                                    <div className="font-bold">{ item.cargo }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-4">
                                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                                <div className="">
                                                    <div className="text-400 font-medium mb-1">Haber Básico</div>
                                                    <div className="font-bold">{ item.haber_basico }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-4">
                                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                                <div className="">
                                                    <div className="text-400 font-medium mb-1">Unidad Organizacional</div>
                                                    <div className="font-bold">{ item.unidad_organizacional }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-4">
                                            <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                                <div className="">
                                                    <div className="text-400 font-medium mb-1">Fecha Creación</div>
                                                    <div className="font-bold">{ formatDate(item.fecha_creacion) }</div>
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
            <PageFooter />
        </div>
    );
}

TblitemsViewPage.defaultProps = {
    id: null,
    primaryKey: 'ca_id',
    pageName: 'tblitems',
    apiPath: 'tblmpcargo/view', // This is correct as it will be combined with the base URL
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
