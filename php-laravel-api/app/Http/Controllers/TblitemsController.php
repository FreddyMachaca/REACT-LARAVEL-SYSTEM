<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpCargo;
use App\Models\TblMpEscalaSalarial;
use App\Models\TblMpNivelSalarial;
use App\Models\TblMpEstructuraOrganizacional;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblitemsController extends Controller
{
    /**
     * Get paginated items with combined data from all related tables
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function index(Request $request){
        try {
            $page = $request->page ?? 1;
            $limit = $request->limit ?? 10;
            $search = $request->search ?? '';
            
            $query = TblMpCargo::query();
            
            if($search){
                TblMpCargo::search($query, $search);
            }
            
            $total_records = $query->count();
            
            $query->skip(($page - 1) * $limit)->take($limit);
            
            $cargo_records = $query->get();
            
            $es_ids = $cargo_records->pluck('ca_es_id')->filter()->unique()->toArray();
            $eo_ids = $cargo_records->pluck('ca_eo_id')->filter()->unique()->toArray();
            
            $escalas = TblMpEscalaSalarial::whereIn('es_id', $es_ids)->get()->keyBy('es_id');
            
            $ns_ids = $escalas->pluck('es_ns_id')->filter()->unique()->toArray();
            
            $niveles = TblMpNivelSalarial::whereIn('ns_id', $ns_ids)->get()->keyBy('ns_id');
            
            $estructuras = TblMpEstructuraOrganizacional::whereIn('eo_id', $eo_ids)->get()->keyBy('eo_id');
            
            $combined_records = [];
            foreach($cargo_records as $cargo) {
                $escala = isset($escalas[$cargo->ca_es_id]) ? $escalas[$cargo->ca_es_id] : null;
                $nivel = $escala && isset($niveles[$escala->es_ns_id]) ? $niveles[$escala->es_ns_id] : null;
                $estructura = isset($estructuras[$cargo->ca_eo_id]) ? $estructuras[$cargo->ca_eo_id] : null;
                
                $combined_records[] = [
                    'id' => $cargo->ca_id,
                    'codigo' => $cargo->ca_ti_item . '-' . $cargo->ca_num_item,
                    'cargo' => $escala ? $escala->es_descripcion : '',
                    'haber_basico' => $nivel ? $nivel->ns_haber_basico : '',
                    'unidad_organizacional' => $estructura ? $estructura->eo_descripcion : '',
                    'fecha_creacion' => $cargo->ca_fecha_creacion
                ];
            }
            
            return $this->respond([
                'records' => $combined_records,
                'total_records' => $total_records,
                'page' => $page,
                'limit' => $limit
            ]);
            
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Get single item with all related data
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function view($rec_id = null){
        try {
            $cargo = TblMpCargo::findOrFail($rec_id);
            
            $escala = null;
            if ($cargo->ca_es_id) {
                $escala = TblMpEscalaSalarial::find($cargo->ca_es_id);
            }
            
            $nivel = null;
            if ($escala && $escala->es_ns_id) {
                $nivel = TblMpNivelSalarial::find($escala->es_ns_id);
            }
            
            $estructura = null;
            if ($cargo->ca_eo_id) {
                $estructura = TblMpEstructuraOrganizacional::find($cargo->ca_eo_id);
            }
            
            $combined_record = [
                'id' => $cargo->ca_id,
                'codigo' => $cargo->ca_ti_item . '-' . $cargo->ca_num_item,
                'cargo' => $escala ? $escala->es_descripcion : '',
                'haber_basico' => $nivel ? $nivel->ns_haber_basico : '',
                'unidad_organizacional' => $estructura ? $estructura->eo_descripcion : '',
                'fecha_creacion' => $cargo->ca_fecha_creacion,
                'cargo_original' => $cargo,
                'escala_original' => $escala,
                'nivel_original' => $nivel,
                'estructura_original' => $estructura
            ];
            
            return $this->respond($combined_record);
            
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Update item record
     * @param Request $request
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function edit(Request $request, $rec_id = null){
        try {
            $cargo = TblMpCargo::findOrFail($rec_id);
            
            if ($request->isMethod('post')) {
                $modeldata = $this->normalizeFormData($request->all());
                
                $cargo->update([
                    'ca_ti_item' => $modeldata['ca_ti_item'] ?? $cargo->ca_ti_item,
                    'ca_num_item' => $modeldata['ca_num_item'] ?? $cargo->ca_num_item,
                    'ca_es_id' => $modeldata['ca_es_id'] ?? $cargo->ca_es_id,
                    'ca_eo_id' => $modeldata['ca_eo_id'] ?? $cargo->ca_eo_id
                ]);
                
                return $this->view($rec_id);
            } else {
                return $this->view($rec_id);
            }
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Delete item record
     * @param Request $request
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function delete(Request $request, $rec_id = null){
        try {
            $arr_id = explode(",", $rec_id);
            $query = TblMpCargo::query();
            $query->whereIn("ca_id", $arr_id);
            $query->delete();
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Registro(s) eliminado(s) con éxito',
                'deleted_ids' => $arr_id
            ]);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Get options for related fields
     * @return \Illuminate\Http\Response
     */
    function getOptions(){
        try {
            $escalaOptions = TblMpEscalaSalarial::select('es_id', 'es_descripcion')->get();
            
            $estructuraOptions = TblMpEstructuraOrganizacional::select('eo_id', 'eo_descripcion')->get();
            
            return $this->respond([
                'escalaOptions' => $escalaOptions,
                'estructuraOptions' => $estructuraOptions
            ]);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
