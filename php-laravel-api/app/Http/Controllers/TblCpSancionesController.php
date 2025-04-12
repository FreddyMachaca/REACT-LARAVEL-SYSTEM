<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblCpSanciones;
use App\Models\TblCatalogo; 
use App\Models\TblPlaFactor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule; 
use Exception;

class TblCpSancionesController extends Controller
{
    const FACTOR_DESC_MINUTOS = 'SANCION POR MINUTOS DE ATRASO';
    const FACTOR_DESC_INASISTENCIA = 'SANCION POR INASISTENCIA';
    const FACTOR_DESC_ABANDONO = 'SANCION POR ABANDONO';
    const FACTOR_DESC_MARCADO_30 = 'SANCION POR MARCADO MAS DE 30 MINUTOS';
    const FACTOR_DESC_INTERNA = 'SANCION INTERNA';

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = TblCpSanciones::query()
                ->join('tbl_catalogo as cat', function ($join) {
                    $join->on('tbl_cp_sanciones.sa_tipo_sancion', '=', 'cat.cat_abreviacion')
                         ->where('cat.cat_tabla', '=', 'Tipo_Sancion'); 
                })
                ->leftJoin('tbl_persona as p', 'tbl_cp_sanciones.sa_per_id', '=', 'p.per_id') 
                ->select('tbl_cp_sanciones.*', 'cat.cat_descripcion as tipo_sancion_descripcion', 'p.per_nombres', 'p.per_ap_paterno', 'p.per_ap_materno'); // Seleccionar descripción

