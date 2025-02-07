<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblPruebaInstituciomCarreraAddRequest;
use App\Http\Requests\TblPruebaInstituciomCarreraEditRequest;
use App\Models\TblPruebaInstituciomCarrera;
use Illuminate\Http\Request;
use Exception;
class TblPruebaInstituciomCarreraController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblPruebaInstituciomCarrera::query();
		if($request->search){
			$search = trim($request->search);
			TblPruebaInstituciomCarrera::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_prueba_instituciom_carrera.id_depto";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblPruebaInstituciomCarrera::listFields());
		return $this->respond($records);
	}
}
