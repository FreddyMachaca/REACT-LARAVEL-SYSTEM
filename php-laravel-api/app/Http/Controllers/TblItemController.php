<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TblItem;

class TblItemController extends Controller
{
    // Obtener todos los ítems
    public function index($filter = null, $filtervalue = null)
    {
        if ($filter && $filtervalue) {
            return TblItem::where($filter, $filtervalue)->get();
        }
        return TblItem::all();
    }

    // Ver un ítem específico
    public function view($rec_id)
    {
        return TblItem::findOrFail($rec_id);
    }

    // Agregar un nuevo ítem
    public function add(Request $request)
    {
        $item = TblItem::create($request->all());
        return response()->json($item, 201);
    }

    // Editar un ítem existente
    public function edit(Request $request, $rec_id)
    {
        $item = TblItem::findOrFail($rec_id);
        $item->update($request->all());
        return response()->json($item, 200);
    }

    // Eliminar un ítem
    public function delete($rec_id)
    {
        $item = TblItem::findOrFail($rec_id);
        $item->delete();
        return response()->json(null, 204);
    }
}
