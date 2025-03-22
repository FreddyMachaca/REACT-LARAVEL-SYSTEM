<?php

namespace App\Http\Controllers;

use App\Http\Requests\TblMpTenorAddRequest;
use App\Models\TblMpTenor;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TblMpTenorController extends Controller
{
    /**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
    function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpTenor::query()->where('te_estado', 'V');
		if($request->search){
			$search = trim($request->search);
			TblMpTenor::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_tenor.te_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblMpTenor::listFields());
		return $this->respond($records);
	}

	function add(TblMpTenorAddRequest $request){
		$modeldata = $request->validated();

		if (isset($modeldata['te_id']) && $modeldata['te_id'] === null) {
			unset($modeldata['te_id']);
		}

		if (empty($modeldata['te_id'])) {
			$tenor = TblMpTenor::create($modeldata);
		} else {
			$tenor = TblMpTenor::findOrFail($modeldata['te_id']);
			$tenor->update($modeldata);
		}
	}

	/**
	 * Change status to A = anulated
	 * @param Integer $rec_id filter record for te_id
	 */
	function delete($rec_id){
		$record = TblMpTenor::find($rec_id);
		$record->te_estado = 'A';
		$record->te_fecha_modificacion = Carbon::now(); 

		$record->save();

		return response()->json($record);
	}

	function getById ($rec_id){
		$record = TblMpTenor::find($rec_id);

		return response()->json($record);
	}
}
