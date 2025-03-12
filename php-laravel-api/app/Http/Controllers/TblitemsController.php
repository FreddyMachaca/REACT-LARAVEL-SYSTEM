<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpCargo;
use App\Models\TblMpEscalaSalarial;
use App\Models\TblMpNivelSalarial;
use App\Models\TblMpEstructuraOrganizacional;
use App\Models\TblMpCategoriaProgramatica;
use App\Models\TblMpTipoItem;
use Illuminate\Http\Request;
use Exception;
use DB;

class TblitemsController extends Controller
{
    /**
     * Get paginated items with combined data from all related tables
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function index(Request $request){
        try {
            $page = $request->page ?? 1;
            $limit = $request->limit ?? 20;
            $search = $request->search ?? '';
            $filter = $request->filter ?? null;
            $filtervalue = $request->filtervalue ?? null;
            
            // Consulta directa con DB para mejor rendimiento y claridad
            $query = DB::table('tbl_mp_cargo AS c')
                ->select([
                    'c.ca_id AS id', 
                    'c.ca_ti_item', 
                    'c.ca_num_item', 
                    'c.ca_tipo_jornada AS tipo_jornada',
                    'c.ca_fecha_creacion AS fecha_creacion',
                    'es.es_descripcion AS cargo',
                    'ns.ns_haber_basico AS haber_basico',
                    'eo.eo_descripcion AS unidad_organizacional'
                ])
                ->leftJoin('tbl_mp_escala_salarial AS es', 'c.ca_es_id', '=', 'es.es_id')
                ->leftJoin('tbl_mp_nivel_salarial AS ns', 'es.es_ns_id', '=', 'ns.ns_id')
                ->leftJoin('tbl_mp_estructura_organizacional AS eo', 'c.ca_eo_id', '=', 'eo.eo_id')
                // Filtrar por gestión 2
                ->where('eo.eo_pr_id', 2);
            
            if($search) {
                $searchTerm = "%{$search}%";
                $query->where(function($q) use ($searchTerm) {
                    $q->where('c.ca_ti_item', 'ILIKE', $searchTerm)
                      ->orWhere('c.ca_num_item', 'ILIKE', $searchTerm)
                      ->orWhere('es.es_descripcion', 'ILIKE', $searchTerm)
                      ->orWhere('eo.eo_descripcion', 'ILIKE', $searchTerm);
                });
            }
            
            if ($filter && $filtervalue) {
                if ($filter === 'ca_eo_id') {
                    $query->where('c.ca_eo_id', $filtervalue);
                    
                    // Obtener estructura con categoria programatica
                    $estructura = TblMpEstructuraOrganizacional::where('eo_id', $filtervalue)
                        ->where('eo_pr_id', 2)
                        ->with('categoriaProgramatica')
                        ->first();
                        
                    if ($estructura) {
                        $cp_descripcion = $estructura->categoriaProgramatica ? 
                            $estructura->categoriaProgramatica->cp_descripcion : 'No disponible';
                            
                        $responseStruct = [
                            'eo_id' => $estructura->eo_id,
                            'eo_descripcion' => $estructura->eo_descripcion,
                            'cp_descripcion' => $cp_descripcion
                        ];
                    }
                }
            }
            
            // Ordenar por fecha de creación
            $query->orderBy('c.ca_fecha_creacion', 'desc');
            
            // Contar total de registros
            $total_records = $query->count();
            
            // Aplicar paginación
            $cargo_records = $query->skip(($page - 1) * $limit)
                                   ->take($limit)
                                   ->get();
            
            // Formatear registros para incluir el código compuesto
            $combined_records = $cargo_records->map(function($cargo) {
                $cargo->codigo = $cargo->ca_ti_item . '-' . $cargo->ca_num_item;
                return $cargo;
            });
            
            return $this->respond([
                'records' => $combined_records,
                'total_records' => $total_records,
                'page' => $page,
                'limit' => $limit,
                'estructura_info' => $responseStruct ?? null
            ]);
            
        } catch (Exception $e) {
            \Log::error("Error in TblitemsController@index: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Get single item with all related data
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function view($rec_id = null){
        try {
            $cargo = TblMpCargo::findOrFail($rec_id);
            
            $escala = null;
            if ($cargo->ca_es_id) {
                $escala = TblMpEscalaSalarial::find($cargo->ca_es_id);
            }
            
            $nivel = null;
            if ($escala && $escala->es_ns_id) {
                $nivel = TblMpNivelSalarial::find($escala->es_ns_id);
            }
            
            $estructura = null;
            if ($cargo->ca_eo_id) {
                $estructura = TblMpEstructuraOrganizacional::find($cargo->ca_eo_id);
            }
            
            $combined_record = [
                'id' => $cargo->ca_id,
                'codigo' => $cargo->ca_ti_item . '-' . $cargo->ca_num_item,
                'cargo' => $escala ? $escala->es_descripcion : '',
                'haber_basico' => $nivel ? $nivel->ns_haber_basico : '',
                'unidad_organizacional' => $estructura ? $estructura->eo_descripcion : '',
                'fecha_creacion' => $cargo->ca_fecha_creacion,
                'cargo_original' => $cargo,
                'escala_original' => $escala,
                'nivel_original' => $nivel,
                'estructura_original' => $estructura
            ];
            
            return $this->respond($combined_record);
            
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Update item record
     * @param Request $request
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function edit(Request $request, $rec_id = null){
        try {
            $cargo = TblMpCargo::findOrFail($rec_id);
            
            if ($request->isMethod('post')) {
                $modeldata = $this->normalizeFormData($request->all());
                
                $cargo->update([
                    'ca_ti_item' => $modeldata['ca_ti_item'] ?? $cargo->ca_ti_item,
                    'ca_num_item' => $modeldata['ca_num_item'] ?? $cargo->ca_num_item,
                    'ca_es_id' => $modeldata['ca_es_id'] ?? $cargo->ca_es_id,
                    'ca_eo_id' => $modeldata['ca_eo_id'] ?? $cargo->ca_eo_id
                ]);
                
                return $this->view($rec_id);
            } else {
                return $this->view($rec_id);
            }
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Delete item record
     * @param Request $request
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function delete(Request $request, $rec_id = null){
        try {
            \Log::debug("Delete request received for ID(s): {$rec_id}");
            
            if (empty($rec_id)) {
                return $this->respondWithError(new \Exception("ID no proporcionado para la eliminación"));
            }
            
            $arr_id = explode(",", $rec_id);
            
            \Log::debug("IDs to delete:", $arr_id);
            
            if (empty($arr_id)) {
                return $this->respondWithError(new \Exception("No se pudo procesar los IDs para eliminación"));
            }
            
            $query = TblMpCargo::query();
            $query->whereIn("ca_id", $arr_id);
            
            $count = $query->count();
            if ($count === 0) {
                return $this->respondWithError(new \Exception("No se encontraron registros para eliminar"));
            }
            
            $query->delete();
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Registro(s) eliminado(s) con éxito',
                'deleted_ids' => $arr_id,
                'count' => $count
            ]);
        } catch (\Exception $e) {
            \Log::error("Error al eliminar registros: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Get options for related fields
     * @return \Illuminate\Http\Response
     */
    function getOptions(){
        try {
            $escalaOptions = TblMpEscalaSalarial::select(
                    'tbl_mp_escala_salarial.es_id', 
                    'tbl_mp_escala_salarial.es_descripcion',
                    'tbl_mp_escala_salarial.es_escalafon',
                    'tbl_mp_nivel_salarial.ns_clase',
                    'tbl_mp_nivel_salarial.ns_nivel',
                    'tbl_mp_nivel_salarial.ns_haber_basico'
                )
                ->where('tbl_mp_escala_salarial.es_pr_id', 2) // Filtrar por gestión 2
                ->leftJoin('tbl_mp_nivel_salarial', 'tbl_mp_escala_salarial.es_ns_id', '=', 'tbl_mp_nivel_salarial.ns_id')
                ->orderBy('tbl_mp_escala_salarial.es_escalafon')
                ->get();
            
            $estructuraOptions = TblMpEstructuraOrganizacional::select('eo_id', 'eo_descripcion')
                ->where('eo_pr_id', 2) // Filtrar por gestión 2
                ->orderBy('eo_descripcion')
                ->get();
            
            $tipoItems = TblMpTipoItem::whereIn('ti_item', ['A', 'C', 'E', 'P', 'S'])
                ->orderBy('ti_orden')
                ->get(['ti_item', 'ti_descripcion']);
                
            return $this->respond([
                'escalaOptions' => $escalaOptions,
                'estructuraOptions' => $estructuraOptions,
                'tipoItems' => $tipoItems
            ]);
        } catch (Exception $e) {
            return $this->respondWithError($e);
        }
    }
    
