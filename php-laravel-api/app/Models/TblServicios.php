<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblServicios extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_servicios';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'servicio_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["servicio_abreviatura","servicio_descripcion","servicio_precio_base","servicio_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(servicio_id AS TEXT) LIKE ?  OR 
				servicio_abreviatura LIKE ?  OR 
				servicio_descripcion LIKE ?  OR 
				servicio_estado LIKE ? 
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
			"servicio_id", 
			"servicio_abreviatura", 
			"servicio_descripcion", 
			"servicio_precio_base", 
			"servicio_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"servicio_id", 
			"servicio_abreviatura", 
			"servicio_descripcion", 
			"servicio_precio_base", 
			"servicio_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"servicio_id", 
			"servicio_abreviatura", 
			"servicio_descripcion", 
			"servicio_precio_base", 
			"servicio_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"servicio_id", 
			"servicio_abreviatura", 
			"servicio_descripcion", 
			"servicio_precio_base", 
			"servicio_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"servicio_id", 
			"servicio_abreviatura", 
			"servicio_descripcion", 
			"servicio_precio_base", 
			"servicio_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
