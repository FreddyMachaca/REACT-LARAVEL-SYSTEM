<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TblPersonaAddRequest;
use App\Models\TblPersona;
use App\Models\TblPersonaDomicilio;
use Illuminate\Http\Request;
use Exception;
use DB;
use Carbon\Carbon;

class TblPersonaController extends Controller
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
            $query = TblPersona::query();
            
            // Aplicar filtros solo si tienen valor
            if ($request->nombres && trim($request->nombres) !== '') {
                $query->where('per_nombres', 'ILIKE', '%'.trim($request->nombres).'%');
            }
            
            if ($request->apellido_paterno && trim($request->apellido_paterno) !== '') {
                $query->where('per_ap_paterno', 'ILIKE', '%'.trim($request->apellido_paterno).'%');
            }
            
            if ($request->apellido_materno && trim($request->apellido_materno) !== '') {
                $query->where('per_ap_materno', 'ILIKE', '%'.trim($request->apellido_materno).'%');
            }
            
            if ($request->num_doc && trim($request->num_doc) !== '') {
                $query->where('per_num_doc', 'ILIKE', '%'.trim($request->num_doc).'%');
            }

            $query->whereNotNull('per_nombres')
                  ->whereNotNull('per_ap_paterno')
                  ->whereNotNull('per_num_doc')
                  ->where('per_nombres', '!=', '')
                  ->where('per_ap_paterno', '!=', '')
                  ->where('per_num_doc', '!=', '');

            if ($request->with_assignments) {
                $query->has('asignacionesTipoAportante');
            }
            
            $query->leftJoin('tbl_mp_asignacion', function($join) {
                $join->on('tbl_persona.per_id', '=', 'tbl_mp_asignacion.as_per_id')
                     ->where('tbl_mp_asignacion.as_estado', '=', 'V');
            })
            ->leftJoin('tbl_mp_cargo', 'tbl_mp_asignacion.as_ca_id', '=', 'tbl_mp_cargo.ca_id')
            ->leftJoin('tbl_mp_escala_salarial', 'tbl_mp_cargo.ca_es_id', '=', 'tbl_mp_escala_salarial.es_id')
            ->leftJoin('tbl_mp_nivel_salarial', 'tbl_mp_escala_salarial.es_ns_id', '=', 'tbl_mp_nivel_salarial.ns_id')
            ->select(
                'tbl_persona.*',
                'tbl_mp_asignacion.as_id',
                'tbl_mp_asignacion.as_ca_id',
                'tbl_mp_cargo.ca_ti_item',
                'tbl_mp_cargo.ca_num_item',
                'tbl_mp_cargo.ca_tipo_jornada',
                'tbl_mp_escala_salarial.es_descripcion as cargo_descripcion',
                'tbl_mp_escala_salarial.es_escalafon',
                'tbl_mp_nivel_salarial.ns_clase',
                'tbl_mp_nivel_salarial.ns_nivel',
                'tbl_mp_nivel_salarial.ns_haber_basico',
                DB::raw('CASE WHEN tbl_mp_asignacion.as_id IS NOT NULL THEN true ELSE false END as tiene_item')
            );
            
            if ($request->nombres) {
                $query->where('per_nombres', 'ILIKE', "%{$request->nombres}%");
            }
            
            if ($request->apellido_paterno) {
                $query->where('per_ap_paterno', 'ILIKE', "%{$request->apellido_paterno}%");
            }
            
            if ($request->apellido_materno) {
                $query->where('per_ap_materno', 'ILIKE', "%{$request->apellido_materno}%");
            }
            
            if ($request->num_doc) {
                $query->where('per_num_doc', 'ILIKE', "%{$request->num_doc}%");
            }
            
            if($request->search){
                $search = trim($request->search);
                TblPersona::search($query, $search);
            }

            $orderby = $request->orderby ?? "tbl_persona.per_id";
            $ordertype = $request->ordertype ?? "desc";
            $query->orderBy($orderby, $ordertype);
            
            if ($fieldname) {
                $query->where($fieldname, $fieldvalue);
            }
            
            // Paginación
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 10);
            
            // Obtener el total antes de la paginación
            $total = $query->count();
            
            // Aplicar paginación
            $records = $query->skip(($page - 1) * $limit)
                            ->take($limit)
                            ->get();
            
            $records = $records->filter(function($record) {
                return !empty(trim($record->per_nombres)) && 
                       !empty(trim($record->per_ap_paterno)) && 
                       !empty(trim($record->per_num_doc));
            })->values();

            return $this->respond([
                'records' => $records,
                'total_records' => $total,
                'current_page' => $page,
                'per_page' => $limit,
                'total_pages' => ceil($total / $limit)
            ]);
        }
        catch(Exception $e){
            \Log::error('Error en TblPersonaController@index: ' . $e->getMessage());
            return $this->respondWithError($e);
        }
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
        try {
            DB::beginTransaction();
            
            $modeldata = $request->validated();
            $modeldata['per_fecha_registro'] = Carbon::now();
            $persona = TblPersona::create($modeldata);

            $domicilioData = $request->only([
                'perd_ciudad_residencia', 
                'perd_descripcion_via', 
                'perd_numero', 
                'perd_tipo_via', 
                'perd_zona'
            ]); 
            $domicilioData['perd_per_id'] = $persona->per_id;
            $domicilioData['perd_fecha_creacion'] = Carbon::now();
            $domicilio = TblPersonaDomicilio::create($domicilioData);

            DB::commit();
            return $this->respond($persona);
        } catch (Exception $e) {
            DB::rollback();
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
            $query = TblPersona::query();
            
            $query->leftJoin('tbl_mp_asignacion', function($join) {
                $join->on('tbl_persona.per_id', '=', 'tbl_mp_asignacion.as_per_id')
                     ->where('tbl_mp_asignacion.as_estado', '=', 'V'); // Solo asignaciones vigentes
            })
            ->leftJoin('tbl_mp_cargo', 'tbl_mp_asignacion.as_ca_id', '=', 'tbl_mp_cargo.ca_id')
            ->select(
                'tbl_persona.*',
                'tbl_mp_asignacion.as_id',
                'tbl_mp_asignacion.as_ca_id',
                'tbl_mp_cargo.ca_ti_item',
                'tbl_mp_cargo.ca_num_item'
            );

            $record = $query->findOrFail($rec_id);
            
            $record->tiene_item = !is_null($record->as_id);
            
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
            $modeldata['per_fecha_registro'] = $modeldata['per_fecha_registro'] ?? now();
            
            DB::beginTransaction();
            $record = TblPersona::create($modeldata);
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
            $record = TblPersona::findOrFail($rec_id);
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
            $query = TblPersona::query();
            $query->whereIn("per_id", $arr_id);
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
}
