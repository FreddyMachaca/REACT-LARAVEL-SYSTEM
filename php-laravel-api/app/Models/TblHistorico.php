<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblHistorico extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_historico';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'his_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["his_tipo_abm","his_nom_tabla","his_nom_pk","his_valor_pk","his_campos","his_usuario_creacion","his_fecha_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(his_id AS TEXT) LIKE ?  OR 
				his_tipo_abm LIKE ?  OR 
				his_nom_tabla LIKE ?  OR 
				his_nom_pk LIKE ?  OR 
				his_valor_pk LIKE ?  OR 
				his_campos LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%","%$text%"
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
			"his_id", 
			"his_tipo_abm", 
			"his_nom_tabla", 
			"his_nom_pk", 
			"his_valor_pk", 
			"his_campos", 
			"his_usuario_creacion", 
			"his_fecha_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"his_id", 
			"his_tipo_abm", 
			"his_nom_tabla", 
			"his_nom_pk", 
			"his_valor_pk", 
			"his_campos", 
			"his_usuario_creacion", 
			"his_fecha_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"his_id", 
			"his_tipo_abm", 
			"his_nom_tabla", 
			"his_nom_pk", 
			"his_valor_pk", 
			"his_campos", 
			"his_usuario_creacion", 
			"his_fecha_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"his_id", 
			"his_tipo_abm", 
			"his_nom_tabla", 
			"his_nom_pk", 
			"his_valor_pk", 
			"his_campos", 
			"his_usuario_creacion", 
			"his_fecha_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"his_id", 
			"his_tipo_abm", 
			"his_nom_tabla", 
			"his_nom_pk", 
			"his_valor_pk", 
			"his_campos", 
			"his_usuario_creacion", 
			"his_fecha_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
