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

const EstructuraOrganizacional = (props) => {
    const app = useApp();
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
    const [loading, setLoading] = useState(false);
    const [contratos, setContratos] = useState(() => {
        try {
            const savedContratos = localStorage.getItem('contratos');
            return savedContratos ? JSON.parse(savedContratos) : [];
        } catch (error) {
            console.error("Error parsing contratos from localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('organizationData', JSON.stringify(organizationData || []));
            localStorage.setItem('itemDetails', JSON.stringify(itemDetails || {}));
            localStorage.setItem('menuItems', JSON.stringify(menuItems || {}));
            localStorage.setItem('contratos', JSON.stringify(contratos || []));
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }, [organizationData, itemDetails, menuItems, contratos]);

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
                onSave={saveContractItem}
            />,
            { closeBtn: true, title: 'Crear Ítem de Contrato' }
        );
    };
    
    const saveContractItem = (contractItemData) => {
        const { id: itemId } = contractItemData;
        
        const contratoId = Date.now();
        
        const newContrato = {
            id: contratoId,
            itemId: itemId,
            codigo_item: contractItemData.codigo_item,
            cargo: contractItemData.cargo,
            haber_basico: contractItemData.haber_basico,
            unidad_organizacional: contractItemData.unidad_organizacional,
            tiempoJornada: contractItemData.tiempoJornada,
            cantidad: contractItemData.cantidad,
            fecha_creacion: new Date().toISOString()
        };
        
        setContratos(prevContratos => [...prevContratos, newContrato]);
        
        setItemDetails(prevDetails => ({
            ...prevDetails,
            [itemId]: {
                ...prevDetails[itemId],
                tieneContrato: true
            }
        }));
        
        app.flashMsg("Éxito", "Contrato creado correctamente");
        app.closeDialogs();
        
        setSelectedItemId(null);
        setTimeout(() => setSelectedItemId(itemId), 100);
    };

    const handleDeleteContrato = (contratoId) => {
        app.confirmDialog({
            message: '¿Está seguro que desea eliminar este contrato?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                setContratos(prevContratos => prevContratos.filter(contrato => contrato.id !== contratoId));
                
                app.flashMsg("Éxito", "Contrato eliminado correctamente");
                
                const tempId = selectedItemId;
                setSelectedItemId(null);
                setTimeout(() => setSelectedItemId(tempId), 100);
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
    
    const handleUpdateContrato = (updatedContrato) => {
        setContratos(prevContratos => 
            prevContratos.map(c => c.id === updatedContrato.id ? updatedContrato : c)
        );
        
        app.flashMsg("Éxito", "Contrato actualizado correctamente");
        app.closeDialogs();
        
        setSelectedContratoId(null);
        setTimeout(() => setSelectedContratoId(updatedContrato.id), 100);
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
        selectedItem.contratos = contratos.filter(c => c.itemId === selectedItem.id);
    }

    console.log("Renderizando con ítem seleccionado:", selectedItemId);
    console.log("Datos del ítem:", selectedItem);

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
                    {loading ? (
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