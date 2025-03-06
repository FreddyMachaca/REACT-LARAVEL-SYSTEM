import React, { useEffect, useState, useRef } from 'react';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Formik, Form, ErrorMessage } from 'formik';  
import * as yup from 'yup'; 
import TblsegmenuEditPage from './Edit';
import useApp from 'hooks/useApp';
import UploadIcon from 'components/UploadIcon';

const TblsegmenuListPage = (props) => {
    const app = useApp();
    const [searchText, setSearchText] = useState('');
    const toast = useRef(null);
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [addChildDialogVisible, setAddChildDialogVisible] = useState(false);
    const [selectedParentNode, setSelectedParentNode] = useState(null);

    const handleEdit = (node) => {
        setSelectedNodeId(node.key);
        setEditDialogVisible(true);
    };

    const handleDelete = (node) => {
        confirmDialog({
            message: '¿Está seguro que desea eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.delete(`/tblsegmenu/delete/${node.key}`);
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado' });
                    fetchMenuTree();
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro' });
                }
            }
        });
    };

    const handleAddChild = (node) => {
        setSelectedParentNode(node);
        setAddChildDialogVisible(true);
    };

    const nodeTemplate = (node) => {
        const isParentNode = node.data.me_url === '#';
        return (
            <div className="flex align-items-center justify-content-between py-2 w-full">
                <div className="flex align-items-center flex-grow-1">
                    {node.data.me_icono && (
                        <span className="mr-2">
                            {node.data.me_icono.startsWith('http') ? (
                                <img src={node.data.me_icono} alt="icon" style={{width: '24px', height: '24px'}} />
                            ) : (
                                <i className={`${node.data.me_icono} text-xl`}></i>
                            )}
                        </span>
                    )}
                    {node.label}
                    {!isParentNode && <small className="ml-2 text-gray-500">({node.data.me_url})</small>}
                </div>
                <div className="flex gap-2 ml-auto">
                    {isParentNode && (
                        <Button 
                            icon="pi pi-plus-circle" 
                            className="p-button-rounded p-button-text p-button-success"
                            tooltip="Agregar un submenu"
                            tooltipOptions={{ position: 'left' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddChild(node);
                            }}
                        />
                    )}
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-rounded p-button-text"
                        tooltip="Editar"
                        tooltipOptions={{ position: 'left' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(node);
                        }}
                    />
                    <Button 
                        icon="pi pi-trash" 
                        className="p-button-rounded p-button-text p-button-danger"
                        tooltip="Eliminar"
                        tooltipOptions={{ position: 'left' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(node);
                        }}
                    />
                </div>
            </div>
        );
    };

    const filterTree = (nodes) => {
        if (!searchText) return nodes;
        
        return nodes.filter(node => {
            const matchesSearch = node.label.toLowerCase().includes(searchText.toLowerCase());
            const hasMatchingChildren = node.children && filterTree(node.children).length > 0;
            return matchesSearch || hasMatchingChildren;
        });
    };

    const convertNodes = (nodes) => {
        return nodes.map(node => ({
            key: String(node.me_id),
            label: node.me_descripcion,
            data: node,
            children: node.children ? convertNodes(node.children) : []
        }));
    };

    const fetchMenuTree = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/tblsegmenu/getMenuTree');
            setTreeData(convertNodes(response.data));
        } catch (error) {
            console.error('Error al obtener el menú en forma de árbol:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMenuTree();
    }, []);

    const AddChildForm = () => {
        const initialValues = {
            me_descripcion: '',
            me_url: '',
            me_icono: '',
            me_id_padre: selectedParentNode?.key,
            me_estado: 'V'
        };

        const handleSubmit = async (values, { setSubmitting }) => {
            try {
                await axios.post('/tblsegmenu/add', {
                    ...values,
                    me_icono: values.me_icono || null, 
                });
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Menú agregado correctamente' });
                setAddChildDialogVisible(false);
                fetchMenuTree();
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el menú' });
            }
            setSubmitting(false);
        };

        return (
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={yup.object().shape({
                    me_descripcion: yup.string().required('La descripción es requerida'),
                    me_url: yup.string().required('La URL es requerida'),
                    me_icono: yup.string().nullable()
                })}
            >
                {({ values, handleChange, isSubmitting, setFieldValue }) => (
                    <Form className="p-fluid">
                        <div className="field">
                            <label htmlFor="me_descripcion">Descripción</label>
                            <InputText
                                id="me_descripcion"
                                name="me_descripcion"
                                value={values.me_descripcion}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="me_descripcion" component="small" className="p-error" />
                        </div>
                        <div className="field">
                            <label htmlFor="me_url">URL</label>
                            <InputText
                                id="me_url"
                                name="me_url"
                                value={values.me_url}
                                onChange={handleChange}
                                placeholder="/ruta del submenu"
                            />
                            <ErrorMessage name="me_url" component="small" className="p-error" />
                        </div>
                        <div className="field">
                            <label htmlFor="me_icono">Icono</label>
                            <UploadIcon 
                                onUpload={(url) => setFieldValue('me_icono', url)}
                            />
                            <small className="text-gray-500">
                                Puedes subir un icono personalizado o dejarlo vacío para usar el icono por defecto
                            </small>
                        </div>
                        <div className="flex justify-content-end mt-4">
                            <Button 
                                type="submit" 
                                label="Guardar" 
                                icon="pi pi-save"
                                loading={isSubmitting}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        );
    };

    return (
        <main id="TblsegmenuListPage" className="main-page p-5">
            <Toast ref={toast} />
            <Dialog
                header="Agregar un submenu"
                visible={addChildDialogVisible}
                style={{ width: '50vw' }}
                modal
                onHide={() => setAddChildDialogVisible(false)}
            >
                <AddChildForm />
            </Dialog>

            {/* Diálogo de edición */}
            <Dialog
                header="Editar Menú"
                visible={editDialogVisible}
                style={{ width: '50vw' }}
                modal
                onHide={() => setEditDialogVisible(false)}
            >
                {selectedNodeId && (
                    <TblsegmenuEditPage
                        id={selectedNodeId}
                        isSubPage={true}
                        showHeader={false}
                        onSave={() => {
                            setEditDialogVisible(false);
                            fetchMenuTree();
                        }}
                    />
                )}
            </Dialog>

            {props.showHeader && (
                <section className="page-section mb-4">
                    <div className="container-fluid">
                        <div className="grid justify-content-between align-items-center">
                            <div className="col">
                                <h2 className="text-3xl text-primary font-bold">Menú del Sistema</h2>
                            </div>
                            <div className="col-fixed" style={{ minWidth: '400px' }}>
                                <div className="flex gap-3">
                                    <span className="p-input-icon-left flex-grow-1">
                                        <i className="pi pi-search" />
                                        <InputText 
                                            value={searchText} 
                                            onChange={(e) => setSearchText(e.target.value)} 
                                            placeholder="Buscar..."
                                            className="p-inputtext p-component w-full"
                                        />
                                    </span>
                                    <Link to="/tblsegmenu/add">
                                        <Button 
                                            label="Agregar Nuevo Menu" 
                                            icon="pi pi-plus" 
                                            className="p-button p-component bg-primary" 
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <section className="page-section">
                <div className="container-fluid">
                    <div className="card p-4">
                        {loading ? (
                            <div className="flex align-items-center justify-content-center text-gray-500 p-5">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                            </div>
                        ) : (
                            <Tree 
                                value={filterTree(treeData)} 
                                nodeTemplate={nodeTemplate}
                                className="w-full"
                                style={{ minHeight: '400px' }}
                            />
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

TblsegmenuListPage.defaultProps = {
    primaryKey: 'me_id',
    pageName: 'tblsegmenu',
    apiPath: 'tblsegmenu/index',
    routeName: 'tblsegmenulist',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Grabar eliminado con éxito",
    showHeader: true,
    showFooter: true,
    paginate: true,
    isSubPage: false,
    showBreadcrumbs: true,
    exportData: false,
    importData: false,
    keepRecords: false,
    multiCheckbox: true,
    search: '',
    fieldName: null,
    fieldValue: null,
    sortField: '',
    sortDir: '',
    pageNo: 1,
    limit: 10,
};

export default TblsegmenuListPage;
