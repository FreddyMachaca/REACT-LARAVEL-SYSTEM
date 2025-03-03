<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpEstructuraOrganizacional;
use Illuminate\Http\Request;
use Exception;
class TblMpEstructuraOrganizacionalController extends Controller
{
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpEstructuraOrganizacional::query();
		if($request->search){
			$search = trim($request->search);
			TblMpEstructuraOrganizacional::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_estructura_organizacional.eo_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblMpEstructuraOrganizacional::listFields());
		return $this->respond($records);
	}
	
	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblMpEstructuraOrganizacional::query();
		$record = $query->findOrFail($rec_id, TblMpEstructuraOrganizacional::viewFields());
		return $this->respond($record);
	}
	
	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$modeldata = $this->normalizeFormData($request->all());
		
		//save TblMpEstructuraOrganizacional record
		$record = TblMpEstructuraOrganizacional::create($modeldata);
		$rec_id = $record->eo_id;
		return $this->respond($record);
	}
	
	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(Request $request, $rec_id = null){
		$query = TblMpEstructuraOrganizacional::query();
		$record = $query->findOrFail($rec_id, TblMpEstructuraOrganizacional::editFields());
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
		$query = TblMpEstructuraOrganizacional::query();
		$query->whereIn("eo_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
