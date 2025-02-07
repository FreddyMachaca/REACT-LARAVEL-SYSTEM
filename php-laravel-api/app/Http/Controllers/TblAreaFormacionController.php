<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblAreaFormacionAddRequest;
use App\Http\Requests\TblAreaFormacionEditRequest;
use App\Models\TblAreaFormacion;
use Illuminate\Http\Request;
use Exception;
class TblAreaFormacionController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblAreaFormacion::query();
		if($request->search){
			$search = trim($request->search);
			TblAreaFormacion::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_area_formacion.af_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblAreaFormacion::listFields());
		return $this->respond($records);
	}
}
