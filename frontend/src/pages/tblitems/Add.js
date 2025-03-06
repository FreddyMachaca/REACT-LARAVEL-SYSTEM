import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Tree } from 'primereact/tree';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';

const TblitemsAddPage = (props) => {
    const app = useApp();
    const [loading, setLoading] = useState(true);
    const [treeData, setTreeData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        ca_ti_item: '',
        ca_num_item: '',
        ca_es_id: '',
        ca_eo_id: ''
    });
    
    const [escalaOptions, setEscalaOptions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState({});
    const treeRef = useRef(null);
    const [debugStats, setDebugStats] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const treeResponse = await axios.get('/tblmpestructuraorganizacional/tree');
                const hierarchyData = treeResponse.data.tree;
                
                setDebugStats(treeResponse.data.stats);
                
                console.log("API Response:", treeResponse.data);
                console.log("Tree Structure:", hierarchyData);
                
                let totalNodes = 0;
                let totalChildNodes = 0;
                
                const countNodes = (nodes) => {
                    totalNodes += nodes.length;
                    nodes.forEach(node => {
                        if (node.children && node.children.length > 0) {
                            totalChildNodes += node.children.length;
                            countNodes(node.children);
                        }
                    });
                };
                
                countNodes(hierarchyData);
                console.log("Total Nodes in Tree:", totalNodes);
                console.log("Total Child Nodes:", totalChildNodes);
                
                setTreeData(hierarchyData);
                
                const optionsResponse = await axios.get('/tblitems/options');
                setEscalaOptions(optionsResponse.data.escalaOptions.map(opt => ({ 
                    value: opt.es_id, 
                    label: opt.es_descripcion 
                })));
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Error al cargar los datos");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    const handleNodeSelect = (e) => {
        setSelectedNode(e.node);
    };
    
    const expandNode = (path) => {
        const newExpandedKeys = { ...expandedKeys };
        path.forEach(key => {
            newExpandedKeys[key] = true;
        });
        setExpandedKeys(newExpandedKeys);
    };
    
    const handleExpandAll = () => {
        const allKeys = {};
        const collectKeys = (nodes) => {
            if (!nodes) return;
            
            nodes.forEach(node => {
                if (node.children && node.children.length) {
                    allKeys[node.key] = true;
                    collectKeys(node.children);
                }
            });
        };
        
        collectKeys(treeData);
        setExpandedKeys(allKeys);
    };
    
    const handleCollapseAll = () => {
        setExpandedKeys({});
    };
    
    const findNodePath = (nodes, nodeKey, currentPath = []) => {
        for (const node of nodes) {
            if (node.key === nodeKey) {
                return [...currentPath, node.key];
            }
            
            if (node.children && node.children.length > 0) {
                const path = findNodePath(node.children, nodeKey, [...currentPath, node.key]);
                if (path) return path;
            }
        }
        
        return null;
    };
    
    const handleOpenForm = () => {
        if (!selectedNode) {
            app.flashMsg("Aviso", "Seleccione una unidad organizacional primero", "warn");
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            ca_eo_id: selectedNode.key
        }));
        
        setShowForm(true);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleDropdownChange = (e, fieldName) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: e.value
        }));
    };
    
    const handleSubmit = async () => {
        if (!formData.ca_ti_item || !formData.ca_num_item || !formData.ca_es_id || !formData.ca_eo_id) {
            app.flashMsg("Error", "Todos los campos son requeridos", "error");
            return;
        }
        
        try {
            setSaving(true);            
            await axios.post('/tblitems/add', formData);            
            app.flashMsg("Éxito", "Item creado correctamente");
            app.navigate('/tblitems');
        } catch (err) {
            console.error("Error saving data:", err);
            app.flashMsg("Error", err.message || "Error al guardar los datos", "error");
            setSaving(false);
        }
    };

    const treeStyles = {
        customTree: {
            border: 'none',
            padding: 0,
        },
        treeNodePadding: {
            padding: '0.25rem 0',
        },
        treeNodeContent: {
            borderRadius: '4px',
            transition: 'background-color 0.2s',
        },
        treeNodeHover: {
            backgroundColor: 'var(--surface-200)',
        },
        treeNodeHighlight: {
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
        },
        selectedNode: {
            fontWeight: 'bold',
            color: 'var(--primary-700)',
        }
    };
    
    const nodeTemplate = (node, options) => {
        const isLeaf = !node.children || node.children.length === 0;
        const iconClassName = isLeaf ? 'pi pi-folder' : options.expanded ? 'pi pi-folder-open' : 'pi pi-folder';
        
        const selectedNodeStyle = (selectedNode && selectedNode.key === node.key) ? treeStyles.selectedNode : {};
        
        const hasChildrenStyle = !isLeaf ? { cursor: 'pointer', fontWeight: options.expanded ? 'bold' : 'normal' } : {};
        
        return (
            <div className="tree-node flex align-items-center" style={{...selectedNodeStyle, ...hasChildrenStyle}}>
                <i className={iconClassName + " mr-2 text-primary"} style={{ fontSize: '1.2rem' }}></i>
                <span className="node-content">
                    {node.label}
                </span>
                {!isLeaf && !options.expanded && (
                    <i className="pi pi-chevron-right ml-auto text-500" style={{ fontSize: '0.8rem' }}></i>
                )}
                {!isLeaf && options.expanded && (
                    <i className="pi pi-chevron-down ml-auto text-500" style={{ fontSize: '0.8rem' }}></i>
                )}
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div>
                <div className="flex justify-content-between align-items-center">
                    <span className="font-bold text-xl">Estructura Organizacional</span>
                    <div className="flex">
                        <Button 
                            icon="pi pi-plus" 
                            label="Expandir todo"
                            className="p-button-outlined p-button-sm mr-2" 
                            onClick={handleExpandAll}
                            tooltip="Expandir todo"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button 
                            icon="pi pi-minus" 
                            label="Contraer todo"
                            className="p-button-outlined p-button-sm" 
                            onClick={handleCollapseAll}
                            tooltip="Contraer todo"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                </div>
                
                {selectedNode && (
                    <div className="mt-2 py-2 px-3 surface-100 border-round">
                        <div className="text-sm">
                            Unidad seleccionada: <span className="font-medium text-primary">{selectedNode.label}</span>
                        </div>
                    </div>
                )}
                
                {debugStats && (
                    <div className="mt-2 py-2 px-3 surface-50 border-round text-sm">
                        <div>Total de nodos: {debugStats.total_nodes}</div>
                        <div>Nodos raíz: {debugStats.root_nodes}</div>
                    </div>
                )}
                
                <div className="mt-2 p-2 surface-50 border-round">
                    <div className="flex align-items-center">
                        <i className="pi pi-info-circle mr-2 text-primary"></i>
                        <span className="text-sm">Haga clic en los nodos para expandirlos o contraerlos.</span>
                    </div>
                </div>
            </div>
        );
    };
    
    if (loading) {
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{width:'50px', height:'50px'}} />
                <div className="font-bold text-lg mt-2">Cargando estructura organizacional...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="p-3 text-center">
                <div className="text-xl text-red-500 mb-3">Error</div>
                <div>{error}</div>
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
            <main id="TblitemsAddPage" className="main-page">
                <section className="page-section mb-3">
                    <div className="container">
                        <div className="grid justify-content-between align-items-center">
                            <div className="col-fixed">
                                <Button onClick={() => app.navigate('/tblitems')} label="" className="p-button p-button-text" icon="pi pi-arrow-left" />
                            </div>
                            <div className="col">
                                <Title title="Agregar Nuevo Item" subtitle="Seleccione una unidad organizacional en el árbol jerárquico" titleClass="text-2xl text-primary font-bold" separator={false} />
                            </div>
                            <div className="col-fixed">
                                <Button 
                                    label="Crear Item" 
                                    icon="pi pi-plus" 
                                    className="p-button-primary" 
                                    disabled={!selectedNode}
                                    onClick={handleOpenForm}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="page-section">
                    <div className="container">
                        <div className="grid">
                            <div className="col-12">
                                <Card header={renderHeader}>
                                    <div className="tree-container" style={{minHeight: '500px', maxHeight: '600px', overflow: 'auto'}}>
                                        <div className="mb-3 px-2 py-1 surface-200 border-round">
                                            <i className="pi pi-info-circle mr-2"></i>
                                            <span className="text-sm">Los nodos principales son las unidades de nivel superior. <strong>Haga clic en un nodo para expandirlo</strong>.</span>
                                        </div>
                                        
                                        {treeData.length > 0 ? (
                                            <Tree 
                                                ref={treeRef}
                                                value={treeData} 
                                                selectionMode="single"
                                                selectionKeys={selectedNode ? {[selectedNode.key]: true} : {}}
                                                expandedKeys={expandedKeys}
                                                onToggle={(e) => setExpandedKeys(e.value)}
                                                onSelectionChange={(e) => {
                                                    const key = Object.keys(e.value)[0];
                                                    if (key) {
                                                        let selectedNodeData = null;
                                                        const findNode = (nodes) => {
                                                            for (let node of nodes) {
                                                                if (node.key == key) {
                                                                    selectedNodeData = node;
                                                                    return true;
                                                                }
                                                                if (node.children && node.children.length) {
                                                                    if (findNode(node.children)) {
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                                            return false;
                                                        };
                                                        findNode(treeData);
                                                        
                                                        setSelectedNode(selectedNodeData);
                                                    } else {
                                                        setSelectedNode(null);
                                                    }
                                                }}
                                                onSelect={handleNodeSelect}
                                                className="w-full"
                                                filter
                                                filterMode="lenient"
                                                filterPlaceholder="Buscar unidad organizacional"
                                                nodeTemplate={nodeTemplate}
                                            />
                                        ) : (
                                            <div className="p-3 text-center text-500">
                                                No se encontraron unidades organizacionales
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
                
                <Dialog 
                    header="Crear Nuevo Item" 
                    visible={showForm} 
                    style={{width: '500px'}} 
                    onHide={() => setShowForm(false)}
                    footer={
                        <div>
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setShowForm(false)} />
                            <Button label="Guardar" icon="pi pi-save" className="p-button-primary" onClick={handleSubmit} loading={saving} />
                        </div>
                    }
                >
                    <div className="grid formgrid p-fluid">
                        <div className="col-12 mb-3">
                            <label htmlFor="ca_ti_item" className="font-medium text-900 mb-2 block">Tipo de Item</label>
                            <InputText
                                id="ca_ti_item"
                                name="ca_ti_item"
                                value={formData.ca_ti_item}
                                onChange={handleInputChange}
                                className="w-full"
                                required
                                placeholder="Ej: ITEM"
                            />
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label htmlFor="ca_num_item" className="font-medium text-900 mb-2 block">Número de Item</label>
                            <InputText
                                id="ca_num_item"
                                name="ca_num_item"
                                value={formData.ca_num_item}
                                onChange={handleInputChange}
                                className="w-full"
                                required
                                placeholder="Ej: 001"
                            />
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label htmlFor="ca_es_id" className="font-medium text-900 mb-2 block">Cargo</label>
                            <Dropdown
                                id="ca_es_id"
                                value={formData.ca_es_id}
                                options={escalaOptions}
                                onChange={(e) => handleDropdownChange(e, 'ca_es_id')}
                                optionValue="value"
                                optionLabel="label"
                                placeholder="Seleccione un cargo"
                                className="w-full"
                                required
                                filter
                            />
                        </div>
                        
                        <Divider />
                        
                        <div className="col-12">
                            <div className="p-3 border-round surface-100">
                                <div className="font-medium text-900 mb-2">Unidad Organizacional</div>
                                <div className="flex align-items-center">
                                    <i className="pi pi-sitemap mr-2 text-primary"></i>
                                    <span className="font-medium text-primary">{selectedNode?.label || "No seleccionada"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </main>
        </div>
    );
};

TblitemsAddPage.defaultProps = {
    pageName: 'tblitems',
    apiPath: 'tblitems/add',
    routeName: 'tblitemsadd',
};

export default TblitemsAddPage;
