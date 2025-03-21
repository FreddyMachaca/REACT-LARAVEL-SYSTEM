<?php

namespace App\Http\Controllers;

use App\Http\Requests\TblPersonaFamiliaresAddRequest;
use App\Models\TblPersonaFamiliares;
use Illuminate\Http\Request;

class tblPersonaFamiliaresController extends Controller
{
    /**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPersonaFamiliares::query();
		if($request->search){
			$search = trim($request->search);
			TblPersonaFamiliares::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_persona_familiares.pf_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $query->get(TblPersonaFamiliares::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblPersonaFamiliares::query();
		$record = $query->findOrFail($rec_id, TblPersonaFamiliares::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblPersonaFamiliaresAddRequest $request){
		$modeldata = $request->validated();
		
		$record = TblPersonaFamiliares::create($modeldata);
		$rec_id = $record->pf_per_id;
		return $this->respond($record);
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	// function edit(TblPersonaFamiliaresEditRequest $request, $rec_id = null){
	// 	$query = TblPersonaFamiliares::query();
	// 	$record = $query->findOrFail($rec_id, TblPersonaFamiliares::editFields());
	// 	if ($request->isMethod('post')) {
	// 		$modeldata = $request->validated();
	// 		$record->update($modeldata);
	// 	}
	// 	return $this->respond($record);
	// }
	

	/**
     * Delete record from the database
	 * Support multi delete by separating record id by comma.
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_id //can be separated by comma 
     * @return \Illuminate\Http\Response
     */
	function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblPersonaFamiliares::query();
		$query->whereIn("ac_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
