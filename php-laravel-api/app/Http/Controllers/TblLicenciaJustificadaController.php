<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TblLicenciaJustificada;
use Illuminate\Http\JsonResponse;

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
    public function obtenerPersona($tipo){
        return response()->json([
            'avatar'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRezYSyEzcasjaNDM7MW1642vvo8e8TSEdoKA&s',
            'alta' => '01/01/2021',
            'baja' => '31/12/2021',
            'ubi_admin' => 'PROGRAMA BARRIOS Y COMUNIDADES DE VERDAD (Eventual I)',
            'ubi_prog' => 'GESTION ADMINISTRATIVA PROGRAMA BARRIOS Y COMUNIDADES DE VERDAD',
            'item' => 'BV-10',

            'message' => 'Boleta no encontrada' // Mensaje de aviso
        ], 200);
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
            'lj_per_id_autoriza' => 'nullable|string|max:200',
        ]);

        $licenciaData = $request->all();

        $licenciaData['lj_fecha_emision'] = now();
        $licenciaData['lj_estado'] = 'V';

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

}
