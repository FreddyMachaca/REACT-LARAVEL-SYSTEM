<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpTipoItem;
use Illuminate\Http\Request;
use Exception;

class TblMpTipoItemController extends Controller
{
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\Http\Response
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpTipoItem::query();
		if($request->search){
			$search = trim($request->search);
			TblMpTipoItem::search($query, $search);
		}
		$orderby = $request->orderby ?? "ti_orden";
		$ordertype = $request->ordertype ?? "asc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue);
		}
		$records = $this->paginate($query, TblMpTipoItem::listFields());
		return $this->respond($records);
	}
	
	/**
     * Select table record by primary key (ti_item and ti_tipo)
	 * @param string $ti_item
     * @param string $ti_tipo
     * @return \Illuminate\Http\Response
     */
	function view($ti_item = null, $ti_tipo = null){
		$query = TblMpTipoItem::query();
		$record = $query->where('ti_item', $ti_item)
                      ->where('ti_tipo', $ti_tipo)
                      ->first(TblMpTipoItem::viewFields());
		
		if(!$record){
			return $this->respondWithError("Registro no encontrado");
		}
		
		return $this->respond($record);
	}
	
	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$modeldata = $this->normalizeFormData($request->all());
		
		// Check if record already exists
		$exists = TblMpTipoItem::where('ti_item', $modeldata['ti_item'])
                            ->where('ti_tipo', $modeldata['ti_tipo'])
                            ->exists();
		
		if($exists){
			return $this->respondWithError("El registro ya existe");
		}
		
		//save TblMpTipoItem record
		$record = TblMpTipoItem::create($modeldata);
		return $this->respond($record);
	}
	
	/**
     * Update table record with form data
	 * @param string $ti_item //part of composite primary key
     * @param string $ti_tipo //part of composite primary key
     * @return \Illuminate\Http\Response
     */
	function edit(Request $request, $ti_item = null, $ti_tipo = null){
		$query = TblMpTipoItem::query();
		$record = $query->where('ti_item', $ti_item)
                      ->where('ti_tipo', $ti_tipo)
                      ->first();
		
		if(!$record){
			return $this->respondWithError("Registro no encontrado");
		}
		
		if ($request->isMethod('post')) {
			$modeldata = $this->normalizeFormData($request->all());
			$record->update($modeldata);
		}
		return $this->respond($record);
	}
	
	/**
     * Delete record from the database
	 * Support multi delete by separating record ids by comma.
	 * @param  \Illuminate\Http\Request
	 * @param string $record_ids //can be separated by comma 
     * @return \Illuminate\Http\Response
     */
	function delete(Request $request){
	    try {
	        $items = $request->input('items', []);
	        
	        if(empty($items)){
	            return $this->respondWithError("No se proporcionaron elementos para eliminar");
	        }
	        
	        $deletedCount = 0;
	        $failed = [];
	        
	        foreach($items as $item){
	            if(!isset($item['ti_item']) || !isset($item['ti_tipo'])){
	                $failed[] = $item;
	                continue;
	            }
	            
	            $query = TblMpTipoItem::query();
	            $query->where('ti_item', $item['ti_item'])
	                  ->where('ti_tipo', $item['ti_tipo']);
	            
	            $deleted = $query->delete();
	            if($deleted){
	                $deletedCount++;
	            }else{
	                $failed[] = $item;
	            }
	        }
	        
	        return $this->respond([
	            'deleted_count' => $deletedCount,
	            'failed' => $failed
	        ]);
	    } catch (Exception $e) {
	        return $this->respondWithError($e);
	    }
	}
	
	/**
     * Get items by specific tipo value
	 * @param string $tipo
     * @return \Illuminate\Http\Response
     */
	function getByTipo($tipo = null){
		try {
			$query = TblMpTipoItem::query();
			$query->where('ti_tipo', $tipo);
			$query->orderBy('ti_orden', 'asc');
			$records = $query->get(TblMpTipoItem::listFields());
			return $this->respond($records);
		} catch (Exception $e) {
			return $this->respondWithError($e);
		}
	}
	
	/**
     * Return list of Tipo Item with only ti_item and ti_descripcion fields.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTiposItem(){
        $records = TblMpTipoItem::select('ti_item', 'ti_descripcion')
                    ->whereIn('ti_item', ['A','C','E','P','S'])
                    ->orderBy('ti_orden', 'asc')
                    ->get();
        return $this->respond($records);
    }
}
