<?php

namespace App\Http\Controllers;

use App\Http\Requests\TblPersonaAddRequest;
use App\Models\TblPersona;
use App\Models\TblPersonaDomicilio;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TblPersonaController extends Controller
{

    /**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPersona::query();
		if($request->search){
			$search = trim($request->search);
			TblPersona::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_persona.per_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $query->get(TblPersona::listFields());
		return $this->respond($records);
	}

	function getPersonWithHome(Request $request, $fieldname = null, $fieldvalue = null){
		$query = TblPersona::with('domicilio'); 

		if ($request->search) {
			$search = trim($request->search);
			TblPersona::search($query, $search);
		}

		$orderby = $request->orderby ?? "tbl_persona.per_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);

		if ($fieldname) {
			$query->where($fieldname, $fieldvalue);
		}

		$records = $query->get();
		return $this->respond($records);
	}

	function addPersonAndHome(TblPersonaAddRequest $request){
		$modeldata = $request->validated();
		$modeldata['per_fecha_registro'] = Carbon::now();
		$persona = TblPersona::create($modeldata);

		$domicilioData = $request->only(['perd_ciudad_residencia', 'perd_descripcion_via', 'perd_numero', 'perd_tipo_via', 'perd_zona']); 
		$domicilioData['perd_per_id'] = $persona->per_id; 
		$domicilioData['perd_fecha_creacion'] = Carbon::now(); 
		$domicilio = TblPersonaDomicilio::create($domicilioData);

		return response()->json($persona);
	}
}
