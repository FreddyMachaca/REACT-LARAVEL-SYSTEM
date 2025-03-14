<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// api routes that need auth

Route::middleware(['auth:api'])->group(function () {


});

Route::get('home', 'HomeController@index');


/* routes for TblAcreedores Controller  */	
	Route::get('tblacreedores/', 'TblAcreedoresController@index');
	Route::get('tblacreedores/index', 'TblAcreedoresController@index');
	Route::get('tblacreedores/index/{filter?}/{filtervalue?}', 'TblAcreedoresController@index');	
	Route::get('tblacreedores/view/{rec_id}', 'TblAcreedoresController@view');	
	Route::post('tblacreedores/add', 'TblAcreedoresController@add');	
	Route::any('tblacreedores/edit/{rec_id}', 'TblAcreedoresController@edit');	
	Route::any('tblacreedores/delete/{rec_id}', 'TblAcreedoresController@delete');

/* routes for TblAreaFormacion Controller  */	
	Route::get('tblareaformacion/', 'TblAreaFormacionController@index');
	Route::get('tblareaformacion/index', 'TblAreaFormacionController@index');
	Route::get('tblareaformacion/index/{filter?}/{filtervalue?}', 'TblAreaFormacionController@index');

/* routes for TblAudit Controller  */	
	Route::get('tblaudit/', 'TblAuditController@index');
	Route::get('tblaudit/index', 'TblAuditController@index');
	Route::get('tblaudit/index/{filter?}/{filtervalue?}', 'TblAuditController@index');	
	Route::get('tblaudit/view/{rec_id}', 'TblAuditController@view');	
	Route::post('tblaudit/add', 'TblAuditController@add');	
	Route::any('tblaudit/edit/{rec_id}', 'TblAuditController@edit');	
	Route::any('tblaudit/delete/{rec_id}', 'TblAuditController@delete');

/* routes for TblBsEgs Controller  */	
	Route::get('tblbsegs/', 'TblBsEgsController@index');
	Route::get('tblbsegs/index', 'TblBsEgsController@index');
	Route::get('tblbsegs/index/{filter?}/{filtervalue?}', 'TblBsEgsController@index');	
	Route::get('tblbsegs/view/{rec_id}', 'TblBsEgsController@view');	
	Route::post('tblbsegs/add', 'TblBsEgsController@add');	
	Route::any('tblbsegs/edit/{rec_id}', 'TblBsEgsController@edit');	
	Route::any('tblbsegs/delete/{rec_id}', 'TblBsEgsController@delete');

/* routes for TblCarreras Controller  */	
	Route::get('tblcarreras/', 'TblCarrerasController@index');
	Route::get('tblcarreras/index', 'TblCarrerasController@index');
	Route::get('tblcarreras/index/{filter?}/{filtervalue?}', 'TblCarrerasController@index');	
	Route::get('tblcarreras/view/{rec_id}', 'TblCarrerasController@view');	
	Route::post('tblcarreras/add', 'TblCarrerasController@add');	
	Route::any('tblcarreras/edit/{rec_id}', 'TblCarrerasController@edit');	
	Route::any('tblcarreras/delete/{rec_id}', 'TblCarrerasController@delete');

/* routes for TblCatalogo Controller  */	
	Route::get('tblcatalogo/', 'TblCatalogoController@index');
	Route::get('tblcatalogo/index', 'TblCatalogoController@index');
	Route::get('tblcatalogo/index/{filter?}/{filtervalue?}', 'TblCatalogoController@index');	
	Route::get('tblcatalogo/view/{rec_id}', 'TblCatalogoController@view');	
	Route::post('tblcatalogo/add', 'TblCatalogoController@add');	
	Route::any('tblcatalogo/edit/{rec_id}', 'TblCatalogoController@edit');	
	Route::any('tblcatalogo/delete/{rec_id}', 'TblCatalogoController@delete');

