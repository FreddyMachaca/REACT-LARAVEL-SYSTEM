import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import { useState } from 'react';
import axios from "axios";

function RegisterZoneDialog({ dialogZone, showDialogAddZone, selectValue, setFormData }) {
    const [filteredValues, setFilteredValues] = useState({provincia: [], ciudad_localidad:[]});

  const formik = useFormik({
    initialValues: {
      cat_descripcion: "",
      cat_estado: "V",
      cat_id_superior: null,
      cat_tabla: "zona",

      cat_departamento: null,
      cat_provincia: null,
    },
    validate: (data) => {
      let errors = {};
      if (!data.cat_departamento) {
        errors.cat_departamento = "Este campo es requerido.";
      }

      if (!data.cat_provincia) {
        errors.cat_provincia = "Este campo es requerido.";
      }

      if (!data.cat_id_superior) {
        errors.cat_id_superior = "Este campo es requerido.";
      }

      if (!data.cat_descripcion) {
        errors.cat_descripcion = "Este campo es requerido.";
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      showDialogAddZone();
      formik.resetForm();
    },
  });

  const isFormFieldValid = (name) =>!!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  const filterSelect = ({target, value}) => {
    axios.get(`tblcatalogo/catalogos/childs/${value}`)
        .then(response => {
            const data = response.data; // Extraer la data de la respuesta

            // Verificar qué campo actualizar en el estado según target.name
            if (target.name === "cat_departamento") {
                setFilteredValues(prev => ({
                    ...prev,
                    provincia: data.map(item => ({
                        label: item.cat_descripcion,
                        value: item.cat_id
                    })),
                    ciudad_localidad: [] // Resetear ciudad_localidad si cambia el departamento
                }));
            } else if (target.name === "cat_provincia") {
                setFilteredValues(prev => ({
                    ...prev,
                    ciudad_localidad: data.map(item => ({
                        label: item.cat_descripcion,
                        value: item.cat_id
                    }))
                }));
            }
        })
        .catch(error => console.error("Error al obtener catálogos hijos:", error));
  }

  return (
    <Dialog
      header="Nueva zona"
      visible={dialogZone}
      style={{ width: "50vw" }}
      onHide={showDialogAddZone}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="grid p-fluid mb-2 mt-3">
          <div className="field col-12 md:col-4">
            <span className="p-float-label">
              <Dropdown
                id="cat_departamento"
                name="cat_departamento"
                value={formik.values.cat_departamento}
                onChange={(e) =>
                  {formik.setFieldValue("cat_departamento", e.value);
                  filterSelect(e);}
                }
                options={selectValue}
                optionLabel="label"
              />
              <label
                htmlFor="cat_departamento"
                className={classNames({
                  "p-error": isFormFieldValid("cat_departamento"),
                })}
              >
                DEPARTAMENTO
              </label>
            </span>
            {getFormErrorMessage("cat_departamento")}
          </div>
          <div className="field col-12 md:col-4">
            <span className="p-float-label">
              <Dropdown 
              id="cat_provincia"
              name="cat_provincia"
              value={formik.values.cat_provincia}
              options={filteredValues.provincia} 
              onChange={(e) =>
                {formik.setFieldValue("cat_provincia", e.value)
                filterSelect(e);}
              }
              optionLabel="label"
              />
              <label htmlFor="cat_provincia" 
              className={classNames({
                "p-error": isFormFieldValid("cat_provincia"),
              })}>PROVINCIA</label>
            </span>
            {getFormErrorMessage("cat_provincia")}

          </div>
          <div className="field col-12 md:col-4">
            <span className="p-float-label">
              <Dropdown 
              id="cat_id_superior"
              name="cat_id_superior"
              value={formik.values.cat_id_superior}
              onChange={(e) =>
                formik.setFieldValue("cat_id_superior", e.value)
              }
              options={filteredValues.ciudad_localidad} 
              optionLabel="label"
              />
              <label htmlFor="cat_id_superior" 
              className={classNames({
                "p-error": isFormFieldValid("cat_id_superior"),
              })}>CIUDAD</label>
            </span>
            {getFormErrorMessage("cat_id_superior")}
          </div>
          <div className="field col-12">
            <span className="p-float-label">
              <InputText 
              id='cat_descripcion'
              name='cat_descripcion'
              value={formik.values.cat_descripcion}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('cat_descripcion') })}/>
              <label htmlFor="cat_descripcion"
              className={classNames({ 'p-error': isFormFieldValid('cat_descripcion') })}>NUEVA ZONA</label>
            </span>
            {getFormErrorMessage('cat_descripcion')}
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            type="button"
            onClick={showDialogAddZone}
            className="p-button-text"
          />
          <Button label="Guardar" type="submit" icon="pi pi-check" autoFocus />
        </div>
      </form>
    </Dialog>
  );
}

export default RegisterZoneDialog;
