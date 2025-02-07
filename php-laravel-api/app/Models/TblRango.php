<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblRango extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_rango';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'ra_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["ra_id","ra_minimo","ra_maximo","ra_valor","ra_tabla","ra_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(ra_id AS TEXT) LIKE ?  OR 
				ra_tabla LIKE ?  OR 
				ra_estado LIKE ? 
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
			"ra_id", 
			"ra_minimo", 
			"ra_maximo", 
			"ra_valor", 
			"ra_tabla", 
			"ra_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ra_id", 
			"ra_minimo", 
			"ra_maximo", 
			"ra_valor", 
			"ra_tabla", 
			"ra_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ra_id", 
			"ra_minimo", 
			"ra_maximo", 
			"ra_valor", 
			"ra_tabla", 
			"ra_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ra_id", 
			"ra_minimo", 
			"ra_maximo", 
			"ra_valor", 
			"ra_tabla", 
			"ra_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ra_id", 
			"ra_minimo", 
			"ra_maximo", 
			"ra_valor", 
			"ra_tabla", 
			"ra_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