    /**
     * Add a new item record
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    function add(Request $request){
        try {
            $modeldata = $this->normalizeFormData($request->all());
            
            \Log::info("Received data for new item:", $modeldata);
            
            $currentGestion = 2; // Gestión 2
            $cantidad = isset($modeldata['cantidad']) ? intval($modeldata['cantidad']) : 1;
            
            if ($cantidad < 1) {
                $cantidad = 1;
            }
            
            if (empty($modeldata['ca_ti_item'])) {
                return $this->respondWithError(new \Exception("El campo Tipo Item es requerido"));
            }
            
            if (empty($modeldata['ca_es_id'])) {
                return $this->respondWithError(new \Exception("El campo Cargo es requerido"));
            }
            
            if (empty($modeldata['ca_eo_id'])) {
                return $this->respondWithError(new \Exception("La Unidad Organizacional es requerida"));
            }
            
            // Verificar que la estructura organizacional pertenezca a la gestión 2
            $estructura = TblMpEstructuraOrganizacional::find($modeldata['ca_eo_id']);
            if (!$estructura || $estructura->eo_pr_id != 2) {
                return $this->respondWithError(new \Exception("La Unidad Organizacional debe pertenecer a la gestión 2"));
            }
            
            $baseTiItem = $modeldata['ca_ti_item'];
            
            $existingItems = TblMpCargo::where('ca_eo_id', $modeldata['ca_eo_id'])
                ->where('ca_ti_item', $baseTiItem)
                ->orderBy('ca_num_item', 'desc')
                ->get(['ca_num_item']);
            
            \Log::info("Found " . $existingItems->count() . " existing items with the same tipo_item and eo_id");
            
            $highestNumItem = 1;
            if ($existingItems->count() > 0) {
                foreach ($existingItems as $item) {
                    if (!empty($item->ca_num_item) && intval($item->ca_num_item) > $highestNumItem) {
                        $highestNumItem = intval($item->ca_num_item);
                    }
                }
                \Log::info("Highest existing item number: " . $highestNumItem);
            }
            
            $startNumItem = $highestNumItem;
            $createdItems = [];
            
            \Log::info("Will create {$cantidad} items starting from number: " . ($startNumItem + 1));
            
            DB::beginTransaction();
            try {
                $maxId = DB::table('tbl_mp_cargo')->max('ca_id') ?? 0;
                \Log::info("Current max ca_id is: {$maxId}");
                
                for ($i = 0; $i < $cantidad; $i++) {
                    $numItem = $startNumItem + 1 + $i;
                    
                    $newId = $maxId + 1 + $i;
                    
                    $cargoData = [
                        'ca_id' => $newId, 
                        'ca_ti_item' => $baseTiItem,
                        'ca_num_item' => $numItem,
                        'ca_es_id' => $modeldata['ca_es_id'],
                        'ca_eo_id' => $modeldata['ca_eo_id'],
                        'ca_tipo_jornada' => $modeldata['ca_tipo_jornada'] ?? 'TT',
                        'ca_pr_id' => $currentGestion,
                        'ca_estado' => 'V',
                        'ca_fecha_creacion' => now()
                    ];
                    
                    \Log::info("Creating item with data:", $cargoData);
                    
                    $cargo = TblMpCargo::create($cargoData);
                    
                    $createdItems[] = [
                        'id' => $cargo->ca_id,
                        'codigo' => $cargo->ca_ti_item . '-' . $cargo->ca_num_item,
                        'estado' => 'Vigente'
                    ];
                }
                
                DB::commit();
                
                return $this->respond([
                    'status' => 'success',
                    'message' => $cantidad > 1 ? "{$cantidad} items creados correctamente" : "Item creado correctamente",
                    'records' => $createdItems,
                    'count' => $cantidad
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (Exception $e) {
            \Log::error("Error creating items: " . $e->getMessage());
            \Log::error("Stack trace: " . $e->getTraceAsString());
            return $this->respondWithError($e);
        }
    }
}
