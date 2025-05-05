<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblServiciosAddRequest;
use App\Http\Requests\TblServiciosEditRequest;
use App\Models\TblServicios;
use Illuminate\Http\Request;
use Exception;
class TblServiciosController extends Controller
{

    public function obtenerServicios()
    {
        // Obtener todos los servicios desde la base de datos
        $servicios = TblServicios::select('servicio_id as value', 'servicio_precio_base as preuni', 'servicio_descripcion as label')
            ->where('servicio_estado', 'A') // Filtra solo los servicios activos
            ->get();

        return response()->json([
            'success' => true,
            'data' => $servicios,
        ]);
    }
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblServicios::query();
		if($request->search){
			$search = trim($request->search);
			TblServicios::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_servicios.servicio_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblServicios::listFields());
		return $this->respond($records);
	}


	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblServicios::query();
		$record = $query->findOrFail($rec_id, TblServicios::viewFields());
		return $this->respond($record);
	}


	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblServiciosAddRequest $request){
		$modeldata = $request->validated();

		//save TblServicios record
		$record = TblServicios::create($modeldata);
		$rec_id = $record->servicio_id;
		return $this->respond($record);
	}


	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblServiciosEditRequest $request, $rec_id = null){
		$query = TblServicios::query();
		$record = $query->findOrFail($rec_id, TblServicios::editFields());
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
		$query = TblServicios::query();
		$query->whereIn("servicio_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
}
