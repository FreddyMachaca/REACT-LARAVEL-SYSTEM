import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Title } from 'components/Title';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Tree } from 'primereact/tree';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import useApp from 'hooks/useApp';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const TblasignacionView = () => {
    const { personaId } = useParams();
    const app = useApp();
    const [loading, setLoading] = useState(true);
    const [persona, setPersona] = useState(null);
    const [tieneNumItem, setTieneNumItem] = useState(false);
    const [numItemBusqueda, setNumItemBusqueda] = useState('');
    const [showTreeDialog, setShowTreeDialog] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [expandedKeys, setExpandedKeys] = useState({});
    const treeRef = useRef(null);
    
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [tiposActa, setTiposActa] = useState([]);
    const [selectedTipoActa, setSelectedTipoActa] = useState(null);
    const [saving, setSaving] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        loadInitialData();
        loadTiposActa();
    }, [personaId]);

    const loadInitialData = async () => {
        try {
            const [personaResponse, treeResponse] = await Promise.all([
                axios.get(`/tblpersona/view/${personaId}`),
                axios.get('/tblmpestructuraorganizacional/tree')
            ]);

            setPersona(personaResponse.data);
            setTreeData(treeResponse.data.tree);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            app.flashMsg('Error', 'Error al cargar los datos', 'error');
            setLoading(false);
        }
    };

    const loadTiposActa = async () => {
        try {
            const response = await axios.get('/tblcatalogo/byTipo/tipo_mov_alta_ingreso');
            if (response.data) {
                setTiposActa(response.data.map(tipo => ({
                    value: tipo.cat_abreviacion,
                    label: tipo.cat_descripcion
                })));
            }
        } catch (error) {
            console.error('Error cargando tipos de acta:', error);
            app.flashMsg('Error', 'Error al cargar tipos de acta', 'error');
        }
    };

    const handleNumItemSearch = async () => {
        if (!numItemBusqueda) return;
        
        try {
            const response = await axios.get(`/tblitems/index?filter=ca_num_item&filtervalue=${numItemBusqueda}`);
            if (response.data.records?.length > 0) {
                const item = response.data.records[0];
                setItemSeleccionado(item);
                findAndExpandNode(item.ca_id);
            } else {
                app.flashMsg('Info', 'No se encontró el item', 'info');
            }
        } catch (error) {
            console.error('Error searching item:', error);
            app.flashMsg('Error', 'Error al buscar el item', 'error');
        }
    };

    const findAndExpandNode = (itemId) => {
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

    const nodeTemplate = (node, options) => {
        const isLeaf = !node.children || node.children.length === 0;
        let iconClassName = '';
        
        if (node.type === 'item') {
            iconClassName = 'pi pi-user';
        } else {
            iconClassName = isLeaf ? 'pi pi-folder' : options.expanded ? 'pi pi-folder-open' : 'pi pi-folder';
        }
        
        const selectedNodeStyle = (selectedNode && selectedNode.key === node.key) ? 
            { fontWeight: 'bold', color: 'var(--primary-700)' } : {};
        const hasChildrenStyle = !isLeaf ? 
            { cursor: 'pointer', fontWeight: options.expanded ? 'bold' : 'normal' } : {};
        
        const nodeTypeStyle = node.type === 'item' ? 
            { backgroundColor: 'var(--surface-50)', borderRadius: '4px', padding: '2px 4px' } : {};
        
        return (
            <div className="tree-node flex align-items-center" 
                 style={{...selectedNodeStyle, ...hasChildrenStyle, ...nodeTypeStyle}}>
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

    const handleNodeSelect = async (e) => {
        if (!e.node) return;
        
        if (e.node.type === 'item') {
            try {
                const itemId = e.node.key.replace('item_', '');
                console.log('Fetching details for item:', itemId);
                
                if (!itemId) {
                    throw new Error('ID de item no válido');
                }
                
                const response = await axios.get(`/tblmpasignacion/getItemDetails/${itemId}`);
                console.log('API Response:', response.data);
                
                if (response.data) {
                    if (response.data.asignado) {
                        app.flashMsg('Error', 
                            'Este item no está disponible porque ya se encuentra asignado a otro funcionario', 
                            'error'
                        );
                    }
                    
                    setItemSeleccionado(response.data);
                    if (response.data.as_fecha_inicio) {
                        setFechaInicio(new Date(response.data.as_fecha_inicio));
                    }
                    if (response.data.as_fecha_fin) {
                        setFechaFin(new Date(response.data.as_fecha_fin));
                    }
                    setShowTreeDialog(false);
                }
            } catch (error) {
                console.error('Error fetching item details:', error);
                app.flashMsg('Error', 
                    `No se pudo obtener la información del item: ${error.response?.data?.message || error.message}`, 
                    'error'
                );
            }
        }
    };

    const handleSave = async () => {
        if (!itemSeleccionado || !fechaInicio || !selectedTipoActa) {
            app.flashMsg('Error', 'Complete todos los campos requeridos', 'error');
            return;
        }

        try {
            setSaving(true);
            
            const data = {
                as_per_id: personaId,
                as_ca_id: itemSeleccionado.ca_id,
                as_fecha_inicio: fechaInicio,
                as_fecha_fin: fechaFin,
                as_estado: 'V',
                as_tipo_reg: 'ALT',
                as_tipo_mov: selectedTipoActa,
                as_fecha_creacion: new Date(),
                as_usuario_creacion: 1
            };

            await axios.post('/tblmpasignacion/add', data);
            
            app.flashMsg('Éxito', 'Asignación guardada correctamente');
            app.navigate('/asignacionItems');
            
        } catch (error) {
            console.error('Error saving:', error);
            app.flashMsg('Error', 'Error al guardar la asignación', 'error');
        } finally {
            setSaving(false);
        }
    };

    const PersonaInfoCard = () => (
        <Card className="mb-3">
            <div className="flex flex-column align-items-center text-center mb-4">
                <div className="p-4 border-circle bg-primary-100 mb-3" style={{ width: '150px', height: '150px' }}>
                    <i className="pi pi-user text-8xl text-primary" style={{ fontSize: '5rem' }}></i>
                </div>
                <h2 className="text-xl font-bold mb-2">{`${persona?.per_nombres} ${persona?.per_ap_paterno} ${persona?.per_ap_materno}`}</h2>
                <div className="flex align-items-center gap-2 text-500">
                    <i className="pi pi-id-card"></i>
                    <span className="font-semibold">CI: {persona?.per_num_doc}</span>
                </div>
            </div>

            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="p-3 border-round surface-100">
                        <div className="text-500 mb-2">Nombres</div>
                        <div className="text-900 font-medium">{persona?.per_nombres}</div>
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="p-3 border-round surface-100">
                        <div className="text-500 mb-2">Apellido Paterno</div>
                        <div className="text-900 font-medium">{persona?.per_ap_paterno}</div>
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="p-3 border-round surface-100">
                        <div className="text-500 mb-2">Apellido Materno</div>
                        <div className="text-900 font-medium">{persona?.per_ap_materno}</div>
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="p-3 border-round surface-100">
                        <div className="text-500 mb-2">Apellido Casada</div>
                        <div className="text-900 font-medium">{persona?.per_ap_casada || 'No registrado'}</div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const BusquedaItemCard = () => (
        <Card className="mb-3 shadow-2">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="m-0 font-semibold">Búsqueda de Item</h3>
                    <span className="text-500">Seleccione el método de búsqueda</span>
                </div>
                <Button 
                    label="Buscar en árbol" 
                    icon="pi pi-sitemap"
                    className="p-button-rounded p-button-outlined"
                    onClick={() => setShowTreeDialog(true)}
                />
            </div>

            <div className="surface-100 p-3 border-round mb-3">
                <div className="flex align-items-center mb-3">
                    <Checkbox 
                        checked={tieneNumItem} 
                        onChange={e => setTieneNumItem(e.checked)} 
                        id="tieneItem"
                    />
                    <label htmlFor="tieneItem" className="ml-2 font-medium">¿Tiene número de item?</label>
                </div>
                
                {tieneNumItem && (
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputText 
                            value={numItemBusqueda}
                            onChange={e => setNumItemBusqueda(e.target.value)}
                            placeholder="Ingrese número de item"
                            className="w-full"
                        />
                        <Button 
                            icon="pi pi-search" 
                            onClick={handleNumItemSearch}
                            className="p-button-primary"
                        />
                    </div>
                )}
            </div>
        </Card>
    );

    const ItemInfoCards = () => (
        <>
            <Card title="Información del Item" className="mb-3">
                <div className="grid">
                    <div className="col-3">
                        <label className="block font-bold mb-2">Código Item</label>
                        <div className="p-3 border-round surface-100">
                            {itemSeleccionado ? `${itemSeleccionado.ca_ti_item}-${itemSeleccionado.ca_num_item}` : 'No seleccionado'}
                        </div>
                    </div>
                    <div className="col-3">
                        <label className="block font-bold mb-2">Escalafón</label>
                        <div className="p-3 border-round surface-100">
                            {itemSeleccionado?.es_escalafon || 'No seleccionado'}
                        </div>
                    </div>
                    <div className="col-3">
                        <label className="block font-bold mb-2">Cargo</label>
                        <div className="p-3 border-round surface-100">
                            {itemSeleccionado?.cargo_descripcion || 'No seleccionado'}
                        </div>
                    </div>
                    <div className="col-3">
                        <label className="block font-bold mb-2">Haber Básico</label>
                        <div className="p-3 border-round surface-100 text-primary font-bold">
                            {itemSeleccionado?.ns_haber_basico 
                                ? new Intl.NumberFormat('es-BO', { 
                                    style: 'currency', 
                                    currency: 'BOB' 
                                  }).format(itemSeleccionado.ns_haber_basico)
                                : 'No seleccionado'}
                        </div>
                    </div>
                    <div className="col-3">
                        <label className="block font-bold mb-2">Estado</label>
                        <div className="p-3 border-round surface-100">
                            {itemSeleccionado ? (
                                itemSeleccionado.asignado ? (
                                    <div className="flex flex-column align-items-start gap-2">
                                        <span className="badge bg-red-100 text-red-900 p-2">
                                            <i className="pi pi-lock mr-2"></i>
                                            Item Asignado
                                        </span>
                                        <small className="text-red-500 block">
                                            Este item ya está asignado y no puede ser seleccionado
                                        </small>
                                    </div>
                                ) : (
                                    <span className="badge bg-green-100 text-green-900 p-2">
                                        <i className="pi pi-check-circle mr-2"></i>
                                        Item Disponible
                                    </span>
                                )
                            ) : (
                                <span className="text-500">
                                    <i className="pi pi-info-circle mr-2"></i>
                                    Seleccione item
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
            
            {!itemSeleccionado?.asignado && (
                <>
                    <Card title="Información de Asignación" className="mb-3">
                        <div className="grid">
                            {/* Fecha Alta siempre visible */}
                            <div className={itemSeleccionado?.ca_ti_item === 'P' ? 'col-6' : 'col-4'}>
                                <label className="block font-bold mb-2">Fecha Alta *</label>
                                <Calendar 
                                    value={fechaInicio}
                                    onChange={e => setFechaInicio(e.value)}
                                    showIcon
                                    className="w-full"
                                />
                            </div>
                            
                            {/* Fecha Baja solo visible cuando NO es tipo P */}
                            {itemSeleccionado?.ca_ti_item && itemSeleccionado.ca_ti_item !== 'P' && (
                                <div className="col-4">
                                    <label className="block font-bold mb-2">Fecha Baja</label>
                                    <Calendar 
                                        value={fechaFin}
                                        onChange={e => setFechaFin(e.value)}
                                        showIcon
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <div className="col-4">
                                <label className="block font-bold mb-2">Tipo Jornada</label>
                                <div className="p-3 border-round surface-100">
                                    {itemSeleccionado?.ca_tipo_jornada === 'TT' ? 'Tiempo Completo' : 
                                     itemSeleccionado?.ca_tipo_jornada === 'MT' ? 'Medio Tiempo' : 
                                     'No seleccionado'}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Categorías" className="mb-3">
                        <div className="grid">
                            <div className="col-6">
                                <label className="block font-bold mb-2">Categoría Administrativa</label>
                                <div className="p-3 border-round surface-100">
                                    {itemSeleccionado?.categoria_administrativa || 'No seleccionado'}
                                </div>
                            </div>
                            <div className="col-6">
                                <label className="block font-bold mb-2">Categoría Programática</label>
                                <div className="p-3 border-round surface-100">
                                    {itemSeleccionado?.categoria_programatica || 'No seleccionado'}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Tipo de Movimiento" className="mb-3">
                        <div className="grid">
                            <div className="col-12">
                                <label className="block font-bold mb-2">Tipo de Acta *</label>
                                <Dropdown
                                    value={selectedTipoActa}
                                    options={tiposActa}
                                    onChange={(e) => setSelectedTipoActa(e.value)}
                                    placeholder="Seleccione el tipo de acta"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </Card>

                    {itemSeleccionado && (
                        <div className="flex justify-content-end mt-3">
                            <Button
                                label="Guardar Asignación"
                                icon="pi pi-save"
                                className="p-button-success"
                                onClick={handleSave}
                                loading={saving}
                                disabled={!selectedTipoActa || !fechaInicio}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <Title title="Administración de Asignación" />
            
            <div className="grid">
                <div className="col-12 lg:col-4">
                    <div className="sticky" style={{ top: '20px' }}>
                        <PersonaInfoCard />
                        <BusquedaItemCard />
                    </div>
                </div>
                
                <div className="col-12 lg:col-8">
                    <ItemInfoCards />
                </div>
            </div>

            <Dialog 
                visible={showTreeDialog} 
                onHide={() => setShowTreeDialog(false)}
                header={
                    <div className="flex justify-content-between align-items-center w-full">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-sitemap text-xl"></i>
                            <span className="font-bold">Seleccionar Item</span>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                icon="pi pi-plus" 
                                label="Expandir todo"
                                className="p-button-outlined p-button-sm" 
                                onClick={handleExpandAll}
                            />
                            <Button 
                                icon="pi pi-minus" 
                                label="Contraer todo"
                                className="p-button-outlined p-button-sm" 
                                onClick={handleCollapseAll}
                            />
                        </div>
                    </div>
                }
                style={{ width: '80vw' }}
                className="p-dialog-custom"
            >
                <div className="p-3 surface-100 border-round mb-3">
                    <i className="pi pi-info-circle text-primary mr-2"></i>
                    <span className="text-600">Seleccione un item disponible del árbol organizacional</span>
                </div>
                <Tree
                    ref={treeRef}
                    value={treeData}
                    selectionMode="single"
                    selectionKeys={selectedNode}
                    expandedKeys={expandedKeys}
                    onToggle={e => setExpandedKeys(e.value)}
                    onSelect={handleNodeSelect}
                    onSelectionChange={(e) => {
                        const key = Object.keys(e.value)[0];
                        if (key) {
                            const findNode = (nodes) => {
                                for (let node of nodes) {
                                    if (node.key === key) return node;
                                    if (node.children) {
                                        const found = findNode(node.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            };
                            const selectedNodeData = findNode(treeData);
                            setSelectedNode(selectedNodeData);
                        }
                    }}
                    className="w-full"
                    filter
                    filterMode="lenient"
                    filterPlaceholder="Buscar unidad organizacional"
                    nodeTemplate={nodeTemplate}
                />
            </Dialog>
        </div>
    );
};

export default TblasignacionView;
