<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblCatalogo extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_catalogo';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'cat_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["cat_tabla","cat_secuencial","cat_descripcion","cat_abreviacion","cat_estado","cat_id_superior","cat_adicional"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(cat_id AS TEXT) LIKE ?  OR 
				cat_tabla LIKE ?  OR 
				cat_descripcion LIKE ?  OR 
				cat_abreviacion LIKE ?  OR 
				cat_estado LIKE ?  OR 
				cat_adicional LIKE ? 
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
			"cat_id", 
			"cat_tabla", 
			"cat_secuencial", 
			"cat_descripcion", 
			"cat_abreviacion", 
			"cat_estado", 
			"cat_id_superior", 
			"cat_adicional" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"cat_id", 
			"cat_tabla", 
			"cat_secuencial", 
			"cat_descripcion", 
			"cat_abreviacion", 
			"cat_estado", 
			"cat_id_superior", 
			"cat_adicional" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"cat_id", 
			"cat_tabla", 
			"cat_secuencial", 
			"cat_descripcion", 
			"cat_abreviacion", 
			"cat_estado", 
			"cat_id_superior", 
			"cat_adicional" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"cat_id", 
			"cat_tabla", 
			"cat_secuencial", 
			"cat_descripcion", 
			"cat_abreviacion", 
			"cat_estado", 
			"cat_id_superior", 
			"cat_adicional" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"cat_id", 
			"cat_tabla", 
			"cat_secuencial", 
			"cat_descripcion", 
			"cat_abreviacion", 
			"cat_estado", 
			"cat_id_superior", 
			"cat_adicional" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
