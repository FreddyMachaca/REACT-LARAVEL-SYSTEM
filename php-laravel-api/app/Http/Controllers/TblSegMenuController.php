<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblSegMenuAddRequest;
use App\Http\Requests\TblSegMenuEditRequest;
use App\Models\TblSegMenu;
use Illuminate\Http\Request;
use Exception;
class TblSegMenuController extends Controller
{
	

	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblSegMenu::query();
		if($request->search){
			$search = trim($request->search);
			TblSegMenu::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_seg_menu.me_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblSegMenu::listFields());
		return $this->respond($records);
	}
	

	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblSegMenu::query();
		$record = $query->findOrFail($rec_id, TblSegMenu::viewFields());
		return $this->respond($record);
	}
	

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		try {
			$modeldata = $request->all();
			
			// Establecer valores predeterminados si no están presentes
			$modeldata['me_vista'] = $modeldata['me_vista'] ?? 1;
			$modeldata['me_orden'] = $modeldata['me_orden'] ?? 0;
			$modeldata['me_estado'] = $modeldata['me_estado'] ?? '1';
			$modeldata['me_usuario_creacion'] = $modeldata['me_usuario_creacion'] ?? 1;
			$modeldata['me_fecha_creacion'] = $modeldata['me_fecha_creacion'] ?? now();

			// Validar datos requeridos
			if (empty($modeldata['me_descripcion'])) {
				return response()->json(['error' => 'La descripción es requerida'], 422);
			}

			// Si es un hijo, validar que exista el padre
			if (!empty($modeldata['me_id_padre'])) {
				$parent = TblSegMenu::find($modeldata['me_id_padre']);
				if (!$parent) {
					return response()->json(['error' => 'El menú padre no existe'], 422);
				}
			}

			// Crear el registro
			$record = TblSegMenu::create($modeldata);
			
			return response()->json($record, 200);
		}
		catch (Exception $e) {
			return response()->json(['error' => $e->getMessage()], 500);
		}
	}
	

	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(TblSegMenuEditRequest $request, $rec_id = null){
		$query = TblSegMenu::query();
		$record = $query->findOrFail($rec_id, TblSegMenu::editFields());
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
		$query = TblSegMenu::query();
		$query->whereIn("me_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}

	public function getMenuTree() {
		$menu = TblSegMenu::orderBy('me_orden')
			->get(['me_id', 'me_descripcion', 'me_url', 'me_icono', 
				   'me_id_padre', 'me_orden', 'me_estado']);
		
		// Convertir la lista plana en una estructura de árbol
		$tree = $this->buildTree($menu);
		
		return $this->respond($tree);
	}
	
	private function buildTree($elements, $parentId = null) {
		$branch = [];
	
		foreach ($elements as $element) {
			if ($element->me_id_padre == $parentId) {
				$children = $this->buildTree($elements, $element->me_id);
				if ($children) {
					$element->children = $children;
				}
				$branch[] = $element;
			}
		}
	
		return $branch;
	}
}