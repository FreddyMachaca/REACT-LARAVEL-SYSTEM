import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tree } from 'primereact/tree';
import { useFormik } from 'formik';
import axios from 'axios'
import DialogEOrganizacional from './DialogEOrganizacional.jsx';
import PageLoading from '../../components/PageLoading'
import React, { useState, useEffect } from 'react';
import useApp from 'hooks/useApp';


function TblestructuraorganizacionalView() {
    const app = useApp();
    const [categoriaProgramatica, setCategoriaProgramatica] = useState(); 
    const [dropdownDocumento, setDropdownDocumento] = useState();
    const [displayResponsive, setDisplayResponsive] = useState(false);
    const [formData, setFormData] = useState({});
    const [nodes, setNodes] = useState();
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedKeys, setExpandedKeys] = useState({});    

    useEffect(() => {
        PageLoading();
    
        fetchData();
    }, []);

    useEffect(() => {
        if (Object.keys(formData).length > 0) { 
            handleSubmit();
        }
    }, [formData]);
    
    const fetchData = async () => {
        try {
            const eo_pr_id = 21;
            const [response1, response2] = await Promise.all([
                axios.get(`tblmpestructuraoraganizacional/${eo_pr_id}`),
            ]);

            const data1 = response1.data;
            const transFormNode = (node, parent = null, parentKey = '', index = 0) => {
                const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
                const children = node.children ? Object.values(node.children) : [];
                
                return {
                    id: node.eo_id,
                    key: currentKey,
                    label: node.eo_descripcion?.trim() || node.cp_ue_descripcion.trim(),
                    pi_icon: "pi pi-fw pi-folder",
                    codigo: node.eo_cp_id === 0 ? '' : `${node.cp_da} - ${node.cp_ue} - ${node.cp_programa} - ${node.cp_proyecto} - ${node.cp_actividad} (${node.cp_fuente} - ${node.cp_organismo})`,
                    parent,
                    children: children.map((child, childIndex) => transFormNode(child, node, currentKey, childIndex))
                };
            };

            const transformedData = Object.values(data1).map((rootNode, index) => transFormNode(rootNode, null,'', index));
            setNodes(transformedData);

            fillDrodownDocument(data1);

            setLoading(false);
            
        } catch (error) {
            console.error("Error al obtener registros: ", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            item_number: '',
            und_organizacional: null,
        },
        validate: (data) => {
            let errors = {};
            
            if (!data.und_organizacional) {
                errors.und_organizacional = 'Este campo es requerido.';
            }

            return errors;
        },
        onSubmit: ({item_number, und_organizacional:{code}}) => {
            expandNodeByEoId(code);
        }
    });

    const formikAddEo = useFormik({
        initialValues: {
            eo_pr_id: '',
            eo_descripcion: '',
            eo_prog: '', 
            eo_sprog: '', 
            eo_proy: '', 
            eo_unidad: '',
            eo_obract: '',
            eo_cod_superior: '',
            eo_estado: '', 
            eo_cp_id: null,
        },
        validate: (data) => {
            let errors = {};

            if (data.eo_pr_id === '' || data.eo_prog === '' || data.eo_sprog === '' || data.eo_proy === '' || data.eo_cod_superior === '') {
                errors.eo_cod_superior = 'Campo requerido.';
            }

            if(!data.eo_cp_id){
                errors.eo_cp_id = 'Este campo es requerido';
            }

            if(!data.eo_descripcion){
                errors.eo_descripcion = 'Este campo es requerido';
            }

            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            onHide();
            formikAddEo.resetForm();
        }
    }); 

    const fillDrodownDocument = (data) => {
        
        const extractNodes = (node, collected = []) => {
            collected.push({
                name: node.eo_descripcion?.trim() || node.cp_ue_descripcion.trim(),
                code: node.eo_id
            });

            if (node.children) {
                Object.values(node.children).forEach(child => extractNodes(child, collected));
            }

            return collected;
        };

        const transformedData = Object.values(data).flatMap(rootNode => extractNodes(rootNode));
        
        setDropdownDocumento(transformedData);
    }
    
    const isFormFieldValid = (formik, name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (formik, name) => {
        return isFormFieldValid(formik, name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const onNodeSelect = ({node}) => {
        if(!node.id) return ;
        
        setSelectedNode(node);

        if( [2,3].includes(node.key.split('-').length) ){
            const level = node.key.split('-').length;
            fetchEstructuraByNode(node, level);
            setDisplayResponsive(true);            
        }
    }

    const fetchEstructuraByNode = (node, level) => {
        const nodeId = level == 2 ? node.id : node.parent.eo_id;
        axios.get(`tblmpestructuraoraganizacional/structures-and-categories/${nodeId}`)
        .then(response => {
            const record = response.data.record;
            const record_cp = response.data.record_cp;
            
            filterSelect(record_cp.cp_da, record_cp.cp_pr_id);
            
            const newValues = {
                eo_prog: record.eo_prog,
                eo_sprog: record.eo_sprog,
                eo_proy: record.eo_proy,
                eo_obract: record.eo_obract,
                eo_unidad: record.eo_unidad,
                eo_pr_id: record.eo_pr_id,
                eo_cod_superior: node.id,
                eo_cp_id: null,
                eo_descripcion: '',
                eo_estado: 'V', 
            };
            formikAddEo.setValues(newValues);
        })
        .catch(error => {
            console.error("Error al obtener registros: ", error)
        })
    }
    
    const filterSelect = (cp_da, cp_pr_id) => {
        axios.get(`tblmpcategoriaprogramatica/period-and-da/${cp_da}/${cp_pr_id}`)
        .then(response => {
            const options = response.data.map((item) => ({
                name: `${item.cp_descripcion}`,  
                code: item.cp_id,
                code_cp: `${item.cp_da} - ${item.cp_ue} - ${item.cp_programa} - ${item.cp_proyecto} - ${item.cp_actividad} (${item.cp_fuente} - ${item.cp_organismo})`,
            }));

            setCategoriaProgramatica(options);
        })
        .catch(error => {
            console.error("Error al obtener registros: ", error)
        })
    }

    const onHide = () => setDisplayResponsive(false);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('tblmpestructuraoraganizacional/add', formData);
            setLoading(true);

            console.log('Respuesta del servidor:', response.data);
            app.flashMsg('Crear registro', 'Grabar agregado exitosamente');
        } catch (error) {
            console.error('Error al enviar datos:', error);
            app.flashMsg('Error', 'No se pudo enviar la información');
        }
        fetchData();
    }

    const findNodeByEoId = (nodes, targetId) => {
        for(const node of nodes){
            if(node.id === targetId) return node;
            
            if(node.children){
                const found = findNodeByEoId(node.children, targetId);
                if(found) return found;
            }
        }
        return null;
    };

    const expandNodeByEoId = (targetId) => {
        const node = findNodeByEoId(nodes, targetId);
        if(!node) return;

        setSelectedNode(node);

        // We get keys ancesters (for the node will be visible)
        const keyParts = node.key.split('-');
        const ancestorKeys = [];
        let currentKey = '';

        for(let i=0; i<keyParts.length-1; i++){
            currentKey = currentKey ? `${currentKey}-${keyParts[i]}` : keyParts[i];
            ancestorKeys.push(currentKey);
        }

        // create new object expandedKeys
        const newExpandedKeys = {};
        ancestorKeys.forEach(key => newExpandedKeys[key] = true);

        // expand the node, if this have childrens
        if(node.children?.length > 0){
            newExpandedKeys[node.key] = true;
        }

        setExpandedKeys(newExpandedKeys);
        setSelectedKey(node.key); 
    }

  return (
    <>
        <div className="flex align-items-center justify-content-center h-full">
            <Card style={{ width: '50vw', padding: '0' }}>
                <section>
                    <div className="border-left-2 border-primary-500 m-2 surface-overlay p-2 flex justify-content-between">
                        <div>
                            <strong>Estructura Organizacional</strong>
                            <p>Seleccione la unidad organizacion requerida.</p>
                        </div>
                        <div>
                            {/* <Button className="p-button-outlined"> <i className="pi pi-print mr-2"></i>Imprimir</Button> */}
                        </div>
                    </div>
                </section>
                <Divider/>
                <section>
                    <div>
                        <form onSubmit={formik.handleSubmit} className="p-fluid">
                            <div className='grid p-fluid my-2'>
                                <div className="field col-6">
                                    <span className="p-float-label">
                                    <Dropdown id="und_organizacional" name='und_organizacional' value={formik.values.und_organizacional} options={dropdownDocumento} onChange={formik.handleChange} optionLabel="name" filter showClear filterBy='name' />
                                    <label htmlFor="und_organizacional" className={classNames({ 'p-error': isFormFieldValid(formik,'und_organizacional') })}>TIPO DE DOCUMENTO</label>
                                    </span>
                                    {getFormErrorMessage(formik,'und_organizacional')}
                                </div>
                                <div className="field col-3">
                                    <span className="p-float-label">
                                        <InputText id="item_number" name="item_number" value={formik.values.item_number} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid(formik, 'item_number') })} />
                                        <label htmlFor="item_number" className={classNames({ 'p-error': isFormFieldValid(formik, 'item_number') })}>NÚMERO DE ÍTEM</label>
                                    </span>
                                    {getFormErrorMessage(formik, 'item_number')}
                                </div>

                                <div className='col-3'>
                                    <Button type="submit" className='font-semibold flex justify-content-center align-items-center'> <i className="pi pi-search mr-2"></i> BUSCAR</Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="scrollable-tree">
                    {loading && (<PageLoading/>)}
                    {!loading && (<Tree value={nodes} 
                    nodeTemplate={(node) => (
                        <span className='flex'>
                        <span className={`icon-blue`}>
                            <i className={node.pi_icon}></i>
                        </span>{node.label} { node.codigo && (<span className='ml-2 text-sm text-color-secondary'>{node.codigo}</span>)}
                        </span>
                    )}
                    selectionMode="single" selectionKeys={selectedKey} onSelectionChange={e => setSelectedKey(e.value)} onSelect={onNodeSelect}
                    expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}/>)}
                    </div>
                </section>
            </Card>
        </div>
        <DialogEOrganizacional display={displayResponsive} node={selectedNode} formik={formikAddEo} data={categoriaProgramatica} onHide={onHide}/>
    </>
  )
}

export default TblestructuraorganizacionalView