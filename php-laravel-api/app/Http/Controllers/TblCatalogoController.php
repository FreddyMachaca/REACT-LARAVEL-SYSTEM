<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblCatalogoAddRequest;
use App\Http\Requests\TblCatalogoEditRequest;
use App\Models\TblCatalogo;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

class TblCatalogoController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblCatalogo::query();
		if($request->search){
			$search = trim($request->search);
			TblCatalogo::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_catalogo.cat_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue);
		}
		$records = $this->paginate($query, TblCatalogo::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblCatalogo::query();
		$record = $query->findOrFail($rec_id, TblCatalogo::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblCatalogoAddRequest $request){
		$modeldata = $request->validated();
		
		//save TblCatalogo record
		$record = TblCatalogo::create($modeldata);
		$rec_id = $record->cat_id;
		return $this->respond($record);
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblCatalogoEditRequest $request, $rec_id = null){
		$query = TblCatalogo::query();
		$record = $query->findOrFail($rec_id, TblCatalogo::editFields());
		if ($request->isMethod('post')) {
			$modeldata = $request->validated();
			$record->update($modeldata);
		}
		return $this->respond($record);
	}
	

	/**
     * Delete record from the database
	 * Support multi delete by separating record id by comma.
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_id //can be separated by comma 
     * @return \Illuminate\Http\Response
     */
	function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblCatalogo::query();
		$query->whereIn("cat_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}

    public function getByTipo($tabla)
    {
        try {
            $records = DB::table('tbl_catalogo')
                ->where('cat_tabla', $tabla)
                ->where('cat_estado', 'V')
                ->select(['cat_id', 'cat_descripcion', 'cat_abreviacion'])
                ->orderBy('cat_secuencial')
                ->get();
                
            return $this->respond($records);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
