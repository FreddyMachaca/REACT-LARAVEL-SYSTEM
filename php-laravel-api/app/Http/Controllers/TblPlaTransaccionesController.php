<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblPlaTransacciones;
use App\Models\TblPlaTransaccionesCuotas;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblPlaTransaccionesController extends Controller
{
    public function index(Request $request, $fieldname = null, $fieldvalue = null)
    {
        try {
            $query = TblPlaTransacciones::query();
            
            if($request->search){
                $search = trim($request->search);
                TblPlaTransacciones::search($query, $search);
            }
            
            if ($fieldname) {
                $query->where($fieldname, $fieldvalue);
            } else {
                foreach($request->all() as $key => $value) {
                    if ($key !== 'search' && $key !== 'limit' && $key !== 'page' && !empty($value)) {
                        $query->where($key, $value);
                    }
                }
            }
            
            $records = $query->paginate($request->limit ?? 10);
            return $this->respond($records);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    public function view($rec_id = null)
    {
        try {
            $record = DB::table('tbl_pla_transacciones as t')
                ->leftJoin('tbl_pla_factor as f', 't.tr_fa_id', '=', 'f.fa_id')
                ->leftJoin('tbl_persona as p', 't.tr_per_id', '=', 'p.per_id')
                ->select([
                    't.*', 
                    'f.fa_descripcion', 
                    'p.per_nombres', 
                    'p.per_ap_paterno', 
                    'p.per_ap_materno'
                ])
                ->where('t.tr_id', $rec_id)
                ->first();
                
            if (!$record) {
                return $this->respondWithError("Record not found", 404);
            }
            
            return $this->respond($record);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    public function add(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $maxId = DB::table('tbl_pla_transacciones')->max('tr_id') ?? 0;
            
            $modeldata = $this->normalizeFormData($request->all());
            
            if (isset($modeldata['tr_id'])) {
                unset($modeldata['tr_id']);
            }
            
            $modeldata['tr_fecha_creacion'] = now();
            $modeldata['tr_monto'] = floatval($modeldata['tr_monto'] ?? 0);

            $record = TblPlaTransacciones::create($modeldata);
            
            if (!$record || !$record->tr_id) {
                throw new Exception('Error al crear la transacción: No se pudo obtener el ID');
            }

            DB::commit();
            
            $record = TblPlaTransacciones::with(['persona', 'factor'])
                ->findOrFail($record->tr_id);
            
            return $this->respond($record);
        }
        catch(Exception $e) {
            DB::rollback();
            return $this->respondWithError($e);
        }
    }
    
    public function edit(Request $request, $rec_id = null)
    {
        try {
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblPlaTransacciones::findOrFail($rec_id);
            $record->update($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    public function delete(Request $request, $rec_id = null)
    {
        try {
            $arr_id = explode(",", $rec_id);
            TblPlaTransacciones::whereIn("tr_id", $arr_id)->delete();
            return $this->respond([
                "status" => "success",
                "message" => "Registros eliminados exitosamente"
            ]);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }

    public function getTransaccionesPersona($personaId)
    {
        try {
            $records = DB::table('tbl_pla_transacciones as t')
                ->leftJoin('tbl_pla_factor as f', 't.tr_fa_id', '=', 'f.fa_id')
                ->where('t.tr_per_id', $personaId)
                ->select([
                    't.*',
                    'f.fa_descripcion',
                    DB::raw('CAST(t.tr_monto AS FLOAT) as tr_monto') 
                ])
                ->get();

            return $this->respond([
                'records' => $records,
                'total_records' => $records->count()
            ]);
        }
        catch(Exception $e) {
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

    /**
     * Store a new transaction record
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $maxId = DB::table('tbl_pla_transacciones')->max('tr_id') ?? 0;
            
            $validatedData = $request->validate([
                'tr_pc_id'       => 'required|integer',
                'tr_per_id'      => 'required|integer',
                'tr_fa_id'       => 'required|integer',
                'tr_fecha_inicio'=> 'required|date',
                'tr_fecha_fin'   => 'nullable|date',
                'tr_monto'       => 'required|numeric',
                'tr_estado'      => 'required|string|max:3'
            ]);
            
            $validatedData['tr_id'] = $maxId + 1;
            $validatedData['tr_usuario_creacion'] = auth()->user() ? auth()->user()->id : null;
            $validatedData['tr_fecha_creacion'] = now();
            
            $transaccion = TblPlaTransacciones::create($validatedData);
            
            if (!$transaccion || !$transaccion->tr_id) {
                throw new Exception('Error al crear la transacción: No se pudo obtener el ID');
            }

            DB::commit();
            
            $transaccion = TblPlaTransacciones::with(['persona', 'factor'])
                ->findOrFail($transaccion->tr_id);
            
            return $this->respond($transaccion);
        }
        catch(Exception $e) {
            DB::rollback();
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Store transaction installment record
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function storeCuotas(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $validatedData = $request->validate([
                'tc_tr_id'       => 'required|integer|exists:tbl_pla_transacciones,tr_id',
                'tc_cant_cuotas' => 'required|integer|min:1',
                'tc_monto'       => 'required|numeric|min:0',
                'tc_estado'      => 'required|string|max:3'
            ]);
            
            $cuotas = TblPlaTransaccionesCuotas::create($validatedData);
            
            DB::commit();
            
            return $this->respond($cuotas);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->respondWithError($e);
        }
    }
}
