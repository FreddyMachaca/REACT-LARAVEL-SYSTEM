<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActaentregacabAddRequest;
use App\Http\Requests\ActaentregacabEditRequest;
use App\Models\Actaentregacab;
use App\Models\Actaentregadet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class ActaentregacabController extends Controller
{

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // Guardar en la tabla actaentregacab
            $actaCab = [
                'ae_observacion' => $request->observacion,
                'ae_recaudaciontotalbs' => $request->recaudacion_total,
                'punto_recaud_id' => $request->punto_recaudacion,
                'ae_fecha' => $request->fecha,
                'ae_grupo' => $request->grupo,
                'ae_operador1erturno' => $request->operador_1er_turno,
                'ae_operador2doturno' => $request->operador_2do_turno,
                'ae_cambiobs' => $request->cambio_bs,
                'ae_cajachicabs' => $request->caja_chica_bs,
                'ae_llaves' => $request->llaves,
                'ae_fechero' => $request->fechero,
                'ae_tampo' => $request->tampo,
                'ae_candados' => $request->candados,
            ];
            $record = Actaentregacab::create($actaCab);
            // Verifica que el ID se haya generado correctamente
            if (!$actaCab || !$record->ae_actaid) {
                throw new \Exception("No se pudo obtener el ID del acta creada.");
            }
            // Guardar los registros en actaentregadet
            foreach ($request->registros as $registro) {
                ActaEntregaDet::create([
                    'ae_actaid' => $record->ae_actaid,
                    'servicio_idop1' => $registro['tipo_servicio'],
                    'aed_desdenumeroop1' => $registro['desde_numero'],
                    'aed_hastanumeroop1' => $registro['hasta_numero'],
                    'aed_vendidohastaop1' => $registro['cantidad_boletos'],
                    'aed_cantidadop1' => $registro['cantidad_boletos'],
                    'aed_preciounitario' => $registro['precio_unitario'],
                    'aed_importebsop1' => $registro['importe_total'],
                    'aed_estado' => "A",
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Acta guardada correctamente'], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al guardar el acta', 'details' => $e->getMessage()], 500);
        }
    }

    public function buscarActas(Request $request) {
        $query = Actaentregacab::query();

        if ($request->has('correlativo') && !empty($request->correlativo)) {
            $query->where('ae_correlativo', 'LIKE', "%{$request->correlativo}%");
        }

        if ($request->has('fecha') && !empty($request->fecha)) {
            $query->whereDate('ae_fecha', $request->fecha); // Para fechas exactas
            // Alternativa para búsqueda flexible:
            // $query->where('ae_fecha', 'LIKE', "%{$request->fecha}%");
        }

        if ($request->has('estado') && !empty($request->estado)) {
            $query->where('ae_estado', 'LIKE', "%{$request->estado}%");
        }

        return response()->json($query->get());
    }

    /**
     * List table records
     * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
    function index(Request $request, $fieldname = null, $fieldvalue = null)
    {
        $query = Actaentregacab::query();
        if ($request->search) {
            $search = trim($request->search);
            Actaentregacab::search($query, $search);
        }
        $orderby = $request->orderby ?? "actaentregacab.ae_actaid";
        $ordertype = $request->ordertype ?? "desc";
        $query->orderBy($orderby, $ordertype);
        if ($fieldname) {
            $query->where($fieldname, $fieldvalue); //filter by a single field name
        }
        $records = $this->paginate($query, Actaentregacab::listFields());
        return $this->respond($records);
    }


    /**
     * Select table record by ID
     * @param string $rec_id
     * @return \Illuminate\View\View
     */
    function view($rec_id = null)
    {
        $query = Actaentregacab::query();
        $record = $query->findOrFail($rec_id, Actaentregacab::viewFields());
        return $this->respond($record);
    }


    /**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
    function add(ActaentregacabAddRequest $request)
    {
        $modeldata = $request->validated();

        //save Actaentregacab record
        $record = Actaentregacab::create($modeldata);
        $rec_id = $record->ae_actaid;
        return $this->respond($record);
    }


    /**
     * Update table record with form data
     * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
    function edit(ActaentregacabEditRequest $request, $rec_id = null)
    {
        $query = Actaentregacab::query();
        $record = $query->findOrFail($rec_id, Actaentregacab::editFields());
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
    function delete(Request $request, $rec_id = null)
    {
        $arr_id = explode(",", $rec_id);
        $query = Actaentregacab::query();
        $query->whereIn("ae_actaid", $arr_id);
        $query->delete();
        return $this->respond($arr_id);
    }
}
