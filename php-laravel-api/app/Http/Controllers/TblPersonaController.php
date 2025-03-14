<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblPersona;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblPersonaController extends Controller
{
    /**
     * List table records
     * @param Request $request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\Http\Response
     */
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try{
            $query = TblPersona::query();
            
            if($request->search){
                $search = trim($request->search);
                TblPersona::search($query, $search);
            }
            
            if ($fieldname) {
                $query->where($fieldname, $fieldvalue);
            }
            
            $records = $query->paginate($request->limit ?? 10);
            return $this->respond($records);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Select table record by ID
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function view($rec_id = null){
        try{
            $query = TblPersona::query();
            $record = $query->findOrFail($rec_id);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Save form record to the table
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    function add(Request $request){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $modeldata['per_fecha_registro'] = $modeldata['per_fecha_registro'] ?? now();
            
            DB::beginTransaction();
            $record = TblPersona::create($modeldata);
            DB::commit();
            
            return $this->respond($record);
        }
        catch(Exception $e){
            DB::rollback();
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Update table record with form data
     * @param Request $request
     * @param string $rec_id //select record by table primary key
     * @return \Illuminate\Http\Response
     */
    function edit(Request $request, $rec_id = null){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblPersona::findOrFail($rec_id);
            $record->update($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Delete record from the database
     * @param Request $request
     * @param string $rec_id //can be separated by comma for multiple records
     * @return \Illuminate\Http\Response
     */
    function delete(Request $request, $rec_id = null){
        try{
            $arr_id = explode(",", $rec_id);
            $query = TblPersona::query();
            $query->whereIn("per_id", $arr_id);
            $query->delete();
            
            return $this->respond([
                "status" => "success",
                "message" => "Registros eliminados exitosamente",
                "deleted_records" => count($arr_id)
            ]);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
}
