<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblMpAsignacion extends Model 
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_mp_asignacion';
    
    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'as_id';
    
    /**
     * @var array
     */
    protected $fillable = [
        'as_per_id',
        'as_ca_id',
        'as_fecha_inicio',
        'as_fecha_fin',
        'as_estado',
        'as_tipo_reg',
        'as_tipo_mov',
        'as_tipo_baja',
        'as_validacion',
        'as_fecha_validacion',
        'as_memo',
        'as_memo_baja',
        'as_usuario_creacion',
        'as_fecha_creacion',
        'as_pr_id'
    ];
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * Define relationships
     */
    public function cargo()
    {
        return $this->belongsTo(TblMpCargo::class, 'as_ca_id', 'ca_id');
    }

    /**
     * Set search query for the model
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $text
     */
    public static function search($query, $text){
        $search_condition = '(
            CAST(as_id AS TEXT) LIKE ? OR
            as_estado LIKE ? OR 
            as_tipo_reg LIKE ? OR
            as_tipo_mov LIKE ? OR
            as_tipo_baja LIKE ? OR
            as_validacion LIKE ?
        )';
        
        $search_params = array_fill(0, 6, "%$text%");
        $query->whereRaw($search_condition, $search_params);
    }
}
