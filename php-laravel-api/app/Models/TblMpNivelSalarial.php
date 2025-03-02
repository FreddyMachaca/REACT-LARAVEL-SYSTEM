<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblMpNivelSalarial extends Model 
{
	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_nivel_salarial';
	
	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'ns_id';
	
	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = [
		"ns_id",
		"ns_clase",
		"ns_nivel",
		"ns_descripcion",
		"ns_haber_basico",
		"ns_estado",
		"ns_incremento",
		"ns_pr_id"
	];
	
	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(ns_id AS TEXT) LIKE ?  OR 
				ns_clase LIKE ?  OR 
				ns_nivel LIKE ?  OR 
				ns_descripcion LIKE ?  OR 
				ns_estado LIKE ? 
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
			"ns_id", 
			"ns_clase", 
			"ns_nivel", 
			"ns_descripcion", 
			"ns_haber_basico", 
			"ns_estado", 
			"ns_incremento", 
			"ns_pr_id" 
		];
	}
	
	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ns_id", 
			"ns_clase", 
			"ns_nivel", 
			"ns_descripcion", 
			"ns_haber_basico", 
			"ns_estado", 
			"ns_incremento", 
			"ns_pr_id" 
		];
	}
	
	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ns_id", 
			"ns_clase", 
			"ns_nivel", 
			"ns_descripcion", 
			"ns_haber_basico", 
			"ns_estado", 
			"ns_incremento", 
			"ns_pr_id" 
		];
	}
	
	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ns_id", 
			"ns_clase", 
			"ns_nivel", 
			"ns_descripcion", 
			"ns_haber_basico", 
			"ns_estado", 
			"ns_incremento", 
			"ns_pr_id" 
		];
	}
	
	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ns_id", 
			"ns_clase", 
			"ns_nivel", 
			"ns_descripcion", 
			"ns_haber_basico", 
			"ns_estado", 
			"ns_incremento", 
			"ns_pr_id" 
		];
	}
	
	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
