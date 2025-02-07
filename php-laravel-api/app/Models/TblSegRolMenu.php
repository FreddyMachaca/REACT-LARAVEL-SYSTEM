<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblSegRolMenu extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_seg_rol_menu';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'rolme_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["rolme_rol_id","rolme_me_id","rolme_estado","rolme_usuario_creacion","rolme_fecha_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(rolme_id AS TEXT) LIKE ?  OR 
				rolme_estado LIKE ? 
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
			"rolme_id", 
			"rolme_rol_id", 
			"rolme_me_id", 
			"rolme_estado", 
			"rolme_usuario_creacion", 
			"rolme_fecha_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"rolme_id", 
			"rolme_rol_id", 
			"rolme_me_id", 
			"rolme_estado", 
			"rolme_usuario_creacion", 
			"rolme_fecha_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"rolme_id", 
			"rolme_rol_id", 
			"rolme_me_id", 
			"rolme_estado", 
			"rolme_usuario_creacion", 
			"rolme_fecha_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"rolme_id", 
			"rolme_rol_id", 
			"rolme_me_id", 
			"rolme_estado", 
			"rolme_usuario_creacion", 
			"rolme_fecha_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"rolme_id", 
			"rolme_rol_id", 
			"rolme_me_id", 
			"rolme_estado", 
			"rolme_usuario_creacion", 
			"rolme_fecha_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
