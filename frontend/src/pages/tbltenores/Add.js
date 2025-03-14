import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { SpeedDial } from 'primereact/speeddial';
import { useParams } from 'react-router-dom';
import { Dialog } from "primereact/dialog";
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

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

const printContent = (text) => {
  const printWindow = window.open("");
  printWindow.document.write(`
      <html>
      <head>
          <title>Vista previa</title>
          <style>
              @page { margin: 0; }
              body { font-family: Arial, sans-serif; padding: 20px; }
          </style>
      </head>
      <body>
          ${text}
          <script>
              window.onload = function() {
                  window.print();
              }
          </script>
      </body>
      </html>
  `);
  printWindow.document.close();
};

function TbltenoresAdd() {
    const [text, setText] = useState('');
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [movimientoData, setMovimientoData] = useState();
    const [selectedPlaceholder, setSelectedPlaceholder] = useState([]);
    const editorRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const [visible, setVisible] = useState(false);
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
              const converter = new QuillDeltaToHtmlConverter(contenido.ops, {});
              const htmlContent = converter.convert();

              //const placeholders = htmlContent.match(/\[(.*?)\]/g) || [];
              //const uniquePlaceholders = [...new Set(placeholders)]; 

              setText(htmlContent);
              //setPlaceholders(uniquePlaceholders);
            } else {
              console.error("Formato de datos incorrecto");
            }
          })
          .catch(error => console.error("Error al obtener los datos:", error));
      }, []);    

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

    const items = [
      {
          label: "Vista previa",
          icon: "pi pi-eye",
          command: () => setVisible(true),
      },
      {
          label: "Imprimir / Guardar PDF",
          icon: "pi pi-print",
          command: () => printContent(text),
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

                <section>
                    <div className='grid p-fluid'>
                        <div className='field col-8'>
                            <label htmlFor="inp" className="block">DESDE EL ÍTEM</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-file-edit" />
                                <InputText id="inp" placeholder='Exenta en el marcado reloj biométrico' className="block"/>
                            </span>
                  
                        </div>
                        <div className='field col-4'>
                            <label htmlFor="tipo_movimiento" className="block">TIPO MOVIMIENTO</label>
                            <Dropdown id='tipo_movimiento' filter value={selectedMovimiento} options={movimientoData} onChange={onMovimientoChange} optionLabel="cat_descripcion" placeholder="Seleccione..." />
                        </div>
                    </div>                    
                    <div>
                        <Editor ref={editorRef} headerTemplate={header} value={text} onTextChange={(e) => setText(e.htmlValue)} />
                    </div>
                    <div className='flex justify-content-end my-5'>
                      <Button className="p-button-success mr-2" icon="pi pi-file-edit" label='Modificar'/> 
                    </div>
                </section>
            </Card>
            <SpeedDial model={items} direction="up" style={{ position: "fixed", bottom: "2rem", right: "2rem" }} />

            <Dialog header="Vista previa del documento" visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
                <div dangerouslySetInnerHTML={{ __html: text }} />
            </Dialog>
        </div>
    </>
  )
}

export default TbltenoresAdd