<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblPersona extends Model 
{
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
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Set search query for the model
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $text
     */
    public static function search($query, $text){
        $search_condition = '(
            per_num_doc LIKE ? OR
            per_ap_paterno LIKE ? OR
            per_ap_materno LIKE ? OR
            per_nombres LIKE ? OR
            per_ap_casada LIKE ?
        )';
        
        $search_params = array_fill(0, 5, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }
}
