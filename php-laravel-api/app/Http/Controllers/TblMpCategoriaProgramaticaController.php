<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpCategoriaProgramatica;
use Illuminate\Http\Request;
use Exception;

class TblMpCategoriaProgramaticaController extends Controller
{
    /**
     * List table records
     * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\Http\Response
     */
    function index(Request $request, $fieldname = null , $fieldvalue = null){
        try {
            $query = TblMpCategoriaProgramatica::query();
            
            if($request->search){
                $search = trim($request->search);
                TblMpCategoriaProgramatica::search($query, $search);
            }

            $orderby = $request->orderby ?? "tbl_mp_categoria_programatica.cp_id";
            $ordertype = $request->ordertype ?? "desc";
            $query->orderBy($orderby, $ordertype);

            if($fieldname){
                $query->where($fieldname , $fieldvalue);
                $query->where('cp_estado', 'V');
            }
            
            $records = $this->paginate($query, TblMpCategoriaProgramatica::listFields());
            return $this->respond($records);
        } catch(Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Select table record by ID
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function view($rec_id = null){
        try {
            if (!$rec_id || $rec_id == 0) {
                return $this->respond([
                    'cp_id' => 0,
                    'cp_descripcion' => 'No asignado'
                ]);
            }
            
            $query = TblMpCategoriaProgramatica::query();
            $record = $query->find($rec_id);
            
            if(!$record){
                return $this->respond([
                    'cp_id' => $rec_id,
                    'cp_descripcion' => 'No encontrado'
                ]);
            }
            
            return $this->respond($record);
        } catch (Exception $e) {
            \Log::error("Error in TblMpCategoriaProgramaticaController@view: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return $this->respond([
                'cp_id' => $rec_id,
                'cp_descripcion' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
    function add(Request $request){
        $modeldata = $this->normalizeFormData($request->all());
        if(empty($modeldata['cp_fecha_modificacion'])){
            $modeldata['cp_fecha_modificacion'] = now();
        }
        
        $record = TblMpCategoriaProgramatica::create($modeldata);
        $rec_id = $record->cp_id;
        return $this->respond($record);
    }

    /**
     * Update table record with form data
     * @param string $rec_id //select record by table primary key
     * @return \Illuminate\Http\Response
     */
    function edit(Request $request, $rec_id = null){
        $query = TblMpCategoriaProgramatica::query();
        $record = $query->findOrFail($rec_id, TblMpCategoriaProgramatica::editFields());
        if ($request->isMethod('post')) {
            $modeldata = $this->normalizeFormData($request->all());
            $modeldata['cp_fecha_modificacion'] = now();
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
        $query = TblMpCategoriaProgramatica::query();
        $query->whereIn("cp_id", $arr_id);
        $query->delete();
        return $this->respond($arr_id);
    }

    /**
     * Get record counts of category programs by type
     * @return \Illuminate\Http\Response
     */
    function getCounts(){
        try {
            $countByProgram = TblMpCategoriaProgramatica::selectRaw('cp_programa, count(*) as count')
                ->groupBy('cp_programa')
                ->get();
            
            $countByState = TblMpCategoriaProgramatica::selectRaw('cp_estado, count(*) as count')
                ->groupBy('cp_estado')
                ->get();
            
            return $this->respond([
                'countByProgram' => $countByProgram,
                'countByState' => $countByState
            ]);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Filter records by cp_pr_id
     * @param int $pr_id
     * @return \Illuminate\Http\Response
     */
    function getByPrId($pr_id = null){
        try {
            $query = TblMpCategoriaProgramatica::where('cp_pr_id', $pr_id);
            $records = $query->get(TblMpCategoriaProgramatica::listFields());
            return $this->respond($records);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }

    /**
     * Filter by DA and PR
     * @param string $cp_da
     * @param int $cp_pr_id
     * @return \Illuminate\Http\Response
     */
    public function filterByDaAndPr($cp_da, $cp_pr_id){
        try {
            $records = TblMpCategoriaProgramatica::where('cp_da', $cp_da)
                ->where('cp_pr_id', $cp_pr_id)
                ->where('cp_estado', 'V')
                ->get();

            return $this->respond($records);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
}
