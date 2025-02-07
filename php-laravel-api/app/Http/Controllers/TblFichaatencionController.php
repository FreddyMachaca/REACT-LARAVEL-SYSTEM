<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblFichaatencionAddRequest;
use App\Http\Requests\TblFichaatencionEditRequest;
use App\Models\TblFichaatencion;
use Illuminate\Http\Request;
use Exception;
class TblFichaatencionController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblFichaatencion::query();
		if($request->search){
			$search = trim($request->search);
			TblFichaatencion::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_fichaatencion.fic_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblFichaatencion::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblFichaatencion::query();
		$record = $query->findOrFail($rec_id, TblFichaatencion::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblFichaatencionAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblFichaatencion record
		$record = TblFichaatencion::create($modeldata);
		$rec_id = $record->fic_id;
		return $this->respond($record);
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblFichaatencionEditRequest $request, $rec_id = null){
		$query = TblFichaatencion::query();
		$record = $query->findOrFail($rec_id, TblFichaatencion::editFields());
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
		$query = TblFichaatencion::query();
		$query->whereIn("fic_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
