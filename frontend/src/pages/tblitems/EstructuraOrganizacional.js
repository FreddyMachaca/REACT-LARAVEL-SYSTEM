import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import OrganizationTree from './components/OrganizationTree';
import ItemDetailsSidebar from './components/ItemDetailsSidebar';
import { initialOrganizationData, itemDetails as initialItemDetails } from './components/OrganizationData';
import useApp from 'hooks/useApp';
import ItemFormPage from './components/ItemForm';

const EstructuraOrganizacional = (props) => {
    const app = useApp();
    const navigate = useNavigate();
    const [organizationData, setOrganizationData] = useState(() => {
        const savedData = localStorage.getItem('organizationData');
        return savedData ? JSON.parse(savedData) : initialOrganizationData;
    });
    
    const [itemDetails, setItemDetails] = useState(() => {
        const savedDetails = localStorage.getItem('itemDetails');
        return savedDetails ? JSON.parse(savedDetails) : initialItemDetails;
    });
    
    const [menuItems, setMenuItems] = useState(() => {
        const savedMenuItems = localStorage.getItem('menuItems');
        return savedMenuItems ? JSON.parse(savedMenuItems) : {};
    });
    
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('organizationData', JSON.stringify(organizationData));
        localStorage.setItem('itemDetails', JSON.stringify(itemDetails));
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }, [organizationData, itemDetails, menuItems]);

    // Mejorar la función handleSelectItem para garantizar la actualización de la vista
    const handleSelectItem = (itemId) => {
        console.log("Ítem seleccionado:", itemId);
        console.log("Detalles disponibles:", itemDetails[itemId]);
        
        // Si es el mismo ítem, no hacemos nada para evitar re-renders innecesarios
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

    // Function to add a new item to the tree
    const addNewItem = (formData) => {
        const { parentId, ...itemData } = formData;
        
        // Generate new ID
        const newId = Math.max(...Object.keys(itemDetails).map(Number).length ? Object.keys(itemDetails).map(Number) : [0]) + 1;
        
        // Add item details
        setItemDetails(prevDetails => ({
            ...prevDetails,
            [newId]: {
                id: newId,
                ...itemData
            }
        }));
        
        // Add to tree structure
        if (parentId) {
            // Add as a child node
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
            // Add as a root item
            setOrganizationData(prevData => [
                ...prevData,
                { id: newId, title: itemData.title, children: [] }
            ]);
        }

        // Mostrar mensaje de éxito
        app.flashMsg("Éxito", "Ítem creado correctamente");
        
        // Cerrar el diálogo explícitamente
        app.closeDialogs();
    };
    
    // Function to update an existing item
    const updateItem = (formData) => {
        const { id, menuItem, ...itemData } = formData;
        if (!id) return;
        
        // Update item details
        setItemDetails(prevDetails => ({
            ...prevDetails,
            [id]: {
                ...prevDetails[id],
                ...itemData
            }
        }));
        
        // Update menu item if it exists
        if (menuItem) {
            if (menuItem.addToMenu) {
                setMenuItems(prevMenuItems => ({
                    ...prevMenuItems,
                    [id]: menuItem
                }));
            } else {
                // Si no se debe añadir al menú, eliminamos la entrada si existe
                setMenuItems(prevMenuItems => {
                    const newMenuItems = { ...prevMenuItems };
                    delete newMenuItems[id];
                    return newMenuItems;
                });
            }
        }
        
        // Update item title in the tree
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
        
        // Si el elemento editado es el seleccionado, actualizamos la selección
        if (selectedItemId === id) {
            setSelectedItemId(null);
            setTimeout(() => setSelectedItemId(id), 100);
        }
    };
    
    // Function to delete an item from the tree
    const deleteItem = (itemId) => {
        if (!itemId) return;
        
        // Función recursiva para eliminar un nodo y todos sus hijos
        const removeNode = (items, idToRemove) => {
            // Filtrar el nodo a eliminar del nivel actual
            const filteredItems = items.filter(item => item.id !== idToRemove);
            
            // Si el array ha cambiado de tamaño, significa que ya encontramos y eliminamos el nodo
            if (filteredItems.length !== items.length) {
                return filteredItems;
            }
            
            // Si no se encontró en este nivel, buscar en los hijos
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
        
        // Eliminar el nodo y sus hijos del árbol
        setOrganizationData(prevData => removeNode(prevData, itemId));
        
        // Eliminar los detalles del ítem
        setItemDetails(prevDetails => {
            const newDetails = { ...prevDetails };
            delete newDetails[itemId];
            return newDetails;
        });
        
        // Eliminar del menú si existe
        setMenuItems(prevMenuItems => {
            const newMenuItems = { ...prevMenuItems };
            delete newMenuItems[itemId];
            return newMenuItems;
        });
        
        // Si el elemento eliminado es el seleccionado, limpiamos la selección
        if (selectedItemId === itemId) {
            setSelectedItemId(null);
        }
        
        app.flashMsg("Éxito", "Ítem eliminado correctamente");
        if (app.isDialogOpen()) {
            app.closeDialogs();
        }
    };

    // Asegurar que selectedItem y selectedMenuInfo tienen los datos correctos
    const selectedItem = selectedItemId ? itemDetails[selectedItemId] : null;
    
    console.log("Renderizando con ítem seleccionado:", selectedItemId);
    console.log("Datos del ítem:", selectedItem);

    return (
        <main className="main-page">
            <section className="page-section mb-3">
                <div className="container">
                    <div className="grid justify-content-between align-items-center">
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
                                />
                                {/* Añadir un debug auxiliar durante el desarrollo */}
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
                                    key={selectedItemId} // Añadir key para forzar el re-render cuando cambia
                                    item={selectedItem} 
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
    debug: false // Opción para activar el debug en desarrollo
};

export default EstructuraOrganizacional;
