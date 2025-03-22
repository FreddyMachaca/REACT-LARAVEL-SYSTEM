<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TblPersonaAddRequest;
use App\Http\Requests\TblPersonaEditRequest;
use App\Models\AsignacionHorario;
use Illuminate\Http\Request;
use Exception;

class AsignacionHorarioController extends Controller
{
    // Obtener todas las asignaciones de horario
    public function index()
    {
        return response()->json(AsignacionHorario::all(), 200);
    }

    // Crear una nueva asignación de horario
    public function store(Request $request)
    {
        //dd($request->all());
        $validated = $request->validate([
            'ah_per_id' => 'required|integer',
            'ah_tipo_horario' => 'required|integer',
            'ah_fecha_inicial' => 'required|date',
            'ah_fecha_final' => 'required|date',
            'ah_estado' => 'required|string|max:3',
            'selected_days' => 'required|array', // Días seleccionados en español
            'ingress1' => 'nullable|date_format:H:i',
            'exit1' => 'nullable|date_format:H:i',
            'ingress2' => 'nullable|date_format:H:i',
            'exit2' => 'nullable|date_format:H:i',
        ]);

        // Mapeo de días en español a los prefijos de columna
        $diasMap = [
            'lunes' => 'lun',
            'martes' => 'mar',
            'miércoles' => 'mie',
            'jueves' => 'jue',
            'viernes' => 'vie',
            'sábado' => 'sab',
            'domingo' => 'dom',
        ];

        // Datos base obligatorios
        $horarioData = [
            'ah_per_id' => $validated['ah_per_id'],
            'ah_tipo_horario' => $validated['ah_tipo_horario'],
            'ah_fecha_inicial' => $validated['ah_fecha_inicial'],
            'ah_fecha_final' => $validated['ah_fecha_final'],
            'ah_estado' => 'V',
        ];

        // Asignar valores solo si no son NULL
        foreach ($validated['selected_days'] as $dia) {
            if (isset($diasMap[$dia])) {
                $sigla = $diasMap[$dia];

                if (!is_null($validated['ingress1'])) {
                    $horarioData["ah_{$sigla}_ing1"] = $validated['ingress1'];
                }
                if (!is_null($validated['exit1'])) {
                    $horarioData["ah_{$sigla}_sal1"] = $validated['exit1'];
                }
                if (!is_null($validated['ingress2'])) {
                    $horarioData["ah_{$sigla}_ing2"] = $validated['ingress2'];
                }
                if (!is_null($validated['exit2'])) {
                    $horarioData["ah_{$sigla}_sal2"] = $validated['exit2'];
                }
            }
        }
        // Guardar en la base de datos
        $asignacionHorario = AsignacionHorario::create($horarioData);
        return response()->json(['message' => 'Horario asignado correctamente', 'data' => $asignacionHorario], 201);
    }

    // Obtener una asignación de horario específica
    public function show($id_per)
    {
        $records = AsignacionHorario::where('ah_per_id', $id_per)
            ->with(['tipoHorario:cat_id,cat_descripcion'])
            ->get();

        if ($records->isEmpty()) {
            return response()->json(['message' => 'No se encontraron horarios'], 404);
        }

        return response()->json($records, 200);
    }

    // Actualizar una asignación de horario
    public function update(Request $request, $id)
    {
        $asignacionHorario = AsignacionHorario::find($id);

        if (!$asignacionHorario) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        $asignacionHorario->update($request->all());

        return response()->json(['message' => 'Horario actualizado correctamente', 'data' => $asignacionHorario], 200);
    }
    // Eliminar una asignación de horario
    public function destroy($id)
    {
        $asignacionHorario = AsignacionHorario::find($id);

        if (!$asignacionHorario) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        $asignacionHorario->delete();

        return response()->json(['message' => 'Horario eliminado correctamente'], 200);
    }
}
