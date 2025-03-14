<?php

namespace App\Http\Controllers;

use App\Models\TblMpMemosHistoricos;
use Illuminate\Http\Request;

class TblMpMemosHistoricosController extends Controller
{
    public function prueba(){
        $record = TblMpMemosHistoricos::find(0);
        return response()->json($record);
    }
}
