<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\TblSegRolAddRequest;
use App\Http\Requests\TblSegRolEditRequest;
use App\Models\TblSegRol;
use App\Models\TblSegRolMenu;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
class TblSegRolController extends Controller
{

	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblSegRol::query();
		if($request->search){
			$search = trim($request->search);
			TblSegRol::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_seg_rol.rol_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue); //filter by a single field name
		}
		$records = $this->paginate($query, TblSegRol::listFields());
		return $this->respond($records);
	}

	function view($rec_id = null){
		$query = TblSegRol::query();
		$record = $query->findOrFail($rec_id, TblSegRol::viewFields());
		return $this->respond($record);
	}
    public function add(TblSegRolAddRequest $request)
    {
        try {
            DB::beginTransaction();

            // Preparar datos para TblSegRol
            $modeldata = $request->validated();
            Log::info('Datos recibidos en add:', $modeldata); // Verifica los datos

            $rolData = [
                'rol_descripcion' => $modeldata['nombre'],
                'rol_estado' => 'V',
                'rol_fecha_creacion' => now(),
                'rol_usuario_creacion' => auth()->id() ?? 1
            ];

            // Crear el registro del rol
            $record = TblSegRol::create($rolData);
            $rol_id = $record->rol_id;

            // Procesar los menús seleccionados
            if (isset($modeldata['selectedNodes']) && is_array($modeldata['selectedNodes'])) {
                foreach ($modeldata['selectedNodes'] as $menu_id) {
                    TblSegRolMenu::create([
                        'rolme_rol_id' => $rol_id,
                        'rolme_me_id' => $menu_id,
                        'rolme_estado' => 'V',
                        'rolme_usuario_creacion' => auth()->id() ?? 1,
                        'rolme_fecha_creacion' => now()
                    ]);
                }
            }

            DB::commit();
            return $this->respond($record);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en add:', ['error' => $e->getMessage()]); // Registra el error
            return $this->respondError('Error al crear el rol: ' . $e->getMessage());
        }
    }

    public function edit(TblSegRolEditRequest $request, $rec_id = null)
    {
        try {
            DB::beginTransaction();

            $query = TblSegRol::query();
            $record = $query->findOrFail($rec_id, TblSegRol::editFields());

            if ($request->isMethod('post')) {
                $modeldata = $request->validated();

                // Actualizar datos del rol
                $rolData = [
                    'rol_descripcion' => $modeldata['nombre'],
                    // No actualizamos rol_fecha_creacion ni rol_usuario_creacion
                    // ya que son campos de creación original
                ];

                $record->update($rolData);

                // Actualizar menús asociados
                if (isset($modeldata['selectedNodes']) && is_array($modeldata['selectedNodes'])) {
                    // Marcar como inactivos los menús anteriores
                    TblSegRolMenu::where('rolme_rol_id', $rec_id)
                        ->update([
                            'rolme_estado' => 'INA'
                        ]);

                    // Crear o actualizar nuevos registros de menús
                    foreach ($modeldata['selectedNodes'] as $menu_id) {
                        TblSegRolMenu::updateOrCreate(
                            [
                                'rolme_rol_id' => $rec_id,
                                'rolme_me_id' => $menu_id
                            ],
                            [
                                'rolme_estado' => 'V',
                                'rolme_usuario_creacion' => auth()->id() ?? 1,
                                'rolme_fecha_creacion' => Carbon::now()
                            ]
                        );
                    }
                }
            }

            DB::commit();
            return $this->respond($record);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->respondError('Error al actualizar el rol: ' . $e->getMessage());
        }
    }

    private function respondError($message)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 500);
    }

	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	/*function add(TblSegRolAddRequest $request){
		$modeldata = $request->validated();

		//save TblSegRol record
		$record = TblSegRol::create($modeldata);
		$rec_id = $record->rol_id;
		return $this->respond($record);
	}*/


	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	/*function edit(TblSegRolEditRequest $request, $rec_id = null){
		$query = TblSegRol::query();
		$record = $query->findOrFail($rec_id, TblSegRol::editFields());
		if ($request->isMethod('post')) {
			$modeldata = $request->validated();
			$record->update($modeldata);
		}
		return $this->respond($record);
	}*/


	/**
     * Delete record from the database
	 * Support multi delete by separating record id by comma.
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_id //can be separated by comma
     * @return \Illuminate\Http\Response
     */
	function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblSegRol::query();
		$query->whereIn("rol_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}

     public function getRolById($id_rol)
    {
        // Buscar el rol en la base de datos
        $rol = TblSegRol::find($id_rol);

        // Verificar si el rol existe
        if (!$rol) {
            return response()->json([
                'success' => false,
                'message' => 'Rol no encontrado',
            ], 404);
        }

        // Devolver los datos del rol
        return response()->json([
            'success' => true,
            'data' => [
                'id_rol' => $rol->rol_id,
                'nombre' => $rol->rol_descripcion,
                'descripcion' => $rol->rol_descripcion,
            ],
        ]);
    }

    function getAllRoles()
    {
        try {
            // Obtener todos los registros de la tabla tblsegrol
            $roles = TblSegRol::all();
            return $this->respond($roles);
        } catch (Exception $e) {
            return $this->respondWithError($e->getMessage());
        }
    }


    private function respondWithError($message, $statusCode = 500)
    {
        return response()->json([
            'error' => $message,
        ], $statusCode);
    }
}
