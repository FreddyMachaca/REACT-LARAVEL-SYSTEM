<?php

namespace App\Http\Controllers;

use App\Models\TblKdRespuestaCombo;
use Illuminate\Http\Request;

class TblKdRespuestaComboController extends Controller
{
    /**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblKdRespuestaCombo::query();
		if($request->search){
			$search = trim($request->search);
			TblKdRespuestaCombo::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_kd_respuesta_combo.rc_rq_id";
		$ordertype = $request->ordertype ?? "asc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $query->get(TblKdRespuestaCombo::listFields());
		return $this->respond($records);
	}
}
