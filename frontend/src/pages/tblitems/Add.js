import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import useApp from 'hooks/useApp';
import useAddPage from 'hooks/useAddPage';

const TblItemsAddPage = (props) => {
    const finalProps = { ...TblItemsAddPage.defaultProps, ...props };

    const app = useApp();
    const toast = React.useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const pageController = useAddPage({ props: finalProps });
    const { submitForm, apiRequestError, loading } = pageController;
    const [item, setItem] = useState(finalProps.formDefaultValues || {});

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (!item.codigo_item || !item.cargo || !item.haber_basico || !item.unidad_organizacional) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Por favor complete todos los campos requeridos', 
                life: 3000 
            });
            return;
        }
        try {
            await submitForm(item);
            app.flashMsg("Éxito", "Registro agregado correctamente", "success");
            toast.current.show({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Item agregado correctamente', 
                life: 3000 
            });
            app.navigate('/tblitems');
        } catch (error) {
            console.error('Save error:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: typeof error === 'string' ? error : 'No se pudo agregar el item', 
                life: 3000 
            });
        }
    };

    const handleCancel = () => {
        setSubmitted(false);
        app.navigate(-1);
    };

    return (
        <main className="main-page">
            <h2>Agregar Nuevo Item</h2>
            <Toast ref={toast} />
            <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
                <div className="field">
                    <label htmlFor="codigo_item">Código Item</label>
                    <InputText
                        id="codigo_item"
                        name="codigo_item"
                        value={item?.codigo_item || ''}
                        onChange={onInputChange}
                        required
                        autoFocus
                    />
                    {submitted && !item?.codigo_item && <small className="p-error">El código del item es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="cargo">Cargo</label>
                    <InputText
                        id="cargo"
                        name="cargo"
                        value={item?.cargo || ''}
                        onChange={onInputChange}
                        required
                    />
                    {submitted && !item?.cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="haber_basico">Haber Básico</label>
                    <InputText
                        id="haber_basico"
                        name="haber_basico"
                        value={item?.haber_basico || ''}
                        onChange={onInputChange}
                        type="number"
                        step="0.01"
                        required
                    />
                    {submitted && !item?.haber_basico && <small className="p-error">El haber básico es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="unidad_organizacional">Unidad Organizacional</label>
                    <InputText
                        id="unidad_organizacional"
                        name="unidad_organizacional"
                        value={item?.unidad_organizacional || ''}
                        onChange={onInputChange}
                        required
                    />
                    {submitted && !item?.unidad_organizacional && <small className="p-error">La unidad organizacional es requerida.</small>}
                </div>
                <div className="field">
                    <Button
                        label="Guardar"
                        icon="pi pi-check"
                        onClick={handleSave}
                        className="p-button-success mr-2"
                        loading={loading}
                    />
                    <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-secondary" />
                </div>
            </form>
            {apiRequestError && (
                <Message
                    severity="error"
                    className="mt-3"
                    text={
                        typeof apiRequestError === 'string' 
                            ? apiRequestError 
                            : (apiRequestError?.message || 'Ha ocurrido un error al procesar la solicitud')
                    }
                />
            )}
        </main>
    );
};

TblItemsAddPage.defaultProps = {
    id: null,
    primaryKey: 'id',
    pageName: 'tblitem',
    apiPath: 'tblitem/add',
    routeName: 'tblitemsadd',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Registro eliminado con éxito",
    showHeader: true,
    showFooter: true,
    exportButton: true,
    isSubPage: false,
    formDefaultValues: {
        codigo_item: '',
        cargo: '',
        haber_basico: '',
        unidad_organizacional: ''
    }
};

export default TblItemsAddPage;