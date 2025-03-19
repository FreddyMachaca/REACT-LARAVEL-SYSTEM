<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpEscalaSalarial;
use Illuminate\Http\Request;
use Exception;
class TblMpEscalaSalarialController extends Controller
{
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpEscalaSalarial::query();
		if($request->search){
			$search = trim($request->search);
			TblMpEscalaSalarial::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_escala_salarial.es_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblMpEscalaSalarial::listFields());
		return $this->respond($records);
	}
	
	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblMpEscalaSalarial::query();
		$record = $query->findOrFail($rec_id, TblMpEscalaSalarial::viewFields());
		return $this->respond($record);
	}
	
	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$modeldata = $this->normalizeFormData($request->all());
		
		//save TblMpEscalaSalarial record
		$record = TblMpEscalaSalarial::create($modeldata);
		$rec_id = $record->es_id;
		return $this->respond($record);
	}
	
	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(Request $request, $rec_id = null){
		$query = TblMpEscalaSalarial::query();
		$record = $query->findOrFail($rec_id, TblMpEscalaSalarial::editFields());
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
		$query = TblMpEscalaSalarial::query();
		$query->whereIn("es_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
