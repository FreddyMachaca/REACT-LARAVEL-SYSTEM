import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';

const OrganizationTree = ({ data, onSelectItem, onAddChild, onEditItem, onDeleteItem, selectedItemId, itemDetails, contratos, onViewContrato, onEditContrato, onDeleteContrato, selectedContratoId }) => {
    const [expandedKeys, setExpandedKeys] = useState({});
    const contextMenu = React.useRef(null);
    
    const transformToTreeNodes = (items) => {
        return items.map(item => {
            const details = itemDetails && itemDetails[item.id];
            const isContractItem = details && details.tieneContrato;
            
            const itemContratos = contratos ? contratos.filter(contrato => contrato.itemId === item.id) : [];
            
            const contratoNodes = itemContratos.map(contrato => ({
                key: `contrato-${contrato.id}`,
                label: `${contrato.cargo} - ${contrato.haber_basico || 0} Bs.`,
                icon: 'pi pi-user',
                data: {
                    ...contrato,
                    isContractNode: true
                },
                selectable: true,
                children: []
            }));
            
            const allChildren = [
                ...(item.children && item.children.length > 0 ? transformToTreeNodes(item.children) : []),
                ...contratoNodes
            ];
            
            return {
                key: String(item.id),
                label: item.title,
                icon: isContractItem ? 'pi pi-briefcase' : 'pi pi-folder',
                data: { 
                    ...item,
                    tieneContrato: isContractItem 
                },
                children: allChildren
            };
        });
    };
    
    const treeNodes = transformToTreeNodes(data);
    
    useEffect(() => {
        if (contratos && contratos.length > 0) {
            const newExpandedKeys = { ...expandedKeys };
            
            contratos.forEach(contrato => {
                if (contrato.itemId) {
                    newExpandedKeys[contrato.itemId] = true;
                }
            });
            
            setExpandedKeys(newExpandedKeys);
        }
    }, [contratos]);
    
    useEffect(() => {
        if (selectedItemId) {
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
    
    useEffect(() => {
        if (selectedContratoId) {
            const contrato = contratos.find(c => c.id === selectedContratoId);
            if (contrato && contrato.itemId) {
                setExpandedKeys(prev => ({...prev, [contrato.itemId]: true}));
            }
        }
    }, [selectedContratoId, contratos]);
    
    const handleSelectionChange = (e) => {
        const selectedKey = e.value ? Object.keys(e.value)[0] : null;
        if (selectedKey) {
            if (selectedKey.startsWith('contrato-')) {
                const contratoId = parseInt(selectedKey.replace('contrato-', ''));
                const contrato = contratos.find(c => c.id === contratoId);
                if (contrato) {
                    onViewContrato(contratoId);
                }
            } else {
                onSelectItem(parseInt(selectedKey));
            }
        }
    };
    
    const handleToggle = (e) => {
        setExpandedKeys(e.value);
    };
    
    const handleNodeClick = (e, node) => {
        e.stopPropagation();
        if (node.data.isContractNode) {
            onViewContrato(node.data.id);
        } else {
            onSelectItem(parseInt(node.key));
        }
    };
    
    const menuModel = (nodeKey) => {
        if (nodeKey.startsWith('contrato-')) {
            const contratoId = parseInt(nodeKey.replace('contrato-', ''));
            return [
                {
                    label: 'Ver detalles',
                    icon: 'pi pi-eye',
                    command: () => onViewContrato(contratoId)
                },
                {
                    label: 'Editar contrato',
                    icon: 'pi pi-pencil',
                    command: () => onEditContrato(contratoId)
                },
                {
                    label: 'Eliminar contrato',
                    icon: 'pi pi-trash',
                    className: 'p-button-danger',
                    command: () => onDeleteContrato(contratoId)
                }
            ];
        } else {
            return [
                {
                    label: 'Agregar hijo',
                    icon: 'pi pi-plus',
                    command: () => onAddChild(parseInt(nodeKey))
                },
                {
                    label: 'Editar',
                    icon: 'pi pi-pencil',
                    command: () => onEditItem(parseInt(nodeKey))
                },
                {
                    label: 'Eliminar',
                    icon: 'pi pi-trash',
                    className: 'p-button-danger',
                    command: () => onDeleteItem(parseInt(nodeKey))
                }
            ];
        }
    };
    
    const nodeTemplate = (node) => {
        const isContractItem = node.data.tieneContrato;
        const isContractNode = node.data.isContractNode;
        
        if (isContractNode) {
            const isSelected = selectedContratoId === node.data.id;
            
            return (
                <div 
                    className={`flex align-items-center gap-2 py-1 ${isSelected ? 'bg-primary-50 border-round' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewContrato(node.data.id);
                    }}
                    style={{ cursor: 'pointer' }}
                    data-nodeid={node.key}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        contextMenu.current.show(e);
                        contextMenu.current.nodeKey = node.key;
                    }}
                >
                    <span className={`flex-grow-1 text-sm ${isSelected ? 'text-primary font-bold' : ''}`}>
                        {node.label}
                    </span>
                    <div className="flex gap-1">
                        <Button 
                            icon="pi pi-pencil" 
                            className="p-button-rounded p-button-text p-button-sm" 
                            style={{ width: '1.5rem', height: '1.5rem' }}
                            tooltip="Editar contrato"
                            tooltipOptions={{ position: 'top' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditContrato(node.data.id);
                            }}
                        />
                        <Button 
                            icon="pi pi-trash" 
                            className="p-button-rounded p-button-text p-button-danger p-button-sm" 
                            style={{ width: '1.5rem', height: '1.5rem' }}
                            tooltip="Eliminar contrato"
                            tooltipOptions={{ position: 'top' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteContrato(node.data.id);
                            }}
                        />
                    </div>
                </div>
            );
        }
        
        return (
            <div 
                className="flex align-items-center gap-2 py-1"
                onContextMenu={(e) => {
                    e.preventDefault();
                    contextMenu.current.show(e);
                    contextMenu.current.nodeKey = node.key;
                }}
                onClick={(e) => handleNodeClick(e, node)}
                style={{ cursor: 'pointer' }}
                data-nodeid={node.key}
            >
                <span 
                    className={`flex-grow-1 ${selectedItemId === parseInt(node.key) ? 'font-bold text-primary' : ''}`}
                >
                    {node.label}
                    {isContractItem && (
                        <i className="pi pi-briefcase ml-2 text-blue-500"></i>
                    )}
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
                    
                    {!isContractItem && (
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
                    )}
                </div>
            </div>
        );
    };
    
    const handleContextMenuHide = () => {
        contextMenu.current.nodeKey = null;
    };
    
    const handleContextMenuShow = (e) => {
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
