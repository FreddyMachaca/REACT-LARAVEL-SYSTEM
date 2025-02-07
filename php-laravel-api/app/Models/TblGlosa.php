<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblGlosa extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_glosa';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'gl_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["gl_valor_pk","gl_nombre_pk","gl_tabla","gl_tipo_mov","gl_tipo_doc","gl_glosa","gl_numero_doc","gl_fecha_doc","gl_estado","gl_usuario","gl_fecha_registro"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(gl_id AS TEXT) LIKE ?  OR 
				gl_valor_pk LIKE ?  OR 
				gl_nombre_pk LIKE ?  OR 
				gl_tabla LIKE ?  OR 
				gl_glosa LIKE ?  OR 
				gl_numero_doc LIKE ?  OR 
				gl_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%"
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
			"gl_id", 
			"gl_valor_pk", 
			"gl_nombre_pk", 
			"gl_tabla", 
			"gl_tipo_mov", 
			"gl_tipo_doc", 
			"gl_glosa", 
			"gl_numero_doc", 
			"gl_fecha_doc", 
			"gl_estado", 
			"gl_usuario", 
			"gl_fecha_registro" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"gl_id", 
			"gl_valor_pk", 
			"gl_nombre_pk", 
			"gl_tabla", 
			"gl_tipo_mov", 
			"gl_tipo_doc", 
			"gl_glosa", 
			"gl_numero_doc", 
			"gl_fecha_doc", 
			"gl_estado", 
			"gl_usuario", 
			"gl_fecha_registro" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"gl_id", 
			"gl_valor_pk", 
			"gl_nombre_pk", 
			"gl_tabla", 
			"gl_tipo_mov", 
			"gl_tipo_doc", 
			"gl_glosa", 
			"gl_numero_doc", 
			"gl_fecha_doc", 
			"gl_estado", 
			"gl_usuario", 
			"gl_fecha_registro" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"gl_id", 
			"gl_valor_pk", 
			"gl_nombre_pk", 
			"gl_tabla", 
			"gl_tipo_mov", 
			"gl_tipo_doc", 
			"gl_glosa", 
			"gl_numero_doc", 
			"gl_fecha_doc", 
			"gl_estado", 
			"gl_usuario", 
			"gl_fecha_registro" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"gl_id", 
			"gl_valor_pk", 
			"gl_nombre_pk", 
			"gl_tabla", 
			"gl_tipo_mov", 
			"gl_tipo_doc", 
			"gl_glosa", 
			"gl_numero_doc", 
			"gl_fecha_doc", 
			"gl_estado", 
			"gl_usuario", 
			"gl_fecha_registro" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
