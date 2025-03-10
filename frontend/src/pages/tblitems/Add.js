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
import { RadioButton } from 'primereact/radiobutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
        ca_eo_id: '',
        ca_tipo_jornada: 'TT' 
    });
    
    const [escalaOptions, setEscalaOptions] = useState([]);
    const [tipoItemOptions, setTipoItemOptions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState({});
    const treeRef = useRef(null);
    const [debugStats, setDebugStats] = useState(null);
    
    const [categoriaPragmatica, setCategoriaPragmatica] = useState('');
    const [categoriaAdministrativa, setCategoriaAdministrativa] = useState('');
    const [loadingRelatedData, setLoadingRelatedData] = useState(false);
    
    const [nodeItems, setNodeItems] = useState([]);
    const [loadingNodeItems, setLoadingNodeItems] = useState(false);
    
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
                
                const tipoItemResponse = await axios.get('/tblmptipoitem/index');
                if (tipoItemResponse.data && tipoItemResponse.data.records) {
                    // Filter only types A,C,E,P,S
                    const filteredTypes = tipoItemResponse.data.records.filter(
                        item => ['A', 'C', 'E', 'P', 'S'].includes(item.ti_item)
                    );
                    
                    setTipoItemOptions(filteredTypes.map(item => ({
                        value: item.ti_item,
                        label: `${item.ti_item} - ${item.ti_descripcion}`
                    })));
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Error al cargar los datos");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    const fetchRelatedData = async (nodeId) => {
        try {
            setLoadingRelatedData(true);
            setLoadingNodeItems(true);
            
            console.log("Fetching data for node ID:", nodeId);
            
            const structureResponse = await axios.get(`/tblmpestructuraorganizacional/view/${nodeId}`);
            const structureData = structureResponse.data;
            console.log("Structure data:", structureData);
            
            setSelectedNode({
                key: structureData.eo_id,
                label: structureData.eo_descripcion ? structureData.eo_descripcion.trim() : 'No disponible',
                eo_cod_superior: structureData.eo_cod_superior,
                eo_prog: structureData.eo_prog,
                eo_sprog: structureData.eo_sprog,
                eo_proy: structureData.eo_proy,
                eo_cp_id: structureData.eo_cp_id
            });
            
            setCategoriaAdministrativa(structureData.eo_descripcion ? structureData.eo_descripcion.trim() : 'No disponible');
            
            if (structureData.eo_cp_id) {
                try {
                    const categoryResponse = await axios.get(`/tblmpcategoriaprogramatica/view/${structureData.eo_cp_id}`);
                    console.log("Category data:", categoryResponse.data);
                    
                    if (categoryResponse.data && categoryResponse.data.cp_descripcion) {
                        setCategoriaPragmatica(categoryResponse.data.cp_descripcion.trim());
                    } else {
                        setCategoriaPragmatica('No disponible');
                    }
                } catch (err) {
                    console.error("Error fetching category:", err);
                    setCategoriaPragmatica('No disponible');
                }
            } else {
                setCategoriaPragmatica('No asignada');
            }
            
            try {
                const itemsResponse = await axios.get(`/tblitems/index?filter=ca_eo_id&filtervalue=${nodeId}`);
                console.log("Items response:", itemsResponse.data);
                
                if (itemsResponse.data && itemsResponse.data.records && Array.isArray(itemsResponse.data.records)) {
                    setNodeItems(itemsResponse.data.records);
                    
                    if (itemsResponse.data.estructura_info) {
                        console.log("Additional estructura info:", itemsResponse.data.estructura_info);
                    }
                } else {
                    setNodeItems([]);
                }
            } catch (itemErr) {
                console.error("Error fetching items:", itemErr);
                setNodeItems([]);
            }
            
            setLoadingRelatedData(false);
            setLoadingNodeItems(false);
            
        } catch (err) {
            console.error("Error fetching structure data:", err);
            console.error("Error details:", err.response?.data || err.message);
            setCategoriaPragmatica('Error al cargar');
            setCategoriaAdministrativa('Error al cargar');
            setNodeItems([]);
            setLoadingRelatedData(false);
            setLoadingNodeItems(false);
        }
    };
    
    const handleNodeSelect = (e) => {
        const node = e.node;
        setSelectedNode(node);
            
        if (node && node.key) {
            setFormData(prev => ({
                ...prev,
                ca_eo_id: node.key
            }));
            fetchRelatedData(node.key);
        }
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
        if (!formData.ca_ti_item || !formData.ca_num_item || !formData.ca_es_id || !formData.ca_eo_id || !formData.ca_tipo_jornada) {
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
            </div>
        );
    };

    const renderNodeDetails = () => {
        return (
            <Card title="Datos del Item" className="mt-0 shadow-3 border-round">
                {loadingRelatedData ? (
                    <div className="flex align-items-center justify-content-center p-3">
                        <ProgressSpinner style={{ width: '30px', height: '30px' }} />
                        <span className="ml-2">Cargando datos...</span>
                    </div>
                ) : (
                    <div className="p-3">
                        {selectedNode ? (
                            <div className="p-fluid">                                
                                {/* Categoria Programatica */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Categoría Programática</label>
                                    <div className="p-2 border-round surface-50 text-900 font-medium">
                                        {categoriaPragmatica || 'No disponible'}
                                    </div>
                                </div>
                                
                                {/* Categoria Administrativa */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Categoría Administrativa</label>
                                    <div className="p-2 border-round surface-50 text-900 font-medium">
                                        {categoriaAdministrativa || 'No disponible'}
                                    </div>
                                </div>
                                
                                {/* Informacion de la Unidad */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Detalles de la Unidad</label>
                                    <div className="p-3 border-round surface-50">
                                        <div className="grid">
                                            <div className="col-12 mb-2 flex align-items-center">
                                                <i className="pi pi-id-card mr-2 text-primary"></i>
                                                <strong>ID:</strong>
                                                <span className="ml-2">{selectedNode.key}</span>
                                            </div>
                                            <div className="col-12 mb-2 flex align-items-center">
                                                <i className="pi pi-tag mr-2 text-primary"></i>
                                                <strong>Nombre:</strong>
                                                <span className="ml-2">{selectedNode.label}</span>
                                            </div>
                                            <div className="col-12 mb-2 flex align-items-center">
                                                <i className="pi pi-sitemap mr-2 text-primary"></i>
                                                <strong>Código Superior:</strong>
                                                <span className="ml-2">{selectedNode.eo_cod_superior || 'Ninguno'}</span>
                                            </div>
                                            <div className="col-12 flex align-items-center">
                                                <i className="pi pi-hashtag mr-2 text-primary"></i>
                                                <strong>Programa:</strong>
                                                <span className="ml-2">
                                                    {selectedNode.eo_prog || '0'} - {selectedNode.eo_sprog || '0'} - {selectedNode.eo_proy || '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Items Table */}
                                <div className="field mb-3">
                                    <div className="flex justify-content-between align-items-center mb-2">
                                        <label className="font-medium text-600">Items en esta Unidad</label>
                                        <span className="badge bg-blue-100 text-blue-900 border-round p-1 font-medium">
                                            {nodeItems.length} items
                                        </span>
                                    </div>
                                    {loadingNodeItems ? (
                                        <div className="flex align-items-center justify-content-center p-2">
                                            <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                                            <span className="ml-2">Cargando items...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {nodeItems && nodeItems.length > 0 ? (
                                                <DataTable 
                                                    value={nodeItems} 
                                                    className="p-datatable-sm" 
                                                    stripedRows 
                                                    size="small"
                                                    showGridlines
                                                    responsiveLayout="scroll"
                                                    emptyMessage="No hay items definidos para esta unidad"
                                                >
                                                    <Column field="codigo" header="Código" style={{ width: '100px' }} />
                                                    <Column field="cargo" header="Cargo" />
                                                    <Column 
                                                        field="haber_basico" 
                                                        header="Haber Básico"
                                                        style={{ width: '130px' }}
                                                        body={(rowData) => (
                                                            <span className="font-bold">
                                                                {rowData.haber_basico ? 
                                                                    new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(rowData.haber_basico)
                                                                    : 'N/A'}
                                                            </span>
                                                        )}
                                                    />
                                                    <Column 
                                                        field="tipo_jornada" 
                                                        header="Jornada" 
                                                        style={{ width: '110px' }}
                                                        body={(rowData) => (
                                                            <span className={`badge ${rowData.tipo_jornada === 'TT' ? 'bg-blue-100 text-blue-900' : 'bg-orange-100 text-orange-900'} p-1 border-round`}>
                                                                {rowData.tipo_jornada === 'TT' ? 'Tiempo Completo' : 'Medio Tiempo'}
                                                            </span>
                                                        )}
                                                    />
                                                </DataTable>
                                            ) : (
                                                <div className="p-3 border-round surface-50 text-center">
                                                    <i className="pi pi-inbox text-4xl text-300 mb-3"></i>
                                                    <div className="text-600 mb-2">No hay items en esta unidad</div>
                                                    <div className="text-400 text-sm">Utilice el botón de abajo para crear uno nuevo</div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                
                                <Divider />
                                
                                <div className="flex justify-content-center">
                                    <Button 
                                        label="Crear Item" 
                                        icon="pi pi-plus-circle"
                                        className="p-button-primary"
                                        onClick={handleOpenForm}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 text-center">
                                <i className="pi pi-arrow-left text-5xl text-300 mb-3"></i>
                                <p className="text-600">Seleccione una unidad organizacional del árbol para ver los detalles</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>
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
                        </div>
                    </div>
                </section>
                
                <section className="page-section">
                    <div className="container">
                        <div className="grid">
                            <div className="col-12 md:col-8">
                                <Card header={renderHeader}>
                                    <div className="tree-container" style={{minHeight: '500px', maxHeight: '600px', overflow: 'auto'}}>
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
                                                        if (selectedNodeData) {
                                                            fetchRelatedData(selectedNodeData.key);
                                                        } else {
                                                            setSelectedNode(null);
                                                        }
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
                            <div className="col-12 md:col-4">
                                {renderNodeDetails()}
                            </div>
                        </div>
                    </div>
                </section>
                
                <Dialog 
                    header="Crear Nuevo Item" 
                    visible={showForm} 
                    style={{width: '600px'}} 
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
                            <Dropdown 
                                id="ca_ti_item"
                                value={formData.ca_ti_item}
                                options={tipoItemOptions}
                                onChange={(e) => handleDropdownChange(e, 'ca_ti_item')}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccione un tipo de item"
                                className="w-full"
                                required
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
                                filtered
                            />
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label className="font-medium text-900 mb-2 block">Tipo Jornada</label>
                            <div className="flex gap-4">
                                <div className="flex align-items-center">
                                    <RadioButton 
                                        inputId="jornada1" 
                                        name="ca_tipo_jornada" 
                                        value="TT" 
                                        onChange={handleInputChange} 
                                        checked={formData.ca_tipo_jornada === 'TT'} 
                                    />
                                    <label htmlFor="jornada1" className="ml-2">Tiempo Completo (TT)</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton 
                                        inputId="jornada2" 
                                        name="ca_tipo_jornada" 
                                        value="MT" 
                                        onChange={handleInputChange} 
                                        checked={formData.ca_tipo_jornada === 'MT'} 
                                    />
                                    <label htmlFor="jornada2" className="ml-2">Medio Tiempo (MT)</label>
                                </div>
                            </div>
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
                        
                        <div className="col-12 mt-3">
                            <div className="p-3 border-round surface-100">
                                <div className="font-medium text-900 mb-2">Categoría Programática</div>
                                <div className="flex align-items-center">
                                    <i className="pi pi-list mr-2 text-primary"></i>
                                    <span className="font-medium text-primary">{categoriaPragmatica || "No disponible"}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 mt-3">
                            <div className="p-3 border-round surface-100">
                                <div className="font-medium text-900 mb-2">Categoría Administrativa</div>
                                <div className="flex align-items-center">
                                    <i className="pi pi-building mr-2 text-primary"></i>
                                    <span className="font-medium text-primary">{categoriaAdministrativa || "No disponible"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </main>
        </div>
    );
};

export default TblitemsAddPage;