/* routes for TblCategoriaLicencias Controller  */	
	Route::get('tblcategorialicencias/', 'TblCategoriaLicenciasController@index');
	Route::get('tblcategorialicencias/index', 'TblCategoriaLicenciasController@index');
	Route::get('tblcategorialicencias/index/{filter?}/{filtervalue?}', 'TblCategoriaLicenciasController@index');	
	Route::get('tblcategorialicencias/view/{rec_id}', 'TblCategoriaLicenciasController@view');	
	Route::post('tblcategorialicencias/add', 'TblCategoriaLicenciasController@add');	
	Route::any('tblcategorialicencias/edit/{rec_id}', 'TblCategoriaLicenciasController@edit');	
	Route::any('tblcategorialicencias/delete/{rec_id}', 'TblCategoriaLicenciasController@delete');

/* routes for TblEmpleador Controller  */	
	Route::get('tblempleador/', 'TblEmpleadorController@index');
	Route::get('tblempleador/index', 'TblEmpleadorController@index');
	Route::get('tblempleador/index/{filter?}/{filtervalue?}', 'TblEmpleadorController@index');	
	Route::get('tblempleador/view/{rec_id}', 'TblEmpleadorController@view');	
	Route::post('tblempleador/add', 'TblEmpleadorController@add');	
	Route::any('tblempleador/edit/{rec_id}', 'TblEmpleadorController@edit');	
	Route::any('tblempleador/delete/{rec_id}', 'TblEmpleadorController@delete');

/* routes for TblFichaatencion Controller  */	
	Route::get('tblfichaatencion/', 'TblFichaatencionController@index');
	Route::get('tblfichaatencion/index', 'TblFichaatencionController@index');
	Route::get('tblfichaatencion/index/{filter?}/{filtervalue?}', 'TblFichaatencionController@index');	
	Route::get('tblfichaatencion/view/{rec_id}', 'TblFichaatencionController@view');	
	Route::post('tblfichaatencion/add', 'TblFichaatencionController@add');	
	Route::any('tblfichaatencion/edit/{rec_id}', 'TblFichaatencionController@edit');	
	Route::any('tblfichaatencion/delete/{rec_id}', 'TblFichaatencionController@delete');

/* routes for TblGlosa Controller  */	
	Route::get('tblglosa/', 'TblGlosaController@index');
	Route::get('tblglosa/index', 'TblGlosaController@index');
	Route::get('tblglosa/index/{filter?}/{filtervalue?}', 'TblGlosaController@index');	
	Route::get('tblglosa/view/{rec_id}', 'TblGlosaController@view');	
	Route::post('tblglosa/add', 'TblGlosaController@add');	
	Route::any('tblglosa/edit/{rec_id}', 'TblGlosaController@edit');	
	Route::any('tblglosa/delete/{rec_id}', 'TblGlosaController@delete');

/* routes for TblGradoAcademico Controller  */	
	Route::get('tblgradoacademico/', 'TblGradoAcademicoController@index');
	Route::get('tblgradoacademico/index', 'TblGradoAcademicoController@index');
	Route::get('tblgradoacademico/index/{filter?}/{filtervalue?}', 'TblGradoAcademicoController@index');	
	Route::get('tblgradoacademico/view/{rec_id}', 'TblGradoAcademicoController@view');	
	Route::post('tblgradoacademico/add', 'TblGradoAcademicoController@add');	
	Route::any('tblgradoacademico/edit/{rec_id}', 'TblGradoAcademicoController@edit');	
	Route::any('tblgradoacademico/delete/{rec_id}', 'TblGradoAcademicoController@delete');

/* routes for TblHistorico Controller  */	
	Route::get('tblhistorico/', 'TblHistoricoController@index');
	Route::get('tblhistorico/index', 'TblHistoricoController@index');
	Route::get('tblhistorico/index/{filter?}/{filtervalue?}', 'TblHistoricoController@index');	
	Route::get('tblhistorico/view/{rec_id}', 'TblHistoricoController@view');	
	Route::post('tblhistorico/add', 'TblHistoricoController@add');	
	Route::any('tblhistorico/edit/{rec_id}', 'TblHistoricoController@edit');	
	Route::any('tblhistorico/delete/{rec_id}', 'TblHistoricoController@delete');

