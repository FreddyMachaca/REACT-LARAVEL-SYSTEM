<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Exception;
use Carbon\Carbon;

class AsistenciaController extends Controller
{
    /**
     * Ejecuta el procedimiento almacenado sp_generar_asistencia.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generarAsistencia(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date_format:Y-m-d',
            'fecha_fin' => 'required|date_format:Y-m-d|after_or_equal:fecha_inicio',
        ]);

        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        // Obtener el usuario
        // $usuario = Auth::user() ? Auth::user()->username : 'sistema';
        $usuario = 'api_user';

        Log::info("Iniciando generación de asistencia para el período: $fechaInicio a $fechaFin por usuario: $usuario");

        try {
            // Ejecutar el procedimiento almacenado
            DB::statement('CALL sp_generar_asistencia(?, ?, ?)', [
                $fechaInicio,
                $fechaFin,
                $usuario
            ]);

            Log::info("Procedimiento sp_generar_asistencia ejecutado exitosamente para el período: $fechaInicio a $fechaFin");

            return response()->json(['message' => 'Proceso de generación de asistencia completado exitosamente.'], 200);

        } catch (Exception $e) {
            Log::error("Error al ejecutar sp_generar_asistencia: " . $e->getMessage());
            return response()->json(['message' => 'Error al generar la asistencia: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene los datos de asistencia y sanciones generados para un rango de fechas.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAsistenciaData(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date_format:Y-m-d',
            'fecha_fin' => 'required|date_format:Y-m-d|after_or_equal:fecha_inicio',
            //'per_id' => 'sometimes|integer|exists:tbl_persona,per_id'
        ]);

        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        $perId = $request->input('per_id');

        Log::info("Buscando datos de asistencia para el período: $fechaInicio a $fechaFin" . ($perId ? " para per_id: $perId" : ""));

        try {
            // Consulta para Asistencia
            $asistenciaQuery = DB::table('tbl_cp_asistencia as a')
                ->join('tbl_persona as p', 'a.att_per_id', '=', 'p.per_id')
                ->leftJoin('tbl_cp_licencia_justificada as lj1', 'a.att_id_lic_ing1', '=', 'lj1.lj_id')
                ->leftJoin('tbl_catalogo as cat1', function ($join) {
                    $join->on('lj1.lj_tipo_licencia', '=', 'cat1.cat_id')
                         ->where('cat1.cat_tabla', '=', 'Tipo_Licencia');
                })
                // Join para licencia en att_id_lic_sal1
                ->leftJoin('tbl_cp_licencia_justificada as lj2', 'a.att_id_lic_sal1', '=', 'lj2.lj_id')
                ->leftJoin('tbl_catalogo as cat2', function ($join) {
                    $join->on('lj2.lj_tipo_licencia', '=', 'cat2.cat_id')
                         ->where('cat2.cat_tabla', '=', 'Tipo_Licencia');
                })
                // Join para licencia en att_id_lic_ing2
                ->leftJoin('tbl_cp_licencia_justificada as lj3', 'a.att_id_lic_ing2', '=', 'lj3.lj_id')
                ->leftJoin('tbl_catalogo as cat3', function ($join) {
                    $join->on('lj3.lj_tipo_licencia', '=', 'cat3.cat_id')
                         ->where('cat3.cat_tabla', '=', 'Tipo_Licencia');
                })
                // Join para licencia en att_id_lic_sal2
                ->leftJoin('tbl_cp_licencia_justificada as lj4', 'a.att_id_lic_sal2', '=', 'lj4.lj_id')
                ->leftJoin('tbl_catalogo as cat4', function ($join) {
                    $join->on('lj4.lj_tipo_licencia', '=', 'cat4.cat_id')
                         ->where('cat4.cat_tabla', '=', 'Tipo_Licencia');
                })
                // Join para Horario Especial
                ->leftJoin('tbl_cp_horario_especial as he', function ($join) {
                    $join->on('a.att_per_id', '=', 'he.he_per_id')
                         ->on('a.att_fecha', '=', 'he.he_fecha')
                         ->where('he.he_estado', '=', 'V');
                })
                ->select(
                    'a.att_id',
                    'a.att_fecha',
                    'a.att_dia',
                    DB::raw("CONCAT(p.per_nombres, ' ', p.per_ap_paterno, ' ', p.per_ap_materno) as nombre_completo"),
                    'p.per_num_doc',
                    'a.att_ing1',
                    'a.att_sal1',
                    'a.att_ing2',
                    'a.att_sal2',
                    'a.att_min_atraso',
                    'a.att_min_atraso_mayor30',
                    'a.att_min_salio_antes',
                    'a.att_min_extras',
                    'a.att_tipo_observado',
                    DB::raw('COALESCE(cat1.cat_descripcion, cat2.cat_descripcion, cat3.cat_descripcion, cat4.cat_descripcion) as licencia_descripcion'),
                    'he.he_descripcion as horario_especial_descripcion'
                )
                ->whereBetween('a.att_fecha', [$fechaInicio, $fechaFin])
                ->orderBy('a.att_fecha', 'asc')
                ->orderBy('nombre_completo', 'asc');

            if ($perId) {
                $asistenciaQuery->where('a.att_per_id', $perId);
            }

            $asistenciaData = $asistenciaQuery->get();

            // Consulta para Sanciones
            $sancionesQuery = DB::table('tbl_cp_sanciones as s')
                ->join('tbl_persona as p', 's.sa_per_id', '=', 'p.per_id')
                ->join('tbl_pla_factor as f', 's.sa_factor', '=', 'f.fa_id')
                ->select(
                    's.sa_id',
                    's.sa_fecha_inicio as fecha_sancion',
                    DB::raw("CONCAT(p.per_nombres, ' ', p.per_ap_paterno, ' ', p.per_ap_materno) as nombre_completo"),
                    'p.per_num_doc',
                    'f.fa_descripcion as factor_descripcion',
                    's.sa_minutos',
                    's.sa_tipo_sancion',
                    's.sa_dias_sancion'
                )
                ->whereBetween('s.sa_fecha_inicio', [$fechaInicio, $fechaFin])
                ->where('s.sa_estado', 'V')
                ->orderBy('s.sa_fecha_inicio', 'asc')
                ->orderBy('nombre_completo', 'asc');

            if ($perId) {
                $sancionesQuery->where('s.sa_per_id', $perId);
            }

            $sancionesData = $sancionesQuery->get();

            $personasConAsistencia = DB::table('tbl_cp_asistencia as a')
                ->join('tbl_persona as p', 'a.att_per_id', '=', 'p.per_id')
                ->select('p.per_id', DB::raw("CONCAT(p.per_nombres, ' ', p.per_ap_paterno, ' ', p.per_ap_materno) as nombre_completo"))
                ->whereBetween('a.att_fecha', [$fechaInicio, $fechaFin])
                ->distinct()
                ->orderBy('nombre_completo')
                ->get();

            Log::info("Datos encontrados - Asistencia: " . $asistenciaData->count() . ", Sanciones: " . $sancionesData->count());

            return response()->json([
                'asistencia' => $asistenciaData,
                'sanciones' => $sancionesData, 
                'personas' => $personasConAsistencia,
            ], 200);

        } catch (Exception $e) {
            Log::error("Error al obtener datos de asistencia/sanciones: " . $e->getMessage());
            return response()->json(['message' => 'Error al obtener los datos generados: ' . $e->getMessage()], 500);
        }
    }

    public function getReporteAsistecia(Request $request){
        $personaId = $request->query('persona_id'); 
        $fechaInicio = $request->query('fecha_inicio');
        $fechaFin = $request->query('fecha_fin');

        try {

            $requestFake = new Request();
            $tblPersona = new TblPersonaController();
            $personaData = $tblPersona->index($requestFake, 'per_id', $personaId);

            $reporte = DB::select(
                "SELECT * FROM fn_l_reporte_asistencia(?, ?, ?);",
                [$personaId, $fechaInicio, $fechaFin]
            );

            $reporte = collect($reporte)->map(function ($item) {
                $manana = 0;
                $tarde = 0;

                $manana_esp = 0;
                $tarde_esp = 0;

                if ($item->marca_entrada_manana && $item->marca_salida_manana) {
                    $manana = Carbon::parse($item->marca_salida_manana)->diffInMinutes(Carbon::parse($item->marca_entrada_manana));
                }

                if ($item->marca_entrada_tarde && $item->marca_salida_tarde) {
                    $tarde = Carbon::parse($item->marca_salida_tarde)->diffInMinutes(Carbon::parse($item->marca_entrada_tarde));
                }

                if(!$item->horario_ing_tarde){
                    $item->marca_entrada_tarde = 'NO LABORABLE';
                    $item->marca_salida_tarde = 'NO LABORABLE';
                } else {
                    $manana_esp = Carbon::parse($item->horario_sal_manana)->diffInMinutes(Carbon::parse($item->horario_ing_manana));
                }

                if(!$item->horario_ing_manana){
                    $item->marca_entrada_manana = 'NO LABORABLE';
                    $item->marca_salida_manana = 'NO LABORABLE';
                } else {
                    $tarde_esp = Carbon::parse($item->horario_sal_tarde)->diffInMinutes(Carbon::parse($item->horario_ing_tarde));
                }

                $item->min_trabajo_esp = $manana_esp + $tarde_esp;
                $item->min_trabajo = $manana + $tarde;

                return $item;
            });

            return response()->json([
                'reporte' => $reporte,
                'persona' => $personaData
            ]);

        } catch (Exception $e) {
            Log::error("Error al ejecutar fn_l_reporte_asistencia: " . $e->getMessage());
            return response()->json(['message' => 'Error al generar reporte de asistencia: ' . $e->getMessage()], 500);
        }
    }
}
