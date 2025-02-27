import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import OrganizationTree from './components/OrganizationTree';
import ItemDetailsSidebar from './components/ItemDetailsSidebar';
import ItemFormPage from './components/ItemForm';
import ContractItemForm from './components/ContractItemForm';
import ContractItemEditForm from './components/ContractItemEditForm';
import { initialOrganizationData, itemDetails as initialItemDetails } from './components/OrganizationData';
import useApp from 'hooks/useApp';
import { confirmDialog } from 'primereact/confirmdialog';
import useApi from 'hooks/useApi';

const EstructuraOrganizacional = (props) => {
    const app = useApp();
    const api = useApi();
    const navigate = useNavigate();
    
    const [organizationData, setOrganizationData] = useState(() => {
        try {
            const savedData = localStorage.getItem('organizationData');
            return savedData ? JSON.parse(savedData) : initialOrganizationData;
        } catch (error) {
            console.error("Error parsing organizationData from localStorage:", error);
            return initialOrganizationData;
        }
    });
    
    const [itemDetails, setItemDetails] = useState(() => {
        try {
            const savedDetails = localStorage.getItem('itemDetails');
            return savedDetails ? JSON.parse(savedDetails) : initialItemDetails;
        } catch (error) {
            console.error("Error parsing itemDetails from localStorage:", error);
            return initialItemDetails;
        }
    });
    
    const [menuItems, setMenuItems] = useState(() => {
        try {
            const savedMenuItems = localStorage.getItem('menuItems');
            return savedMenuItems ? JSON.parse(savedMenuItems) : {};
        } catch (error) {
            console.error("Error parsing menuItems from localStorage:", error);
            return {};
        }
    });
    
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedContratoId, setSelectedContratoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false); // Nuevo estado para controlar si ya se cargaron los datos
    const [contratos, setContratos] = useState([]);
    const [loadingTree, setLoadingTree] = useState(true);

    useEffect(() => {
        // Solo cargar los datos una vez
        if (dataLoaded) return;

        const fetchItems = async () => {
            try {
                console.log("Iniciando carga de datos...");
                setLoading(true);
                
                // Obtener contratos de la base de datos
                const response = await api.get('tblitem');
                console.log("Respuesta API completa:", response);
                
                // Verificamos la estructura de la respuesta para encontrar los registros
                let dbContratos = [];
                
                if (response?.records) {
                    dbContratos = response.records;
                } else if (response?.data?.records) {
                    dbContratos = response.data.records;
                } else if (Array.isArray(response)) {
                    dbContratos = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    dbContratos = response.data;
                }
                
                console.log("Contratos extraídos de la respuesta:", dbContratos);

                // Aseguramos que todos los contratos tengan un itemId explícito
                const processedContratos = dbContratos.map(contrato => {
                    // Si no tiene itemId pero sí tiene item_estructural_id, usamos ese
                    if (!contrato.itemId && contrato.item_estructural_id) {
                        return {
                            ...contrato,
                            itemId: parseInt(contrato.item_estructural_id)
                        };
                    }
                    return contrato;
                });
                
                console.log("Contratos procesados con itemId:", processedContratos);
                
                setContratos(processedContratos);
                
                // Creamos un mapa de qué ítems tienen contratos
                const itemsWithContracts = {};
                processedContratos.forEach(contrato => {
                    const itemId = contrato.itemId || parseInt(contrato.item_estructural_id);
                    if (itemId) {
                        itemsWithContracts[itemId] = true;
                    }
                });
                
                console.log("Ítems con contratos:", itemsWithContracts);
                
                // Actualizamos los itemDetails
                setItemDetails(prevDetails => {
                    const updatedDetails = { ...prevDetails };
                    
                    // Actualizamos los ítems que tienen contratos
                    Object.keys(itemsWithContracts).forEach(itemId => {
                        const numericId = parseInt(itemId);
                        if (updatedDetails[numericId]) {
                            updatedDetails[numericId] = {
                                ...updatedDetails[numericId],
                                tieneContrato: true
                            };
                        } else {
                            console.warn(`Ítem ${itemId} no existe en itemDetails, posible problema de sincronización`);
                        }
                    });
                    
                    return updatedDetails;
                });
                
                // Marcar los datos como cargados
                setDataLoaded(true);
                
            } catch (error) {
                console.error("Error fetching contratos:", error);
                app.flashMsg("Error", "No se pudieron cargar los ítems de contrato", "error");
            } finally {
                console.log("Finalizando carga de datos");
                setLoading(false);
                setLoadingTree(false);
            }
        };
        
        fetchItems();
    }, [api, app, dataLoaded]); // Quitamos itemDetails para evitar ciclos

    // Simplifica el efecto para localStorage para evitar múltiples actualizaciones
    useEffect(() => {
        if (dataLoaded) {
            try {
                localStorage.setItem('organizationData', JSON.stringify(organizationData));
                localStorage.setItem('itemDetails', JSON.stringify(itemDetails));
                localStorage.setItem('menuItems', JSON.stringify(menuItems));
            } catch (error) {
                console.error("Error saving data to localStorage:", error);
            }
        }
    }, [organizationData, itemDetails, menuItems, dataLoaded]);

    const handleSelectItem = (itemId) => {
        console.log("Ítem seleccionado:", itemId);
        console.log("Detalles disponibles:", itemDetails[itemId]);
        
        setSelectedContratoId(null);
        
        if (selectedItemId === itemId) return;
        
        setSelectedItemId(itemId);
    };

    const handleAddChild = (parentId) => {
        app.openPageDialog(
            <ItemFormPage 
                isSubPage={true} 
                parentId={parentId} 
                onSave={addNewItem}
            />,
            { closeBtn: true, title: 'Crear Nuevo Ítem' }
        );
    };
    
    const handleEditItem = (itemId) => {
        if (itemDetails[itemId]) {
            const itemToEdit = { 
                ...itemDetails[itemId],
                menuItem: menuItems[itemId] || {
                    addToMenu: false,
                    description: '',
                    url: '',
                    icon: 'pi pi-folder',
                    visible: true
                } 
            };
            
            app.openPageDialog(
                <ItemFormPage 
                    isSubPage={true} 
                    itemToEdit={itemToEdit} 
                    onSave={updateItem}
                    onDelete={deleteItem}
                />,
                { closeBtn: true, title: 'Editar Ítem' }
            );
        }
    };

    const handleCreateContract = (structuralItemId) => {
        const structuralItem = itemDetails[structuralItemId];
        
        if (!structuralItem) {
            app.flashMsg("Error", "No se encontró el ítem estructural", "error");
            return;
        }
        
        app.openPageDialog(
            <ContractItemForm 
                isSubPage={true} 
                structuralItem={structuralItem} 
                onSave={(contractData) => saveContractItem(contractData, structuralItem)}
            />,
            { closeBtn: true, title: 'Crear Ítem de Contrato' }
        );
    };
    
    const saveContractItem = async (contractItemData, structuralItem) => {
        setLoading(true);
        try {
            // Eliminamos cualquier campo que no esté en tu esquema de BD
            const formData = {
                codigo_item: contractItemData.codigo_item,
                cargo: contractItemData.cargo,
                haber_basico: parseFloat(contractItemData.haber_basico).toFixed(2),
                unidad_organizacional: contractItemData.unidad_organizacional,
                tiempo_jornada: contractItemData.tiempo_jornada || contractItemData.tiempoJornada, // Aceptar ambos formatos
                cantidad: parseInt(contractItemData.cantidad, 10)
            };
            
            console.log("Enviando datos de contrato a API:", formData);
            
            const response = await api.post('tblitem/add', formData);
            console.log("Respuesta API:", response);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            // Obtener el ID del nuevo contrato
            const responseId = response.id || 
                            (response.record && response.record.id) || 
                            Date.now();
            
            // Crear objeto de contrato guardado con la información necesaria 
            const savedContrato = {
                ...formData,
                id: responseId,
                itemId: structuralItem.id, // Ahora asignamos correctamente el ID del ítem estructural
                fecha_creacion: (response.record && response.record.fecha_creacion) || new Date().toISOString()
            };
            
            console.log("Contrato guardado:", savedContrato);
            
            // Actualizar estado local
            setContratos(prevContratos => [...prevContratos, savedContrato]);
            
            if (structuralItem && structuralItem.id) {
                // Marcar el ítem como que tiene contrato
                setItemDetails(prevDetails => ({
                    ...prevDetails,
                    [structuralItem.id]: {
                        ...prevDetails[structuralItem.id],
                        tieneContrato: true
                    }
                }));
                
                // Refrescar la selección para actualizar la vista
                setSelectedItemId(null);
                setTimeout(() => setSelectedItemId(structuralItem.id), 100);
            }
            
            app.flashMsg("Éxito", "Contrato creado correctamente");
            app.closeDialogs();
            
            return savedContrato;
        } catch (error) {
            console.error("Error al guardar el contrato:", error);
            const errorMsg = error.response?.data?.message || error.message || "Error desconocido";
            app.flashMsg("Error", `Error al guardar el contrato: ${errorMsg}`, "error");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContrato = (contratoId) => {
        confirmDialog({
            message: '¿Está seguro que desea eliminar este contrato?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                setLoading(true);
                try {
                    const response = await api.delete(`tblitem/delete/${contratoId}`);
                    
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    
                    const updatedContratos = contratos.filter(c => c.id !== contratoId);
                    setContratos(updatedContratos);
                    
                    if (selectedContratoId === contratoId) {
                        setSelectedContratoId(null);
                    }
                    
                    app.flashMsg('Éxito', 'El contrato ha sido eliminado con éxito');
                } catch (error) {
                    console.error("Error al eliminar el contrato:", error);
                    app.flashMsg("Error", "Error al eliminar el contrato de la base de datos", "error");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleViewContrato = (contratoId) => {
        setSelectedItemId(null);
        setSelectedContratoId(contratoId);
    };
    
    const handleEditContrato = (contratoId) => {
        const contrato = contratos.find(c => c.id === contratoId);
        if (!contrato) {
            app.flashMsg("Error", "No se encontró el contrato", "error");
            return;
        }
        
        app.openPageDialog(
            <ContractItemEditForm
                isSubPage={true}
                contrato={contrato}
                onSave={handleUpdateContrato}
            />,
            { closeBtn: true, title: 'Editar Contrato' }
        );
    };
    
    const handleUpdateContrato = async (updatedContrato) => {
        setLoading(true);
        try {
            // Corregir nombres de campos para que coincidan con el backend
            const formData = {
                codigo_item: updatedContrato.codigo_item,
                cargo: updatedContrato.cargo,
                haber_basico: updatedContrato.haber_basico,
                unidad_organizacional: updatedContrato.unidad_organizacional,
                tiempo_jornada: updatedContrato.tiempoJornada, // Usar tiempo_jornada para el backend
                cantidad: updatedContrato.cantidad
            };
            
            const response = await api.post(`tblitem/edit/${updatedContrato.id}`, formData);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            setContratos(prevContratos => 
                prevContratos.map(c => c.id === updatedContrato.id ? updatedContrato : c)
            );
            
            app.flashMsg("Éxito", "Contrato actualizado correctamente");
            app.closeDialogs();
            
            setSelectedContratoId(null);
            setTimeout(() => setSelectedContratoId(updatedContrato.id), 100);
        } catch (error) {
            console.error("Error al actualizar el contrato:", error);
            app.flashMsg("Error", "Error al actualizar el contrato en la base de datos", "error");
        } finally {
            setLoading(false);
        }
    };

    const addNewItem = (formData) => {
        const { parentId, ...itemData } = formData;
        
        const newId = Math.max(...Object.keys(itemDetails).map(Number).length ? Object.keys(itemDetails).map(Number) : [0]) + 1;
        
        setItemDetails(prevDetails => ({
            ...prevDetails,
            [newId]: {
                id: newId,
                ...itemData
            }
        }));
        
        if (parentId) {
            const updateTree = (items) => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return {
                            ...item,
                            children: [...item.children, { id: newId, title: itemData.title, children: [] }]
                        };
                    } else if (item.children && item.children.length > 0) {
                        return {
                            ...item,
                            children: updateTree(item.children)
                        };
                    }
                    return item;
                });
            };
            
            setOrganizationData(prevData => updateTree(prevData));
        } else {
            setOrganizationData(prevData => [
                ...prevData,
                { id: newId, title: itemData.title, children: [] }
            ]);
        }
        
        app.flashMsg("Éxito", "Ítem creado correctamente");
        app.closeDialogs();
    };

    const updateItem = (formData) => {
        const { id, menuItem, ...itemData } = formData;
        if (!id) return;
        
        setItemDetails(prevDetails => ({
            ...prevDetails,
            [id]: {
                ...prevDetails[id],
                ...itemData
            }
        }));
        
        if (menuItem) {
            if (menuItem.addToMenu) {
                setMenuItems(prevMenuItems => ({
                    ...prevMenuItems,
                    [id]: menuItem
                }));
            } else {
                setMenuItems(prevMenuItems => {
                    const newMenuItems = { ...prevMenuItems };
                    delete newMenuItems[id];
                    return newMenuItems;
                });
            }
        }
        
        const updateTree = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        title: itemData.title
                    };
                } else if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateTree(item.children)
                    };
                }
                return item;
            });
        };
        
        setOrganizationData(prevData => updateTree(prevData));
        
        app.flashMsg("Éxito", "Ítem actualizado correctamente");
        if (app.isDialogOpen()) {
            app.closeDialogs();
        }
        
        if (selectedItemId === id) {
            setSelectedItemId(null);
            setTimeout(() => setSelectedItemId(id), 100);
        }
    };

    const deleteItem = (itemId) => {
        if (!itemId) return;
        
        const removeNode = (items, idToRemove) => {
            const filteredItems = items.filter(item => item.id !== idToRemove);
            if (filteredItems.length !== items.length) {
                return filteredItems;
            }
            return filteredItems.map(item => {
                if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: removeNode(item.children, idToRemove)
                    };
                }
                return item;
            });
        };
        
        setOrganizationData(prevData => removeNode(prevData, itemId));
        
        setItemDetails(prevDetails => {
            const newDetails = { ...prevDetails };
            delete newDetails[itemId];
            return newDetails;
        });
        
        setMenuItems(prevMenuItems => {
            const newMenuItems = { ...prevMenuItems };
            delete newMenuItems[itemId];
            return newMenuItems;
        });
        
        if (selectedItemId === itemId) {
            setSelectedItemId(null);
        }
        
        app.flashMsg("Éxito", "Ítem eliminado correctamente");
        if (app.isDialogOpen()) {
            app.closeDialogs();
        }
    };

    const selectedItem = selectedItemId ? itemDetails[selectedItemId] : null;
    const selectedContrato = selectedContratoId ? contratos.find(c => c.id === selectedContratoId) : null;
    
    if (selectedItem) {
        // Asociar los contratos al ítem seleccionado, considerando ambos campos
        selectedItem.contratos = contratos.filter(contrato => {
            const contratoItemId = contrato.itemId || parseInt(contrato.item_estructural_id);
            return contratoItemId === selectedItem.id;
        });
    }
    
    return (
        <main className="main-page">
            <section className="page-section mb-3">
                <div className="container">
                    <div className="grid justify-content-between align-items-center">
                        <div className="col-fixed">
                            <Button 
                                onClick={() => navigate('/tblitems')} 
                                label="" 
                                className="p-button p-button-text" 
                                icon="pi pi-arrow-left" 
                                tooltip="Volver a la lista de items"
                                tooltipOptions={{ position: 'right' }}
                            />
                        </div>
                        <div className="col">
                            <Title title="Estructura Organizacional" titleClass="text-2xl text-primary font-bold" subTitleClass="text-500" separator={false} />
                        </div>
                        <div className="col-fixed">
                            <Button 
                                label="Crear Raíz" 
                                icon="pi pi-plus" 
                                className="p-button-primary" 
                                tooltip="Agregar un elemento raíz"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={() => handleAddChild(null)}
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="page-section">
                <div className="container">
                    {loading || loadingTree ? (
                        <div className="flex align-items-center justify-content-center p-5">
                            <ProgressSpinner style={{width:'50px', height:'50px'}} />
                            <div className="ml-3 font-medium">Cargando estructura...</div>
                        </div>
                    ) : (
                        <div className="grid">
                            <div className="col-12 lg:col-8">
                                <OrganizationTree 
                                    data={organizationData} 
                                    onSelectItem={handleSelectItem}
                                    onAddChild={handleAddChild}
                                    onEditItem={handleEditItem}
                                    onDeleteItem={deleteItem}
                                    selectedItemId={selectedItemId}
                                    selectedContratoId={selectedContratoId}
                                    itemDetails={itemDetails}
                                    contratos={contratos}
                                    onViewContrato={handleViewContrato}
                                    onEditContrato={handleEditContrato}
                                    onDeleteContrato={handleDeleteContrato}
                                />
                                {props.debug && selectedItemId && (
                                    <div className="p-2 mt-3 bg-gray-100 border-round">
                                        <h5>Debug: Item seleccionado ID: {selectedItemId}</h5>
                                        <pre className="p-2 bg-gray-200 border-round">
                                            {JSON.stringify(selectedItem, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                            <div className="col-12 lg:col-4">
                                <ItemDetailsSidebar 
                                    key={`${selectedItemId}-${selectedContratoId}`}
                                    item={selectedItem} 
                                    contrato={selectedContrato}
                                    onCreateContract={handleCreateContract}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};
EstructuraOrganizacional.defaultProps = {
    showHeader: true,
    showFooter: true,
    debug: false
};
export default EstructuraOrganizacional;