<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblGradoAcademico extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_grado_academico';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'ga_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["ga_nombre","ga_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(ga_id AS TEXT) LIKE ?  OR 
				ga_nombre LIKE ?  OR 
				ga_estado LIKE ? 
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
			"ga_id", 
			"ga_nombre", 
			"ga_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ga_id", 
			"ga_nombre", 
			"ga_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ga_id", 
			"ga_nombre", 
			"ga_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ga_id", 
			"ga_nombre", 
			"ga_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ga_id", 
			"ga_nombre", 
			"ga_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
