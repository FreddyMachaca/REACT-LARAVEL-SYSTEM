<?php

namespace App\Http\Controllers;

use App\Http\Requests\TblKdEducacionFormalAddRequest;
use App\Models\TblKdEducacionFormal;
use Illuminate\Http\Request;

class TblKdEducacionFormalController extends Controller
{
    /**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblKdEducacionFormal::query();
		if($request->search){
			$search = trim($request->search);
			TblKdEducacionFormal::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_kd_educacion_formal.ef_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where('ef_estado', 'V');
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $query->get(TblKdEducacionFormal::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblKdEducacionFormal::query();
		$record = $query->findOrFail($rec_id, TblKdEducacionFormal::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblKdEducacionFormalAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblKdEducacionFormal record
		$record = TblKdEducacionFormal::create($modeldata);
		$rec_id = $record->ac_id;
		return $this->respond($record);
	}

	function delete(Request $request, $rec_id = null){
		$record = TblKdEducacionFormal::find($rec_id);
		$record->ef_estado = 'C';

		$record->save();

		return response()->json($record);
	}
}
