<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\Controller;
use App\Models\TblPlaTransacciones;
use App\Models\TblPlaTransaccionesCuotas;
use App\Models\TblPlaFactor;
use Illuminate\Http\Request;
use Exception;
use DB;
use Illuminate\Validation\ValidationException;

class TblPlaPagosServiciosController extends Controller
{
    public function getRepSalarios()
    {
        try {
            $records = DB::table('tbl_catalogo')
                ->where('cat_tabla', 'rep_salarios')
                ->where('cat_estado', 'V')
                ->select(['cat_id', 'cat_descripcion'])
                ->get();
            
            return $this->respond($records);
        } catch(Exception $e) {
            return Response::json([
                'message' => 'Error al obtener los salarios: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            // Validar datos de entrada
            try {
                $validatedData = $request->validate([
                    'per_id' => 'required|integer',  
                    'tipo_monto' => 'required|in:unico,cuotas',
                    'monto' => 'required|numeric|min:0',
                    'descripcion' => 'required|string',
                    'monto_cuota' => 'required_if:tipo_monto,cuotas|nullable|numeric|min:0' 
                ]);
            } catch (ValidationException $e) {
                DB::rollback();
                return Response::json([
                    'message' => 'Error de validación',
                    'errors' => $e->errors()
                ], 422);
            }

            // Obtener el ID máximo de la tabla tbl_pla_factor y calcular el siguiente ID
            $maxFactorId = DB::table('tbl_pla_factor')->max('fa_id') ?? 0;
            $nextFactorId = $maxFactorId + 1;

            $factor = TblPlaFactor::create([
                'fa_id' => $nextFactorId,
                'fa_descripcion' => $validatedData['descripcion'],
                'fa_tipo' => 'SERVICIO',
                'fa_estado' => 'V'
            ]);

            $maxTransaccionId = DB::table('tbl_pla_transacciones')->max('tr_id') ?? 0;
            $nextTransaccionId = $maxTransaccionId + 1;
            
            $transaccion = TblPlaTransacciones::create([
                'tr_id' => $nextTransaccionId, 
                'tr_pc_id' => 1, 
                'tr_per_id' => $validatedData['per_id'],
                'tr_fa_id' => $factor->fa_id,
                'tr_fecha_inicio' => now(),
                'tr_monto' => $validatedData['monto'],
                'tr_estado' => 'V',
                'tr_fecha_creacion' => now()
            ]);

            if ($validatedData['tipo_monto'] === 'cuotas' && isset($validatedData['monto_cuota'])) {
                TblPlaTransaccionesCuotas::create([
                    'tc_tr_id' => $transaccion->tr_id,
                    'tc_cant_cuotas' => 1,
                    'tc_monto' => $validatedData['monto_cuota'],
                    'tc_estado' => 'V'
                ]);
            }

            DB::commit();
            return $this->respond([
                'status' => 'success',
                'message' => 'Pago registrado correctamente',
                'data' => $transaccion
            ]);

        } catch(Exception $e) {
            DB::rollback();
            \Log::error('Error en TblPlaPagosServiciosController@store: ' . $e->getMessage()); // Loguear el error
            return Response::json([
                'message' => 'Error al registrar el pago: ' . $e->getMessage(),
            ], 500);
        }
    }
}
