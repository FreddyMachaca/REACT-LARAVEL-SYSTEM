<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblCarreras extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_carreras';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'carr_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["carr_nombre","carr_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(carr_id AS TEXT) LIKE ?  OR 
				carr_nombre LIKE ?  OR 
				carr_estado LIKE ? 
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
			"carr_id", 
			"carr_nombre", 
			"carr_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"carr_id", 
			"carr_nombre", 
			"carr_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"carr_id", 
			"carr_nombre", 
			"carr_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"carr_id", 
			"carr_nombre", 
			"carr_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"carr_id", 
			"carr_nombre", 
			"carr_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
