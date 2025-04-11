<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblPlaTransacciones extends Model
{
    protected $table = 'tbl_pla_transacciones';
    protected $primaryKey = 'tr_id';
    public $timestamps = false;
    public $incrementing = false; 

    protected $fillable = [
        'tr_id', 
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

    public static function search($query, $text)
    {
        if (is_string($text)) {
            $search_condition = '(
                CAST(tr_id AS TEXT) LIKE ? OR 
                tr_estado LIKE ? OR
                CAST(tr_monto AS TEXT) LIKE ?
            )';
            
            $search_params = array_fill(0, 3, "%$text%");
            $query->whereRaw($search_condition, $search_params);

            // Búsqueda en relaciones
            $query->orWhere(function ($query) use ($text) {
                $query->whereHas('persona', function($q) use ($text) {
                    $q->where('per_nombres', 'ILIKE', "%{$text}%")
                      ->orWhere('per_ap_paterno', 'ILIKE', "%{$text}%")
                      ->orWhere('per_ap_materno', 'ILIKE', "%{$text}%")
                      ->orWhere('per_num_doc', 'ILIKE', "%{$text}%");
                });
            });
        }

        return $query;
    }

    public function persona()
    {
        return $this->belongsTo(TblPersona::class, 'tr_per_id', 'per_id');
    }

    public function factor()
    {
        return $this->belongsTo(TblPlaFactor::class, 'tr_fa_id', 'fa_id');
    }

    public function cuotas()
    {
        return $this->hasOne(TblPlaTransaccionesCuotas::class, 'tc_tr_id', 'tr_id');
    }
}
