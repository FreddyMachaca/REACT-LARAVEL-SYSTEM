<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblIdioma extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_idioma';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'idm_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["idm_nombre","idm_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(idm_id AS TEXT) LIKE ?  OR 
				idm_nombre LIKE ?  OR 
				idm_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%"
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
			"idm_id", 
			"idm_nombre", 
			"idm_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"idm_id", 
			"idm_nombre", 
			"idm_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"idm_id", 
			"idm_nombre", 
			"idm_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"idm_id", 
			"idm_nombre", 
			"idm_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"idm_id", 
			"idm_nombre", 
			"idm_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
