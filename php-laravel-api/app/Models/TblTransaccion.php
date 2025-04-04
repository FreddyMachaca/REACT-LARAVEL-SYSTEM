<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblTransaccion extends Model
{
    use HasFactory;

    protected $table = 'tbl_pla_transacciones';
    protected $primaryKey = 'tr_id';
    public $timestamps = false; // Si no usas created_at y updated_at de Laravel

    protected $fillable = [
        'tr_pc_id',
        'tr_per_id',
        'tr_fa_id',
        'tr_fecha_inicio',
        'tr_fecha_fin',
        'tr_monto',
        'tr_estado',
        'tr_usuario_creacion',
        'tr_fecha_creacion'
    ];
}
