<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblPruebaGradoCarreraAddRequest;
use App\Http\Requests\TblPruebaGradoCarreraEditRequest;
use App\Models\TblPruebaGradoCarrera;
use Illuminate\Http\Request;
use Exception;
class TblPruebaGradoCarreraController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPruebaGradoCarrera::query();
		if($request->search){
			$search = trim($request->search);
			TblPruebaGradoCarrera::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_prueba_grado_carrera.id_grado";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblPruebaGradoCarrera::listFields());
		return $this->respond($records);
	}
}