/* routes for TblIdioma Controller  */	
	Route::get('tblidioma/', 'TblIdiomaController@index');
	Route::get('tblidioma/index', 'TblIdiomaController@index');
	Route::get('tblidioma/index/{filter?}/{filtervalue?}', 'TblIdiomaController@index');	
	Route::get('tblidioma/view/{rec_id}', 'TblIdiomaController@view');	
	Route::post('tblidioma/add', 'TblIdiomaController@add');	
	Route::any('tblidioma/edit/{rec_id}', 'TblIdiomaController@edit');	
	Route::any('tblidioma/delete/{rec_id}', 'TblIdiomaController@delete');

/* routes for TblInstituciones Controller  */	
	Route::get('tblinstituciones/', 'TblInstitucionesController@index');
	Route::get('tblinstituciones/index', 'TblInstitucionesController@index');
	Route::get('tblinstituciones/index/{filter?}/{filtervalue?}', 'TblInstitucionesController@index');	
	Route::get('tblinstituciones/view/{rec_id}', 'TblInstitucionesController@view');	
	Route::post('tblinstituciones/add', 'TblInstitucionesController@add');	
	Route::any('tblinstituciones/edit/{rec_id}', 'TblInstitucionesController@edit');	
	Route::any('tblinstituciones/delete/{rec_id}', 'TblInstitucionesController@delete');

/* routes for TblMaBonoAntiguedadEscala Controller  */	
	Route::get('tblmabonoantiguedadescala/', 'TblMaBonoAntiguedadEscalaController@index');
	Route::get('tblmabonoantiguedadescala/index', 'TblMaBonoAntiguedadEscalaController@index');
	Route::get('tblmabonoantiguedadescala/index/{filter?}/{filtervalue?}', 'TblMaBonoAntiguedadEscalaController@index');	
	Route::get('tblmabonoantiguedadescala/view/{rec_id}', 'TblMaBonoAntiguedadEscalaController@view');	
	Route::post('tblmabonoantiguedadescala/add', 'TblMaBonoAntiguedadEscalaController@add');	
	Route::any('tblmabonoantiguedadescala/edit/{rec_id}', 'TblMaBonoAntiguedadEscalaController@edit');	
	Route::any('tblmabonoantiguedadescala/delete/{rec_id}', 'TblMaBonoAntiguedadEscalaController@delete');

/* routes for TblPeriodo Controller  */	
	Route::get('tblperiodo/', 'TblPeriodoController@index');
	Route::get('tblperiodo/index', 'TblPeriodoController@index');
	Route::get('tblperiodo/index/{filter?}/{filtervalue?}', 'TblPeriodoController@index');	
	Route::get('tblperiodo/view/{rec_id}', 'TblPeriodoController@view');	
	Route::post('tblperiodo/add', 'TblPeriodoController@add');	
	Route::any('tblperiodo/edit/{rec_id}', 'TblPeriodoController@edit');	
	Route::any('tblperiodo/delete/{rec_id}', 'TblPeriodoController@delete');

/* routes for TblPruebaCarrerasInstituto Controller  */	
	Route::get('tblpruebacarrerasinstituto/', 'TblPruebaCarrerasInstitutoController@index');
	Route::get('tblpruebacarrerasinstituto/index', 'TblPruebaCarrerasInstitutoController@index');
	Route::get('tblpruebacarrerasinstituto/index/{filter?}/{filtervalue?}', 'TblPruebaCarrerasInstitutoController@index');

/* routes for TblPruebaGradoCarrera Controller  */	
	Route::get('tblpruebagradocarrera/', 'TblPruebaGradoCarreraController@index');
	Route::get('tblpruebagradocarrera/index', 'TblPruebaGradoCarreraController@index');
	Route::get('tblpruebagradocarrera/index/{filter?}/{filtervalue?}', 'TblPruebaGradoCarreraController@index');

