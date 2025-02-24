import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import useApp from 'hooks/useApp';
import useAddPage from 'hooks/useAddPage';

const TblItemsAddPage = (props) => {
    const app = useApp();
    const toast = React.useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const pageController = useAddPage(props);
    const { newItem, setNewItem, saveItem, apiRequestError, loading } = pageController;

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleSave = async () => {
        setSubmitted(true);
        try {
            await saveItem(newItem);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Item agregado correctamente', life: 3000 });
            app.closePageDialog();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el item', life: 3000 });
        }
    };

    const handleCancel = () => {
        setSubmitted(false);
        app.closePageDialog();
    };

    return (
        <Dialog header="Agregar Nuevo Item" visible={true} modal={true} onHide={handleCancel} closable={false}>
            <Toast ref={toast} />
            <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
                <div className="field">
                    <label htmlFor="codigo_item">Código Item</label>
                    <InputText
                        id="codigo_item"
                        name="codigo_item"
                        value={newItem.codigo_item || ''}
                        onChange={onInputChange}
                        required
                        autoFocus
                    />
                    {submitted && !newItem.codigo_item && <small className="p-error">El código del item es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="cargo">Cargo</label>
                    <InputText
                        id="cargo"
                        name="cargo"
                        value={newItem.cargo || ''}
                        onChange={onInputChange}
                        required
                    />
                    {submitted && !newItem.cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="haber_basico">Haber Básico</label>
                    <InputText
                        id="haber_basico"
                        name="haber_basico"
                        value={newItem.haber_basico || ''}
                        onChange={onInputChange}
                        type="number"
                        step="0.01"
                        required
                    />
                    {submitted && !newItem.haber_basico && <small className="p-error">El haber básico es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="unidad_organizacional">Unidad Organizacional</label>
                    <InputText
                        id="unidad_organizacional"
                        name="unidad_organizacional"
                        value={newItem.unidad_organizacional || ''}
                        onChange={onInputChange}
                        required
                    />
                    {submitted && !newItem.unidad_organizacional && <small className="p-error">La unidad organizacional es requerida.</small>}
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
                    text={
                        typeof apiRequestError === 'string'
                            ? apiRequestError
                            : apiRequestError?.message || 'Ha ocurrido un error'
                    }
                />
            )}
        </Dialog>
    );
};

TblItemsAddPage.defaultProps = {
    id: null,
    primaryKey: 'id',
    pageName: 'tblitems',
    apiPath: 'tblitems/add',
    routeName: 'tblitemsadd',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Registro eliminado con éxito",
    showHeader: true,
    showFooter: true,
    exportButton: true,
    isSubPage: false,
};

export default TblItemsAddPage;