            if ($request->search) {
                $search = trim($request->search);
                 $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('tbl_cp_sanciones.sa_estado', 'LIKE', "%{$search}%")
                             ->orWhere('cat.cat_descripcion', 'ILIKE', "%{$search}%") 
                             ->orWhereHas('persona', function ($q) use ($search) {
                                 $q->where('per_nombres', 'ILIKE', "%{$search}%")
                                   ->orWhere('per_ap_paterno', 'ILIKE', "%{$search}%")
                                   ->orWhere('per_ap_materno', 'ILIKE', "%{$search}%")
                                   ->orWhere('per_num_doc', 'ILIKE', "%{$search}%");
                             });
                 });
            }

            if ($request->has('sa_per_id')) {
                $query->where('tbl_cp_sanciones.sa_per_id', $request->sa_per_id);
            }

            $orderby = $request->orderby ?? "tbl_cp_sanciones.sa_fecha_inicio"; 
            $ordertype = $request->ordertype ?? "desc";
            $query->orderBy($orderby, $ordertype);

            $limit = $request->limit ?? 10;
            $records = $query->paginate($limit);

            return $this->respond($records);

        } catch (Exception $e) {
            Log::error("Error listing sanciones: " . $e->getMessage());
            return Response::json(['message' => 'Error al listar las sanciones: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $maxFactorId = DB::table('tbl_pla_factor')->max('fa_id') ?? 0;
            $factorId = $maxFactorId + 1;

            $factorData = [
                'fa_id' => $factorId,
                'fa_descripcion' => $request->tipo_sancion_descripcion,
                'fa_tipo' => 'SANCION',
                'fa_estado' => 'V',
                'fa_signo' => '-',
                'fa_tipo_calculo' => 'MANUAL',
                'fa_valor' => 0,
                'fa_orden' => '1'
            ];

            DB::table('tbl_pla_factor')->insert($factorData);

            $maxId = DB::table('tbl_cp_sanciones')->max('sa_id') ?? 0;
            $nextId = $maxId + 1;

            $sancionData = [
                'sa_id' => $nextId,
                'sa_per_id' => $request->sa_per_id,
                'sa_factor' => $factorId,
                'sa_tipo_sancion' => $request->sa_tipo_sancion,
                'sa_estado' => $request->sa_estado,
                'sa_dias_sancion' => $request->sa_dias_sancion,
                'sa_minutos' => $request->sa_minutos,
                'sa_fecha_inicio' => $request->sa_fecha_inicio,
                'sa_fecha_fin' => $request->sa_fecha_fin,
            ];

            $sancion = DB::table('tbl_cp_sanciones')->insert($sancionData);

            DB::commit();

            $sancion = DB::table('tbl_cp_sanciones')
                ->join('tbl_catalogo as cat', function ($join) {
                    $join->on('tbl_cp_sanciones.sa_tipo_sancion', '=', 'cat.cat_abreviacion')
                         ->where('cat.cat_tabla', '=', 'Tipo_Sancion');
                })
                ->where('tbl_cp_sanciones.sa_id', $nextId)
                ->first();

            return $this->respond($sancion);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error storing sancion: " . $e->getMessage());
            return Response::json([
                'message' => 'Error al guardar la sanción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $sancion = TblCpSanciones::with(['persona'])
                ->join('tbl_catalogo as cat', function ($join) {
                    $join->on('tbl_cp_sanciones.sa_tipo_sancion', '=', 'cat.cat_abreviacion')
                         ->where('cat.cat_tabla', '=', 'Tipo_Sancion');
                })
                ->select('tbl_cp_sanciones.*', 'cat.cat_descripcion as tipo_sancion_descripcion')
                ->findOrFail($id);

            return $this->respond($sancion);

        } catch (Exception $e) {
            Log::error("Error showing sancion {$id}: " . $e->getMessage());
            return Response::json(['message' => 'Sanción no encontrada o error al obtenerla.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        Log::info('TblCpSancionesController@update: Received request for ID ' . $id, $request->all());
       try {
            $sancion = TblCpSanciones::findOrFail($id);
            Log::info('TblCpSancionesController@update: Found sanction record');

            if ($request->has('sa_factor')) {
                Log::info('TblCpSancionesController@update: Validating provided sa_factor');
                $request->validate(['sa_factor' => 'required|integer|exists:tbl_pla_factor,fa_id']);
                Log::info('TblCpSancionesController@update: Provided sa_factor validated');
            }

            $factorId = $request->input('sa_factor', $sancion->sa_factor);
            Log::info('TblCpSancionesController@update: Fetching factor with ID: ' . $factorId);
            $factor = TblPlaFactor::find($factorId);
             if (!$factor) {
                 Log::error('TblCpSancionesController@update: Factor not found for ID: ' . $factorId);
                 return Response::json(['message' => 'Factor de sanción no válido.'], 422);
             }
            $factorDesc = $factor->fa_descripcion;
            Log::info('TblCpSancionesController@update: Factor found: ' . $factorDesc);

            $isMinutesType = ($factorDesc === self::FACTOR_DESC_MINUTOS);

            $rules = [
                'sa_factor' => 'sometimes|required|integer|exists:tbl_pla_factor,fa_id',
                'sa_minutos' => ['sometimes', 'nullable', 'integer', 'min:0', Rule::requiredIf($isMinutesType)],
                'sa_fecha_inicio' => ['sometimes', 'nullable', 'date', Rule::requiredIf($isMinutesType)],
                'sa_fecha_fin' => ['sometimes', 'nullable', 'date', 'after_or_equal:sa_fecha_inicio', Rule::requiredIf($isMinutesType)],
                'sa_dias_sancion' => [
                    'sometimes', 'nullable', 'numeric', 'min:0.1',
                    Rule::requiredIf(in_array($factorDesc, [self::FACTOR_DESC_INASISTENCIA, self::FACTOR_DESC_ABANDONO, self::FACTOR_DESC_MARCADO_30, self::FACTOR_DESC_INTERNA]))
                ],
                'sa_dias_acumulados' => [
                    'sometimes', 'nullable', 'numeric', 'min:0',
                    Rule::requiredIf(in_array($factorDesc, [self::FACTOR_DESC_ABANDONO, self::FACTOR_DESC_MARCADO_30, self::FACTOR_DESC_INTERNA]))
                ],
                'sa_estado' => 'sometimes|nullable|string|max:3',
                'sa_fecha_sancion' => ['sometimes', 'nullable', 'date', Rule::requiredIf(!$isMinutesType)],
            ];

            Log::info('TblCpSancionesController@update: Starting validation');
            $validatedData = $request->validate($rules);
            Log::info('TblCpSancionesController@update: Validation passed', $validatedData);

            Log::info('TblCpSancionesController@update: Determining sa_tipo_sancion and adjusting data');
            if ($isMinutesType) {
                $validatedData['sa_tipo_sancion'] = 'SMA';
                $validatedData['sa_dias_sancion'] = null;
                $validatedData['sa_dias_acumulados'] = null;
                unset($validatedData['sa_fecha_sancion']);
                Log::info('TblCpSancionesController@update: Type set to SMA');
            } else {
                $validatedData['sa_tipo_sancion'] = 'SDA';
                $validatedData['sa_minutos'] = null;
                $validatedData['sa_fecha_fin'] = null;

                if (isset($validatedData['sa_fecha_sancion'])) {
                    $validatedData['sa_fecha_inicio'] = $validatedData['sa_fecha_sancion'];
                    unset($validatedData['sa_fecha_sancion']);
                    Log::info('TblCpSancionesController@update: sa_fecha_inicio set from sa_fecha_sancion');
                } elseif ($request->has('sa_fecha_sancion') && $validatedData['sa_fecha_sancion'] === null && !$isMinutesType) {
                     Log::warning('TblCpSancionesController@update: sa_fecha_sancion received as null for non-minutes type.');
                }


                if (!in_array($factorDesc, [self::FACTOR_DESC_ABANDONO, self::FACTOR_DESC_MARCADO_30, self::FACTOR_DESC_INTERNA])) {
                    $validatedData['sa_dias_acumulados'] = null;
                    Log::info('TblCpSancionesController@update: sa_dias_acumulados nullified');
                }
                Log::info('TblCpSancionesController@update: Type set to SDA');
            }

            Log::info('TblCpSancionesController@update: Final data before DB transaction', $validatedData);
            DB::beginTransaction();
            Log::info('TblCpSancionesController@update: Starting DB transaction');
            $sancion->update($validatedData);
            Log::info('TblCpSancionesController@update: Record updated');
            DB::commit();
            Log::info('TblCpSancionesController@update: DB transaction committed');

            Log::info('TblCpSancionesController@update: Reloading record with factor description');
             $sancion = TblCpSanciones::with(['persona'])
                ->join('tbl_pla_factor as factor', 'tbl_cp_sanciones.sa_factor', '=', 'factor.fa_id')
                ->select('tbl_cp_sanciones.*', 'factor.fa_descripcion as factor_descripcion')
                ->findOrFail($sancion->sa_id);
            Log::info('TblCpSancionesController@update: Record reloaded successfully');

            return $this->respond($sancion);

        } catch (ValidationException $e) {
            Log::error('TblCpSancionesController@update: Validation failed for ID ' . $id, ['errors' => $e->errors()]);
            return Response::json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("TblCpSancionesController@update: Error updating sancion {$id}: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine()); // Detailed log
            return Response::json(['message' => 'Error al actualizar la sanción: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $ids Comma-separated IDs
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($ids)
    {
        try {
            $arr_ids = explode(",", $ids);

            DB::beginTransaction();
            $deletedCount = TblCpSanciones::whereIn('sa_id', $arr_ids)->delete();
            DB::commit();

            if ($deletedCount > 0) {
                return Response::json(['message' => "{$deletedCount} sanción(es) eliminada(s) exitosamente."]);
            } else {
                return Response::json(['message' => 'No se encontraron sanciones para eliminar.'], 404);
            }

        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error deleting sanciones: " . $e->getMessage());
            return Response::json(['message' => 'Error al eliminar la(s) sanción(es): ' . $e->getMessage()], 500);
        }
    }
}
