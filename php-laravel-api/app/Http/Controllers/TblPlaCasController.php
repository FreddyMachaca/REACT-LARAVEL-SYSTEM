<?php

namespace App\Http\Controllers;

use App\Models\TblPlaCas;
use Illuminate\Http\Request;

class TblPlaCasController extends Controller
{
    /**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$data = $request->all();

        // Extraer la antigüedad
        $antiguedad = $data['antiguedad'] ?? [];

        // Crear el nuevo registro
        $registro = TblPlaCas::create([
            'cs_res_adm'    => $data['cs_res_adm'],
            'cs_nro_cas'    => $data['cs_nro_cas'],
            'cs_fecha_cas'  => $data['cs_fecha_cas'],
            'cs_anos'       => $antiguedad['cs_anos'] ?? 0,
            'cs_meses'      => $antiguedad['cs_meses'] ?? 0,
            'cs_dias'       => $antiguedad['cs_dias'] ?? 0,
            'cs_tipo_reg'   => $data['cs_tipo_reg'],
            'cs_estado'     => $data['cs_estado'],
            'cs_per_id'     => $data['cs_per_id'],
            'cs_procesado'     => '-',
        ]);
		return $this->respond($registro);
	}

    function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPlaCas::query();
		if($request->search){
			$search = trim($request->search);
			TblPlaCas::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_pla_cas.cs_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblPlaCas::listFields());
		return $this->respond($records);
	}

    function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblPlaCas::query();
		$query->whereIn("cs_id", $arr_id);
		$query->update(['cs_estado' => 'C']);

		//$query->delete();
		return $this->respond($arr_id);
	}
}
