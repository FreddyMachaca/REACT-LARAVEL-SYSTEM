<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblGlosaAddRequest;
use App\Http\Requests\TblGlosaEditRequest;
use App\Models\TblGlosa;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblGlosaController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblGlosa::query();
		if($request->search){
			$search = trim($request->search);
			TblGlosa::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_glosa.gl_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblGlosa::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblGlosa::query();
		$record = $query->findOrFail($rec_id, TblGlosa::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		try {
			$modeldata = $this->normalizeFormData($request->all());
			
			if (!isset($modeldata['gl_valor_pk']) || 
				!isset($modeldata['gl_nombre_pk']) || 
				!isset($modeldata['gl_tabla']) || 
				!isset($modeldata['gl_tipo_doc']) || 
				!isset($modeldata['gl_glosa']) || 
				!isset($modeldata['gl_numero_doc']) || 
				!isset($modeldata['gl_fecha_doc'])) {
				throw new Exception("Faltan campos requeridos");
			}

			$glosa = new TblGlosa();
			$glosa->gl_valor_pk = strval($modeldata['gl_valor_pk']); // Convertir a string
			$glosa->gl_nombre_pk = strval($modeldata['gl_nombre_pk']);
			$glosa->gl_tabla = strval($modeldata['gl_tabla']);
			$glosa->gl_tipo_mov = intval($modeldata['gl_tipo_mov']); // Convertir a integer
			$glosa->gl_tipo_doc = intval($modeldata['gl_tipo_doc']); // Convertir a integer
			$glosa->gl_glosa = strval($modeldata['gl_glosa']);
			$glosa->gl_numero_doc = strval($modeldata['gl_numero_doc']);
			$glosa->gl_fecha_doc = date('Y-m-d H:i:s', strtotime($modeldata['gl_fecha_doc']));
			$glosa->gl_estado = 'V';
			$glosa->gl_usuario = auth()->id() ?? 1;
			$glosa->gl_fecha_registro = now();
			
			$glosa->save();
			
			return $this->respond($glosa);
		} catch (Exception $e) {
			return $this->respondWithError($e);
		}
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblGlosaEditRequest $request, $rec_id = null){
		$query = TblGlosa::query();
		$record = $query->findOrFail($rec_id, TblGlosa::editFields());
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
		$query = TblGlosa::query();
		$query->whereIn("gl_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
