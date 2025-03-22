<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblTipoAportante;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblTipoAportanteController extends Controller
{
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try{
            $query = TblTipoAportante::query();
            
            if($request->search){
                $search = trim($request->search);
                TblTipoAportante::search($query, $search);
            }
            
            if ($fieldname) {
                $query->where($fieldname, $fieldvalue);
            }
            
            $records = $query->paginate($request->limit ?? 10);
            return $this->respond($records);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function view($rec_id = null){
        try{
            $record = TblTipoAportante::findOrFail($rec_id);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function add(Request $request){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblTipoAportante::create($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function edit(Request $request, $rec_id = null){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblTipoAportante::findOrFail($rec_id);
            $record->update($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function delete(Request $request, $rec_id = null){
        try{
            $arr_id = explode(",", $rec_id);
            $query = TblTipoAportante::query();
            $query->whereIn("ta_id", $arr_id);
            $query->delete();
            return $this->respond([
                "status" => "success",
                "message" => "Registros eliminados exitosamente",
                "deleted_records" => count($arr_id)
            ]);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }

    public function getPersonaInfo($personaId)
    {
        try {
            $query = DB::table('tbl_persona AS p')
                ->select(
                    'p.*',
                    'a.as_fecha_inicio',
                    'a.as_fecha_fin',
                    'c.ca_ti_item',
                    'c.ca_num_item',
                    'c.ca_tipo_jornada',
                    'es.es_descripcion AS cargo_descripcion',
                    'es.es_escalafon',
                    'ns.ns_haber_basico',
                    'eo.eo_descripcion AS categoria_administrativa',
                    'cp.cp_descripcion AS categoria_programatica',
                    DB::raw("CONCAT(eo.eo_prog, ' - ', eo.eo_sprog, ' - ', eo.eo_proy, ' - ', eo.eo_obract, ' - ', eo.eo_unidad) as codigo_administrativo"),
                    DB::raw("CONCAT(cp.cp_da, ' - ', cp.cp_ue, ' - ', cp.cp_programa, ' - ', cp.cp_proyecto, ' - ', cp.cp_actividad) as codigo_programatico")
                )
                ->leftJoin('tbl_mp_asignacion AS a', function($join) {
                    $join->on('p.per_id', '=', 'a.as_per_id')
                        ->where('a.as_estado', '=', 'V');
                })
                ->leftJoin('tbl_mp_cargo AS c', 'a.as_ca_id', '=', 'c.ca_id')
                ->leftJoin('tbl_mp_escala_salarial AS es', 'c.ca_es_id', '=', 'es.es_id')
                ->leftJoin('tbl_mp_nivel_salarial AS ns', 'es.es_ns_id', '=', 'ns.ns_id')
                ->leftJoin('tbl_mp_estructura_organizacional AS eo', 'c.ca_eo_id', '=', 'eo.eo_id')
                ->leftJoin('tbl_mp_categoria_programatica AS cp', 'eo.eo_cp_id', '=', 'cp.cp_id')
                ->where('p.per_id', $personaId)
                ->first();

            return $this->respond($query);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
