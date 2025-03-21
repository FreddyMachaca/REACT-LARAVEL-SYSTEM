<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblCatalogoAddRequest;
use App\Http\Requests\TblCatalogoEditRequest;
use App\Models\TblCatalogo;
use Illuminate\Http\Request;
use Exception;
class TblCatalogoController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblCatalogo::query();
		if($request->search){
			$search = trim($request->search);
			TblCatalogo::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_catalogo.cat_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblCatalogo::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblCatalogo::query();
		$record = $query->findOrFail($rec_id, TblCatalogo::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblCatalogoAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblCatalogo record
		$record = TblCatalogo::create($modeldata);
		$rec_id = $record->cat_id;
		return $this->respond($record);
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblCatalogoEditRequest $request, $rec_id = null){
		$query = TblCatalogo::query();
		$record = $query->findOrFail($rec_id, TblCatalogo::editFields());
		if ($request->isMethod('post')) {
			$modeldata = $request->validated();
			$record->update($modeldata);
		}
		return $this->respond($record);
	}
	

	/**
     * Delete record from the database
	 * Support multi delete by separating record id by comma.
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_id //can be separated by comma 
     * @return \Illuminate\Http\Response
     */
	function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblCatalogo::query();
		$query->whereIn("cat_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}

	function getMovGeneral(){
		$records = TblCatalogo::where('cat_tabla', 'tipo_mov_general')
		->where('cat_estado', 'V')
		->get();
		
		return response()->json($records);
	}

	/**
	 * This function return data where cat_tabla is equals to 
	 * 'zona', 'tipo_via', 'ciudad_localidad'
	 */
	function getDataDomicilio(){
		$records = TblCatalogo::whereIn('cat_tabla', ['zona', 'tipo_via', 'ciudad_localidad'])
			->where('cat_estado', 'V')
			->get();

		return response()->json($records);
	}

	function getDataEducation(){
		$records = TblCatalogo::whereIn('cat_tabla', ['nivel_instruccion', 'centro_formacion_kd', 'carrera', 'titulos'])
			->where('cat_estado', 'V')
			->get();

		return response()->json($records);
	}

	/**
	 * This function return records that they are equal to rec_tipo
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_tipo //can be separated by comma 
     * @return \Illuminate\Http\Response
	 */
	function getCatalogosAddPerson(Request $request, $rec_tipo = null){
		$query = TblCatalogo::where('cat_estado', 'V')
		->whereIn('cat_tabla', 
			['tipo_documento_impreso', 'estado_civil', 'zona', 'pais', 'ciudad_localidad', 'departamento', 'provincia', 'tipo_via']
		)
		->select("cat_id", "cat_tabla", "cat_descripcion")
		->get()
		->groupBy('cat_tabla');

		return response()->json($query);
	}

	/**
	 * Select tabla records by cat_id_superior
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_tipo //can be separated by comma 
     * @return \Illuminate\Http\Response
	 */
	function getCatalogoByCatIdSup(Request $request, $rec_id){
		$query = TblCatalogo::where('cat_id_superior', $rec_id)
			->where('cat_estado', 'V')
			->get();

		return response()->json($query);
	}

	function addZoneWithDepartament (Request $request) {
		$datos = $request->validate([
			"cat_id_superior" => "required|integer",
			"cat_descripcion" => "required|string",
			"cat_estado" => "required|string",
			"cat_tabla" => "required|string",
		]);
		
		$maxSecuencial = TblCatalogo::where('cat_tabla', 'zona')->max('cat_secuencial');

		$catalogo = new TblCatalogo();
		$catalogo->cat_tabla = $request->cat_tabla;
		$catalogo->cat_secuencial = $maxSecuencial + 1;
		$catalogo->cat_descripcion = $request->cat_descripcion;
		$catalogo->cat_estado = $request->cat_estado;
		$catalogo->cat_id_superior = $request->cat_id_superior;
		$catalogo->save();

		return response()->json($request);
	}
}
