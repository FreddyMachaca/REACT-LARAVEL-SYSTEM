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

    public static function search($query, $text)
    {
        $search_condition = '(
            CAST(at_id AS TEXT) LIKE ? OR 
            CAST(at_per_id AS TEXT) LIKE ? OR
            CAST(at_ta_id AS TEXT) LIKE ? OR
            at_estado LIKE ?
        )';
        
        $search_params = array_fill(0, 4, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }
}
