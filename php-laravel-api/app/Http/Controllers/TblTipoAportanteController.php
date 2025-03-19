<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TblTipoAportante;
use Illuminate\Http\Request;
use Exception;

class TblTipoAportanteController extends Controller
{
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try{
            $query = TblTipoAportante::query();
            
            if($request->search){
                $search = trim($request->search);
                TblTipoAportante::search($query, $search);
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
    
    function view($rec_id = null){
        try{
            $record = TblTipoAportante::findOrFail($rec_id);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function add(Request $request){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblTipoAportante::create($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function edit(Request $request, $rec_id = null){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblTipoAportante::findOrFail($rec_id);
            $record->update($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }
    
    function delete(Request $request, $rec_id = null){
        try{
            $arr_id = explode(",", $rec_id);
            $query = TblTipoAportante::query();
            $query->whereIn("ta_id", $arr_id);
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
