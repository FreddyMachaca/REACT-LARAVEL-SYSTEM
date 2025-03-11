import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const DialogEOrganizacional = ({display, node, formik, data, onHide}) => {

    const selectedCategoryTemplate = (option, props) => {
        if (option) {
            return (
                <div>
                    <div className='text-sm'>{option.name} <span className='ml-2 text-xs text-color-secondary'>{option.code_cp}</span></div>
                </div>
            );
        }

        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const categoryOptionTemplate = (option) => {
        return (
            <div>
                <div className='text-sm'>{option.name} <span className='ml-2 text-xs text-color-secondary'>{option.code_cp}</span></div>
            </div>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                <Button type="submit" form="addEoForm" label="Guardar" icon="pi pi-save" autoFocus />
            </div>
        );
    }

    const isFormFieldValid = (formik, name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (formik, name) => {
        return isFormFieldValid(formik, name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  return (
    <>
    <Dialog header="Nuevo elemento en la estructura" visible={display} onHide={() => onHide()} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} footer={renderFooter()}>
        <section>
            <div className="border-left-2 border-primary-500 m-2 surface-overlay p-2 flex justify-content-between">
                <div>
                    <p>Está agregando un nuevo registro dentro de: <strong>{node && (node.label)}</strong>. 
                    <br></br>
                    Complete los siguientes campos para continuar.</p>
                </div>
            </div>
        </section>
        <form id="addEoForm" onSubmit={formik.handleSubmit} className="grid p-fluid my-5">
            <input type="hidden" name="eo_pr_id" value={formik.values.eo_pr_id} />
            <input type="hidden" name="eo_prog" value={formik.values.eo_prog} />
            <input type="hidden" name="eo_sprog" value={formik.values.eo_sprog} />
            <input type="hidden" name="eo_proy" value={formik.values.eo_proy} />
            <input type="hidden" name="eo_obract" value={formik.values.eo_obract} />
            <input type="hidden" name="eo_unidad" value={formik.values.eo_unidad} />
            <input type="hidden" name="eo_estado" value={formik.values.eo_estado} />
            <input type="hidden" name="eo_cod_superior" value={formik.values.eo_cod_superior} />

            <div className="field col-12">
                <span className="p-float-label">
                    <Dropdown id="eo_cp_id" name="eo_cp_id" value={formik.values.eo_cp_id} options={data} onChange={formik.handleChange} optionLabel="name" optionValue="code" valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} />
                    <label htmlFor="eo_cp_id" className={classNames({ 'p-error': isFormFieldValid(formik, 'eo_cp_id') })}>CATEGORIA PROGRAMÁTICA</label>
                </span>
                {getFormErrorMessage(formik, 'eo_cp_id')}
            </div>

            <div className="field col-12">
                <span className="p-float-label">
                    <InputText id="eo_descripcion" name="eo_descripcion" value={formik.values.eo_descripcion} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid(formik,'eo_descripcion') })} />
                    <label htmlFor="eo_descripcion" className={classNames({ 'p-error': isFormFieldValid(formik,'eo_descripcion') })}>DESCRIPCIÓN</label>
                </span>
                {getFormErrorMessage(formik,'eo_descripcion')}
            </div>
        </form>
    </Dialog>
    </>
  )
}

export default DialogEOrganizacional;