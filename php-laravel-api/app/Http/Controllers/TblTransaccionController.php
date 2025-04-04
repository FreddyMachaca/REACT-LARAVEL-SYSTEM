<?php

namespace App\Http\Controllers;

use App\Models\TblTransaccion;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TblTransaccionController extends Controller
{
    // Listar todas las transacciones
    public function index()
    {
        // Ejemplo: podrías filtrar solo las de "horas extras" si lo deseas
        $transacciones = TblTransaccion::all();
        return response()->json($transacciones);
    }

    // Crear nueva transacción
    public function store(Request $request)
    {
        // Validación mínima, ajusta según tus reglas
        $validatedData = $request->validate([
            'tr_pc_id'       => 'required|integer',
            'tr_per_id'      => 'required|integer',
            'tr_fa_id'       => 'required|integer',
            'tr_fecha_inicio'=> 'required|date',
            'tr_fecha_fin'   => 'nullable|date',
            'tr_monto'       => 'required|numeric',
            'tr_estado'      => 'required|string|max:3'
        ]);

        // Completar campos de auditoría si aplica
        $validatedData['tr_usuario_creacion'] = auth()->user() ? auth()->user()->id : null;
        $validatedData['tr_fecha_creacion']   = Carbon::now();

        $transaccion = TblTransaccion::create($validatedData);
        return response()->json($transaccion, 201);
    }

    // Mostrar una transacción por ID
    public function show($id)
    {
        $transaccion = TblTransaccion::findOrFail($id);
        return response()->json($transaccion);
    }

    // Actualizar transacción
    public function update(Request $request, $id)
    {
        $transaccion = TblTransaccion::findOrFail($id);

        $validatedData = $request->validate([
            'tr_pc_id'       => 'required|integer',
            'tr_per_id'      => 'required|integer',
            'tr_fa_id'       => 'required|integer',
            'tr_fecha_inicio'=> 'required|date',
            'tr_fecha_fin'   => 'nullable|date',
            'tr_monto'       => 'required|numeric',
            'tr_estado'      => 'required|string|max:3'
        ]);

        $transaccion->update($validatedData);
        return response()->json($transaccion);
    }

    // Eliminar transacción
    public function destroy($id)
    {
        $transaccion = TblTransaccion::findOrFail($id);
        $transaccion->delete();
        return response()->json(null, 204);
    }
}