/* routes for TblPruebaGradoInstitucion Controller  */	
	Route::get('tblpruebagradoinstitucion/', 'TblPruebaGradoInstitucionController@index');
	Route::get('tblpruebagradoinstitucion/index', 'TblPruebaGradoInstitucionController@index');
	Route::get('tblpruebagradoinstitucion/index/{filter?}/{filtervalue?}', 'TblPruebaGradoInstitucionController@index');

/* routes for TblPruebaInstituciomCarrera Controller  */	
	Route::get('tblpruebainstituciomcarrera/', 'TblPruebaInstituciomCarreraController@index');
	Route::get('tblpruebainstituciomcarrera/index', 'TblPruebaInstituciomCarreraController@index');
	Route::get('tblpruebainstituciomcarrera/index/{filter?}/{filtervalue?}', 'TblPruebaInstituciomCarreraController@index');

/* routes for TblRango Controller  */	
	Route::get('tblrango/', 'TblRangoController@index');
	Route::get('tblrango/index', 'TblRangoController@index');
	Route::get('tblrango/index/{filter?}/{filtervalue?}', 'TblRangoController@index');	
	Route::get('tblrango/view/{rec_id}', 'TblRangoController@view');	
	Route::post('tblrango/add', 'TblRangoController@add');	
	Route::any('tblrango/edit/{rec_id}', 'TblRangoController@edit');	
	Route::any('tblrango/delete/{rec_id}', 'TblRangoController@delete');

/* routes for TblRequisitoFormacion Controller  */	
	Route::get('tblrequisitoformacion/', 'TblRequisitoFormacionController@index');
	Route::get('tblrequisitoformacion/index', 'TblRequisitoFormacionController@index');
	Route::get('tblrequisitoformacion/index/{filter?}/{filtervalue?}', 'TblRequisitoFormacionController@index');	
	Route::get('tblrequisitoformacion/view/{rec_id}', 'TblRequisitoFormacionController@view');	
	Route::post('tblrequisitoformacion/add', 'TblRequisitoFormacionController@add');	
	Route::any('tblrequisitoformacion/edit/{rec_id}', 'TblRequisitoFormacionController@edit');	
	Route::any('tblrequisitoformacion/delete/{rec_id}', 'TblRequisitoFormacionController@delete');

/* routes for TblSegMenu Controller  */	
	Route::get('tblsegmenu/', 'TblSegMenuController@index');
	Route::get('tblsegmenu/index', 'TblSegMenuController@index');
	Route::get('tblsegmenu/index/{filter?}/{filtervalue?}', 'TblSegMenuController@index');	
	Route::get('tblsegmenu/view/{rec_id}', 'TblSegMenuController@view');	
	Route::post('tblsegmenu/add', 'TblSegMenuController@add');	
	Route::any('tblsegmenu/edit/{rec_id}', 'TblSegMenuController@edit');	
	Route::any('tblsegmenu/delete/{rec_id}', 'TblSegMenuController@delete');
	Route::get('tblsegmenu/getMenuTree', 'TblSegMenuController@getMenuTree');
	Route::get('tblsegmenu/manageMenuTree', 'TblSegMenuController@manageMenuTree');


/* routes for TblSegMenuUsuario Controller  */	
	Route::get('tblsegmenuusuario/', 'TblSegMenuUsuarioController@index');
	Route::get('tblsegmenuusuario/index', 'TblSegMenuUsuarioController@index');
	Route::get('tblsegmenuusuario/index/{filter?}/{filtervalue?}', 'TblSegMenuUsuarioController@index');	
	Route::get('tblsegmenuusuario/view/{rec_id}', 'TblSegMenuUsuarioController@view');	
	Route::post('tblsegmenuusuario/add', 'TblSegMenuUsuarioController@add');	
	Route::any('tblsegmenuusuario/edit/{rec_id}', 'TblSegMenuUsuarioController@edit');	
	Route::any('tblsegmenuusuario/delete/{rec_id}', 'TblSegMenuUsuarioController@delete');

