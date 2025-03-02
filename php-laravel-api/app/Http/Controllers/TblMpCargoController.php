<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpCargo;
use Illuminate\Http\Request;
use Exception;
class TblMpCargoController extends Controller
{
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpCargo::query();
		if($request->search){
			$search = trim($request->search);
			TblMpCargo::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_cargo.ca_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblMpCargo::listFields());
		return $this->respond($records);
	}
	
	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblMpCargo::query();
		$record = $query->findOrFail($rec_id, TblMpCargo::viewFields());
		return $this->respond($record);
	}
	
	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$modeldata = $this->normalizeFormData($request->all());
		
		//save TblMpCargo record
		$record = TblMpCargo::create($modeldata);
		$rec_id = $record->ca_id;
		return $this->respond($record);
	}
	
	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(Request $request, $rec_id = null){
		$query = TblMpCargo::query();
		$record = $query->findOrFail($rec_id, TblMpCargo::editFields());
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
		$query = TblMpCargo::query();
		$query->whereIn("ca_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
