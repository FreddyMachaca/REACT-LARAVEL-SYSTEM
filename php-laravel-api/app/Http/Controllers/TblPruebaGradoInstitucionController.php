<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblPruebaGradoInstitucionAddRequest;
use App\Http\Requests\TblPruebaGradoInstitucionEditRequest;
use App\Models\TblPruebaGradoInstitucion;
use Illuminate\Http\Request;
use Exception;
class TblPruebaGradoInstitucionController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPruebaGradoInstitucion::query();
		if($request->search){
			$search = trim($request->search);
			TblPruebaGradoInstitucion::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_prueba_grado_institucion.id_grado";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblPruebaGradoInstitucion::listFields());
		return $this->respond($records);
	}
}
