<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TblItem;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TblItemController extends Controller
{
    /**
     * List table records
     * @param Request $request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     */
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try {
            // Verificar que todos los campos existen en la base de datos
            $columns = DB::connection()->getSchemaBuilder()->getColumnListing('tbl_items');
            Log::info('Columnas disponibles en tbl_items:', $columns);

            $query = TblItem::query();
            
            if($request->search){
                $search = trim($request->search);
                TblItem::search($query, $search);
            }
            
            $orderby = $request->orderby ?? "tbl_items.id";
            $ordertype = $request->ordertype ?? "desc";
            $query->orderBy($orderby, $ordertype);
            
            if($fieldname){
                $query->where($fieldname, $fieldvalue);
            }
            
            // Asegurarnos de no solicitar campos inexistentes
            $fields = array_intersect(TblItem::listFields(), $columns);
            $records = $this->paginate($query, $fields);
            
            return response()->json($records);
        } 
        catch (\Exception $e) {
            Log::error('Error en TblItemController::index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Error al cargar los registros: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Select table record by ID
     * @param string $rec_id
     */
    function view($rec_id = null){
        try {
            $columns = DB::connection()->getSchemaBuilder()->getColumnListing('tbl_items');
            $fields = array_intersect(TblItem::viewFields(), $columns);
            
            $query = TblItem::query();
            $record = $query->findOrFail($rec_id, $fields);
            
            return response()->json($record);
        }
        catch (\Exception $e) {
            Log::error('Error en TblItemController::view: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al obtener el registro: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Save form record to the table
     */
    function add(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'codigo_item' => 'required|unique:tbl_items',
                'cargo' => 'required',
                'haber_basico' => 'required|numeric|min:0',
                'unidad_organizacional' => 'required',
                'tiempo_jornada' => 'required',
                'cantidad' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Solo aceptar campos que existan en la tabla
            $modeldata = $request->only([
                'codigo_item',
                'cargo',
                'haber_basico',
                'unidad_organizacional',
                'tiempo_jornada',
                'cantidad',
                'fecha_creacion'
            ]);
            
            // Establecer fecha de creación si no está presente
            $modeldata['fecha_creacion'] = $modeldata['fecha_creacion'] ?? now();

            $record = TblItem::create($modeldata);
            
            return response()->json([
                'id' => $record->id,
                'record' => $record,
                'success' => true
            ], 201);
        }
        catch(Exception $e){
            Log::error('Error en TblItemController::add: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update table record with form data
     * @param string $rec_id //select record by table primary key
     */
    function edit(Request $request, $rec_id = null){
        try{
            $columns = DB::connection()->getSchemaBuilder()->getColumnListing('tbl_items');
            $fields = array_intersect(TblItem::editFields(), $columns);
            
            $query = TblItem::query();
            $record = $query->findOrFail($rec_id, $fields);
            
            if ($request->isMethod('post')) {
                $validator = Validator::make($request->all(), [
                    'codigo_item' => 'required|unique:tbl_items,codigo_item,'.$rec_id,
                    'cargo' => 'required',
                    'haber_basico' => 'required|numeric|min:0',
                    'unidad_organizacional' => 'required',
                    'tiempo_jornada' => 'required',
                    'cantidad' => 'required|integer|min:1',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 422);
                }

                // Solo aceptar campos que existen en la tabla
                $modeldata = $request->only([
                    'codigo_item',
                    'cargo',
                    'haber_basico',
                    'unidad_organizacional',
                    'tiempo_jornada',
                    'cantidad'
                ]);
                
                $record->update($modeldata);
            }
            
            return response()->json([
                'record' => $record,
                'success' => true
            ]);
        }
        catch(Exception $e){
            Log::error('Error en TblItemController::edit: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Delete record from the database
     * @param string $rec_id //can be separated by comma 
     */
    function delete(Request $request, $rec_id = null){
        try{
            $arr_id = explode(",", $rec_id);
            $query = TblItem::query();
            $query->whereIn("id", $arr_id);
            $query->delete();
            
            return response()->json([
                'deleted' => $arr_id,
                'success' => true
            ]);
        }
        catch(Exception $e){
            Log::error('Error en TblItemController::delete: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
