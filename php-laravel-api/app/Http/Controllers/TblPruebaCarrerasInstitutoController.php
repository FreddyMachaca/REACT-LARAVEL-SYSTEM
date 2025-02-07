<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblPruebaCarrerasInstitutoAddRequest;
use App\Http\Requests\TblPruebaCarrerasInstitutoEditRequest;
use App\Models\TblPruebaCarrerasInstituto;
use Illuminate\Http\Request;
use Exception;
class TblPruebaCarrerasInstitutoController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPruebaCarrerasInstituto::query();
		if($request->search){
			$search = trim($request->search);
			TblPruebaCarrerasInstituto::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_prueba_carreras_instituto.carrera_inst";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblPruebaCarrerasInstituto::listFields());
		return $this->respond($records);
	}
}
