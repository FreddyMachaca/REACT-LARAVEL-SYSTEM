<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPersona extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_persona';
    
    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'per_id';
    
    public $incrementing = true;
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'per_tipo_doc',
        'per_num_doc',
        'per_lugar_exp',
        'per_ap_paterno',
        'per_ap_materno',
        'per_nombres',
        'per_ap_casada',
        'per_sexo',
        'per_fecha_nac',
        'per_procedencia',
        'per_serie_libreta_militar',
        'per_lugar_nac',
        'per_estado_civil',
        'per_fecha_registro'
    ];

    public static function listFields(){
        return [
            "per_id", "per_tipo_doc", "per_num_doc", "per_lugar_exp", "per_ap_paterno", 
            "per_ap_materno", "per_nombres", "per_ap_casada", "per_sexo", "per_fecha_nac", 
            "per_procedencia", "per_serie_libreta_militar", "per_lugar_nac", "per_estado_civil", 
            "per_fecha_registro"
        ];
    }

    /**
     * Set search query for the model
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $text
     */
    public static function search($query, $text){
        $search_condition = '(
            CAST(per_id AS TEXT) LIKE ? OR
            per_num_doc LIKE ? OR
            per_ap_paterno LIKE ? OR
            per_ap_materno LIKE ? OR
            per_nombres LIKE ? OR
            per_ap_casada LIKE ?
        )';
        
        $search_params = array_fill(0, 6, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }

    public function asignacionesTipoAportante()
    {
        return $this->hasMany(TblMpAsignacionTipoAportante::class, 'at_per_id', 'per_id')
                    ->where('at_estado', 'V');
    }

    public function domicilio()
    {
        return $this->hasOne(TblPersonaDomicilio::class, 'perd_per_id', 'per_id');
    }

    public function procedencia()
    {
        return $this->belongsTo(TblCatalogo::class, 'per_procedencia', 'cat_id');
    }

    public function lugarNacimiento()
    {
        return $this->belongsTo(TblCatalogo::class, 'per_lugar_nac', 'cat_id');
    }

    public function estadoCivil()
    {
        return $this->belongsTo(TblCatalogo::class, 'per_estado_civil', 'cat_id');
    }

    public function lugarExportado()
    {
        return $this->belongsTo(TblCatalogo::class, 'per_lugar_exp', 'cat_id');
    }
}
