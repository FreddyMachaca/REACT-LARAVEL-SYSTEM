import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils'
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { SpeedDial } from 'primereact/speeddial';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import useApp from 'hooks/useApp';

const placeholders = ["[ITEM_DESTINO]",
"[SOLICITANTE]",
"[NOMBRE_DEL_FUNCIONARIO]",
"[CARNET_DE_IDENTIDAD]",
"[PUESTO_DE_TRABAJO]",
"[DEPENDENCIA]",
"[FECHA_ASIGNACION]",
"[FECHA_DE_BAJA]",
"[HABER_BASICO_DESTINO]",
"[HABER_BASICO_DESTINO_LITERAL]",
"[NIVEL_SALARIAL_DESTINO]",
"[NOMBRE_DE_LA_UNIDAD]",
"[CODIGO_DE_FUNCIONARIO]",
"[fin]"];

function TbltenoresAdd() {
    const app = useApp();
    const [formData, setFormData] = useState({});
    const [text, setText] = useState('');
    const [movimientoData, setMovimientoData] = useState([]);
    const [selectedPlaceholder, setSelectedPlaceholder] = useState([]);
    const editorRef = useRef(null);
    const { te_id } = useParams(); 
    

    useEffect(() => {
      axios.get("tblcatalogo/get/movimiento/general")
      .then(({data}) => {
        const filteredData = data.map(({ cat_abreviacion, cat_descripcion }) => ({
            cat_abreviacion,
            cat_descripcion,
          }));
          setMovimientoData(filteredData);
      })
      .catch(err => console.error(err));
      
    }, [])

    useEffect(() => {
      if(te_id != null && te_id.trim() !== ''){
        axios.get(`tblmtenor/get/${te_id}`) 
          .then(({ data }) => {
            let contenido = data.te_contenido;
            let htmlContent = '';

            if (typeof contenido === "string" && contenido.trim() !=='') {
              try {
                const parsedData = JSON.parse(contenido);

                if (parsedData && parsedData.ops) {
                  const converter = new QuillDeltaToHtmlConverter(parsedData.ops, {
                    paragraphTag: "div",
                    lineBreakTag: "<br>",
                  });
                  htmlContent = converter.convert();
                } else {
                  console.error("This doesn't have delta elements, using as HTML directly.");
                  htmlContent = contenido;
                }
              } catch (error) {
                console.warn("It's not a valid JSON, it'll be use like a HTML.");
                htmlContent = contenido;
              }
            }

            setText(htmlContent);
            saveDataToFormik(data);
          })
          .catch(error => console.error("Error al obtener los datos:", error));
      }
      }, [movimientoData]);    

    useEffect(() => {
      if(Object.keys(formData).length > 0){
        handleSubmit();
      }
    
    }, [formData]);
    

    const formik = useFormik({
      initialValues: {
        te_id: '',
        te_tipo_reg: null,
        te_descripcion: '',
        te_contenido: '',
      },
      validate: (data) => {
        let errors = {};
        if(!data.te_tipo_reg){
          errors.te_tipo_reg = 'Este campo es requerido';
        }
        if(data.te_descripcion === ''){
          errors.te_descripcion = 'Este campo es requerido';
        }
        if(!data.te_contenido){
          errors.te_contenido = 'Este campo es requerido';
        }
        return errors;
      },
      onSubmit: (data) => {
        let payload = { ...data };

        if (data.te_id === null || data.te_id === '') {
            const { te_id, ...restData } = payload; 
            payload = restData; 
        }

        payload.te_tipo_reg = data.te_tipo_reg ? data.te_tipo_reg.cat_abreviacion : null;

        setFormData(payload);
      }
    })

    const saveDataToFormik = (data) => {
      const tipoRegObject = movimientoData.filter( m => m.cat_abreviacion == data.te_tipo_reg )[0];

      const newValues = {
        te_id: data.te_id,
        te_tipo_reg: tipoRegObject,
        te_descripcion: data.te_descripcion,
        te_contenido: data.te_contenido,
      };
      formik.setValues(newValues);
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(formik, name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    
    const handleSelectChange = (e) => {
      const selectedValue = e.value;
      setSelectedPlaceholder(selectedValue);
      if (editorRef.current) {
        const editor = editorRef.current.getQuill();
        const range = editor.getSelection(true); 
        editor.insertText(range.index, selectedValue); 
      }
    };

    const renderHeader = () => {
        return (
          <div className="p-editor-toolbar">
            <span className="ql-formats" style={{ marginRight: "10px" }}>
              <Dropdown filter value={selectedPlaceholder} options={placeholders} onChange={handleSelectChange} 
              style={{ width: "150px", maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
              placeholder="Seleccionar campo"/>
            </span>
            <span className="ql-formats">
              <button className="ql-bold" aria-label="Bold"></button>
              <button className="ql-italic" aria-label="Italic"></button>
              <button className="ql-underline" aria-label="Underline"></button>
              <button className="ql-strike" aria-label="Strike"></button>
            </span>
            <span className="ql-formats">
              <select className="ql-header">
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option selected>Normal</option>
              </select>
            </span>
            <span className="ql-formats">
              <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
            </span>
            <span className="ql-formats">
              <button className="ql-align" value="" aria-label="Align Left"></button>
              <button className="ql-align" value="center" aria-label="Align Center"></button>
              <button className="ql-align" value="right" aria-label="Align Right"></button>
              <button className="ql-align" value="justify" aria-label="Align Justify"></button>
            </span>
            <span className="ql-formats">
              <select className="ql-color"></select>
              <select className="ql-background"></select>
            </span>
            <span className="ql-formats">
              
              <button className="ql-image" aria-label="Insert Image"></button>
            </span>
          </div>
        );
    }

    const handlePrint = () => {
      if (!editorRef.current) return;

      const content = editorRef.current.getElement().querySelector(".p-editor-content").innerHTML; 

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";

      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
          <html>
          <head>
              <title>Impresión</title>
              <style>
                  @media print {
                      @page {
                          margin: 0mm;
                          padding: 20mm;
                      }
                      body {
                          text-align: justify;
                          white-space: pre-wrap;
                      }
                      .content {
                          width: 100%;
                          max-width: 180mm; 
                          margin: auto; 
                      }
                      .ql-align-center { text-align: center; }
                      .ql-align-right { text-align: right; }
                      .ql-align-justify { text-align: justify; }
                      input, textarea, button, select {
                          display: none !important; 
                      }
                  }
              </style>
          </head>
          <body>
              ${content}
              <script>
                  window.onload = function() {
                      window.print();
                      window.onafterprint = function() { window.close(); }
                  }
              </script>
          </body>
          </html>
      `);
      doc.close();

      iframe.contentWindow.focus();
  };


  const handleSubmit = async () => {
    try {
        if (editorRef.current) {
            const editor = editorRef.current.getQuill(); 

            const payload = {
              ...formData,  
              te_contenido: formData.te_contenido,
            };

            const response = await axios.post('tblmtenor/add', payload);
            console.log('Respuesta del servidor:', response.data);
            app.flashMsg('Crear registro', 'Grabado exitosamente');
        }
    } catch (error) {
        console.error('Error al enviar datos:', error);
        app.flashMsg('Error', 'No se pudo enviar la información');
    }
};

    const items = [
      {
          label: "Imprimir / Guardar PDF",
          icon: "pi pi-print",
          command: handlePrint,
      },
  ];

  const header = renderHeader();

  return (
    <>
        <div>
            <Card className='w-9 m-auto'>
                <section>
                    <div className="border-left-2 border-primary-500 surface-overlay p-2 flex justify-content-start">
                        <div>
                            <strong>Creación de Tenor</strong>
                            <p>En el siguiente formulario redacte el tenor que necesite usar en los reportes de memorandums o contratos.</p>
                        </div>
                    </div>
                </section>
                
                <Divider/>
                <form onSubmit={formik.handleSubmit}>
                  <input type='hidden' id='te_id' name='te_id' value={formik.values.te_id}/>
                  <section>
                      <div className='grid p-fluid'>
                          <div className='field col-8'>
                              <label htmlFor="te_descripcion" className={classNames({ 'p-error': isFormFieldValid('te_descripcion') })}>DESDE EL ÍTEM</label>
                              <span className="p-input-icon-left">
                                  <i className="pi pi-file-edit" />
                                  <InputText id="te_descripcion" name='te_descripcion' value={formik.values.te_descripcion} onChange={formik.handleChange}
                                  placeholder='Exenta en el marcado reloj biométrico'  className={classNames({ 'p-invalid': isFormFieldValid('te_descripcion') })}/>
                              </span>
                              {getFormErrorMessage('item_number')}
                    
                          </div>
                          <div className='field col-4'>
                              <label htmlFor="te_tipo_reg" className={classNames({ 'p-error': isFormFieldValid('te_tipo_reg') })}>TIPO MOVIMIENTO</label>

                              <Dropdown id='te_tipo_reg' name='te_tipo_reg' filter  value={formik.values.te_tipo_reg} options={movimientoData} onChange={({ value }) => formik.setFieldValue("te_tipo_reg", value)} placeholder="Seleccione..." className={classNames({ 'p-invalid': isFormFieldValid('te_tipo_reg') })}
                              optionLabel="cat_descripcion"/>

                              {getFormErrorMessage('te_tipo_reg')}
                          </div>
                      </div>                    
                      <div>
                          <Editor ref={editorRef} headerTemplate={header} value={text} 
                          onTextChange={(e) => {
                            setText(e.htmlValue);
                            formik.setFieldValue("te_contenido", e.htmlValue);
                          }} />
                      </div>
                      <div className='flex justify-content-end my-5'>
                        <Button type='submit' className="p-button-success mr-2" icon="pi pi-file-edit" label='Modificar'/> 
                      </div>
                  </section>
                </form>
            </Card>
            <SpeedDial model={items} direction="up" style={{ position: "fixed", bottom: "2rem", right: "2rem" }} showIcon="pi pi-cog" />
        </div>
    </>
  )
}

export default TbltenoresAdd