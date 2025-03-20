<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblTipoAportante extends Model
{
    protected $table = 'tbl_tipo_aportante';
    protected $primaryKey = 'ta_id';
    public $timestamps = false;

    protected $fillable = [
        'ta_descripcion',
        'ta_lab_cotizacion_mensual',
        'ta_lab_prima_riesgo_comun',
        'ta_lab_comision_afp',
        'ta_lab_solidario',
        'ta_pat_prima_riesgo_prof',
        'ta_pat_solidario',
        'ta_pat_caja',
        'ta_pat_provivienda'
    ];

    public static function search($query, $search)
    {
        return $query->where(function($query) use ($search) {
            $query->where('ta_descripcion', 'ILIKE', "%{$search}%");
        });
    }

    public function asignaciones()
    {
        return $this->hasMany(TblMpAsignacionTipoAportante::class, 'at_ta_id', 'ta_id');
    }
}
