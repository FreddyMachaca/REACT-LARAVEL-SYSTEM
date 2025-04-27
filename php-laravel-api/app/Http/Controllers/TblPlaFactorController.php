<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblPlaFactor;
use Illuminate\Http\Request;
use Exception;
use DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log; 

class TblPlaFactorController extends Controller
{
    public function index(Request $request, $fieldname = null, $fieldvalue = null)
    {
        try {
            $query = TblPlaFactor::query();
            
            if ($request->search) {
                $search = trim($request->search);
                TblPlaFactor::search($query, $search);
            }
            
            if ($request->has('filter') && $request->has('filtervalue')) {
                if ($request->filter === 'fa_id') {
                    $ids = explode(',', $request->filtervalue);
                    $query->whereIn('fa_id', $ids);
                }
            }

            $query->where('fa_estado', 'V');
            
            $records = $query->get();
            
            return $this->respond([
                'records' => $records,
                'total_records' => $records->count()
            ]);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    public function view($rec_id = null)
    {
        try {
            $record = TblPlaFactor::findOrFail($rec_id);
            return $this->respond($record);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    public function add(Request $request)
    {
        try {
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblPlaFactor::create($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    public function edit(Request $request, $rec_id = null)
    {
        try {
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblPlaFactor::findOrFail($rec_id);
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
            TblPlaFactor::whereIn("fa_id", $arr_id)->delete();
            return $this->respond([
                "status" => "success",
                "message" => "Registros eliminados exitosamente"
            ]);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }

    public function getFactoresEspeciales()
    {
        try {
            $factores = TblPlaFactor::query()
                ->whereIn('fa_id', [32, 33])
                ->where('fa_estado', 'V')
                ->select(['fa_id', 'fa_descripcion'])
                ->get();
            
            return $this->respond([
                'records' => $factores,
                'total_records' => $factores->count()
            ]);
        }
        catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Get factors of type 'SANCION'
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFactoresSancion()
    {
        try {
            $records = TblPlaFactor::where('fa_tipo', 'SANCION') 
                                    ->where('fa_estado', 'V')
                                    ->select('fa_id', 'fa_descripcion')
                                    ->orderBy('fa_descripcion')
                                    ->get();

            return Response::json(['records' => $records]);

        } catch (Exception $e) {
            Log::error("Error fetching sanction factors: " . $e->getMessage());
            return Response::json(['message' => 'Error al obtener factores de sanción: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get specific sanction factors for Procesamiento module (IDs 57, 58, 59, 60)
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFactoresSancionParaProcesamiento()
    {
        try {
            $specific_ids = [57, 58, 59, 60];

            $records = TblPlaFactor::whereIn('fa_id', $specific_ids)
                                    ->where('fa_estado', 'V')
                                    ->select('fa_id', 'fa_descripcion')
                                    ->orderBy('fa_descripcion')
                                    ->get();

            Log::info('Factores de sanción específicos para Procesamiento encontrados: ' . $records->count());

            return Response::json(['records' => $records]);

        } catch (Exception $e) {
            Log::error("Error fetching specific sanction factors for Procesamiento: " . $e->getMessage());
            return Response::json(['message' => 'Error al obtener factores de sanción específicos para Procesamiento: ' . $e->getMessage()], 500);
        }
    }
}
