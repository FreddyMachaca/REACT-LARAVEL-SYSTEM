<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblMpCargo extends Model 
{
	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_cargo';
	
	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'ca_id';
	
	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = [
		"ca_id", 
		"ca_es_id",
		"ca_eo_id",
		"ca_ti_item",
		"ca_num_item",
		"ca_estado",
		"ca_aplica_incremento",
		"ca_tipo_jornada",
		"ca_basico_calculado",
		"ca_tipo_calculo",
		"ca_pr_id",
		"ca_usuario_creacion",
		"ca_fecha_creacion"
	];
	
	/**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
	public $incrementing = false;
	
	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(ca_id AS TEXT) LIKE ?  OR 
				ca_ti_item LIKE ?  OR 
				ca_estado LIKE ?  OR 
				ca_aplica_incremento LIKE ?  OR 
				ca_tipo_jornada LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%"
		];
		//setting search conditions
		$query->whereRaw($search_condition, $search_params);
	}
	
	/**
     * return list page fields of the model.
     * 
     * @return array
     */
	public static function listFields(){
		return [ 
			"ca_id", 
			"ca_es_id", 
			"ca_eo_id", 
			"ca_ti_item", 
			"ca_num_item", 
			"ca_estado", 
			"ca_aplica_incremento", 
			"ca_tipo_jornada", 
			"ca_basico_calculado", 
			"ca_tipo_calculo", 
			"ca_pr_id", 
			"ca_usuario_creacion", 
			"ca_fecha_creacion" 
		];
	}
	
	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ca_id", 
			"ca_es_id", 
			"ca_eo_id", 
			"ca_ti_item", 
			"ca_num_item", 
			"ca_estado", 
			"ca_aplica_incremento", 
			"ca_tipo_jornada", 
			"ca_basico_calculado", 
			"ca_tipo_calculo", 
			"ca_pr_id", 
			"ca_usuario_creacion", 
			"ca_fecha_creacion" 
		];
	}
	
	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ca_id", 
			"ca_es_id", 
			"ca_eo_id", 
			"ca_ti_item", 
			"ca_num_item", 
			"ca_estado", 
			"ca_aplica_incremento", 
			"ca_tipo_jornada", 
			"ca_basico_calculado", 
			"ca_tipo_calculo", 
			"ca_pr_id", 
			"ca_usuario_creacion", 
			"ca_fecha_creacion" 
		];
	}
	
	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ca_id", 
			"ca_es_id", 
			"ca_eo_id", 
			"ca_ti_item", 
			"ca_num_item", 
			"ca_estado", 
			"ca_aplica_incremento", 
			"ca_tipo_jornada", 
			"ca_basico_calculado", 
			"ca_tipo_calculo", 
			"ca_pr_id", 
			"ca_usuario_creacion", 
			"ca_fecha_creacion" 
		];
	}
	
	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ca_id", 
			"ca_es_id", 
			"ca_eo_id", 
			"ca_ti_item", 
			"ca_num_item", 
			"ca_estado", 
			"ca_aplica_incremento", 
			"ca_tipo_jornada", 
			"ca_basico_calculado", 
			"ca_tipo_calculo", 
			"ca_pr_id", 
			"ca_usuario_creacion", 
			"ca_fecha_creacion" 
		];
	}
	
	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;

	/**
     * Define relationships
     */
    public function escalaSalarial()
    {
        return $this->belongsTo(TblMpEscalaSalarial::class, 'ca_es_id', 'es_id');
    }

    public function estructuraOrganizacional()
    {
        return $this->belongsTo(TblMpEstructuraOrganizacional::class, 'ca_eo_id', 'eo_id');
    }
}
