<?php

namespace App\Http\Controllers;

use App\Models\TblMpCategoriaProgramatica;
use Illuminate\Http\Request;

class TblMpCategoriaProgramaticaController extends Controller
{
    /**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpCategoriaProgramatica::query();
		
		if($request->search){
			$search = trim($request->search);
			TblMpCategoriaProgramatica::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_categoria_programatica.cp_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
			$query->where('cp_estado', 'V');
		}
        
		$records = $this->paginate($query, TblMpCategoriaProgramatica::listFields());

		return $this->respond($records);
	}

    public function filterByDaAndPr($cp_da, $cp_pr_id){
		$records = TblMpCategoriaProgramatica::where('cp_da', $cp_da)
			->where('cp_pr_id', $cp_pr_id)
			->where('cp_estado', 'V')
			->get();

        return response()->json($records);
    }
}
