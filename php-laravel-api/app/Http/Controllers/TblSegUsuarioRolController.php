<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblSegUsuarioRolAddRequest;
use App\Http\Requests\TblSegUsuarioRolEditRequest;
use App\Models\TblSegUsuarioRol;
use Illuminate\Http\Request;
use Exception;
class TblSegUsuarioRolController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblSegUsuarioRol::query();
		if($request->search){
			$search = trim($request->search);
			TblSegUsuarioRol::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_seg_usuario_rol.usrol_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblSegUsuarioRol::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblSegUsuarioRol::query();
		$record = $query->findOrFail($rec_id, TblSegUsuarioRol::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblSegUsuarioRolAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblSegUsuarioRol record
		$record = TblSegUsuarioRol::create($modeldata);
		$rec_id = $record->usrol_id;
		return $this->respond($record);
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblSegUsuarioRolEditRequest $request, $rec_id = null){
		$query = TblSegUsuarioRol::query();
		$record = $query->findOrFail($rec_id, TblSegUsuarioRol::editFields());
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
		$query = TblSegUsuarioRol::query();
		$query->whereIn("usrol_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