/* routes for TblSegRol Controller  */	
	Route::get('tblsegrol/', 'TblSegRolController@index');
	Route::get('tblsegrol/index', 'TblSegRolController@index');
	Route::get('tblsegrol/index/{filter?}/{filtervalue?}', 'TblSegRolController@index');	
	Route::get('tblsegrol/view/{rec_id}', 'TblSegRolController@view');	
	Route::post('tblsegrol/add', 'TblSegRolController@add');	
	Route::any('tblsegrol/edit/{rec_id}', 'TblSegRolController@edit');	
	Route::any('tblsegrol/delete/{rec_id}', 'TblSegRolController@delete');

/* routes for TblSegRolMenu Controller  */	
	Route::get('tblsegrolmenu/', 'TblSegRolMenuController@index');
	Route::get('tblsegrolmenu/index', 'TblSegRolMenuController@index');
	Route::get('tblsegrolmenu/index/{filter?}/{filtervalue?}', 'TblSegRolMenuController@index');	
	Route::get('tblsegrolmenu/view/{rec_id}', 'TblSegRolMenuController@view');	
	Route::post('tblsegrolmenu/add', 'TblSegRolMenuController@add');	
	Route::any('tblsegrolmenu/edit/{rec_id}', 'TblSegRolMenuController@edit');	
	Route::any('tblsegrolmenu/delete/{rec_id}', 'TblSegRolMenuController@delete');

/* routes for TblSegUsuario Controller  */	
	Route::get('tblsegusuario/', 'TblSegUsuarioController@index');
	Route::get('tblsegusuario/index', 'TblSegUsuarioController@index');
	Route::get('tblsegusuario/index/{filter?}/{filtervalue?}', 'TblSegUsuarioController@index');	
	Route::get('tblsegusuario/view/{rec_id}', 'TblSegUsuarioController@view');	
	Route::post('tblsegusuario/add', 'TblSegUsuarioController@add');	
	Route::any('tblsegusuario/edit/{rec_id}', 'TblSegUsuarioController@edit');	
	Route::any('tblsegusuario/delete/{rec_id}', 'TblSegUsuarioController@delete');

/* routes for TblSegUsuarioRol Controller  */	
	Route::get('tblsegusuariorol/', 'TblSegUsuarioRolController@index');
	Route::get('tblsegusuariorol/index', 'TblSegUsuarioRolController@index');
	Route::get('tblsegusuariorol/index/{filter?}/{filtervalue?}', 'TblSegUsuarioRolController@index');	
	Route::get('tblsegusuariorol/view/{rec_id}', 'TblSegUsuarioRolController@view');	
	Route::post('tblsegusuariorol/add', 'TblSegUsuarioRolController@add');	
	Route::any('tblsegusuariorol/edit/{rec_id}', 'TblSegUsuarioRolController@edit');	
	Route::any('tblsegusuariorol/delete/{rec_id}', 'TblSegUsuarioRolController@delete');

/* routes for TblTipoeventoAcademico Controller  */	
	Route::get('tbltipoeventoacademico/', 'TblTipoeventoAcademicoController@index');
	Route::get('tbltipoeventoacademico/index', 'TblTipoeventoAcademicoController@index');
	Route::get('tbltipoeventoacademico/index/{filter?}/{filtervalue?}', 'TblTipoeventoAcademicoController@index');	
	Route::get('tbltipoeventoacademico/view/{rec_id}', 'TblTipoeventoAcademicoController@view');	
	Route::post('tbltipoeventoacademico/add', 'TblTipoeventoAcademicoController@add');	
	Route::any('tbltipoeventoacademico/edit/{rec_id}', 'TblTipoeventoAcademicoController@edit');	
	Route::any('tbltipoeventoacademico/delete/{rec_id}', 'TblTipoeventoAcademicoController@delete');

