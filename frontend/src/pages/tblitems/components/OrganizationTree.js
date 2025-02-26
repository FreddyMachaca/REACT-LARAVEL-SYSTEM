import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';

const OrganizationTree = ({ data, onSelectItem, onAddChild, onEditItem, onDeleteItem, selectedItemId }) => {
    const [expandedKeys, setExpandedKeys] = useState({});
    const contextMenu = React.useRef(null);
    
    // Transformar datos al formato que requiere el componente Tree de PrimeReact
    const transformToTreeNodes = (items) => {
        return items.map(item => {
            return {
                key: String(item.id),
                label: item.title,
                icon: 'pi pi-folder',
                data: { ...item },
                children: item.children && item.children.length > 0 ? transformToTreeNodes(item.children) : []
            };
        });
    };
    
    const treeNodes = transformToTreeNodes(data);
    
    // Aseguramos que se expandan los nodos necesarios para mostrar el nodo seleccionado
    useEffect(() => {
        if (selectedItemId) {
            // Función para encontrar la ruta al nodo seleccionado
            const findPath = (nodes, targetId, path = []) => {
                for (const node of nodes) {
                    if (parseInt(node.key) === targetId) {
                        return [...path, node.key];
                    }
                    
                    if (node.children && node.children.length > 0) {
                        const foundPath = findPath(node.children, targetId, [...path, node.key]);
                        if (foundPath) return foundPath;
                    }
                }
                return null;
            };
            
            const path = findPath(treeNodes, selectedItemId);
            if (path) {
                const newExpandedKeys = {};
                path.forEach(key => {
                    newExpandedKeys[key] = true;
                });
                setExpandedKeys(prev => ({...prev, ...newExpandedKeys}));
            }
        }
    }, [selectedItemId, treeNodes]);
    
    const handleSelectionChange = (e) => {
        const selectedKey = e.value ? Object.keys(e.value)[0] : null;
        if (selectedKey) {
            onSelectItem(parseInt(selectedKey));
        }
    };
    
    const handleToggle = (e) => {
        setExpandedKeys(e.value);
    };
    
    const handleNodeClick = (e, node) => {
        e.stopPropagation();
        onSelectItem(parseInt(node.key));
    };
    
    const menuModel = (nodeKey) => {
        return [
            {
                label: 'Agregar hijo',
                icon: 'pi pi-plus',
                command: () => onAddChild(parseInt(nodeKey))
            },
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => onEditItem && onEditItem(parseInt(nodeKey))
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                className: 'p-button-danger',
                command: () => onDeleteItem && onDeleteItem(parseInt(nodeKey))
            }
        ];
    };
    
    // Template personalizado para los nodos
    const nodeTemplate = (node) => {
        return (
            <div 
                className="flex align-items-center gap-2 py-1"
                onContextMenu={(e) => {
                    e.preventDefault();
                    contextMenu.current.show(e);
                    // Guardar la referencia del nodo en el menú contextual
                    contextMenu.current.nodeKey = node.key;
                }}
                onClick={(e) => handleNodeClick(e, node)} // Añadido para manejar el clic
                style={{ cursor: 'pointer' }}
                data-nodeid={node.key}
            >
                <span 
                    className={`flex-grow-1 ${selectedItemId === parseInt(node.key) ? 'font-bold text-primary' : ''}`}
                >
                    {node.label}
                </span>
                <div className="flex gap-1">
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-rounded p-button-text p-button-sm" 
                        style={{ width: '2rem', height: '2rem' }}
                        tooltip="Editar" 
                        tooltipOptions={{ position: 'top' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditItem(parseInt(node.key));
                        }}
                    />
                    <Button 
                        icon="pi pi-plus" 
                        className="p-button-rounded p-button-text p-button-sm" 
                        style={{ width: '2rem', height: '2rem' }}
                        tooltip="Agregar hijo" 
                        tooltipOptions={{ position: 'top' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddChild(parseInt(node.key));
                        }}
                    />
                </div>
            </div>
        );
    };
    
    // Manejar el menú contextual correctamente
    const handleContextMenuHide = () => {
        contextMenu.current.nodeKey = null;
    };
    
    const handleContextMenuShow = (e) => {
        // Encontrar el nodo más cercano usando el evento
        const nodeElement = e.originalEvent.target.closest('[data-nodeid]');
        if (nodeElement) {
            const nodeKey = nodeElement.getAttribute('data-nodeid');
            contextMenu.current.nodeKey = nodeKey;
            contextMenu.current.show(e.originalEvent);
        }
    };
    
    return (
        <div className="card shadow-2">
            <ContextMenu 
                model={contextMenu.current?.nodeKey ? menuModel(contextMenu.current.nodeKey) : []} 
                ref={contextMenu} 
                onHide={handleContextMenuHide}
            />
            
            {/* Eliminada la referencia al click derecho */}
            <div className="card-header bg-primary text-white p-3">
                <h5 className="m-0">Estructura Organizacional</h5>
            </div>
            
            <div className="p-3">
                <Tree 
                    value={treeNodes} 
                    selectionMode="single"
                    selectionKeys={selectedItemId ? { [String(selectedItemId)]: true } : {}}
                    onSelectionChange={handleSelectionChange}
                    expandedKeys={expandedKeys}
                    onToggle={handleToggle}
                    nodeTemplate={nodeTemplate}
                    className="w-full border-none"
                    onContextMenu={handleContextMenuShow}
                    filter
                    filterMode="lenient"
                    filterPlaceholder="Buscar ítem..."
                />
            </div>
        </div>
    );
};

export default OrganizationTree;
