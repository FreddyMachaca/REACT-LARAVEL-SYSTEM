<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblMpAsignacionTipoAportante extends Model
{
    protected $table = 'tbl_mp_asignacion_tipo_aportante';
    protected $primaryKey = 'at_id';
    public $timestamps = false;

    protected $fillable = [
        'at_per_id',
        'at_ta_id',
        'at_estado'
    ];

    public function persona()
    {
        return $this->belongsTo(TblPersona::class, 'at_per_id', 'per_id');
    }

    public function tipoAportante()
    {
        return $this->belongsTo(TblTipoAportante::class, 'at_ta_id', 'ta_id');
    }

    public static function search($query, $search)
    {
        return $query->where(function($query) use ($search) {
            $query->where('at_estado', 'ILIKE', "%{$search}%");
        });
    }
}
