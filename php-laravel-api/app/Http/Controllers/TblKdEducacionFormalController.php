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
	function index(Request $request, $fieldname = null, $fieldvalue = null)
	{
		$query = TblKdEducacionFormal::query()
			->leftJoin('tbl_catalogo as nivel_instruccion', 'tbl_kd_educacion_formal.ef_nivel_instruccion', '=', 'nivel_instruccion.cat_id')
			->leftJoin('tbl_catalogo as centro_form', 'tbl_kd_educacion_formal.ef_centro_form', '=', 'centro_form.cat_id')
			->leftJoin('tbl_catalogo as carrera_especialidad', 'tbl_kd_educacion_formal.ef_carrera_especialidad', '=', 'carrera_especialidad.cat_id')
			->leftJoin('tbl_catalogo as titulo_obtenido', 'tbl_kd_educacion_formal.ef_titulo_obtenido', '=', 'titulo_obtenido.cat_id');

		if ($request->search) {
			$search = trim($request->search);
			TblKdEducacionFormal::search($query, $search);
		}

		$orderby = $request->orderby ?? "tbl_kd_educacion_formal.ef_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);

		if ($fieldname) {
			$query->where('ef_estado', 'V');
			$query->where($fieldname, $fieldvalue);
		}

		// Seleccionar los campos necesarios incluyendo las descripciones
		$records = $query->get([
			'tbl_kd_educacion_formal.*',
			'nivel_instruccion.cat_descripcion as nivel_instruccion_desc',
			'centro_form.cat_descripcion as centro_form_desc',
			'carrera_especialidad.cat_descripcion as carrera_especialidad_desc',
			'titulo_obtenido.cat_descripcion as titulo_obtenido_desc'
		]);

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
