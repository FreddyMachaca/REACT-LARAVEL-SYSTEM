import {useState, useEffect} from 'react'
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { SpeedDial } from 'primereact/speeddial';
import { Dialog } from 'primereact/dialog';
import { useParams } from 'react-router-dom'
import PersonalDataForm from './PersonalDataForm';
import TblFamily from './TblFamily';
import RequirementsForm from './RequirementsForm'
import TblEducation from './TblEducation';
import FamilyForm from './FamilyForm';
import EducationForm from './EducationForm';
import axios from 'axios';

function TblFuncionariosView() {
  const { per_id } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [personaData, setPersonaData] = useState();
  const [familyData, setFamilyData] = useState();
  const [educationData, setEducationData] = useState();
  const [dataToEdit, setDataToEdit] = useState()

  const fechData = async () => {
    const { data } = await axios.get(`tblpersona/home/per_id/${per_id}`);
    setPersonaData(data[0]);
  }

  useEffect(() => {
    fechData();
  }, [per_id]);

  useEffect(() => {
      fetchDataTables();
  }, []);
  
  const fetchDataTables = async() => {
    try {
        const [familyRes, educationRes] = await Promise.all([
            axios.get(`tblpersonafamiliares/index/pf_per_id/${per_id}`),
            axios.get(`tblkdeducacionformal/index/ef_per_id/${per_id}`)
        ]);

        setFamilyData(familyRes.data);
        setEducationData(educationRes.data);
    } catch (error) {
        console.error("Error obteniendo datos:", error);
    }
  }

  const fillData = (data) => {
    setDataToEdit(data);
  }

  const cleanData = () => setDataToEdit();

  const getModalContent = () => {
    switch (activeIndex) {
      case 1:
        return <FamilyForm perd_per_id={per_id} addMember={setFamilyData} dataToEdit={dataToEdit}/>;
      case 3:
        return <EducationForm ef_per_id={per_id} addEducation={setEducationData} dataToEdit={dataToEdit}/>;
      default:
        return null;
    }
  };

  return (
    <>
      { personaData && (<><h2>Filiación Funcionario</h2>
      <Card title={<><i className="pi pi-briefcase" style={{ fontSize: '1.5rem' }} /> Datos Funcionario</>}>
        
        <div className='flex overflow-hidden'>
          <Image src="/images/avatar-3.jpg" className="custom-image" width='200' shape="square" />
          <div className='flex-grow-1 mx-5 my-2'>
            <section>
              <h6 className='text-color-secondary'> DATOS PERSONALES </h6>
              <div className='flex justify-content-between flex-wrap px-5'>
                <div>
                  <label>CÓD. FUNCIONARIO</label>
                  <div>
                    <span className='text-color-secondary text-lg'>{personaData.per_id ?? ''}</span>
                  </div>
                </div>
                <div>
                  <label>CI</label>
                  <div>
                    <span className='text-color-secondary text-lg'>{personaData.per_num_doc ?? ''}</span>
                  </div>
                </div>
                <div>
                  <label>NOMBRE FUNCIONARIO</label>
                  <div>
                    <span className='text-color-secondary text-lg'>
                      {`${personaData.per_nombres} ${personaData.per_ap_paterno ?? ''} ${personaData.per_ap_materno ?? ''}`.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label>ESTADO CIVIL</label>
                  <div>
                    <span className='text-color-secondary text-lg'>
                      {personaData.per_estado_civil ?? 'No registrado'}
                    </span>
                  </div>
                </div>
                <div>
                  <label>SEXO</label>
                  <div>
                    <span className='text-color-secondary text-lg'>
                      {personaData.per_sexo ?? 'No registrado'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            <section>
            <h6 className='text-color-secondary'> FECHA Y LUGAR DE NACIMIENTO </h6>
              <div className='flex justify-content-between flex-wrap px-5'>
                <div>
                  <label>FECHA DE NACIMIENTO</label>
                  <div>
                    <span className='text-color-secondary text-lg'>
                      {personaData.per_fecha_nac ? personaData.per_fecha_nac.split(' ')[0] : 'Sin fecha'}
                    </span>
                  </div>
                </div>
                <div>
                  <label>PAÍS</label>
                  <div>
                    <span className='text-color-secondary text-lg'>
                      {personaData.per_procedencia ? personaData.per_procedencia : 'No registrado'}
                    </span>
                  </div>
                </div>
                <div>
                  <label>DEPARTAMENTO</label>
                  <div>
                    <span className='text-color-secondary text-lg'></span>
                  </div>
                </div>
                
                <div>
                  <label>PROVINCIA</label>
                  <div>
                    <span className='text-color-secondary text-lg'></span>
                  </div>
                </div>
                <div>
                  <label>LOCALIDAD</label>
                  <div>
                    <span className='text-color-secondary text-lg'></span>
                  </div>
                </div>
              </div>
              
            </section>
          </div>
        </div>

        <Divider/>

        <section>
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="tabview-header-icon">
              <TabPanel header="DATOS PERSONALES" leftIcon="pi pi-id-card">
                <PersonalDataForm data={personaData.domicilio} perd_per_id={per_id}/>
              </TabPanel>
              <TabPanel header="FAMILIARES" leftIcon='pi pi-users'>
                <TblFamily pf_per_id={per_id} familyData={familyData} setFamilyData={setFamilyData} visibleDialog={setVisible} fillData={fillData}/>
              </TabPanel>
              <TabPanel header="REQUISITOS" leftIcon='pi pi-list'>
                <RequirementsForm/>
              </TabPanel>
              <TabPanel header="EDUCACIÓN FORMAL" leftIcon='pi pi-grade'>
                <TblEducation educationData={educationData}/>
              </TabPanel>
          </TabView>
        </section>
      </Card>

      {(activeIndex==1 || activeIndex==3) && (
        <SpeedDial onClick={() => setVisible(true)} direction="up" style={{ position: "fixed", bottom: "2rem", right: "2rem" }} showIcon="pi pi-plus" />
      )}

      <Dialog header="Información" visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
        {getModalContent()}
      </Dialog></>)}
    </>
  )
}

export default TblFuncionariosView