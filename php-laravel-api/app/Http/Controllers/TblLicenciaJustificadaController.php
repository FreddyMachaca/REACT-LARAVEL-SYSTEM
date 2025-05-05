<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TblLicenciaJustificada;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;
//use DB;

class TblLicenciaJustificadaController extends Controller
{
    public function buscar(Request $request): JsonResponse
    {
        // Simulación de datos de licencias (se pueden obtener de la base de datos)
        $licencias = [
            [
                "papeleta" => "265124",
                "codigo" => "10692",
                "funcionario" => "AGUILAR CYNTHIA DORIS",
                "ci" => "349481",
                "tipoLicencia" => "COMISION",
                "fechaLicencia" => "23/02/2021 - 23/02/2021",
                "horaLicencia" => "15:30 - 16:00",
                "estado" => "PENDIENTE"
            ],
            [
                "papeleta" => "265229",
                "codigo" => "12383",
                "funcionario" => "ALANOCA JAIME ENRIQUE",
                "ci" => "429738",
                "tipoLicencia" => "COMISION",
                "fechaLicencia" => "26/02/2021 - 26/02/2021",
                "horaLicencia" => "07:30 - 16:30",
                "estado" => "PENDIENTE"
            ],
            [
                "papeleta" => "2671707",
                "codigo" => "19100",
                "funcionario" => "ALVAREZ GENA VERONICA",
                "ci" => "6172585",
                "tipoLicencia" => "COMISION",
                "fechaLicencia" => "22/03/2021 - 22/03/2021",
                "horaLicencia" => "08:00 - 10:00",
                "estado" => "PENDIENTE"
            ],
            [
                "papeleta" => "269414",
                "codigo" => "19100",
                "funcionario" => "ALVAREZ GENA VERONICA",
                "ci" => "6172585",
                "tipoLicencia" => "COMISION",
                "fechaLicencia" => "19/03/2021 - 19/03/2021",
                "horaLicencia" => "08:00 - 10:00",
                "estado" => "PENDIENTE"
            ],
            [
                "papeleta" => "269416",
                "codigo" => "19100",
                "funcionario" => "ALVAREZ GENA VERONICA",
                "ci" => "6172585",
                "tipoLicencia" => "COMISION",
                "fechaLicencia" => "15/03/2021 - 15/03/2021",
                "horaLicencia" => "14:30 - 16:00",
                "estado" => "PENDIENTE"
            ],
            [
                "papeleta" => "269418",
                "codigo" => "19100",
                "funcionario" => "ALVAREZ GENA VERONICA",
                "ci" => "6172585",
                "tipoLicencia" => "COMISION",
                "fechaLicencia" => "15/03/2021 - 15/03/2021",
                "horaLicencia" => "08:00 - 10:00",
                "estado" => "PENDIENTE"
            ]
        ];

        return response()->json($licencias);
    }

    public function obtenerBoleta($codigoBoleta)
    {
        $boleta = TblLicenciaJustificada::with(['tipoLicencia', 'persona'])
            ->where('lj_id', $codigoBoleta)
            ->first(); // Solo un registro

        if (!$boleta) {
            return response()->json([
                'cat_descripcion' => 'COMISION',
                'per_nombres' => 'CINTHIA',
                'per_ap_materno' => 'AGUILAR',
                'per_ap_paterno' => 'DORIS',
                'lj_fecha_inicial' => '23/02/2021',
                'lj_fecha_final' => '23/02/2021',
                'lj_hora_salida' => '15:30',
                'lj_hora_retorno' => '16:00',
                'lj_motivo' => 'INSPECCION',
                'lj_lugar' => 'PLAN 2 ALTO CIUDADELA',
                'lj_per_id_autoriza' => 'JORGE DIAZ HERRERA',
                'per_id' => '10692',
                'per_num_doc' => '349481',
                'lj_id' => '265124',
                'message' => 'Boleta no encontrada' // Mensaje de aviso
            ], 200);
        }

        return response()->json([
            'cat_descripcion' => $boleta->tipoLicencia->cat_descripcion ?? 'No especificado',
            'per_nombres' => $boleta->persona->per_nombres,
            'per_ap_materno' => $boleta->persona->per_ap_materno,
            'per_ap_paterno' => $boleta->persona->per_ap_paterno,
            'lj_fecha_inicial' => $boleta->lj_fecha_inicial,
            'lj_fecha_final' => $boleta->lj_fecha_final,
            'lj_hora_salida' => $boleta->lj_hora_salida,
            'lj_hora_retorno' => $boleta->lj_hora_retorno,
            'lj_motivo' => $boleta->lj_motivo,
            'lj_lugar' => $boleta->lj_lugar,
            'lj_per_id_autoriza' => $boleta->lj_per_id_autoriza,
            'per_id' => $boleta->persona->per_id,
            'per_num_doc' => $boleta->persona->per_num_doc,
            'lj_id' => $boleta->lj_id
        ]);
    }
    public function obtenerPersona($personaId)
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

