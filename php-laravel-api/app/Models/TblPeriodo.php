<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblPeriodo extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_periodo';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'pr_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["pr_id","pr_gestion","pr_secuencial","pr_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(pr_id AS TEXT) LIKE ?  OR 
				pr_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%"
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
			"pr_id", 
			"pr_gestion", 
			"pr_secuencial", 
			"pr_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"pr_id", 
			"pr_gestion", 
			"pr_secuencial", 
			"pr_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"pr_id", 
			"pr_gestion", 
			"pr_secuencial", 
			"pr_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"pr_id", 
			"pr_gestion", 
			"pr_secuencial", 
			"pr_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"pr_id", 
			"pr_gestion", 
			"pr_secuencial", 
			"pr_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
