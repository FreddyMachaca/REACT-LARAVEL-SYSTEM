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

    protected $fillable = [
        'codigo_item',
        'cargo',
        'haber_basico',
        'unidad_organizacional',
        'fecha_creacion'
    ];
}
