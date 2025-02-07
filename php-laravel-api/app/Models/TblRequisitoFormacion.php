<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblRequisitoFormacion extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_requisito_formacion';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'rf_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["rf_id","rf_formacion","rf_exp_gral","rf_exp_esp","rf_exp_mun","rf_exp_mun_esp","rf_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(rf_id AS TEXT) LIKE ?  OR 
				rf_formacion LIKE ?  OR 
				rf_exp_gral LIKE ?  OR 
				rf_exp_esp LIKE ?  OR 
				rf_exp_mun LIKE ?  OR 
				rf_exp_mun_esp LIKE ?  OR 
				rf_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%"
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
			"rf_id", 
			"rf_formacion", 
			"rf_exp_gral", 
			"rf_exp_esp", 
			"rf_exp_mun", 
			"rf_exp_mun_esp", 
			"rf_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"rf_id", 
			"rf_formacion", 
			"rf_exp_gral", 
			"rf_exp_esp", 
			"rf_exp_mun", 
			"rf_exp_mun_esp", 
			"rf_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"rf_id", 
			"rf_formacion", 
			"rf_exp_gral", 
			"rf_exp_esp", 
			"rf_exp_mun", 
			"rf_exp_mun_esp", 
			"rf_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"rf_id", 
			"rf_formacion", 
			"rf_exp_gral", 
			"rf_exp_esp", 
			"rf_exp_mun", 
			"rf_exp_mun_esp", 
			"rf_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"rf_id", 
			"rf_formacion", 
			"rf_exp_gral", 
			"rf_exp_esp", 
			"rf_exp_mun", 
			"rf_exp_mun_esp", 
			"rf_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
