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
        ca_es_id: '',
        ca_eo_id: '',
        ca_tipo_jornada: 'TT',
        cantidad: 1
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

    const [cargoDetails, setCargoDetails] = useState({
        codigoEscalafon: '',
        clase: '',
        nivelSalarial: '',
        haberBasico: ''
    });
    
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
                if (optionsResponse.data && optionsResponse.data.escalaOptions) {
                    const enhancedOptions = optionsResponse.data.escalaOptions.map(opt => ({
                        value: opt.es_id,
                        label: opt.es_descripcion,
                        es_escalafon: opt.es_escalafon || '',
                        ns_clase: opt.ns_clase || '',
                        ns_nivel: opt.ns_nivel || '',
                        ns_haber_basico: opt.ns_haber_basico || ''
                    }));
                    setEscalaOptions(enhancedOptions);
                } else {
                    setEscalaOptions([]);
                }
                
                try {
                    const tipoItemResponse = await axios.get('/tblmptipoitem/getTiposItem');
                    console.log("Tipo Item Response:", tipoItemResponse.data);
                    
                    if (tipoItemResponse.data && Array.isArray(tipoItemResponse.data)) {
                        setTipoItemOptions(tipoItemResponse.data.map(item => ({
                            value: item.ti_item,
                            label: `${item.ti_item} - ${item.ti_descripcion}`
                        })));
                    } else {
                        console.error("Invalid response format from getTiposItem endpoint");
                        setTipoItemOptions([]);
                    }
                } catch (typeError) {
                    console.error("Error fetching tipo items:", typeError);
                    setTipoItemOptions([]);
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

    const handleCargoChange = (e) => {
        const selectedEscala = escalaOptions.find(option => option.value === e.value);
        
        setFormData(prev => ({
            ...prev,
            ca_es_id: e.value
        }));
        
        if (selectedEscala) {
            setCargoDetails({
                codigoEscalafon: selectedEscala.es_escalafon || 'No disponible',
                clase: selectedEscala.ns_clase || 'No disponible',
                nivelSalarial: selectedEscala.ns_nivel || 'No disponible',
                haberBasico: selectedEscala.ns_haber_basico ? 
                    new Intl.NumberFormat('es-BO', { 
                        style: 'currency', 
                        currency: 'BOB', 
                        minimumFractionDigits: 2 
                    }).format(selectedEscala.ns_haber_basico) : 'No disponible'
            });
        } else {
            setCargoDetails({
                codigoEscalafon: '',
                clase: '',
                nivelSalarial: '',
                haberBasico: ''
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.ca_ti_item || !formData.ca_es_id || !formData.ca_eo_id || !formData.ca_tipo_jornada) {
            app.flashMsg("Error", "Todos los campos son requeridos", "error");
            return;
        }
        
        try {
            setSaving(true);
            console.log("Submitting form data:", formData);
            
            const response = await axios.post('/tblitems/add', formData);
            console.log("Server response:", response.data);
            
            setShowForm(false);
            
            app.flashMsg("Éxito", `${formData.cantidad} item(s) creado(s) correctamente`);
            
            try {
                const treeResponse = await axios.get('/tblmpestructuraorganizacional/tree');
                if (treeResponse.data && treeResponse.data.tree) {
                    setTreeData(treeResponse.data.tree);
                    
                    if (selectedNode && selectedNode.key) {
                        const path = findNodePath(treeResponse.data.tree, selectedNode.key);
                        if (path) {
                            let newExpandedKeys = { ...expandedKeys };
                            path.forEach(key => {
                                newExpandedKeys[key] = true;
                            });
                            setExpandedKeys(newExpandedKeys);
                        }
                    }
                }
            } catch (treeError) {
                console.error("Error refreshing tree:", treeError);
            }
            
            if (selectedNode && selectedNode.key) {
                try {
                    setLoadingNodeItems(true);
                    const itemsResponse = await axios.get(`/tblitems/index?filter=ca_eo_id&filtervalue=${selectedNode.key}`);
                    
                    if (itemsResponse.data && itemsResponse.data.records && Array.isArray(itemsResponse.data.records)) {
                        setNodeItems(itemsResponse.data.records);
                    }
                } catch (fetchErr) {
                    console.error("Error refreshing items list:", fetchErr);
                } finally {
                    setLoadingNodeItems(false);
                    setSaving(false);
                }
            } else {
                setSaving(false);
            }
        } catch (err) {
            console.error("Error saving data:", err);
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
                
                const errorMessage = err.response.data?.message || err.message || "Error al guardar los datos";
                app.flashMsg("Error", errorMessage, "error");
            } else {
                app.flashMsg("Error", err.message || "Error al guardar los datos", "error");
            }
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
        let iconClassName = '';
        
        if (node.type === 'item') {
            iconClassName = 'pi pi-user';
        } else {
            iconClassName = isLeaf ? 'pi pi-folder' : options.expanded ? 'pi pi-folder-open' : 'pi pi-folder';
        }
        
        const selectedNodeStyle = (selectedNode && selectedNode.key === node.key) ? treeStyles.selectedNode : {};
        const hasChildrenStyle = !isLeaf ? { cursor: 'pointer', fontWeight: options.expanded ? 'bold' : 'normal' } : {};
        
        const nodeTypeStyle = node.type === 'item' ? 
            { backgroundColor: 'var(--surface-50)', borderRadius: '4px', padding: '2px 4px' } : {};
        
        return (
            <div className="tree-node flex align-items-center" style={{...selectedNodeStyle, ...hasChildrenStyle, ...nodeTypeStyle}}>
                <i className={iconClassName + " mr-2 " + (node.type === 'item' ? 'text-blue-600' : 'text-primary')} 
                   style={{ fontSize: '1.2rem' }}></i>
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
                                
                                {/* Cargo */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Cargo</label>
                                    <Dropdown 
                                        value={formData.ca_es_id}
                                        options={escalaOptions}
                                        onChange={handleCargoChange}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione un Cargo"
                                        className="w-full"
                                        showClear
                                        filter
                                    />
                                </div>
                                
                                {/* Cargo detalles */}
                                {formData.ca_es_id && (
                                    <div className="field mb-3 p-2 border-round surface-50">
                                        <div className="grid">
                                            <div className="col-12 col-md-6 mb-2">
                                                <span className="font-medium text-600">Código Escalafón:</span>
                                                <span className="ml-2">{cargoDetails.codigoEscalafon}</span>
                                            </div>
                                            <div className="col-12 col-md-6 mb-2">
                                                <span className="font-medium text-600">Clase:</span>
                                                <span className="ml-2">{cargoDetails.clase}</span>
                                            </div>
                                            <div className="col-12 col-md-6 mb-2">
                                                <span className="font-medium text-600">Nivel Salarial:</span>
                                                <span className="ml-2">{cargoDetails.nivelSalarial}</span>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <span className="font-medium text-600">Haber Básico:</span>
                                                <span className="ml-2 font-bold text-primary">{cargoDetails.haberBasico}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Tipo Item */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Tipo Item</label>
                                    <Dropdown 
                                        value={formData.ca_ti_item}
                                        options={tipoItemOptions}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ca_ti_item: e.value }))}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione un Tipo Item"
                                        className="w-full"
                                        showClear
                                    />
                                </div>

                                {/* Tiempo Jornada */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Tiempo Jornada</label>
                                    <Dropdown
                                        value={formData.ca_tipo_jornada}
                                        options={[
                                            {label: 'Tiempo Completo', value: 'TT'},
                                            {label: 'Medio Tiempo', value: 'MT'}
                                        ]}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ca_tipo_jornada: e.value }))}
                                        placeholder="Seleccione el tiempo de jornada"
                                        className="w-full"
                                    />
                                </div>
                                
                                {/* Cantidad */}
                                <div className="field mb-3">
                                    <label className="font-medium text-600">Cantidad de Items</label>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-hashtag"></i>
                                        </span>
                                        <InputText
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={formData.cantidad}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
                                            placeholder="Cantidad de items a crear"
                                        />
                                    </div>
                                    <small className="text-500">Número de items que se crearán con los mismos datos</small>
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
                            <label htmlFor="ca_es_id" className="font-medium text-900 mb-2 block">Cargo</label>
                            <Dropdown
                                id="ca_es_id" 
                                value={formData.ca_es_id}
                                options={escalaOptions}
                                onChange={(e) => {
                                    handleDropdownChange(e, 'ca_es_id');
                                    handleCargoChange(e);
                                }}
                                optionValue="value"
                                optionLabel="label"
                                placeholder="Seleccione un cargo"
                                className="w-full"
                                required
                                filtered
                            />
                            
                            {formData.ca_es_id && (
                                <div className="mt-2 p-2 border-round surface-50 text-sm">
                                    <div className="grid">
                                        <div className="col-6">
                                            <span className="font-medium">Código Escalafón:</span>
                                            <span className="ml-1">{cargoDetails.codigoEscalafon}</span>
                                        </div>
                                        <div className="col-6">
                                            <span className="font-medium">Clase:</span>
                                            <span className="ml-1">{cargoDetails.clase}</span>
                                        </div>
                                        <div className="col-6">
                                            <span className="font-medium">Nivel Salarial:</span>
                                            <span className="ml-1">{cargoDetails.nivelSalarial}</span>
                                        </div>
                                        <div className="col-6">
                                            <span className="font-medium">Haber Básico:</span>
                                            <span className="ml-1 font-bold text-primary">{cargoDetails.haberBasico}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                        
                        <div className="col-12 mb-3">
                            <label htmlFor="cantidad" className="font-medium text-900 mb-2 block">Cantidad de Items</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-hashtag"></i>
                                </span>
                                <InputText
                                    id="cantidad"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData(prev => ({ 
                                        ...prev, 
                                        cantidad: parseInt(e.target.value) || 1 
                                    }))}
                                    className="w-full"
                                    placeholder="Cantidad"
                                />
                            </div>
                            <small className="text-600">Define cuántos items se crearán con estos datos</small>
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
                        
                        <div className="col-12 mt-3"></div>
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
                </Dialog>
            </main>
        </div>
    );
};

export default TblitemsAddPage;
