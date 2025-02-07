<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblEmpleador extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_empleador';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'em_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["em_id","em_nombre","em_razon_social","em_nit","em_departamento","em_provincia","em_localidad","em_zona","em_tipovia","em_nombrevia","em_numero","em_telefono","em_fax","em_otros","em_actividad","em_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(em_id AS TEXT) LIKE ?  OR 
				em_nombre LIKE ?  OR 
				em_razon_social LIKE ?  OR 
				em_nit LIKE ?  OR 
				em_departamento LIKE ?  OR 
				em_provincia LIKE ?  OR 
				em_localidad LIKE ?  OR 
				em_zona LIKE ?  OR 
				em_tipovia LIKE ?  OR 
				em_nombrevia LIKE ?  OR 
				em_numero LIKE ?  OR 
				em_telefono LIKE ?  OR 
				em_fax LIKE ?  OR 
				em_otros LIKE ?  OR 
				em_actividad LIKE ?  OR 
				em_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%","%$text%"
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
			"em_id", 
			"em_nombre", 
			"em_razon_social", 
			"em_nit", 
			"em_departamento", 
			"em_provincia", 
			"em_localidad", 
			"em_zona", 
			"em_tipovia", 
			"em_nombrevia", 
			"em_numero", 
			"em_telefono", 
			"em_fax", 
			"em_otros", 
			"em_actividad", 
			"em_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"em_id", 
			"em_nombre", 
			"em_razon_social", 
			"em_nit", 
			"em_departamento", 
			"em_provincia", 
			"em_localidad", 
			"em_zona", 
			"em_tipovia", 
			"em_nombrevia", 
			"em_numero", 
			"em_telefono", 
			"em_fax", 
			"em_otros", 
			"em_actividad", 
			"em_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"em_id", 
			"em_nombre", 
			"em_razon_social", 
			"em_nit", 
			"em_departamento", 
			"em_provincia", 
			"em_localidad", 
			"em_zona", 
			"em_tipovia", 
			"em_nombrevia", 
			"em_numero", 
			"em_telefono", 
			"em_fax", 
			"em_otros", 
			"em_actividad", 
			"em_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"em_id", 
			"em_nombre", 
			"em_razon_social", 
			"em_nit", 
			"em_departamento", 
			"em_provincia", 
			"em_localidad", 
			"em_zona", 
			"em_tipovia", 
			"em_nombrevia", 
			"em_numero", 
			"em_telefono", 
			"em_fax", 
			"em_otros", 
			"em_actividad", 
			"em_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"em_id", 
			"em_nombre", 
			"em_razon_social", 
			"em_nit", 
			"em_departamento", 
			"em_provincia", 
			"em_localidad", 
			"em_zona", 
			"em_tipovia", 
			"em_nombrevia", 
			"em_numero", 
			"em_telefono", 
			"em_fax", 
			"em_otros", 
			"em_actividad", 
			"em_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
