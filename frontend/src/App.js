import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from 'components/ProtectedRoute';
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';

import IndexLayout from 'layouts/IndexLayout';
import MainLayout from 'layouts/MainLayout';
import TblacreedoresList from 'pages/tblacreedores/List';
import TblacreedoresView from 'pages/tblacreedores/View';
import TblacreedoresAdd from 'pages/tblacreedores/Add';
import TblacreedoresEdit from 'pages/tblacreedores/Edit';
import TblareaformacionList from 'pages/tblareaformacion/List';
import TblauditList from 'pages/tblaudit/List';
import TblauditView from 'pages/tblaudit/View';
import TblauditAdd from 'pages/tblaudit/Add';
import TblauditEdit from 'pages/tblaudit/Edit';
import TblbsegsList from 'pages/tblbsegs/List';
import TblbsegsView from 'pages/tblbsegs/View';
import TblbsegsAdd from 'pages/tblbsegs/Add';
import TblbsegsEdit from 'pages/tblbsegs/Edit';
import TblcarrerasList from 'pages/tblcarreras/List';
import TblcarrerasView from 'pages/tblcarreras/View';
import TblcarrerasAdd from 'pages/tblcarreras/Add';
import TblcarrerasEdit from 'pages/tblcarreras/Edit';
import TblcatalogoList from 'pages/tblcatalogo/List';
import TblcatalogoView from 'pages/tblcatalogo/View';
import TblcatalogoAdd from 'pages/tblcatalogo/Add';
import TblcatalogoEdit from 'pages/tblcatalogo/Edit';
import TblcategorialicenciasList from 'pages/tblcategorialicencias/List';
import TblcategorialicenciasView from 'pages/tblcategorialicencias/View';
import TblcategorialicenciasAdd from 'pages/tblcategorialicencias/Add';
import TblcategorialicenciasEdit from 'pages/tblcategorialicencias/Edit';
import TblempleadorList from 'pages/tblempleador/List';
import TblempleadorView from 'pages/tblempleador/View';
import TblempleadorAdd from 'pages/tblempleador/Add';
import TblempleadorEdit from 'pages/tblempleador/Edit';
import TblfichaatencionList from 'pages/tblfichaatencion/List';
import TblfichaatencionView from 'pages/tblfichaatencion/View';
import TblfichaatencionAdd from 'pages/tblfichaatencion/Add';
import TblfichaatencionEdit from 'pages/tblfichaatencion/Edit';
import TblglosaList from 'pages/tblglosa/List';
import TblglosaView from 'pages/tblglosa/View';
import TblglosaAdd from 'pages/tblglosa/Add';
import TblglosaEdit from 'pages/tblglosa/Edit';
import TblgradoacademicoList from 'pages/tblgradoacademico/List';
import TblgradoacademicoView from 'pages/tblgradoacademico/View';
import TblgradoacademicoAdd from 'pages/tblgradoacademico/Add';
import TblgradoacademicoEdit from 'pages/tblgradoacademico/Edit';
import TblhistoricoList from 'pages/tblhistorico/List';
import TblhistoricoView from 'pages/tblhistorico/View';
import TblhistoricoAdd from 'pages/tblhistorico/Add';
import TblhistoricoEdit from 'pages/tblhistorico/Edit';
import TblidiomaList from 'pages/tblidioma/List';
import TblidiomaView from 'pages/tblidioma/View';
import TblidiomaAdd from 'pages/tblidioma/Add';
import TblidiomaEdit from 'pages/tblidioma/Edit';
import TblinstitucionesList from 'pages/tblinstituciones/List';
import TblinstitucionesView from 'pages/tblinstituciones/View';
import TblinstitucionesAdd from 'pages/tblinstituciones/Add';
import TblinstitucionesEdit from 'pages/tblinstituciones/Edit';
import TblmabonoantiguedadescalaList from 'pages/tblmabonoantiguedadescala/List';
import TblmabonoantiguedadescalaView from 'pages/tblmabonoantiguedadescala/View';
import TblmabonoantiguedadescalaAdd from 'pages/tblmabonoantiguedadescala/Add';
import TblmabonoantiguedadescalaEdit from 'pages/tblmabonoantiguedadescala/Edit';
import TblperiodoList from 'pages/tblperiodo/List';
import TblperiodoView from 'pages/tblperiodo/View';
import TblperiodoAdd from 'pages/tblperiodo/Add';
import TblperiodoEdit from 'pages/tblperiodo/Edit';
import TblpruebacarrerasinstitutoList from 'pages/tblpruebacarrerasinstituto/List';
import TblpruebagradocarreraList from 'pages/tblpruebagradocarrera/List';
import TblpruebagradoinstitucionList from 'pages/tblpruebagradoinstitucion/List';
import TblpruebainstituciomcarreraList from 'pages/tblpruebainstituciomcarrera/List';
import TblrangoList from 'pages/tblrango/List';
import TblrangoView from 'pages/tblrango/View';
import TblrangoAdd from 'pages/tblrango/Add';
import TblrangoEdit from 'pages/tblrango/Edit';
import TblrequisitoformacionList from 'pages/tblrequisitoformacion/List';
import TblrequisitoformacionView from 'pages/tblrequisitoformacion/View';
import TblrequisitoformacionAdd from 'pages/tblrequisitoformacion/Add';
import TblrequisitoformacionEdit from 'pages/tblrequisitoformacion/Edit';
import TblsegmenuList from 'pages/tblsegmenu/List';
import TblsegmenuView from 'pages/tblsegmenu/View';
import TblsegmenuAdd from 'pages/tblsegmenu/Add';
import TblsegmenuEdit from 'pages/tblsegmenu/Edit';
import TblsegmenuusuarioList from 'pages/tblsegmenuusuario/List';
import TblsegmenuusuarioView from 'pages/tblsegmenuusuario/View';
import TblsegmenuusuarioAdd from 'pages/tblsegmenuusuario/Add';
import TblsegmenuusuarioEdit from 'pages/tblsegmenuusuario/Edit';
import TblsegrolList from 'pages/tblsegrol/List';
import TblsegrolView from 'pages/tblsegrol/View';
import TblsegrolAdd from 'pages/tblsegrol/Add';
import TblsegrolEdit from 'pages/tblsegrol/Edit';
import TblsegrolmenuList from 'pages/tblsegrolmenu/List';
import TblsegrolmenuView from 'pages/tblsegrolmenu/View';
import TblsegrolmenuAdd from 'pages/tblsegrolmenu/Add';
import TblsegrolmenuEdit from 'pages/tblsegrolmenu/Edit';
import TblsegusuarioList from 'pages/tblsegusuario/List';
import TblsegusuarioView from 'pages/tblsegusuario/View';
import TblsegusuarioAdd from 'pages/tblsegusuario/Add';
import TblsegusuarioEdit from 'pages/tblsegusuario/Edit';
import TblsegusuariorolList from 'pages/tblsegusuariorol/List';
import TblsegusuariorolView from 'pages/tblsegusuariorol/View';
import TblsegusuariorolAdd from 'pages/tblsegusuariorol/Add';
import TblsegusuariorolEdit from 'pages/tblsegusuariorol/Edit';
import TbltipoeventoacademicoList from 'pages/tbltipoeventoacademico/List';
import TbltipoeventoacademicoView from 'pages/tbltipoeventoacademico/View';
import TbltipoeventoacademicoAdd from 'pages/tbltipoeventoacademico/Add';
import TbltipoeventoacademicoEdit from 'pages/tbltipoeventoacademico/Edit';
import TblitemsView from 'pages/tblitems/View';
import TblitemsList from 'pages/tblitems/List';
import TblitemsEdit from 'pages/tblitems/Edit';
import TblitemsAdd from 'pages/tblitems/Add';
import TblasignacionList from 'pages/tblasignacion/List';
import TblasignacionView from 'pages/tblasignacion/View';
import TblTipoAportanteList from 'pages/tbltipoaportante/List';
import TblTipoAportanteView from 'pages/tbltipoaportante/View';
import TblTransaccionesList from 'pages/transaccionesPersonal/List';
import TblTransaccionesAdd from 'pages/transaccionesPersonal/Add';
import TblTransaccionesView from 'pages/transaccionesPersonal/View';
import TblestructuraorganizacionalView from 'pages/tblestructuraorganizacional/View'
import TbltenoresAdd from 'pages/tbltenores/Add';
import TbltenoresList from 'pages/tbltenores/List';
import TblFuncionariosList from 'pages/filiacionfuncionario/List'
import TblFuncionariosView from 'pages/filiacionfuncionario/View'
import ProcesarDatos from 'pages/administracionDatos/Procesamiento';

