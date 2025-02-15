<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblSegRolMenuAddRequest;
use App\Http\Requests\TblSegRolMenuEditRequest;
use App\Models\TblSegRolMenu;
use Illuminate\Http\Request;
use Exception;
class TblSegRolMenuController extends Controller
{


	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblSegRolMenu::query();
		if($request->search){
			$search = trim($request->search);
			TblSegRolMenu::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_seg_rol_menu.rolme_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblSegRolMenu::listFields());
		return $this->respond($records);
	}


	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblSegRolMenu::query();
		$record = $query->findOrFail($rec_id, TblSegRolMenu::viewFields());
		return $this->respond($record);
	}


	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(TblSegRolMenuAddRequest $request){
		$modeldata = $request->validated();

		//save TblSegRolMenu record
		$record = TblSegRolMenu::create($modeldata);
		$rec_id = $record->rolme_id;
		return $this->respond($record);
	}


	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblSegRolMenuEditRequest $request, $rec_id = null){
		$query = TblSegRolMenu::query();
		$record = $query->findOrFail($rec_id, TblSegRolMenu::editFields());
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
		$query = TblSegRolMenu::query();
		$query->whereIn("rolme_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}

    public function createRolMenuRecords(Request $request)
{
    $request->validate([
        'rol_id' => 'required|integer',
        'node_keys' => 'required|array',
    ]);

    $rol_id = $request->input('rol_id');
    $node_keys = $request->input('node_keys');

    try {
        foreach ($node_keys as $node_key) {
            TblSegRolMenu::create([
                'rolme_rol_id' => $rol_id,
                'rolme_me_id' => $node_key,
                'rolme_estado' => 'V', // Estado activo
                'rolme_usuario_creacion' => auth()->id(), // ID del usuario autenticado
                'rolme_fecha_creacion' => now(),
            ]);
        }

        return response()->json(['message' => 'Registros creados correctamente'], 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Error al crear registros', 'error' => $e->getMessage()], 500);
    }
}
public function deleteRolMenuRecords(Request $request)
{
    $request->validate([
        'rol_id' => 'required|integer',
        'node_keys' => 'required|array',
    ]);

    $rol_id = $request->input('rol_id');
    $node_keys = $request->input('node_keys');

    try {
        TblSegRolMenu::where('rolme_rol_id', $rol_id)
            ->whereIn('rolme_me_id', $node_keys)
            ->delete();

        return response()->json(['message' => 'Registros eliminados correctamente'], 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Error al eliminar registros', 'error' => $e->getMessage()], 500);
    }
}
}
