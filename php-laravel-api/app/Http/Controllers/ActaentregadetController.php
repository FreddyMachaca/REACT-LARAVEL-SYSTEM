<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\ActaentregadetAddRequest;
use App\Http\Requests\ActaentregadetEditRequest;
use App\Models\Actaentregadet;
use Illuminate\Http\Request;
use Exception;
class ActaentregadetController extends Controller
{


	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = Actaentregadet::query();
		if($request->search){
			$search = trim($request->search);
			Actaentregadet::search($query, $search);
		}
		$orderby = $request->orderby ?? "actaentregadet.aed_actaid";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, Actaentregadet::listFields());
		return $this->respond($records);
	}
	function nuevo(Request $request){
        return response()->json($request->all());
    }

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = Actaentregadet::query();
		$record = $query->findOrFail($rec_id, Actaentregadet::viewFields());
		return $this->respond($record);
	}


	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(ActaentregadetAddRequest $request){
		$modeldata = $request->validated();

		//save Actaentregadet record
		$record = Actaentregadet::create($modeldata);
		$rec_id = $record->aed_actaid;
		return $this->respond($record);
	}


	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(ActaentregadetEditRequest $request, $rec_id = null){
		$query = Actaentregadet::query();
		$record = $query->findOrFail($rec_id, Actaentregadet::editFields());
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
		$query = Actaentregadet::query();
		$query->whereIn("aed_actaid", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
