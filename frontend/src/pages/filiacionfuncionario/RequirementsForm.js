import { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';

function RequirementsForm() {
  const [dropDownData, setDropDownData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('tblkdrespuestacombo/index/rc_estado/V');
      
      const groupedData = data.reduce((acc, item) => {
          const key = `group_${item.rc_rq_id}`; 
      
          if (!acc[key]) {
              acc[key] = [];
          }
      
          acc[key].push({
              rc_id: item.rc_id,
              rc_desc: item.rc_desc,
          });
      
          return acc;
      }, {}); 

      setDropDownData(groupedData)
    } 

    fetchData();
  }, []);

  return (
    <div className='p-5'>
      <p>Registre los requisitos presentados por el funcionario.</p>
      <section className='flex flex-column justify-content-end align-items-end mt-5'>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>CERTIFICADO DE NACIMIENTO:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_1} /></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>CÉDULA DE IDENTIDAD:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_2}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>LIBRETA DE SERVICIO MILITAR:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_3}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>CERTIFICADO DE MATRIMONIO:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_4}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>CURRICULUM VITAE:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_5}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>

        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>DOCUMENTO DE FORMACIÓN ACADÉMICA:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_6}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>DECLARACIÓN JURADA DE BIENES - RENTAS:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_7}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>CERTIFICADO DE EXÁMEN MÉDICO:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_8}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>ACTA DE POSESIÓN:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_9}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>FORMULARIO DE AFILIACIÓN AFP:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_10}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>

        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>FOTOCOPIA LEGALIZADA DE TITULO A NIVEL NACIONAL:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_12}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>FORMULARIO DE PRESENTACIÓN DE LIBRETA DE SERVICIO MILITAR:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_13}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>FORMULARIO DE DECLARACIÓN DE VERACIDAD DE DOC.PROFESIONAL:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_14}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>FORMULARIO DECLARACIÓN JURADA POR DOBLE PERCEPCIÓN:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_15}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
        <div className='w-9 grid p-fluid mb-2'>
          <div className='col-12 md:col-3'><p className='text-right text-sm pr-3'>FORMULARIO DE DECLARACIÓN JURADA DE INCOMPATIBILIDAD FUNCIONARIA:</p></div>
          <div className='col-12 md:col-5'><Dropdown optionLabel="rc_desc" options={dropDownData.group_16}/></div>
          <div className='col-12 md:col-4'><Calendar id="basic" /></div>
        </div>
      </section>
    </div>
  )
}

export default RequirementsForm