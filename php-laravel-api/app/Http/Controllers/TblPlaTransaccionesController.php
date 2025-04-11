<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblPlaTransacciones;
use App\Models\TblPlaTransaccionesCuotas;
use Illuminate\Http\Request;
use Exception;
use DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

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
            return Response::json(['message' => 'Error: ' . $e->getMessage()], 500);
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
                return Response::json(['message' => 'Registro no encontrado'], 404);
            }
            
            return Response::json($record);
        }
        catch(Exception $e) {
            Log::error('Error en TblPlaTransaccionesController@view: ' . $e->getMessage());
            return Response::json(['message' => 'Error al ver el registro: ' . $e->getMessage()], 500);
        }
    }
    
    public function add(Request $request)
    {
        try {
             $validatedData = $request->validate([
                'tr_fa_id'       => 'required|integer|exists:tbl_pla_factor,fa_id',
                'tr_pc_id'       => 'required|integer',
                'tr_per_id'      => 'required|integer|exists:tbl_persona,per_id',
                'tr_estado'      => 'required|string|max:3',
            ]);

        } catch (ValidationException $e) {
             return Response::json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            $maxId = DB::table('tbl_pla_transacciones')->max('tr_id') ?? 0;
            $nextId = $maxId + 1;
            
            $modeldata = [
                'tr_id' => $nextId,
                'tr_fa_id' => $validatedData['tr_fa_id'],
                'tr_pc_id' => $validatedData['tr_pc_id'],
                'tr_per_id' => $validatedData['tr_per_id'],
                'tr_estado' => $validatedData['tr_estado'],
                'tr_monto' => 0.00,
                'tr_fecha_inicio' => now(),
                'tr_fecha_creacion' => now(),
            ];

            $record = TblPlaTransacciones::create($modeldata);
            
            if (!$record) {
                throw new Exception('Error al crear la transacción.');
            }

            DB::commit();
            
            $record = TblPlaTransacciones::with(['persona', 'factor'])
                ->findOrFail($record->tr_id);
            
            return $this->respond($record); 

        } catch(Exception $e) {
            DB::rollback();
            Log::error('Error en TblPlaTransaccionesController@add: ' . $e->getMessage());
            return Response::json([
                'message' => 'Error al guardar la transacción: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function edit(Request $request, $rec_id = null)
    {
        try {
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblPlaTransacciones::findOrFail($rec_id);
            $record->update($modeldata);
            return Response::json($record);
        }
        catch(Exception $e) {
            Log::error('Error en TblPlaTransaccionesController@edit: ' . $e->getMessage());
            return Response::json(['message' => 'Error al editar el registro: ' . $e->getMessage()], 500);
        }
    }
    
    public function delete(Request $request, $rec_id = null)
    {
        try {
            $arr_id = explode(",", $rec_id);
            TblPlaTransacciones::whereIn("tr_id", $arr_id)->delete();
            return Response::json([
                "status" => "success",
                "message" => "Registros eliminados exitosamente"
            ]);
        }
        catch(Exception $e) {
            Log::error('Error en TblPlaTransaccionesController@delete: ' . $e->getMessage());
            return Response::json(['message' => 'Error al eliminar el registro: ' . $e->getMessage()], 500);
        }
    }

    public function getTransaccionesPersona($personaId)
    {
        try {
            $allowedFactorDescriptions = [
                'DESC.SINDICATO DE EMPLEADOS', 
                'DESC.SINDICATO DE OBREROS'
            ];

            $records = DB::table('tbl_pla_transacciones as t')
                ->join('tbl_pla_factor as f', 't.tr_fa_id', '=', 'f.fa_id')
                ->where('t.tr_per_id', $personaId)
                ->whereIn('f.fa_descripcion', $allowedFactorDescriptions)
                ->select([
                    't.*',
                    'f.fa_descripcion',
                    DB::raw('CAST(t.tr_monto AS FLOAT) as tr_monto') 
                ])
                ->orderBy('t.tr_fecha_creacion', 'desc')
                ->get();

            return $this->respond([
                'records' => $records,
                'total_records' => $records->count()
            ]);
        }
        catch(Exception $e) {
            Log::error('Error en TblPlaTransaccionesController@getTransaccionesPersona: ' . $e->getMessage());
            return Response::json([
                'message' => 'Error al obtener transacciones: ' . $e->getMessage()
            ], 500);
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

            return Response::json($query);
        } catch (Exception $e) {
            Log::error('Error en TblPlaTransaccionesController@getPersonaInfo: ' . $e->getMessage());
            return Response::json(['message' => 'Error al obtener información de la persona: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $maxId = DB::table('tbl_pla_transacciones')->max('tr_id') ?? 0;
            
            $validatedData = $request->validate([
                'tr_pc_id'       => 'required|integer',
                'tr_per_id'      => 'required|integer',
                'tr_fa_id'       => 'required|integer',
                'tr_fecha_fin'   => 'nullable|date',
                'tr_monto'       => 'required|numeric',
                'tr_estado'      => 'required|string|max:3'
            ]);
            
            $validatedData['tr_id'] = $maxId + 1;
            $validatedData['tr_usuario_creacion'] = auth()->user() ? auth()->user()->id : null;
            $validatedData['tr_fecha_creacion'] = now();
            $validatedData['tr_fecha_inicio'] = now();

            $transaccion = TblPlaTransacciones::create($validatedData);
            
            if (!$transaccion || !$transaccion->tr_id) {
                throw new Exception('Error al crear la transacción: No se pudo obtener el ID');
            }

            DB::commit();
            
            $transaccion = TblPlaTransacciones::with(['persona', 'factor'])
                ->findOrFail($transaccion->tr_id);
            
            return $this->respond($transaccion);
        }
        catch(ValidationException $e) {
            DB::rollback();
             return Response::json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }
        catch(Exception $e) {
            DB::rollback();
             Log::error('Error en TblPlaTransaccionesController@store: ' . $e->getMessage());
             return Response::json([
                'message' => 'Error al guardar la transacción: ' . $e->getMessage()
            ], 500);
        }
    }
    
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
            return Response::json(['message' => 'Error al guardar las cuotas: ' . $e->getMessage()], 500);
        }
    }
}
