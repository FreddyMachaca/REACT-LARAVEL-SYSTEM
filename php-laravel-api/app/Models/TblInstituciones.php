<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblInstituciones extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_instituciones';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'it_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["it_nombre","it_depto","it_provincia","it_ciudad","it_observacion","it_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(it_id AS TEXT) LIKE ?  OR 
				it_nombre LIKE ?  OR 
				it_observacion LIKE ?  OR 
				it_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%"
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
			"it_id", 
			"it_nombre", 
			"it_depto", 
			"it_provincia", 
			"it_ciudad", 
			"it_observacion", 
			"it_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"it_id", 
			"it_nombre", 
			"it_depto", 
			"it_provincia", 
			"it_ciudad", 
			"it_observacion", 
			"it_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"it_id", 
			"it_nombre", 
			"it_depto", 
			"it_provincia", 
			"it_ciudad", 
			"it_observacion", 
			"it_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"it_id", 
			"it_nombre", 
			"it_depto", 
			"it_provincia", 
			"it_ciudad", 
			"it_observacion", 
			"it_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"it_id", 
			"it_nombre", 
			"it_depto", 
			"it_provincia", 
			"it_ciudad", 
			"it_observacion", 
			"it_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
