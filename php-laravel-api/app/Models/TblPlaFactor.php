<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblPlaFactor extends Model
{
    protected $table = 'tbl_pla_factor';
    protected $primaryKey = 'fa_id';
    public $timestamps = false;
    
    protected $fillable = [
        'fa_descripcion',
        'fa_signo',
        'fa_ac_id',
        'fa_tipo_calculo',
        'fa_valor',
        'fa_tipo',
        'fa_orden',
        'fa_estado'
    ];

    public static function search($query, $text){
        $search_condition = '(
            fa_descripcion LIKE ? OR 
            fa_signo LIKE ? OR
            fa_tipo_calculo LIKE ? OR 
            fa_tipo LIKE ? OR
            CAST(fa_valor AS TEXT) LIKE ?
        )';
        
        $search_params = array_fill(0, 5, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }
}
