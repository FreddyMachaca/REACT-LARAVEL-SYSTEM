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
        return <FamilyForm perd_per_id={per_id} addMember={setFamilyData} dataToEdit={dataToEdit} visible={setVisible}/>;
      case 3:
        return <EducationForm ef_per_id={per_id} addEducation={setEducationData} dataToEdit={dataToEdit} visible={setVisible}/>;
      default:
        return null;
    }
  };

  return (
    <>
      { personaData && (<><h2>Filiación Funcionario</h2>
      <Card title={<><i className="pi pi-briefcase" style={{ fontSize: '1.5rem' }} /> Datos Funcionario</>}>

        <div className="flex flex-column md:flex-row">
            {/* Avatar Section */}
            <div className="flex align-items-center justify-content-center mr-4 mb-3 md:mb-0" style={{minWidth: '200px'}}>
                <div className="bg-primary w-8rem h-8rem border-circle flex align-items-center justify-content-center">
                    <i className="pi pi-user text-white" style={{ fontSize: '4rem' }}></i>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
                <h2 className="text-xl font-bold m-0 mb-3">
                    {`${personaData?.per_nombres || ''} ${personaData?.per_ap_paterno || ''} ${personaData?.per_ap_materno || ''}`}
                </h2>

                <div className="surface-100 border-round-xl p-4 w-full">
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <h3 className="text-lg font-semibold mb-3">Datos Personales</h3>
                            <div className="flex flex-column gap-3">
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-briefcase text-primary mr-2"></i>
                                        <span className="text-600">Cód. Funcionario </span>
                                    </div>
                                    <span className="font-medium">{personaData.per_id || 'No asignado'}</span>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-money-bill text-primary mr-2"></i>
                                        <span className="text-600">Carnet de Identidad </span>
                                    </div>
                                    <span className="text-primary font-bold">
                                        {personaData.per_num_doc ?? 'No asignado'}
                                    </span>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-chart-line text-primary mr-2"></i>
                                        <span className="text-600">Estado Civil </span>
                                    </div>
                                    <span className="font-medium">
                                      { 
                                        personaData.estado_civil.cat_descripcion || 'No registrado' 
                                      }
                                    </span>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-chart-line text-primary mr-2"></i>
                                        <span className="text-600">Sexo </span>
                                    </div>
                                    <span className="font-medium">{personaData.per_sexo || 'No registrado'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <h3 className="text-lg font-semibold mb-3">Lugar de Nacimiento</h3>
                            <div className="flex flex-column gap-3">
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-briefcase text-primary mr-2"></i>
                                        <span className="text-600">País </span>
                                    </div>
                                    <span className="font-medium">{personaData.procedencia.cat_descripcion || 'No registrado'}</span>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-money-bill text-primary mr-2"></i>
                                        <span className="text-600">Departamento </span>
                                    </div>
                                    <span className="font-medium">
                                      {personaData.lugar_exportado.cat_descripcion || 'No registrado'}
                                    </span>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-chart-line text-primary mr-2"></i>
                                        <span className="text-600">Provincia </span>
                                    </div>
                                    <span className="font-medium">{personaData.lugar_nacimiento.cat_descripcion || 'No registrado'}</span>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-chart-line text-primary mr-2"></i>
                                        <span className="text-600">Localidad </span>
                                    </div>
                                    <span className="font-medium"></span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <h3 className="text-lg font-semibold mb-3">Información Personal</h3>
                            <div className="flex flex-column gap-3">
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-calendar text-primary mr-2"></i>
                                        <span className="text-600">Fecha Nacimiento </span>
                                    </div>
                                    <span className="font-medium">
                                      {personaData.per_fecha_nac.split(" ")[0] || 'No registrado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                <TblEducation ef_per_id={per_id} educationData={educationData} visibleDialog={setVisible} setEducationData={setEducationData} fillData={fillData}/>
              </TabPanel>
          </TabView>
        </section>
      </Card>

      {(activeIndex==1 || activeIndex==3) && (
        <SpeedDial onClick={() => {
          cleanData();
          setVisible(true)
        }} direction="up" style={{ position: "fixed", bottom: "2rem", right: "2rem" }} showIcon="pi pi-plus" />
      )}

      <Dialog header="Información" visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
        {getModalContent()}
      </Dialog></>)}
    </>
  )
}

export default TblFuncionariosView