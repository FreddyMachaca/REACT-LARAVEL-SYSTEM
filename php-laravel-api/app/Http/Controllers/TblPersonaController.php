<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TblPersonaAddRequest;
use App\Models\TblPersona;
use App\Models\TblPersonaDomicilio;
use Illuminate\Http\Request;
use Exception;
use DB;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
class TblPersonaController extends Controller
{
    /**
     * List table records
     * @param Request $request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\Http\Response
     */
    function index(Request $request, $fieldname = null, $fieldvalue = null){
        try{
            $query = TblPersona::query();

            // Aplicar filtros solo si tienen valor
            if ($request->nombres && trim($request->nombres) !== '') {
                $query->where('per_nombres', 'ILIKE', '%'.trim($request->nombres).'%');
            }

            if ($request->apellido_paterno && trim($request->apellido_paterno) !== '') {
                $query->where('per_ap_paterno', 'ILIKE', '%'.trim($request->apellido_paterno).'%');
            }

            if ($request->apellido_materno && trim($request->apellido_materno) !== '') {
                $query->where('per_ap_materno', 'ILIKE', '%'.trim($request->apellido_materno).'%');
            }

            if ($request->num_doc && trim($request->num_doc) !== '') {
                $query->where('per_num_doc', 'ILIKE', '%'.trim($request->num_doc).'%');
            }

            $query->whereNotNull('per_nombres')
                  ->whereNotNull('per_ap_paterno')
                  ->whereNotNull('per_num_doc')
                  ->where('per_nombres', '!=', '')
                  ->where('per_ap_paterno', '!=', '')
                  ->where('per_num_doc', '!=', '');

            if ($request->with_assignments) {
                $query->has('asignacionesTipoAportante');
            }

            $query->leftJoin('tbl_mp_asignacion', function($join) {
                $join->on('tbl_persona.per_id', '=', 'tbl_mp_asignacion.as_per_id')
                     ->where('tbl_mp_asignacion.as_estado', '=', 'V');
            })
            ->leftJoin('tbl_mp_cargo', 'tbl_mp_asignacion.as_ca_id', '=', 'tbl_mp_cargo.ca_id')
            ->leftJoin('tbl_mp_escala_salarial', 'tbl_mp_cargo.ca_es_id', '=', 'tbl_mp_escala_salarial.es_id')
            ->leftJoin('tbl_mp_nivel_salarial', 'tbl_mp_escala_salarial.es_ns_id', '=', 'tbl_mp_nivel_salarial.ns_id')
            ->select(
                'tbl_persona.*',
                'tbl_mp_asignacion.as_id',
                'tbl_mp_asignacion.as_ca_id',
                'tbl_mp_cargo.ca_ti_item',
                'tbl_mp_cargo.ca_num_item',
                'tbl_mp_cargo.ca_tipo_jornada',
                'tbl_mp_escala_salarial.es_descripcion as cargo_descripcion',
                'tbl_mp_escala_salarial.es_escalafon',
                'tbl_mp_nivel_salarial.ns_clase',
                'tbl_mp_nivel_salarial.ns_nivel',
                'tbl_mp_nivel_salarial.ns_haber_basico',
                DB::raw('CASE WHEN tbl_mp_asignacion.as_id IS NOT NULL THEN true ELSE false END as tiene_item')
            );

            if ($request->nombres) {
                $query->where('per_nombres', 'ILIKE', "%{$request->nombres}%");
            }

            if ($request->apellido_paterno) {
                $query->where('per_ap_paterno', 'ILIKE', "%{$request->apellido_paterno}%");
            }

            if ($request->apellido_materno) {
                $query->where('per_ap_materno', 'ILIKE', "%{$request->apellido_materno}%");
            }

            if ($request->num_doc) {
                $query->where('per_num_doc', 'ILIKE', "%{$request->num_doc}%");
            }

            if($request->search){
                $search = trim($request->search);
                TblPersona::search($query, $search);
            }

            $orderby = $request->orderby ?? "tbl_persona.per_id";
            $ordertype = $request->ordertype ?? "desc";
            $query->orderBy($orderby, $ordertype);

            if ($fieldname) {
                $query->where($fieldname, $fieldvalue);
            }

            // Paginación
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 10);

            // Obtener el total antes de la paginación
            $total = $query->count();

            // Aplicar paginación
            $records = $query->skip(($page - 1) * $limit)
                            ->take($limit)
                            ->get();

            $records = $records->filter(function($record) {
                return !empty(trim($record->per_nombres)) &&
                       !empty(trim($record->per_ap_paterno)) &&
                       !empty(trim($record->per_num_doc));
            })->values();

            return $this->respond([
                'records' => $records,
                'total_records' => $total,
                'current_page' => $page,
                'per_page' => $limit,
                'total_pages' => ceil($total / $limit)
            ]);
        }
        catch(Exception $e){
            \Log::error('Error en TblPersonaController@index: ' . $e->getMessage());
            return $this->respondWithError($e);
        }
    }

    function getPersonWithHome(Request $request, $fieldname = null, $fieldvalue = null){
        //$query = TblPersona::with('domicilio');
        $query = TblPersona::with([
            'domicilio' => function ($q) {
                $q->select('*');
            },
            'procedencia' => function ($q) {
                $q->select('cat_id', 'cat_descripcion');
            },
            'lugarNacimiento' => function ($q) {
                $q->select('cat_id', 'cat_descripcion');
            },
            'estadoCivil' => function ($q) {
                $q->select('cat_id', 'cat_descripcion');
            },
            'lugarExportado' => function ($q) {
                $q->select('cat_id', 'cat_descripcion');
            }
        ])->select('per_id', 'per_nombres', 'per_ap_paterno', 'per_procedencia', 'per_lugar_nac', 'per_estado_civil',
            'per_tipo_doc', 'per_num_doc', 'per_lugar_exp', 'per_ap_materno', 'per_ap_casada', 'per_sexo',
            'per_fecha_nac', 'per_serie_libreta_militar', 'per_fecha_registro'
        );

        if ($request->search) {
            $search = trim($request->search);
            TblPersona::search($query, $search);
        }

        $orderby = $request->orderby ?? "tbl_persona.per_id";
        $ordertype = $request->ordertype ?? "desc";
        $query->orderBy($orderby, $ordertype);

        if ($fieldname) {
            $query->where($fieldname, $fieldvalue);
        }

        $records = $query->get();
        return $this->respond($records);
    }

    function addPersonAndHome(TblPersonaAddRequest $request){
        try {
            DB::beginTransaction();

            $modeldata = $request->validated();
            $modeldata['per_fecha_registro'] = Carbon::now();
            $persona = TblPersona::create($modeldata);

            $domicilioData = $request->only([
                'perd_ciudad_residencia',
                'perd_descripcion_via',
                'perd_numero',
                'perd_tipo_via',
                'perd_zona'
            ]);
            $domicilioData['perd_per_id'] = $persona->per_id;
            $domicilioData['perd_fecha_creacion'] = Carbon::now();
            $domicilio = TblPersonaDomicilio::create($domicilioData);

            DB::commit();
            return $this->respond($persona);
        } catch (Exception $e) {
            DB::rollback();
            return $this->respondWithError($e);
        }
    }

    /**
     * Select table record by ID
     * @param string $rec_id
     * @return \Illuminate\Http\Response
     */
    function view($rec_id = null){
        try{
            $query = TblPersona::query();

            $query->leftJoin('tbl_mp_asignacion', function($join) {
                $join->on('tbl_persona.per_id', '=', 'tbl_mp_asignacion.as_per_id')
                     ->where('tbl_mp_asignacion.as_estado', '=', 'V'); // Solo asignaciones vigentes
            })
            ->leftJoin('tbl_mp_cargo', 'tbl_mp_asignacion.as_ca_id', '=', 'tbl_mp_cargo.ca_id')
            ->select(
                'tbl_persona.*',
                'tbl_mp_asignacion.as_id',
                'tbl_mp_asignacion.as_ca_id',
                'tbl_mp_cargo.ca_ti_item',
                'tbl_mp_cargo.ca_num_item'
            );

            $record = $query->findOrFail($rec_id);

            $record->tiene_item = !is_null($record->as_id);

            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }

    /**
     * Save form record to the table
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    function add(Request $request){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $modeldata['per_fecha_registro'] = $modeldata['per_fecha_registro'] ?? now();

            DB::beginTransaction();
            $record = TblPersona::create($modeldata);
            DB::commit();

            return $this->respond($record);
        }
        catch(Exception $e){
            DB::rollback();
            return $this->respondWithError($e);
        }
    }

    /**
     * Update table record with form data
     * @param Request $request
     * @param string $rec_id //select record by table primary key
     * @return \Illuminate\Http\Response
     */
    function edit(Request $request, $rec_id = null){
        try{
            $modeldata = $this->normalizeFormData($request->all());
            $record = TblPersona::findOrFail($rec_id);
            $record->update($modeldata);
            return $this->respond($record);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }

    /**
     * Delete record from the database
     * @param Request $request
     * @param string $rec_id //can be separated by comma for multiple records
     * @return \Illuminate\Http\Response
     */
    function delete(Request $request, $rec_id = null){
        try{
            $arr_id = explode(",", $rec_id);
            $query = TblPersona::query();
            $query->whereIn("per_id", $arr_id);
            $query->delete();

            return $this->respond([
                "status" => "success",
                "message" => "Registros eliminados exitosamente",
                "deleted_records" => count($arr_id)
            ]);
        }
        catch(Exception $e){
            return $this->respondWithError($e);
        }
    }

    function getDataForSelect () {
        $records = TblPersona::select('per_id', 'per_ap_materno', 'per_ap_paterno', 'per_nombres')
        ->get();

        return response()->json($records);
    }
    
    public function obtenerEmpleado(): JsonResponse
    {
        return response()->json([
            'foto' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRezYSyEzcasjaNDM7MW1642vvo8e8TSEdoKA&s',
            'estado' => 'Pasivo',
            'nombre' => 'CARLOS EDUARDO ASIN HAYDAR',
            'ci' => '471563 LP',
            'codigo' => '5572',
            'item' => 'P-911',
            'cargo' => 'PROFESIONAL III',
            'puesto' => 'SANEADOR TÉCNICO UACT DATC',
            'haber_basico' => 6564.00,
            'codigo_escalafon' => '303',
            'nivel_salarial' => '04',
            'clase' => '0',
            'fecha_alta' => '11/06/2015',
            'fecha_baja' => '29/06/2015',
            'ubicacion_admin' => 'UNIDAD DE ADMINISTRACIÓN Y CONTROL TERRITORIAL',
            'categoria_admin' => '3 - 10 - 4 - 1 - 0',
            'ubicacion_prog' => 'SERVICIOS DE ADMINISTRACIÓN DIRECCIÓN DE ADMINISTRACIÓN TERRITORIAL Y CATASTRAL',
            'categoria_prog' => '8 - 137 - 3 - 0 - 5'
        ]);
    }
    public function obtenerOpciones($personaId): JsonResponse
    {
        $results = DB::select("
        SELECT
            pe.per_id AS value,
            CONCAT(pe.per_nombres, ' ', pe.per_ap_paterno, ' ', pe.per_ap_materno) AS label,
            eo.eo_id,
            eo.eo_cod_superior,
            ca.ca_ti_item,
            ca.ca_num_item
        FROM
            tbl_mp_cargo AS ca
            INNER JOIN tbl_mp_escala_salarial AS es ON ca.ca_es_id = es.es_id
            INNER JOIN tbl_mp_asignacion AS asignacion ON ca.ca_id = asignacion.as_ca_id
            INNER JOIN tbl_persona AS pe ON asignacion.as_per_id = pe.per_id
            INNER JOIN tbl_mp_estructura_organizacional AS eo ON ca.ca_eo_id = eo.eo_id
        WHERE
            eo.eo_id = (
                SELECT eo2.eo_id
                FROM tbl_mp_cargo AS ca2
                INNER JOIN tbl_mp_asignacion AS asignacion2 ON ca2.ca_id = asignacion2.as_ca_id
                INNER JOIN tbl_mp_estructura_organizacional AS eo2 ON ca2.ca_eo_id = eo2.eo_id
                WHERE asignacion2.as_per_id = ?
                LIMIT 1
            )
            AND TRIM(ca.ca_ti_item) = 'E'
    ", [$personaId]);

    return response()->json([
        'success' => true,
        'data' => $results
    ]);
    }
}