/* routes for TblMpCargo Controller  */	
	Route::get('tblmpcargo/', 'TblMpCargoController@index');
	Route::get('tblmpcargo/index', 'TblMpCargoController@index');
	Route::get('tblmpcargo/index/{filter?}/{filtervalue?}', 'TblMpCargoController@index');	
	Route::get('tblmpcargo/view/{rec_id}', 'TblMpCargoController@view');	
	Route::post('tblmpcargo/add', 'TblMpCargoController@add');	
	Route::any('tblmpcargo/edit/{rec_id}', 'TblMpCargoController@edit');	
	Route::any('tblmpcargo/delete/{rec_id}', 'TblMpCargoController@delete');

/* routes for TblMpEscalaSalarial Controller  */	
	Route::get('tblmpescalasalarial/', 'TblMpEscalaSalarialController@index');
	Route::get('tblmpescalasalarial/index', 'TblMpEscalaSalarialController@index');
	Route::get('tblmpescalasalarial/index/{filter?}/{filtervalue?}', 'TblMpEscalaSalarialController@index');	
	Route::get('tblmpescalasalarial/view/{rec_id}', 'TblMpEscalaSalarialController@view');	
	Route::post('tblmpescalasalarial/add', 'TblMpEscalaSalarialController@add');	
	Route::any('tblmpescalasalarial/edit/{rec_id}', 'TblMpEscalaSalarialController@edit');	
	Route::any('tblmpescalasalarial/delete/{rec_id}', 'TblMpEscalaSalarialController@delete');

/* routes for TblMpNivelSalarial Controller  */	
	Route::get('tblmpnivelsalarial/', 'TblMpNivelSalarialController@index');
	Route::get('tblmpnivelsalarial/index', 'TblMpNivelSalarialController@index');
	Route::get('tblmpnivelsalarial/index/{filter?}/{filtervalue?}', 'TblMpNivelSalarialController@index');	
	Route::get('tblmpnivelsalarial/view/{rec_id}', 'TblMpNivelSalarialController@view');	
	Route::post('tblmpnivelsalarial/add', 'TblMpNivelSalarialController@add');	
	Route::any('tblmpnivelsalarial/edit/{rec_id}', 'TblMpNivelSalarialController@edit');	
	Route::any('tblmpnivelsalarial/delete/{rec_id}', 'TblMpNivelSalarialController@delete');

/* routes for TblMpEstructuraOrganizacional Controller  */	
	Route::get('tblmpestructuraorganizacional/', 'TblMpEstructuraOrganizacionalController@index');
	Route::get('tblmpestructuraorganizacional/index', 'TblMpEstructuraOrganizacionalController@index');
	Route::get('tblmpestructuraorganizacional/index/{filter?}/{filtervalue?}', 'TblMpEstructuraOrganizacionalController@index');	
	Route::get('tblmpestructuraorganizacional/view/{rec_id}', 'TblMpEstructuraOrganizacionalController@view');	
	Route::post('tblmpestructuraorganizacional/add', 'TblMpEstructuraOrganizacionalController@add');	
	Route::any('tblmpestructuraorganizacional/edit/{rec_id}', 'TblMpEstructuraOrganizacionalController@edit');	
	Route::any('tblmpestructuraorganizacional/delete/{rec_id}', 'TblMpEstructuraOrganizacionalController@delete');
	Route::get('tblmpestructuraorganizacional/tree', 'TblMpEstructuraOrganizacionalController@getTree');

/* routes for TblMpCategoriaProgramatica Controller */
	Route::get('tblmpcategoriaprogramatica/', 'TblMpCategoriaProgramaticaController@index');
	Route::get('tblmpcategoriaprogramatica/index', 'TblMpCategoriaProgramaticaController@index');
	Route::get('tblmpcategoriaprogramatica/index/{filter?}/{filtervalue?}', 'TblMpCategoriaProgramaticaController@index');
	Route::get('tblmpcategoriaprogramatica/view/{rec_id}', 'TblMpCategoriaProgramaticaController@view');
	Route::post('tblmpcategoriaprogramatica/add', 'TblMpCategoriaProgramaticaController@add');
	Route::any('tblmpcategoriaprogramatica/edit/{rec_id}', 'TblMpCategoriaProgramaticaController@edit');
	Route::any('tblmpcategoriaprogramatica/delete/{rec_id}', 'TblMpCategoriaProgramaticaController@delete');
	Route::get('tblmpcategoriaprogramatica/counts', 'TblMpCategoriaProgramaticaController@getCounts');
	Route::get('tblmpcategoriaprogramatica/bypr/{pr_id}', 'TblMpCategoriaProgramaticaController@getByPrId');

