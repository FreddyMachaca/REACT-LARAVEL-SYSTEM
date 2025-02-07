<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblAudit extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_audit';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'audi_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["audi_tipo_abm","audi_nom_tabla","audi_nom_pk","audi_valor_pk","audi_campos","audi_fecha_creacion","audi_usuario_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(audi_id AS TEXT) LIKE ?  OR 
				audi_tipo_abm LIKE ?  OR 
				audi_nom_tabla LIKE ?  OR 
				audi_nom_pk LIKE ?  OR 
				audi_valor_pk LIKE ?  OR 
				audi_campos LIKE ?  OR 
				audi_usuario_creacion LIKE ? 
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
			"audi_id", 
			"audi_tipo_abm", 
			"audi_nom_tabla", 
			"audi_nom_pk", 
			"audi_valor_pk", 
			"audi_campos", 
			"audi_fecha_creacion", 
			"audi_usuario_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"audi_id", 
			"audi_tipo_abm", 
			"audi_nom_tabla", 
			"audi_nom_pk", 
			"audi_valor_pk", 
			"audi_campos", 
			"audi_fecha_creacion", 
			"audi_usuario_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"audi_id", 
			"audi_tipo_abm", 
			"audi_nom_tabla", 
			"audi_nom_pk", 
			"audi_valor_pk", 
			"audi_campos", 
			"audi_fecha_creacion", 
			"audi_usuario_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"audi_id", 
			"audi_tipo_abm", 
			"audi_nom_tabla", 
			"audi_nom_pk", 
			"audi_valor_pk", 
			"audi_campos", 
			"audi_fecha_creacion", 
			"audi_usuario_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"audi_id", 
			"audi_tipo_abm", 
			"audi_nom_tabla", 
			"audi_nom_pk", 
			"audi_valor_pk", 
			"audi_campos", 
			"audi_fecha_creacion", 
			"audi_usuario_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
