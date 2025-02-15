<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblSegMenuAddRequest;
use App\Http\Requests\TblSegMenuEditRequest;
use App\Models\TblSegMenu;
use App\Models\TblSegRolMenu;

use Illuminate\Http\Request;
use Exception;
class TblSegMenuController extends Controller
{

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

	function add(TblSegMenuAddRequest $request){
		$modeldata = $request->validated();

		//save TblSegMenu record
		$record = TblSegMenu::create($modeldata);
		$rec_id = $record->me_id;
		return $this->respond($record);
	}

	function edit(TblSegMenuEditRequest $request, $rec_id = null){
		$query = TblSegMenu::query();
		$record = $query->findOrFail($rec_id, TblSegMenu::editFields());
		if ($request->isMethod('post')) {
			$modeldata = $request->validated();
			$record->update($modeldata);
		}
		return $this->respond($record);
	}

	function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblSegMenu::query();
		$query->whereIn("me_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}

    function getMenuByRol(Request $request, $rec_id = null){
		$menuTree = $this->buildMenuTree(0, $rec_id);

        return response()->json($menuTree);
	}

	private function buildMenuTree($parentId = 0, $rec_id) {
        $menus = TblSegMenu::where('me_id_padre', $parentId)
            ->where('me_estado', 'V')
            ->select('me_id', 'me_descripcion', 'me_icono')
            ->get();
		//return response()->json($menus);
        $tree = [];
		$descWithIcon = '';
        foreach ($menus as $menu) {
            $children = $this->buildMenuTree($menu->me_id, $rec_id);
			//$descWithIcon = $menu->me_id.'|'.$menu->me_descripcion .'|'. $menu->me_icono.'|'.$menu->rolme_estado;
			$asPermission = TblSegRolMenu::where('rolme_rol_id', $rec_id)
				->where('rolme_me_id', $menu->me_id)
				->where('rolme_estado', 'V')
				->first();
			$descWithIcon = $menu->me_id.'|'.$menu->me_descripcion .'|'. $menu->me_icono.'|'. ($asPermission ? '1' : '0');
            if (!empty($children)) {
                $tree[$descWithIcon] = $children;
            }
            else {
                $tree[$descWithIcon] = true;
            }
        }
        return $tree;
    }


    public function getMenuTree(Request $request)
    {
        // Construye el árbol de menús usando buildMenuTree2
        $menuTree = $this->buildMenuTree2(0);

        // Devuelve la respuesta en formato JSON
        return response()->json($menuTree);
    }

    private function buildMenuTree2($parentId = 0)
    {
        // Obtiene los menús que tienen el mismo padre y están activos
        $menus = TblSegMenu::where('me_id_padre', $parentId)
            ->where('me_estado', 'V')
            ->select('me_id', 'me_descripcion', 'me_icono')
            ->get();

        $tree = [];

        foreach ($menus as $menu) {
            // Construye el nodo actual
            $node = [
                'key' => $menu->me_id, // Identificador único del nodo
                'data' => [
                    'name' => $menu->me_descripcion, // Nombre del menú
                    'icon' => $menu->me_icono, // Icono del menú
                    'checked' => false, // Estado del checkbox (inicialmente false)
                ],
                'children' => $this->buildMenuTree2($menu->me_id), // Submenús
            ];

            // Si no tiene hijos, eliminamos la propiedad 'children'
            if (empty($node['children'])) {
                unset($node['children']);
            }

            $tree[] = $node;
        }

        return $tree;
    }

    function getMenuByRol2(Request $request, $rec_id = null){
		$menuTree = $this->buildMenuTree3(0, $rec_id);

        return response()->json($menuTree);
	}

    private function buildMenuTree3($parentId = 0, $rec_id) {
        $menus = TblSegMenu::where('me_id_padre', $parentId)
            ->where('me_estado', 'V')
            ->select('me_id', 'me_descripcion', 'me_icono')
            ->get();

        $tree = [];
        foreach ($menus as $menu) {
            $children = $this->buildMenuTree3($menu->me_id, $rec_id);
            $asPermission = TblSegRolMenu::where('rolme_rol_id', $rec_id)
                ->where('rolme_me_id', $menu->me_id)
                ->where('rolme_estado', 'V')
                ->first();

            $tree[] = [
                'key' => $menu->me_id,
                'data' => [
                    'name' => $menu->me_descripcion,
                    'icon' => $menu->me_icono,
                ],
                'children' => $children,
                'hasPermission' => $asPermission ? '1' : '0',
            ];
           /* $descWithIcon = $menu->me_id.'|'.$menu->me_descripcion .'|'. $menu->me_icono.'|'. ($asPermission ? '1' : '0');
            if (!empty($children)) {
                $tree[$descWithIcon] = $children;
            }
            else {
                $tree[$descWithIcon] = true;
            }*/
        }

        return $tree;
      }
}
