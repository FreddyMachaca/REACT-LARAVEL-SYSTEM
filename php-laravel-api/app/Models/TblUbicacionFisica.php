<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblUbicacionFisica extends Model
{
    use HasFactory;

    protected $table = 'tbl_cp_ubicacion_fisica'; // Nombre exacto de la tabla en PostgreSQL
    protected $primaryKey = 'uf_id'; // Clave primaria de la tabla
    public $timestamps = false; // Desactiva timestamps si la tabla no tiene `created_at` y `updated_at`

    protected $fillable = [
        'uf_per_id',
        'uf_edificio',
        'uf_piso',
        'uf_bloque',
        'uf_telefono_interno',
        'uf_telefono_oficina',
        'uf_nombre_oficina',
        'uf_fecha_inicio',
        'uf_fecha_final',
        'uf_estado'
    ];

    // Relación con la tabla de personas
    public function persona()
    {
        return $this->belongsTo(TblPersona::class, 'uf_per_id', 'per_id');
    }
    public function catalogo()
    {
        return $this->belongsTo(TblCatalogo::class, 'uf_edificio', 'cat_id');
    }
}
