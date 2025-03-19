<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblTipoAportante extends Model
{
    protected $table = 'tbl_tipo_aportante';
    protected $primaryKey = 'ta_id';
    public $timestamps = false;

    protected $fillable = [
        'ta_id',
        'ta_lab_cotizacion_mensual',
        'ta_lab_prima_riesgo_comun',
        'ta_lab_comision_afp',
        'ta_lab_solidario',
        'ta_pat_prima_riesgo_prof',
        'ta_pat_solidario',
        'ta_pat_caja',
        'ta_pat_provivienda',
        'ta_descripcion',
        'ta_estado'
    ];

    public static function search($query, $text)
    {
        $search_condition = '(
            CAST(ta_id AS TEXT) LIKE ? OR 
            ta_descripcion LIKE ? OR
            ta_estado LIKE ?
        )';
        
        $search_params = array_fill(0, 3, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }
}
