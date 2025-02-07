<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblSegUsuarioRol extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_seg_usuario_rol';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'usrol_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["usrol_us_id","usrol_rol_id","usrol_estado","usrol_fecha_creacion","usrol_usuario_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(usrol_id AS TEXT) LIKE ?  OR 
				usrol_estado LIKE ?  OR 
				usrol_usuario_creacion LIKE ? 
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
			"usrol_id", 
			"usrol_us_id", 
			"usrol_rol_id", 
			"usrol_estado", 
			"usrol_fecha_creacion", 
			"usrol_usuario_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"usrol_id", 
			"usrol_us_id", 
			"usrol_rol_id", 
			"usrol_estado", 
			"usrol_fecha_creacion", 
			"usrol_usuario_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"usrol_id", 
			"usrol_us_id", 
			"usrol_rol_id", 
			"usrol_estado", 
			"usrol_fecha_creacion", 
			"usrol_usuario_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"usrol_id", 
			"usrol_us_id", 
			"usrol_rol_id", 
			"usrol_estado", 
			"usrol_fecha_creacion", 
			"usrol_usuario_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"usrol_id", 
			"usrol_us_id", 
			"usrol_rol_id", 
			"usrol_estado", 
			"usrol_fecha_creacion", 
			"usrol_usuario_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
