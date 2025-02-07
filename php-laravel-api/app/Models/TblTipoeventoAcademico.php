<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblTipoeventoAcademico extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_tipoevento_academico';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'eac_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["eac_nombre","eac_prefijo","eac_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(eac_id AS TEXT) LIKE ?  OR 
				eac_nombre LIKE ?  OR 
				eac_prefijo LIKE ?  OR 
				eac_estado LIKE ? 
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
			"eac_id", 
			"eac_nombre", 
			"eac_prefijo", 
			"eac_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"eac_id", 
			"eac_nombre", 
			"eac_prefijo", 
			"eac_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"eac_id", 
			"eac_nombre", 
			"eac_prefijo", 
			"eac_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"eac_id", 
			"eac_nombre", 
			"eac_prefijo", 
			"eac_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"eac_id", 
			"eac_nombre", 
			"eac_prefijo", 
			"eac_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
