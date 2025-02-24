<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TblItem;
use Exception;

class TblItemController extends Controller
{
    /**
     * List table records
     * @param Request $request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     */
    function index(Request $request, $fieldname = null , $fieldvalue = null){
        $query = TblItem::query();
        if($request->search){
            $search = trim($request->search);
            TblItem::search($query, $search);
        }
        $orderby = $request->orderby ?? "tbl_items.id";
        $ordertype = $request->ordertype ?? "desc";
        $query->orderBy($orderby, $ordertype);
        if($fieldname){
            $query->where($fieldname , $fieldvalue);
        }
        $records = $this->paginate($query, TblItem::listFields());
        return $this->respond($records);
    }

    /**
     * Select table record by ID
     * @param string $rec_id
     */
    function view($rec_id = null){
        $query = TblItem::query();
        $record = $query->findOrFail($rec_id, TblItem::viewFields());
        return $this->respond($record);
    }

    /**
     * Save form record to the table
     */
    function add(Request $request){
        try{
            $modeldata = $request->all();
            
            // Validar datos requeridos
            if(empty($modeldata['codigo_item']) || empty($modeldata['cargo']) || 
               empty($modeldata['haber_basico']) || empty($modeldata['unidad_organizacional'])) {
                return response()->json(['error' => 'Todos los campos son requeridos'], 422);
            }

            // Validar código_item único
            $exists = TblItem::where('codigo_item', $modeldata['codigo_item'])->exists();
            if($exists) {
                return response()->json(['error' => 'El código de item ya existe'], 422);
            }

            // Establecer fecha de creación si no está presente
            $modeldata['fecha_creacion'] = $modeldata['fecha_creacion'] ?? now();

            $record = TblItem::create($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respond($e->getMessage(), 500);
        }
    }

    /**
     * Update table record with form data
     * @param string $rec_id //select record by table primary key
     */
    function edit(Request $request, $rec_id = null){
        try{
            $query = TblItem::query();
            $record = $query->findOrFail($rec_id, TblItem::editFields());
            if ($request->isMethod('post')) {
                $modeldata = $request->all();
                $record->update($modeldata);
            }
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respond($e->getMessage(), 500);
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
            return $this->respond($arr_id);
        }
        catch(Exception $e){
            return $this->respond($e->getMessage(), 500);
        }
    }
}
