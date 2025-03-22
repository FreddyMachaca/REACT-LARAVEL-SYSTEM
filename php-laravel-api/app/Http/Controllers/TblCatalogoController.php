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

    /**
     * Get catalogs by tipo
     */
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

    /**
     * Get general movement catalogs
     */
    function getMovGeneral(){
        try {
            $records = TblCatalogo::where('cat_tabla', 'tipo_mov_general')
                ->where('cat_estado', 'V')
                ->get();
            
            return $this->respond($records);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Get domicilio related catalogs
     */
    function getDataDomicilio(){
        try {
            $records = TblCatalogo::whereIn('cat_tabla', ['zona', 'tipo_via', 'ciudad_localidad'])
                ->where('cat_estado', 'V')
                ->get();

            return $this->respond($records);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Get education related catalogs
     */
    function getDataEducation(){
        try {
            $records = TblCatalogo::whereIn('cat_tabla', [
                'nivel_instruccion', 'centro_formacion_kd', 
                'carrera', 'titulos'
            ])
                ->where('cat_estado', 'V')
                ->get();

            return $this->respond($records);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Get person related catalogs
     */
    function getCatalogosAddPerson(){
        try {
            $query = TblCatalogo::where('cat_estado', 'V')
                ->whereIn('cat_tabla', [
                    'tipo_documento_impreso', 'estado_civil', 'zona',
                    'pais', 'ciudad_localidad', 'departamento',
                    'provincia', 'tipo_via'
                ])
                ->select("cat_id", "cat_tabla", "cat_descripcion")
                ->get()
                ->groupBy('cat_tabla');

            return $this->respond($query);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Get catalogs by superior ID
     */
    function getCatalogoByCatIdSup($rec_id){
        try {
            $query = TblCatalogo::where('cat_id_superior', $rec_id)
                ->where('cat_estado', 'V')
                ->get();

            return $this->respond($query);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Add zone with department
     */
    function addZoneWithDepartament(Request $request){
        try {
            $datos = $request->validate([
                "cat_id_superior" => "required|integer",
                "cat_descripcion" => "required|string",
                "cat_estado" => "required|string",
                "cat_tabla" => "required|string",
            ]);
            
            $maxSecuencial = TblCatalogo::where('cat_tabla', 'zona')->max('cat_secuencial');

            $catalogo = new TblCatalogo();
            $catalogo->cat_tabla = $request->cat_tabla;
            $catalogo->cat_secuencial = $maxSecuencial + 1;
            $catalogo->cat_descripcion = $request->cat_descripcion;
            $catalogo->cat_estado = $request->cat_estado;
            $catalogo->cat_id_superior = $request->cat_id_superior;
            $catalogo->save();

            return $this->respond($catalogo);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