import TbllicenciaList from 'pages/tblLicencia/List';
import TbllicenciaView from 'pages/tblLicencia/View';
import TbllicenciaAdd from 'pages/tblLicencia/Add';
import TbllicenciaEdit from 'pages/tblLicencia/Edit';
import TbllicenciaUbicacion from 'pages/tblLicencia/Ubicacion';
import TbllicenciaValidacion from 'pages/tblLicencia/Validacion';
import BusquedaActa  from 'pages/serviciosprevalorados/busquedaacta';
import TbllicenciaSolicitudLicencia from 'pages/tblLicencia/SolicitudLicencia';
import Alert from 'pages/alerta/Alert'; ///alerta pendientes

import HomePage from './pages/home/HomePage';
import IndexPages from './pages/index';
import ErrorPages from './pages/errors';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'assets/styles/layout.scss';
import TblPersonaList from 'pages/Tblpersona/List';
import TblpersonaAdd from 'pages/Tblpersona/Add';
import ExtraHours from 'pages/tbltransaccion/ExtraHours';
import TblPersonalList from 'pages/gestionPersonal/List';
import PersonalConfiguracion from 'pages/gestionPersonal/personalMenu';
import UserProfile from 'pages/profile/UserProfile';
import TblCpAsignacionHorarioList from 'pages/tblcpasignacionhorario/List';
import TblCpAsigcionHorarioAdd from 'pages/tblcpasignacionhorario/Add'
import TblCpLicenciaJustificadaAdd from 'pages/tblcplicenciajustificada/Add';

