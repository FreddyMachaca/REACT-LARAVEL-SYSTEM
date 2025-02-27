<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblItem extends Model
{
    use HasFactory;

    protected $table = 'tbl_items'; // Nombre de la tabla

    protected $primaryKey = 'id'; // Clave primaria

    public $timestamps = false; // Desactivar timestamps automáticos

    // Solo incluir los campos que existen en la tabla
    protected $fillable = [
        'codigo_item',
        'cargo',
        'haber_basico',
        'unidad_organizacional',
        'tiempo_jornada',
        'cantidad',
        'fecha_creacion'
    ];

    protected $casts = [
        'haber_basico' => 'decimal:2',
        'cantidad' => 'integer',
        'fecha_creacion' => 'datetime'
    ];

    /**
     * Set search query for the model
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $text
     */
    public static function search($query, $text){
        //search table record 
        $search_condition = '(
                CAST(id AS TEXT) LIKE ?  OR 
                codigo_item LIKE ?  OR 
                cargo LIKE ?  OR 
                CAST(haber_basico AS TEXT) LIKE ?  OR 
                unidad_organizacional LIKE ?  OR
                tiempo_jornada LIKE ?  OR
                CAST(cantidad AS TEXT) LIKE ?
        )';
        $search_params = [
            "%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%"
        ];
        //setting search conditions
        $query->whereRaw($search_condition, $search_params);
    }

    /**
     * return list page fields of the model.
     */
    public static function listFields(){
        return [ 
            "id", 
            "codigo_item",
            "cargo",
            "haber_basico",
            "unidad_organizacional",
            "tiempo_jornada",
            "cantidad",
            "fecha_creacion"
        ];
    }

    /**
     * return exportList page fields of the model.
     */
    public static function exportListFields(){
        return [ 
            "id", 
            "codigo_item",
            "cargo",
            "haber_basico",
            "unidad_organizacional",
            "tiempo_jornada",
            "cantidad",
            "fecha_creacion"
        ];
    }

    /**
     * return view page fields of the model.
     */
    public static function viewFields(){
        return [ 
            "id", 
            "codigo_item",
            "cargo",
            "haber_basico",
            "unidad_organizacional",
            "tiempo_jornada",
            "cantidad",
            "fecha_creacion"
        ];
    }

    /**
     * return edit page fields of the model.
     */
    public static function editFields(){
        return [ 
            "id", 
            "codigo_item",
            "cargo",
            "haber_basico",
            "unidad_organizacional",
            "tiempo_jornada",
            "cantidad",
            "fecha_creacion"
        ];
    }
}
