<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblCategoriaLicenciasAddRequest;
use App\Http\Requests\TblCategoriaLicenciasEditRequest;
use App\Models\TblCategoriaLicencias;
use Illuminate\Http\Request;
use Exception;
class TblCategoriaLicenciasController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblCategoriaLicencias::query();
		if($request->search){
			$search = trim($request->search);
			TblCategoriaLicencias::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_categoria_licencias.bt_lic_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblCategoriaLicencias::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblCategoriaLicencias::query();
		$record = $query->findOrFail($rec_id, TblCategoriaLicencias::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblCategoriaLicenciasAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblCategoriaLicencias record
		$record = TblCategoriaLicencias::create($modeldata);
		$rec_id = $record->bt_lic_id;
		return $this->respond($record);
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblCategoriaLicenciasEditRequest $request, $rec_id = null){
		$query = TblCategoriaLicencias::query();
		$record = $query->findOrFail($rec_id, TblCategoriaLicencias::editFields());
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
		$query = TblCategoriaLicencias::query();
		$query->whereIn("bt_lic_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