const App = () => {
    return (
        <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            <Route element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />

                {/* Perfil de Uusuario route */}
                <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                
                {/* tblitems pages routes */}
                <Route path="/tblitems" element={<TblitemsList />} />
                <Route path="/tblitems/:fieldName/:fieldValue" element={<TblitemsList />} />
                <Route path="/tblitems/index/:fieldName/:fieldValue" element={<TblitemsList />} />
                <Route path="/tblitems/view/:pageid" element={<TblitemsView />} />
                <Route path="/tblitems/add" element={<TblitemsAdd />} />
                <Route path="/tblitems/edit/:pageid" element={<TblitemsEdit />} />

                {/* tblacreedores pages routes */}
                <Route path="/tblacreedores" element={<TblacreedoresList />} />
                <Route path="/tblacreedores/:fieldName/:fieldValue" element={<TblacreedoresList />} />
                <Route path="/tblacreedores/index/:fieldName/:fieldValue" element={<TblacreedoresList />} />
                <Route path="/tblacreedores/view/:pageid" element={<TblacreedoresView />} />
                <Route path="/tblacreedores/add" element={<TblacreedoresAdd />} />
                <Route path="/tblacreedores/edit/:pageid" element={<TblacreedoresEdit />} />

                {/* tblareaformacion pages routes */}
                <Route path="/tblareaformacion" element={<TblareaformacionList />} />
                <Route path="/tblareaformacion/:fieldName/:fieldValue" element={<TblareaformacionList />} />
                <Route path="/tblareaformacion/index/:fieldName/:fieldValue" element={<TblareaformacionList />} />

                {/* tblaudit pages routes */}
                <Route path="/tblaudit" element={<TblauditList />} />
                <Route path="/tblaudit/:fieldName/:fieldValue" element={<TblauditList />} />
                <Route path="/tblaudit/index/:fieldName/:fieldValue" element={<TblauditList />} />
                <Route path="/tblaudit/view/:pageid" element={<TblauditView />} />
                <Route path="/tblaudit/add" element={<TblauditAdd />} />
                <Route path="/tblaudit/edit/:pageid" element={<TblauditEdit />} />

                {/* tblbsegs pages routes */}
                <Route path="/tblbsegs" element={<TblbsegsList />} />
                <Route path="/tblbsegs/:fieldName/:fieldValue" element={<TblbsegsList />} />
                <Route path="/tblbsegs/index/:fieldName/:fieldValue" element={<TblbsegsList />} />
                <Route path="/tblbsegs/view/:pageid" element={<TblbsegsView />} />
                <Route path="/tblbsegs/add" element={<TblbsegsAdd />} />
                <Route path="/tblbsegs/edit/:pageid" element={<TblbsegsEdit />} />

                {/* tblcarreras pages routes */}
                <Route path="/tblcarreras" element={<TblcarrerasList />} />
                <Route path="/tblcarreras/:fieldName/:fieldValue" element={<TblcarrerasList />} />
                <Route path="/tblcarreras/index/:fieldName/:fieldValue" element={<TblcarrerasList />} />
                <Route path="/tblcarreras/view/:pageid" element={<TblcarrerasView />} />
                <Route path="/tblcarreras/add" element={<TblcarrerasAdd />} />
                <Route path="/tblcarreras/edit/:pageid" element={<TblcarrerasEdit />} />

                {/* tblcatalogo pages routes */}
                <Route path="/tblcatalogo" element={<TblcatalogoList />} />
                <Route path="/tblcatalogo/:fieldName/:fieldValue" element={<TblcatalogoList />} />
                <Route path="/tblcatalogo/index/:fieldName/:fieldValue" element={<TblcatalogoList />} />
                <Route path="/tblcatalogo/view/:pageid" element={<TblcatalogoView />} />
                <Route path="/tblcatalogo/add" element={<TblcatalogoAdd />} />
                <Route path="/tblcatalogo/edit/:pageid" element={<TblcatalogoEdit />} />

                {/* tblcategorialicencias pages routes */}
                <Route path="/tblcategorialicencias" element={<TblcategorialicenciasList />} />
                <Route path="/tblcategorialicencias/:fieldName/:fieldValue" element={<TblcategorialicenciasList />} />
                <Route path="/tblcategorialicencias/index/:fieldName/:fieldValue" element={<TblcategorialicenciasList />} />
                <Route path="/tblcategorialicencias/view/:pageid" element={<TblcategorialicenciasView />} />
                <Route path="/tblcategorialicencias/add" element={<TblcategorialicenciasAdd />} />
                <Route path="/tblcategorialicencias/edit/:pageid" element={<TblcategorialicenciasEdit />} />
                
                {/* tblCpAsignacionHorario pages routes */}
                <Route path="/tblcpasignacionhorario" element={<TblCpAsignacionHorarioList />} />
                <Route path="/tblcpasignacionhorario/add/:personaId" element={<TblCpAsigcionHorarioAdd />} />
                
                {/* tblCpLicenciaJustificada pages routes */}
                <Route path="/tblcplicenciajustificada/add/:personaId" element={<TblCpLicenciaJustificadaAdd />} />


                {/* tblempleador pages routes */}
                <Route path="/tblempleador" element={<TblempleadorList />} />
                <Route path="/tblempleador/:fieldName/:fieldValue" element={<TblempleadorList />} />
                <Route path="/tblempleador/index/:fieldName/:fieldValue" element={<TblempleadorList />} />
                <Route path="/tblempleador/view/:pageid" element={<TblempleadorView />} />
                <Route path="/tblempleador/add" element={<TblempleadorAdd />} />
                <Route path="/tblempleador/edit/:pageid" element={<TblempleadorEdit />} />

                {/* tblfichaatencion pages routes */}
                <Route path="/tblfichaatencion" element={<TblfichaatencionList />} />
                <Route path="/tblfichaatencion/:fieldName/:fieldValue" element={<TblfichaatencionList />} />
                <Route path="/tblfichaatencion/index/:fieldName/:fieldValue" element={<TblfichaatencionList />} />
                <Route path="/tblfichaatencion/view/:pageid" element={<TblfichaatencionView />} />
                <Route path="/tblfichaatencion/add" element={<TblfichaatencionAdd />} />
                <Route path="/tblfichaatencion/edit/:pageid" element={<TblfichaatencionEdit />} />

                {/* tblglosa pages routes */}
                <Route path="/tblglosa" element={<TblglosaList />} />
                <Route path="/tblglosa/:fieldName/:fieldValue" element={<TblglosaList />} />
                <Route path="/tblglosa/index/:fieldName/:fieldValue" element={<TblglosaList />} />
                <Route path="/tblglosa/view/:pageid" element={<TblglosaView />} />
                <Route path="/tblglosa/add" element={<TblglosaAdd />} />
                <Route path="/tblglosa/edit/:pageid" element={<TblglosaEdit />} />

                {/* tblgradoacademico pages routes */}
                <Route path="/tblgradoacademico" element={<TblgradoacademicoList />} />
                <Route path="/tblgradoacademico/:fieldName/:fieldValue" element={<TblgradoacademicoList />} />
                <Route path="/tblgradoacademico/index/:fieldName/:fieldValue" element={<TblgradoacademicoList />} />
                <Route path="/tblgradoacademico/view/:pageid" element={<TblgradoacademicoView />} />
                <Route path="/tblgradoacademico/add" element={<TblgradoacademicoAdd />} />
                <Route path="/tblgradoacademico/edit/:pageid" element={<TblgradoacademicoEdit />} />

                {/* tblhistorico pages routes */}
                <Route path="/tblhistorico" element={<TblhistoricoList />} />
                <Route path="/tblhistorico/:fieldName/:fieldValue" element={<TblhistoricoList />} />
                <Route path="/tblhistorico/index/:fieldName/:fieldValue" element={<TblhistoricoList />} />
                <Route path="/tblhistorico/view/:pageid" element={<TblhistoricoView />} />
                <Route path="/tblhistorico/add" element={<TblhistoricoAdd />} />
                <Route path="/tblhistorico/edit/:pageid" element={<TblhistoricoEdit />} />

                {/* tblidioma pages routes */}
                <Route path="/tblidioma" element={<TblidiomaList />} />
                <Route path="/tblidioma/:fieldName/:fieldValue" element={<TblidiomaList />} />
                <Route path="/tblidioma/index/:fieldName/:fieldValue" element={<TblidiomaList />} />
                <Route path="/tblidioma/view/:pageid" element={<TblidiomaView />} />
                <Route path="/tblidioma/add" element={<TblidiomaAdd />} />
                <Route path="/tblidioma/edit/:pageid" element={<TblidiomaEdit />} />

                {/* tblinstituciones pages routes */}
                <Route path="/tblinstituciones" element={<TblinstitucionesList />} />
                <Route path="/tblinstituciones/:fieldName/:fieldValue" element={<TblinstitucionesList />} />
                <Route path="/tblinstituciones/index/:fieldName/:fieldValue" element={<TblinstitucionesList />} />
                <Route path="/tblinstituciones/view/:pageid" element={<TblinstitucionesView />} />
                <Route path="/tblinstituciones/add" element={<TblinstitucionesAdd />} />
                <Route path="/tblinstituciones/edit/:pageid" element={<TblinstitucionesEdit />} />

                {/* tblmabonoantiguedadescala pages routes */}
                <Route path="/tblmabonoantiguedadescala" element={<TblmabonoantiguedadescalaList />} />
                <Route path="/tblmabonoantiguedadescala/:fieldName/:fieldValue" element={<TblmabonoantiguedadescalaList />} />
                <Route path="/tblmabonoantiguedadescala/index/:fieldName/:fieldValue" element={<TblmabonoantiguedadescalaList />} />
                <Route path="/tblmabonoantiguedadescala/view/:pageid" element={<TblmabonoantiguedadescalaView />} />
                <Route path="/tblmabonoantiguedadescala/add" element={<TblmabonoantiguedadescalaAdd />} />
                <Route path="/tblmabonoantiguedadescala/edit/:pageid" element={<TblmabonoantiguedadescalaEdit />} />

                {/* tblperiodo pages routes */}
                <Route path="/tblperiodo" element={<TblperiodoList />} />
                <Route path="/tblperiodo/:fieldName/:fieldValue" element={<TblperiodoList />} />
                <Route path="/tblperiodo/index/:fieldName/:fieldValue" element={<TblperiodoList />} />
                <Route path="/tblperiodo/view/:pageid" element={<TblperiodoView />} />
                <Route path="/tblperiodo/add" element={<TblperiodoAdd />} />
                <Route path="/tblperiodo/edit/:pageid" element={<TblperiodoEdit />} />

                {/* tblpruebacarrerasinstituto pages routes */}
                <Route path="/tblpruebacarrerasinstituto" element={<TblpruebacarrerasinstitutoList />} />
                <Route path="/tblpruebacarrerasinstituto/:fieldName/:fieldValue" element={<TblpruebacarrerasinstitutoList />} />
                <Route path="/tblpruebacarrerasinstituto/index/:fieldName/:fieldValue" element={<TblpruebacarrerasinstitutoList />} />

                {/* tblpruebagradocarrera pages routes */}
                <Route path="/tblpruebagradocarrera" element={<TblpruebagradocarreraList />} />
                <Route path="/tblpruebagradocarrera/:fieldName/:fieldValue" element={<TblpruebagradocarreraList />} />
                <Route path="/tblpruebagradocarrera/index/:fieldName/:fieldValue" element={<TblpruebagradocarreraList />} />

                {/* tblpruebagradoinstitucion pages routes */}
                <Route path="/tblpruebagradoinstitucion" element={<TblpruebagradoinstitucionList />} />
                <Route path="/tblpruebagradoinstitucion/:fieldName/:fieldValue" element={<TblpruebagradoinstitucionList />} />
                <Route path="/tblpruebagradoinstitucion/index/:fieldName/:fieldValue" element={<TblpruebagradoinstitucionList />} />

                {/* tblpruebainstituciomcarrera pages routes */}
                <Route path="/tblpruebainstituciomcarrera" element={<TblpruebainstituciomcarreraList />} />
                <Route path="/tblpruebainstituciomcarrera/:fieldName/:fieldValue" element={<TblpruebainstituciomcarreraList />} />
                <Route path="/tblpruebainstituciomcarrera/index/:fieldName/:fieldValue" element={<TblpruebainstituciomcarreraList />} />

                {/* tblrango pages routes */}
                <Route path="/tblrango" element={<TblrangoList />} />
                <Route path="/tblrango/:fieldName/:fieldValue" element={<TblrangoList />} />
                <Route path="/tblrango/index/:fieldName/:fieldValue" element={<TblrangoList />} />
                <Route path="/tblrango/view/:pageid" element={<TblrangoView />} />
                <Route path="/tblrango/add" element={<TblrangoAdd />} />
                <Route path="/tblrango/edit/:pageid" element={<TblrangoEdit />} />

                {/* tblrequisitoformacion pages routes */}
                <Route path="/tblrequisitoformacion" element={<TblrequisitoformacionList />} />
                <Route path="/tblrequisitoformacion/:fieldName/:fieldValue" element={<TblrequisitoformacionList />} />
                <Route path="/tblrequisitoformacion/index/:fieldName/:fieldValue" element={<TblrequisitoformacionList />} />
                <Route path="/tblrequisitoformacion/view/:pageid" element={<TblrequisitoformacionView />} />
                <Route path="/tblrequisitoformacion/add" element={<TblrequisitoformacionAdd />} />
                <Route path="/tblrequisitoformacion/edit/:pageid" element={<TblrequisitoformacionEdit />} />

                {/* tblsegmenu pages routes */}
                <Route path="/tblsegmenu" element={<TblsegmenuList />} />
                <Route path="/tblsegmenu/:fieldName/:fieldValue" element={<TblsegmenuList />} />
                <Route path="/tblsegmenu/index/:fieldName/:fieldValue" element={<TblsegmenuList />} />
                <Route path="/tblsegmenu/view/:pageid" element={<TblsegmenuView />} />
                <Route path="/tblsegmenu/add" element={<TblsegmenuAdd />} />
                <Route path="/tblsegmenu/edit/:pageid" element={<TblsegmenuEdit />} />

                {/* tblsegmenuusuario pages routes */}
                <Route path="/tblsegmenuusuario" element={<TblsegmenuusuarioList />} />
                <Route path="/tblsegmenuusuario/:fieldName/:fieldValue" element={<TblsegmenuusuarioList />} />
                <Route path="/tblsegmenuusuario/index/:fieldName/:fieldValue" element={<TblsegmenuusuarioList />} />
                <Route path="/tblsegmenuusuario/view/:pageid" element={<TblsegmenuusuarioView />} />
                <Route path="/tblsegmenuusuario/add" element={<TblsegmenuusuarioAdd />} />
                <Route path="/tblsegmenuusuario/edit/:pageid" element={<TblsegmenuusuarioEdit />} />

                {/* tblsegrol pages routes */}
                <Route path="/tblsegrol" element={<TblsegrolList />} />
                <Route path="/tblsegrol/:fieldName/:fieldValue" element={<TblsegrolList />} />
                <Route path="/tblsegrol/index/:fieldName/:fieldValue" element={<TblsegrolList />} />
                <Route path="/tblsegrol/view/:pageid" element={<TblsegrolView />} />
                <Route path="/tblsegrol/add" element={<TblsegrolAdd />} />
                <Route path="/tblsegrol/edit/:pageid" element={<TblsegrolEdit />} />

                {/* tblsegrolmenu pages routes */}
                <Route path="/tblsegrolmenu" element={<TblsegrolmenuList />} />
                <Route path="/tblsegrolmenu/:fieldName/:fieldValue" element={<TblsegrolmenuList />} />
                <Route path="/tblsegrolmenu/index/:fieldName/:fieldValue" element={<TblsegrolmenuList />} />
                <Route path="/tblsegrolmenu/view/:pageid" element={<TblsegrolmenuView />} />
                <Route path="/tblsegrolmenu/add" element={<TblsegrolmenuAdd />} />
                <Route path="/tblsegrolmenu/edit/:pageid" element={<TblsegrolmenuEdit />} />

                {/* tblsegusuario pages routes */}
                <Route path="/tblsegusuario" element={<TblsegusuarioList />} />
                <Route path="/tblsegusuario/:fieldName/:fieldValue" element={<TblsegusuarioList />} />
                <Route path="/tblsegusuario/index/:fieldName/:fieldValue" element={<TblsegusuarioList />} />
                <Route path="/tblsegusuario/view/:pageid" element={<TblsegusuarioView />} />
                <Route path="/tblsegusuario/add" element={<TblsegusuarioAdd />} />
                <Route path="/tblsegusuario/edit/:pageid" element={<TblsegusuarioEdit />} />

                {/* tblsegusuariorol pages routes */}
                <Route path="/tblsegusuariorol" element={<TblsegusuariorolList />} />
                <Route path="/tblsegusuariorol/:fieldName/:fieldValue" element={<TblsegusuariorolList />} />
                <Route path="/tblsegusuariorol/index/:fieldName/:fieldValue" element={<TblsegusuariorolList />} />
                <Route path="/tblsegusuariorol/view/:pageid" element={<TblsegusuariorolView />} />
                <Route path="/tblsegusuariorol/add" element={<TblsegusuariorolAdd />} />
                <Route path="/tblsegusuariorol/edit/:pageid" element={<TblsegusuariorolEdit />} />

                {/* tbltipoeventoacademico pages routes */}
                <Route path="/tbltipoeventoacademico" element={<TbltipoeventoacademicoList />} />
                <Route path="/tbltipoeventoacademico/:fieldName/:fieldValue" element={<TbltipoeventoacademicoList />} />
                <Route path="/tbltipoeventoacademico/index/:fieldName/:fieldValue" element={<TbltipoeventoacademicoList />} />
                <Route path="/tbltipoeventoacademico/view/:pageid" element={<TbltipoeventoacademicoView />} />
                <Route path="/tbltipoeventoacademico/add" element={<TbltipoeventoacademicoAdd />} />
                <Route path="/tbltipoeventoacademico/edit/:pageid" element={<TbltipoeventoacademicoEdit />} />
                
                {/* Asignacion de Items routes */}
                <Route path="/asignacionItems" element={<TblasignacionList />} />
                <Route path="/asignacionItems/asignar/:personaId" element={<TblasignacionView />} />
                
                {/* Tipo Aportante routes */}
                <Route path="/tbltipoaportante" element={<TblTipoAportanteList />} />
                <Route path="/tbltipoaportante/asignar/:personaId" element={<TblTipoAportanteView />} />
                
                {/* Transacciones Personal routes */}
                <Route path="/tblTransacciones" element={<TblTransaccionesList />} />
                <Route path="/tblTransacciones/add/:personaId" element={<TblTransaccionesAdd />} />
                <Route path="/tblTransacciones/view/:id" element={<TblTransaccionesView />} />

                {/* section manual de supuestos */}
                <Route path="/ManualPuestos/EstructuraOrganizacional" element={<TblestructuraorganizacionalView />} />

                {/* creacion de tenores */}
                <Route path="/MovimientoPersonal/Tenor/:te_id" element={<TbltenoresAdd/>}/>
                <Route path="/MovimientoPersonal/Tenor/" element={<TbltenoresAdd/>}/>
                <Route path="/MovimientoPersonal/ListaTenor" element={<TbltenoresList/>}/>

                {/* Filiacion de funcionarios */}
                <Route path="/Kardex/FiliacionFuncionario" element={<TblFuncionariosList/>}/> 
                <Route path="/Kardex/FiliacionFuncionario/:per_id" element={<TblFuncionariosView/>}/> 

                {/* tblpersona pages routes */}
                <Route path="/MovimientoPersonal/Persona" element={<TblPersonaList/>}/> 
                <Route path="/MovimientoPersonal/Persona/add" element={<TblpersonaAdd/>}/> 

                {/* ExtraHours routes */}
				<Route path="/tbltransaccion" element={<ExtraHours />} />
                
                {/* Gestión de Personal routes */}
                <Route path="/gestionPersonal" element={<TblPersonalList />} />
                <Route path="/gestionPersonal/configuracion/:personaId" element={<PersonalConfiguracion />} />
<<<<<<< HEAD
                
                {/* Procesos routes */}
                <Route path="/procesar" element={<ProcesarDatos />} />
                
=======
                {/* Alertas de solicitud de licencias justificadas */}
                <Route path="/alerta/Alert" element={<Alert />} />
                <Route path="/tbllicencia" element={<TbllicenciaList />} />
				<Route path="/tbllicencia/:fieldName/:fieldValue" element={<TbllicenciaList />} />
				<Route path="/tbllicencia/index/:fieldName/:fieldValue" element={<TbllicenciaList />} />			
				<Route path="/tbllicencia/add/:idPer" element={<TbllicenciaAdd />} />			
				<Route path="/tbllicencia/edit/:idPer" element={<TbllicenciaEdit />} />
				<Route path="/tbllicencia/ubicacion/:idPer" element={<TbllicenciaUbicacion />} />
				<Route path="/tbllicencia/validacion" element={<TbllicenciaValidacion />} />
				<Route path="/tbllicencia/view" element={<TbllicenciaView />} />				
				<Route path="/tbllicencia/LicensePopup" element={<licensepopup />} />
				<Route path="/asignacionhorario/store" element={<TbllicenciaAdd />} />
				<Route path="/serviciosprevalorados/busquedaacta/" element={<BusquedaActa />} /> 				
				<Route path="/serviciosprevalorados/actaentregapopup/" element={<actaentregapopup />} /> 
                <Route path="/tbllicencia/solicitudlicencia/" element={<TbllicenciaSolicitudLicencia />} />
				{/**abre popup alerta */}
				<Route path="/alerta/Alert" element={<Alert />} />
>>>>>>> modulo-alerta-licencias
            </Route>

            <Route exact element={<IndexLayout />}></Route>
                <Route path="/*" element={<IndexPages />} />
                <Route path="/error/*" element={<ErrorPages />} />
        </Routes>
    );
}

export default App;
