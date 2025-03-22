<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblPlaTransacciones extends Model
{
    protected $table = 'tbl_pla_transacciones';
    protected $primaryKey = 'tr_id';
    public $timestamps = false;
    
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

    public $incrementing = false;

    public static function search($query, $text){
        $search_condition = '(
            CAST(tr_id AS TEXT) LIKE ? OR 
            tr_estado LIKE ? OR
            CAST(tr_monto AS TEXT) LIKE ?
        )';
        
        $search_params = array_fill(0, 3, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }

    public function persona()
    {
        return $this->belongsTo(TblPersona::class, 'tr_per_id', 'per_id');
    }

    public function factor()
    {
        return $this->belongsTo(TblPlaFactor::class, 'tr_fa_id', 'fa_id');
    }
}
