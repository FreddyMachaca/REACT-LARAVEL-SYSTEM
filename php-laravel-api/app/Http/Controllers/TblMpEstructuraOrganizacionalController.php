<?php

namespace App\Http\Controllers;

use App\Http\Requests\TblMpEstructuraOrganizacionalAddRequest;
use App\Models\TblMpCategoriaProgramatica;
use App\Models\TblMpEstructuraOrganizacional;


class TblMpEstructuraOrganizacionalController extends Controller
{
    public function add(TblMpEstructuraOrganizacionalAddRequest $request){
        $modeldata = $request->validated();
		$record = TblMpEstructuraOrganizacional::create($modeldata);
        
        return $this->respond($record);
    }

    
    public function getOrgStructureAndCategory($rec_id) {
        $record = TblMpEstructuraOrganizacional::find($rec_id);
        // $max = TblMpEstructuraOrganizacional::where('eo_cod_superior', $rec_id)
        // ->max('eo_unidad'); 

        $max = TblMpEstructuraOrganizacional::where('eo_pr_id', $record->eo_pr_id)
            ->where('eo_prog', $record->eo_prog)
            ->where('eo_sprog', $record->eo_sprog)
            ->where('eo_proy', $record->eo_proy)
            ->max('eo_unidad'); 

        $record->eo_unidad = $max + 1; // this is the new value of eo_unidad

        $record_cp = TblMpCategoriaProgramatica::find($record->eo_cp_id);

        $data = [
            'record' => $record,
            'record_cp' => $record_cp,
        ];
        return response()->json($data);
    }

    public function getTreeOrganizationalEstructure($eo_pr_id) {
        // Obtener todos los registros relacionados en una sola consulta
        $allRecords = TblMpEstructuraOrganizacional::from('tbl_mp_estructura_organizacional as eo')
            ->leftJoin('tbl_mp_categoria_programatica as cp', 'cp.cp_id', '=', 'eo.eo_cp_id') 
            ->where('eo.eo_pr_id', $eo_pr_id)
            ->where('eo.eo_obract', 0)
            ->where(function ($query) {
                $query->where('cp.cp_pr_id', 21)
                    ->orWhereNull('cp.cp_pr_id'); 
            })
            ->select(
                'eo.eo_id',
                'eo.eo_cp_id',
                'eo.eo_prog',
                'eo.eo_sprog',
                'eo.eo_proy',
                'eo.eo_unidad',
                'eo.eo_descripcion',
                'eo.eo_cod_superior',
            
                'cp.cp_da', 
                'cp.cp_ue', 
                'cp.cp_programa', 
                'cp.cp_proyecto', 
                'cp.cp_actividad', 
                'cp.cp_fuente',
                'cp.cp_organismo',
            )
            ->get();

    
        // Filtrar los nodos raíz (padres)
        $parents = $allRecords->where('eo_cp_id', 0);

    
        //Construir el árbol recursivamente
        $tree = $parents->map(function ($parent) use ($allRecords) {
            return $this->buildTree($allRecords, $parent);
        });
    
        return response()->json($tree);
    }
    
    private function buildTree($records, $node) {
        // Obtener hijos del nodo actual
        $children = $records->where('eo_cod_superior', $node->eo_id);
    
        // Construir estructura del nodo
        $result = $node->toArray();
        $result['children'] = $children->map(function ($child) use ($records) {
            return $this->buildTree($records, $child);
        });
    
        return $result;
    }

}