/* routes for TblMpTipoItem Controller  */	
	Route::get('tblmptipoitem/', 'TblMpTipoItemController@index');
	Route::get('tblmptipoitem/index', 'TblMpTipoItemController@index');
	Route::get('tblmptipoitem/index/{filter?}/{filtervalue?}', 'TblMpTipoItemController@index');	
	Route::get('tblmptipoitem/view/{ti_item}/{ti_tipo}', 'TblMpTipoItemController@view');	
	Route::post('tblmptipoitem/add', 'TblMpTipoItemController@add');	
	Route::any('tblmptipoitem/edit/{ti_item}/{ti_tipo}', 'TblMpTipoItemController@edit');	
	Route::post('tblmptipoitem/delete', 'TblMpTipoItemController@delete');
	Route::get('tblmptipoitem/bytipo/{tipo}', 'TblMpTipoItemController@getByTipo');
	Route::get('tblmptipoitem/getTiposItem', 'TblMpTipoItemController@getTiposItem');

/* routes for Tblitems Controller */	
	Route::get('tblitems/', 'TblitemsController@index');
	Route::get('tblitems/index', 'TblitemsController@index');
	Route::get('tblitems/view/{rec_id}', 'TblitemsController@view');
	Route::get('tblitems/options', 'TblitemsController@getOptions');
	Route::post('tblitems/add', 'TblitemsController@add');
	Route::any('tblitems/edit/{rec_id}', 'TblitemsController@edit');
	Route::any('tblitems/delete/{rec_id}', 'TblitemsController@delete');

/* routes for TblMpAsignacion Controller */	
	Route::get('tblmpasignacion/', 'TblMpAsignacionController@index');
	Route::get('tblmpasignacion/index', 'TblMpAsignacionController@index');
	Route::get('tblmpasignacion/index/{filter?}/{filtervalue?}', 'TblMpAsignacionController@index');
	Route::get('tblmpasignacion/view/{rec_id}', 'TblMpAsignacionController@view');
	Route::post('tblmpasignacion/add', 'TblMpAsignacionController@add');
	Route::any('tblmpasignacion/edit/{rec_id}', 'TblMpAsignacionController@edit');
	Route::any('tblmpasignacion/delete/{rec_id}', 'TblMpAsignacionController@delete');

/* routes for TblPersona Controller */	
	Route::get('tblpersona/', 'TblPersonaController@index');
	Route::get('tblpersona/index', 'TblPersonaController@index');
	Route::get('tblpersona/index/{filter?}/{filtervalue?}', 'TblPersonaController@index');
	Route::get('tblpersona/view/{rec_id}', 'TblPersonaController@view');
	Route::post('tblpersona/add', 'TblPersonaController@add');
	Route::any('tblpersona/edit/{rec_id}', 'TblPersonaController@edit');
	Route::any('tblpersona/delete/{rec_id}', 'TblPersonaController@delete');

/* routes for FileUpload Controller  */	
	Route::post('fileuploader/upload/{fieldname}', 'FileUploaderController@upload');
	Route::post('fileuploader/s3upload/{fieldname}', 'FileUploaderController@s3upload');
	Route::post('fileuploader/remove_temp_file', 'FileUploaderController@remove_temp_file');

	Route::post('/upload-icon', function (Request $request) {
		$request->validate([
			'icon' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
		]);

		$path = $request->file('icon')->store('icons', 'public');

		return response()->json(['url' => asset("storage/$path")]);
	});