                return response()->json($query);


        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos de la persona',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function search(Request $request)
    {
        $query = TblLicenciaJustificada::with(['persona', 'tipoLicencia']);

        // Filtrar por ID de licencia
        if ($request->has('id_per') && !empty($request->id_per)) {
            $query->where('lj_per_id', $request->id_per);
        }

        // Filtrar por número de documento (CI) con coincidencias parciales
        if ($request->has('num_ci') && !empty($request->num_ci)) {
            $query->whereHas('persona', function ($q) use ($request) {
                $q->where('per_num_doc', 'like', "%{$request->num_ci}%");
            });
        }

        // Filtrar por nombre con coincidencias parciales
        if ($request->has('nombre') && !empty($request->nombre)) {
            $query->whereHas('persona', function ($q) use ($request) {
                $q->where('per_nombres', 'like', "%{$request->nombre}%");
            });
        }

        // Filtrar por apellido paterno con coincidencias parciales
        if ($request->has('paterno') && !empty($request->paterno)) {
            $query->whereHas('persona', function ($q) use ($request) {
                $q->where('per_ap_paterno', 'like', "%{$request->paterno}%");
            });
        }

        // Filtrar por apellido materno con coincidencias parciales
        if ($request->has('materno') && !empty($request->materno)) {
            $query->whereHas('persona', function ($q) use ($request) {
                $q->where('per_ap_materno', 'like', "%{$request->materno}%");
            });
        }

        // Filtrar por número de licencia exacto
        if ($request->has('num_licencia') && !empty($request->num_licencia)) {
            $query->where('lj_id', $request->num_licencia);
        }

        // Obtener resultados paginados (10 por página)
        $licencias = $query->get();

        return response()->json($licencias);
    }
    /**
     * Obtener todas las licencias justificadas.
     */
    public function index(): JsonResponse
    {
        $licencias = TblLicenciaJustificada::all();
        return response()->json($licencias);
    }

    /**
     * Obtener una licencia justificada por su ID.
     */
    public function show($id): JsonResponse
    {
        $licencia = TblLicenciaJustificada::find($id);

        if (!$licencia) {
            return response()->json(['message' => 'Licencia no encontrada'], 404);
        }

        return response()->json($licencia);
    }

    /**
     * Crear una nueva licencia justificada.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'lj_per_id' => 'required|integer',
            'lj_tipo_licencia' => 'nullable|integer',
            'lj_fecha_inicial' => 'nullable|date',
            'lj_fecha_final' => 'nullable|date',
            'lj_hora_salida' => 'nullable|date_format:H:i',
            'lj_hora_retorno' => 'nullable|date_format:H:i',
            'lj_motivo' => 'nullable|string|max:200',
            'lj_lugar' => 'nullable|string|max:200',
            'lj_per_id_autoriza' => 'nullable|integer',
        ]);

        $licenciaData = $request->all();

        $licenciaData['lj_fecha_emision'] = now();
        $licenciaData['lj_estado'] = 'P';

        $licencia = TblLicenciaJustificada::create($licenciaData);

        return response()->json(['message' => 'Licencia creada con éxito', 'data' => $licencia], 201);
    }
    /**
     * Actualizar una licencia justificada.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $licenciaData = TblLicenciaJustificada::find($id);

        if (!$licenciaData) {
            return response()->json(['message' => 'Licencia no encontrada'], 404);
        }

        $request->validate([
            'lj_per_id' => 'required|integer',
            'lj_tipo_licencia' => 'nullable|integer',
            'lj_fecha_inicial' => 'nullable|date',
            'lj_fecha_final' => 'nullable|date',
            'lj_hora_salida' => 'nullable|date_format:H:i',
            'lj_hora_retorno' => 'nullable|date_format:H:i',
            'lj_motivo' => 'nullable|string|max:200',
            'lj_lugar' => 'nullable|string|max:200',
            'lj_per_id_autoriza' => 'nullable|string|max:200',
        ]);
        $licenciaData['lj_fecha_emision'] = now();
        $licenciaData['lj_estado'] = 'V';
        $licencia = TblLicenciaJustificada::update($licenciaData->all());
       // $licencia->update($request->all());
        return response()->json(['message' => 'Licencia actualizada con éxito', 'data' => $licencia]);
    }

    /**
     * Eliminar una licencia justificada.
     */
    public function destroy($id): JsonResponse
    {
        $licencia = TblLicenciaJustificada::find($id);

        if (!$licencia) {
            return response()->json(['message' => 'Licencia no encontrada'], 404);
        }

        $licencia->delete();

        return response()->json(['message' => 'Licencia eliminada con éxito']);
    }

