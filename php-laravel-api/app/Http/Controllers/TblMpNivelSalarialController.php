<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpNivelSalarial;
use Illuminate\Http\Request;
use Exception;
class TblMpNivelSalarialController extends Controller
{
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpNivelSalarial::query();
		if($request->search){
			$search = trim($request->search);
			TblMpNivelSalarial::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_nivel_salarial.ns_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblMpNivelSalarial::listFields());
		return $this->respond($records);
	}
	
	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblMpNivelSalarial::query();
		$record = $query->findOrFail($rec_id, TblMpNivelSalarial::viewFields());
		return $this->respond($record);
	}
	
	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$modeldata = $this->normalizeFormData($request->all());
		
		//save TblMpNivelSalarial record
		$record = TblMpNivelSalarial::create($modeldata);
		$rec_id = $record->ns_id;
		return $this->respond($record);
	}
	
	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(Request $request, $rec_id = null){
		$query = TblMpNivelSalarial::query();
		$record = $query->findOrFail($rec_id, TblMpNivelSalarial::editFields());
		if ($request->isMethod('post')) {
			$modeldata = $this->normalizeFormData($request->all());
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
		$query = TblMpNivelSalarial::query();
		$query->whereIn("ns_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
