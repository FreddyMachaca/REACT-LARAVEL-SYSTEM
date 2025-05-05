<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TblUbicacionFisica;

class TblUbicacionFisicaController extends Controller
{
    // Obtener todas las ubicaciones físicas
    public function index()
    {
        return response()->json(TblUbicacionFisica::all(), 200);
    }
    public function buscar_reg($per_id)
    {
        $ubicacion = TblUbicacionFisica::where('uf_per_id', $per_id)
            ->with(['persona' => function ($query) {
                $query->selectRaw('per_id, per_nombres || \' \' || per_ap_paterno || \' \' || per_ap_materno as nombres');
            }])
            ->get();

        return response()->json($ubicacion, 200);
    }
    public function getUbicacionFisica($id)
    {
        // Realizar la consulta usando Eloquent con la relación
        $resultados = TblUbicacionFisica::with('catalogo:cat_id,cat_descripcion')
            ->where('uf_per_id', $id)
            ->get(['uf_id', 'uf_fecha_inicio', 'uf_estado', 'uf_edificio']);

        // Verificar si se encontraron registros
        if ($resultados->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron ubicaciones físicas para el ID proporcionado.',
            ], 404);
        }

        // Formatear la respuesta
        $data = $resultados->map(function ($ubicacion) {
            return [
                'uf_id' => $ubicacion->uf_id,
                'uf_fecha_inicio' => $ubicacion->uf_fecha_inicio,
                'uf_estado' => $ubicacion->uf_estado,
                'cat_descripcion' => $ubicacion->catalogo->cat_descripcion,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
    // Obtener una ubicación física por ID
    public function show($id)
    {
        $ubicacion = TblUbicacionFisica::find($id);
        if (!$ubicacion) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }
        return response()->json($ubicacion, 200);
    }

    // Crear una nueva ubicación física
    public function store(Request $request)
    {
        //dd($request);
        $request->validate([
            'uf_per_id' => 'required|integer',
            'uf_edificio' => 'required|integer',
            'uf_piso' => 'nullable|string|max:10',
            'uf_bloque' => 'nullable|string|max:10',
            'uf_telefono_interno' => 'nullable|integer',
            'uf_telefono_oficina' => 'nullable|integer',
            'uf_nombre_oficina' => 'nullable|string|max:100',
            'uf_fecha_inicio' => 'required|date'
        ]);
        $ubicacionData = $request->all();

        $ubicacionData['uf_fecha_final'] = now()->addDays(7);;
        $ubicacionData['uf_estado'] = 'V';

        $ubicacion = TblUbicacionFisica::create($ubicacionData);

        return response()->json(['message' => 'Ubicación creada con éxito', 'data' => $ubicacion], 201);
    }

    // Actualizar una ubicación física
    public function update(Request $request, $id)
    {
        $ubicacion = TblUbicacionFisica::find($id);
        if (!$ubicacion) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }

        $request->validate([
            'uf_per_id' => 'integer',
            'uf_edificio' => 'integer',
            'uf_piso' => 'nullable|string|max:10',
            'uf_bloque' => 'nullable|string|max:10',
            'uf_telefono_interno' => 'nullable|integer',
            'uf_telefono_oficina' => 'nullable|integer',
            'uf_nombre_oficina' => 'nullable|string|max:100',
            'uf_fecha_inicio' => 'date',
            'uf_fecha_final' => 'nullable|date',
            'uf_estado' => 'string|max:3'
        ]);

        $ubicacion->update($request->all());

        return response()->json(['message' => 'Ubicación actualizada con éxito', 'data' => $ubicacion], 200);
    }

    // Eliminar una ubicación física
    public function destroy($id)
    {
        $ubicacion = TblUbicacionFisica::find($id);
        if (!$ubicacion) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }

        $ubicacion->delete();

        return response()->json(['message' => 'Ubicación eliminada con éxito'], 200);
    }
}
