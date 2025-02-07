<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblSegRol extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_seg_rol';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'rol_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["rol_descripcion","rol_estado","rol_fecha_creacion","rol_usuario_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(rol_id AS TEXT) LIKE ?  OR 
				rol_descripcion LIKE ?  OR 
				rol_estado LIKE ?  OR 
				rol_usuario_creacion LIKE ? 
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
			"rol_id", 
			"rol_descripcion", 
			"rol_estado", 
			"rol_fecha_creacion", 
			"rol_usuario_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"rol_id", 
			"rol_descripcion", 
			"rol_estado", 
			"rol_fecha_creacion", 
			"rol_usuario_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"rol_id", 
			"rol_descripcion", 
			"rol_estado", 
			"rol_fecha_creacion", 
			"rol_usuario_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"rol_id", 
			"rol_descripcion", 
			"rol_estado", 
			"rol_fecha_creacion", 
			"rol_usuario_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"rol_id", 
			"rol_descripcion", 
			"rol_estado", 
			"rol_fecha_creacion", 
			"rol_usuario_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
