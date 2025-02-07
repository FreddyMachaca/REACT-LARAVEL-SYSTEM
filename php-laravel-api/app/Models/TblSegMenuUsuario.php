<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblSegMenuUsuario extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_seg_menu_usuario';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'meus_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["meus_me_id","meus_us_id","meus_estado","meus_fecha_creacion","meus_usuario_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(meus_id AS TEXT) LIKE ?  OR 
				meus_estado LIKE ? 
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
			"meus_id", 
			"meus_me_id", 
			"meus_us_id", 
			"meus_estado", 
			"meus_fecha_creacion", 
			"meus_usuario_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"meus_id", 
			"meus_me_id", 
			"meus_us_id", 
			"meus_estado", 
			"meus_fecha_creacion", 
			"meus_usuario_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"meus_id", 
			"meus_me_id", 
			"meus_us_id", 
			"meus_estado", 
			"meus_fecha_creacion", 
			"meus_usuario_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"meus_id", 
			"meus_me_id", 
			"meus_us_id", 
			"meus_estado", 
			"meus_fecha_creacion", 
			"meus_usuario_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"meus_id", 
			"meus_me_id", 
			"meus_us_id", 
			"meus_estado", 
			"meus_fecha_creacion", 
			"meus_usuario_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
