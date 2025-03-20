<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblMpAsignacionTipoAportante;
use Illuminate\Http\Request;
use Exception;

class TblMpAsignacionTipoAportanteController extends Controller
{
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try{
            $query = TblMpAsignacionTipoAportante::query();
            
            // Filtrar por estado vigente
            $query->where('at_estado', 'V');
            
            // Si se proporciona el ID de la persona, filtrar por ella
            if ($request->at_per_id) {
                $query->where('at_per_id', $request->at_per_id);
            }
            
            $query->select('at_id', 'at_ta_id', 'at_estado');
            
            $query->with(['tipoAportante:ta_id,ta_descripcion']);
            
            $query->orderBy('at_id', 'desc');
            
            $records = $query->get();
            return $this->respond(['data' => $records]);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function view($rec_id = null){
        try{
            $query = TblMpAsignacionTipoAportante::query();
            $query->with(['persona', 'tipoAportante']);
            $record = $query->findOrFail($rec_id);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function add(Request $request){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $modeldata['at_estado'] = $modeldata['at_estado'] ?? 'V';
            $record = TblMpAsignacionTipoAportante::create($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function edit(Request $request, $rec_id = null){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblMpAsignacionTipoAportante::findOrFail($rec_id);
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
            $query = TblMpAsignacionTipoAportante::query();
            $query->whereIn("at_id", $arr_id);
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

    public function listAsignaciones(Request $request)
    {
        try {
            $query = TblMpAsignacionTipoAportante::query()
                ->select(
                    'tbl_mp_asignacion_tipo_aportante.at_id',
                    'tbl_mp_asignacion_tipo_aportante.at_estado',
                    'tbl_tipo_aportante.ta_descripcion'
                )
                ->join('tbl_tipo_aportante', 
                       'tbl_mp_asignacion_tipo_aportante.at_ta_id', '=', 
                       'tbl_tipo_aportante.ta_id')
                ->join('tbl_persona',
                       'tbl_mp_asignacion_tipo_aportante.at_per_id', '=',
                       'tbl_persona.per_id')
                ->where('tbl_mp_asignacion_tipo_aportante.at_estado', 'V')
                ->whereNotNull('tbl_tipo_aportante.ta_descripcion')
                ->whereNotNull('tbl_mp_asignacion_tipo_aportante.at_ta_id')
                ->whereNotNull('tbl_mp_asignacion_tipo_aportante.at_per_id');

            if ($request->at_per_id) {
                $query->where('tbl_mp_asignacion_tipo_aportante.at_per_id', $request->at_per_id);
            }

            $records = $query->get();

            $records = $records->filter(function($record) {
                return !empty($record->ta_descripcion);
            })->values();

            return $this->respond(['data' => $records]);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
