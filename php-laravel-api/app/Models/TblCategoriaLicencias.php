<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblCategoriaLicencias extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_categoria_licencias';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'bt_lic_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["bt_lic_categoria_nombre","bt_lic_prefijo","bt_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(bt_lic_id AS TEXT) LIKE ?  OR 
				bt_lic_categoria_nombre LIKE ?  OR 
				bt_lic_prefijo LIKE ?  OR 
				bt_estado LIKE ? 
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
			"bt_lic_id", 
			"bt_lic_categoria_nombre", 
			"bt_lic_prefijo", 
			"bt_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"bt_lic_id", 
			"bt_lic_categoria_nombre", 
			"bt_lic_prefijo", 
			"bt_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"bt_lic_id", 
			"bt_lic_categoria_nombre", 
			"bt_lic_prefijo", 
			"bt_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"bt_lic_id", 
			"bt_lic_categoria_nombre", 
			"bt_lic_prefijo", 
			"bt_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"bt_lic_id", 
			"bt_lic_categoria_nombre", 
			"bt_lic_prefijo", 
			"bt_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
