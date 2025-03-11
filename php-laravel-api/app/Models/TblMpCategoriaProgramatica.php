<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TblMpCategoriaProgramatica extends Model 
{
	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_categoria_programatica';
	
	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'cp_id';
	
	/**
     * Table fillable fields - updated to match actual DB schema
     *
     * @var array
     */
	protected $fillable = [
		"cp_id",
		"cp_da",
		"cp_da_descripcion",
		"cp_ue",
		"cp_ue_descripcion",
		"cp_programa",
		"cp_proyecto",
		"cp_actividad",
		"cp_cod_poa",
		"cp_descripcion",
		"cp_estado",
		"cp_tipo_gasto",
		"cp_fuente",
		"cp_organismo",
		"cp_pr_id",
		"cp_fecha_modificacion"
	];
	
	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		$search_condition = '(
				CAST(cp_id AS TEXT) LIKE ?  OR 
				cp_descripcion LIKE ?  OR 
				cp_estado LIKE ?  OR
				CAST(cp_programa AS TEXT) LIKE ?
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%"
		];
		$query->whereRaw($search_condition, $search_params);
	}
	
	/**
     * return list page fields of the model.
     * 
     * @return array
     */
	public static function listFields(){
		return [ 
			"cp_id", 
			"cp_pr_id",
			"cp_da",
			"cp_da_descripcion", 
			"cp_ue",
			"cp_ue_descripcion",
			"cp_programa",
			"cp_proyecto",
			"cp_actividad",
			"cp_cod_poa",
			"cp_descripcion", 
			"cp_estado",
			"cp_tipo_gasto",
			"cp_fuente",
			"cp_organismo",
			"cp_fecha_modificacion" 
		];
	}
	
	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"cp_id", 
			"cp_pr_id",
			"cp_da",
			"cp_da_descripcion", 
			"cp_ue",
			"cp_ue_descripcion",
			"cp_programa",
			"cp_proyecto",
			"cp_actividad",
			"cp_cod_poa",
			"cp_descripcion", 
			"cp_estado",
			"cp_tipo_gasto",
			"cp_fuente",
			"cp_organismo",
			"cp_fecha_modificacion" 
		];
	}
	
	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"cp_id", 
			"cp_pr_id",
			"cp_da",
			"cp_da_descripcion", 
			"cp_ue",
			"cp_ue_descripcion",
			"cp_programa",
			"cp_proyecto",
			"cp_actividad",
			"cp_cod_poa",
			"cp_descripcion", 
			"cp_estado",
			"cp_tipo_gasto",
			"cp_fuente",
			"cp_organismo",
			"cp_fecha_modificacion" 
		];
	}
	
	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"cp_id", 
			"cp_pr_id",
			"cp_da",
			"cp_da_descripcion", 
			"cp_ue",
			"cp_ue_descripcion",
			"cp_programa",
			"cp_proyecto",
			"cp_actividad",
			"cp_cod_poa",
			"cp_descripcion", 
			"cp_estado",
			"cp_tipo_gasto",
			"cp_fuente",
			"cp_organismo",
			"cp_fecha_modificacion" 
		];
	}
	
	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"cp_id", 
			"cp_pr_id",
			"cp_da",
			"cp_da_descripcion", 
			"cp_ue",
			"cp_ue_descripcion",
			"cp_programa",
			"cp_proyecto",
			"cp_actividad",
			"cp_cod_poa",
			"cp_descripcion", 
			"cp_estado",
			"cp_tipo_gasto",
			"cp_fuente",
			"cp_organismo",
			"cp_fecha_modificacion" 
		];
	}
	
	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}