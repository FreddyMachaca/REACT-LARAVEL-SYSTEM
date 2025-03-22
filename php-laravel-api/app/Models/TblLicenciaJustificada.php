<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblLicenciaJustificada extends Model
{
    use HasFactory;

    protected $table = 'tbl_cp_licencia_justificada'; // Nombre real de la tabla en la BD
    protected $primaryKey = 'lj_id'; // Clave primaria

    public $timestamps = false; // Desactivar timestamps (created_at, updated_at)

    protected $fillable = [
        'lj_per_id',
        'lj_tipo_licencia',
        'lj_fecha_inicial',
        'lj_fecha_final',
        'lj_fecha_emision',
        'lj_hora_salida',
        'lj_hora_retorno',
        'lj_motivo',
        'lj_lugar',
        'lj_per_id_autoriza',
        'lj_estado'
    ];
 // Relación con la tabla tbl_catalogo (licencia tipo)
 public function tipoLicencia()
 {
     return $this->belongsTo(TblCatalogo::class, 'lj_tipo_licencia', 'cat_id');
 }

 // Relación con la tabla tbl_persona (persona asociada)
 public function persona()
 {
     return $this->belongsTo(TblPersona::class, 'lj_per_id', 'per_id');
 }
    protected $casts = [
        'lj_fecha_inicial' => 'date',
        'lj_fecha_final' => 'date',
        'lj_fecha_emision' => 'datetime',
        'lj_hora_salida' => 'string',
        'lj_hora_retorno' => 'string',
    ];
}
