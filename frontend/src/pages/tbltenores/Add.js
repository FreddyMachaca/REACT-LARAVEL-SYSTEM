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
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [movimientoData, setMovimientoData] = useState();
    const [selectedPlaceholder, setSelectedPlaceholder] = useState([]);
    //const [loading, setLoading] = useState(true);
    const editorRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const { te_id } = useParams(); 
    //const [placeholders , setPlaceholders] = useState();
    

    useEffect(() => {
      axios.get("tblcatalogo/get/movimiento/general")
      .then(({data}) => {
        const filteredData = data.map(({ cat_id, cat_descripcion }) => ({
            cat_id,
            cat_descripcion,
          }));
          setMovimientoData(filteredData);
      })
      .catch(err => console.error(err));
      
    }, [])

    useEffect(() => {
        axios.get(`tblmtenor/get/${te_id}`) 
          .then(({ data }) => {
            let contenido = data.te_contenido;
            if (typeof contenido === "string") {
              try {
                contenido = JSON.parse(contenido); 
              } catch (error) {
                console.error("Error al parsear JSON:", error);
                return;
              }
            }
    
            if (contenido && contenido.ops) {
              //const converter = new QuillDeltaToHtmlConverter(contenido.ops, {});
              const converter = new QuillDeltaToHtmlConverter(contenido.ops, {
                paragraphTag: "div", 
                lineBreakTag: "<br>",
              });
              const htmlContent = converter.convert();

              //const placeholders = htmlContent.match(/\[(.*?)\]/g) || [];
              //const uniquePlaceholders = [...new Set(placeholders)]; 

              setText(htmlContent);
              //setPlaceholders(uniquePlaceholders);
            } else {
              console.error("Formato de datos incorrecto");
            }

            saveDataToFormik(data);
          })
          .catch(error => console.error("Error al obtener los datos:", error));
      }, []);    

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
        if(data.te_id === ''){
          errors.te_id = 'Este campo es requerido';
        }
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
        setFormData(data);
      }
    })

    const saveDataToFormik = (data) => {
      const newValues = {
        te_id: data.te_id,
        te_tipo_reg: data.te_tipo_reg,
        te_descripcion: data.te_descripcion,
        te_contenido: data.te_contenido,
      };
      formik.setValues(newValues);
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(formik, name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const onMovimientoChange = (e) => {
        setSelectedMovimiento(e.value);
    }
    
    const handleSelectChange = (e) => {
      //setSelectedPlaceholder(e.target.value);
      const selectedValue = e.value;
      setSelectedPlaceholder(selectedValue);
      if (editorRef.current) {
        const editor = editorRef.current.getQuill();
        const range = editor.getSelection(true); 
        editor.insertText(range.index, selectedValue); 
      }
    };
    
    const handleReplace = () => {
      if (selectedPlaceholder && inputValue) {
        const newText = text.replace(selectedPlaceholder, inputValue);
        setText(newText);
        setInputValue("");
        setSelectedPlaceholder("");
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
              <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
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
            
            const delta = editor.clipboard.convert(formik.values.te_contenido);

            const contenidoDeltaString = JSON.stringify(delta);

            const formData = {
                ...formik.values, 
                te_contenido: contenidoDeltaString 
            };

            console.log(formData)

            const response = await axios.post('tblmtenor/add', formData);
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
                              <label htmlFor="tipo_movimiento" className={classNames({ 'p-error': isFormFieldValid('tipo_movimiento') })}>TIPO MOVIMIENTO</label>

                              <Dropdown id='tipo_movimiento' name='tipo_movimiento' filter value={selectedMovimiento} options={movimientoData} onChange={onMovimientoChange} placeholder="Seleccione..." className={classNames({ 'p-invalid': isFormFieldValid('tipo_movimiento') })}
                              optionLabel="cat_descripcion"/>

                              {getFormErrorMessage('tipo_movimiento')}
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