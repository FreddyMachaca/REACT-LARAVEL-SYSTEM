<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblGlosaAddRequest;
use App\Http\Requests\TblGlosaEditRequest;
use App\Models\TblGlosa;
use Illuminate\Http\Request;
use Exception;
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
	function add(TblGlosaAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblGlosa record
		$record = TblGlosa::create($modeldata);
		$rec_id = $record->gl_id;
		return $this->respond($record);
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
