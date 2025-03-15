<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblMpAsignacion;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblMpAsignacionController extends Controller
{
    /**
     * List table records
     * @param Request $request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\Http\Response
     */
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try{
            $query = TblMpAsignacion::query();
            
            if($request->search){
                $search = trim($request->search);
                TblMpAsignacion::search($query, $search);
            }
            
            if ($fieldname) {
                $query->where($fieldname, $fieldvalue);
            }
            
            // Join with cargo table for additional info
            $query->with(['cargo']);
            
            $records = $query->paginate($request->limit ?? 10);
            return $this->respond($records);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Select table record by ID
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function view($rec_id = null){
        try{
            $query = TblMpAsignacion::query();
            $query->with(['cargo']);
            $record = $query->findOrFail($rec_id);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Save form record to the table
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    function add(Request $request){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            
            $existingAssignment = TblMpAsignacion::where('as_ca_id', $modeldata['as_ca_id'])
                ->where('as_estado', 'V')
                ->first();
                
            if ($existingAssignment) {
                throw new Exception("Este item ya se encuentra asignado");
            }
            
            if (empty($modeldata['as_per_id']) || empty($modeldata['as_ca_id']) || 
                empty($modeldata['as_fecha_inicio']) || empty($modeldata['as_tipo_mov'])) {
                throw new Exception("Faltan campos requeridos");
            }
            
            DB::beginTransaction();
            
            $modeldata['as_fecha_creacion'] = $modeldata['as_fecha_creacion'] ?? now();
            $modeldata['as_estado'] = 'V';
            
            $record = TblMpAsignacion::create($modeldata);
            
            DB::commit();
            return $this->respond($record);
        }
        catch(Exception $e){
            DB::rollback();
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Update table record with form data
     * @param Request $request
     * @param string $rec_id //select record by table primary key
     * @return \Illuminate\Http\Response
     */
    function edit(Request $request, $rec_id = null){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblMpAsignacion::findOrFail($rec_id);
            $record->update($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Delete record from the database
     * @param Request $request
     * @param string $rec_id //can be separated by comma for multiple records
     * @return \Illuminate\Http\Response
     */
    function delete(Request $request, $rec_id = null){
        try{
            $arr_id = explode(",", $rec_id);
            $query = TblMpAsignacion::query();
            $query->whereIn("as_id", $arr_id);
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

    /**
     * Get item details for assignment
     */
    public function getItemDetails($itemId)
    {
        try {
            \Log::info("Getting item details for ID: " . $itemId);
            
            $query = DB::table('tbl_mp_cargo AS c')
                ->leftJoin('tbl_mp_escala_salarial AS es', 'c.ca_es_id', '=', 'es.es_id')
                ->leftJoin('tbl_mp_nivel_salarial AS ns', 'es.es_ns_id', '=', 'ns.ns_id')
                ->leftJoin('tbl_mp_estructura_organizacional AS eo', 'c.ca_eo_id', '=', 'eo.eo_id')
                ->leftJoin('tbl_mp_categoria_programatica AS cp', 'eo.eo_cp_id', '=', 'cp.cp_id')
                ->select([
                    'c.ca_id',
                    'c.ca_tipo_jornada',
                    'c.ca_ti_item', 
                    'c.ca_num_item',
                    'es.es_escalafon',
                    'es.es_descripcion AS cargo_descripcion',
                    'ns.ns_haber_basico',
                    'eo.eo_descripcion AS categoria_administrativa',
                    'cp.cp_descripcion AS categoria_programatica'
                ])
                ->where('c.ca_id', $itemId)
                ->first();

            if (!$query) {
                return response()->json([
                    'message' => "No se encontró el item solicitado",
                    'error' => true
                ], 404);
            }

            $asignacion = DB::table('tbl_mp_asignacion AS a')
                ->leftJoin('tbl_persona AS p', 'a.as_per_id', '=', 'p.per_id')
                ->where('a.as_ca_id', $itemId)
                ->where('a.as_estado', 'V')
                ->select('a.as_fecha_inicio', 'a.as_fecha_fin', 'p.per_nombres', 'p.per_ap_paterno', 'p.per_ap_materno')
                ->first();

            $result = (array)$query;
            
            if ($asignacion) {
                $result['as_fecha_inicio'] = $asignacion->as_fecha_inicio;
                $result['as_fecha_fin'] = $asignacion->as_fecha_fin;
                $result['asignado'] = true;
                $result['asignado_a'] = trim($asignacion->per_nombres . ' ' . 
                                           $asignacion->per_ap_paterno . ' ' . 
                                           $asignacion->per_ap_materno);
            } else {
                $result['asignado'] = false;
            }

            return $this->respond($result);

        } catch (Exception $e) {
            \Log::error("Error in getItemDetails: " . $e->getMessage());
            return $this->respondWithError($e);
        }
    }

    /**
     * Get available items
     */
    public function getAvailableItems()
    {
        try {
            $query = DB::table('tbl_mp_cargo AS c')
                ->leftJoin('tbl_mp_escala_salarial AS es', 'c.ca_es_id', '=', 'es.es_id')
                ->leftJoin('tbl_mp_nivel_salarial AS ns', 'es.es_ns_id', '=', 'ns.ns_id')
                ->leftJoin('tbl_mp_estructura_organizacional AS eo', 'c.ca_eo_id', '=', 'eo.eo_id')
                ->whereNotExists(function($query) {
                    $query->select(DB::raw(1))
                        ->from('tbl_mp_asignacion')
                        ->whereRaw('tbl_mp_asignacion.as_ca_id = c.ca_id')
                        ->where('tbl_mp_asignacion.as_estado', 'V');
                })
                ->where('c.ca_estado', 'V')
                ->select([
                    'c.ca_id',
                    'c.ca_ti_item',
                    'c.ca_num_item',
                    'c.ca_tipo_jornada',
                    'es.es_descripcion AS cargo',
                    'ns.ns_haber_basico',
                    'eo.eo_descripcion AS unidad_organizacional'
                ])
                ->get();

            return $this->respond($query);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