    public function validate_permission($id): JsonResponse
    {
        $licencia = TblLicenciaJustificada::find($id);

        if (!$licencia) {
            return response()->json(['message' => 'Licencia no encontrada'], 404);
        }

        // Actualizar el campo lj_estado
        $licencia->lj_estado = 'V';
        $licencia->save(); // Guardar en la base de datos

        return response()->json(['message' => 'Licencia actualizada con éxito', 'data' => $licencia]);
    }
 /**
     * metodos de autorizacion de licencias
     * @return JsonResponse|mixed
     */
    public function getPendingAuthorizations($autorizaId)
    {
        $query = DB::query()
            ->select([
                'tbl_persona.per_id',
                'tbl_persona.per_nombres',
                'tbl_persona.per_ap_paterno',
                'tbl_persona.per_ap_materno',
                'tbl_cp_licencia_justificada.lj_id',
                'tbl_cp_licencia_justificada.lj_tipo_licencia',
                'tbl_catalogo.cat_descripcion',
                'tbl_cp_licencia_justificada.lj_fecha_inicial',
                'tbl_cp_licencia_justificada.lj_fecha_final',
                'tbl_cp_licencia_justificada.lj_hora_salida',
                'tbl_cp_licencia_justificada.lj_hora_retorno',
                'tbl_cp_licencia_justificada.lj_motivo',
                'tbl_cp_licencia_justificada.lj_per_id_autoriza'
            ])
            ->from('tbl_cp_licencia_justificada')
            ->join('tbl_persona', 'tbl_cp_licencia_justificada.lj_per_id', '=', 'tbl_persona.per_id')
            ->join('tbl_catalogo', 'tbl_cp_licencia_justificada.lj_tipo_licencia', '=', 'tbl_catalogo.cat_id')
            ->where('tbl_cp_licencia_justificada.lj_per_id_autoriza', $autorizaId)
            ->where('tbl_cp_licencia_justificada.lj_estado', 'P');

        $results = $query->get();

        return response()->json([
            'success' => true,
            'data' => $results,
            'count' => $results->count()
        ]);
    }
    public function approveAuthorization(Request $request, $id)
    {
        try {

            Log::info("Authorization {$id} approved by user {$request->user()->id}");

            return response()->json(['success' => true, 'message' => 'Authorization approved successfully']);
        } catch (\Exception $e) {
            Log::error('Error approving authorization: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to approve authorization'], 500);
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

    public function obtenerLicenciasPorAutorizador(int $autorizaId): JsonResponse
{
    $licencias = DB::table('tbl_cp_licencia_justificada')
        ->join('tbl_persona', 'tbl_cp_licencia_justificada.lj_per_id', '=', 'tbl_persona.per_id')
        ->join('tbl_catalogo', 'tbl_cp_licencia_justificada.lj_tipo_licencia', '=', 'tbl_catalogo.cat_id')
        ->select(
            'tbl_persona.per_id',
            'tbl_persona.per_nombres',
            'tbl_persona.per_ap_paterno',
            'tbl_persona.per_ap_materno',
            'tbl_cp_licencia_justificada.lj_tipo_licencia',
            'tbl_catalogo.cat_descripcion',
            'tbl_cp_licencia_justificada.lj_id',
            'tbl_cp_licencia_justificada.lj_fecha_inicial',
            'tbl_cp_licencia_justificada.lj_fecha_final',
            'tbl_cp_licencia_justificada.lj_hora_salida',
            'tbl_cp_licencia_justificada.lj_hora_retorno',
            'tbl_cp_licencia_justificada.lj_motivo',
            'tbl_cp_licencia_justificada.lj_per_id_autoriza'
        )
        ->where('tbl_cp_licencia_justificada.lj_per_id_autoriza', $autorizaId)
        ->get();

    return response()->json($licencias);
}
}
