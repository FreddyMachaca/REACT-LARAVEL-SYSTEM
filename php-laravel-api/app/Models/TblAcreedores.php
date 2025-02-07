<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblAcreedores extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_acreedores';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'ac_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["ac_id","ac_descripcion","ac_tipo","ac_documento","ac_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(ac_id AS TEXT) LIKE ?  OR 
				ac_descripcion LIKE ?  OR 
				ac_tipo LIKE ?  OR 
				ac_documento LIKE ?  OR 
				ac_estado LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%"
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
			"ac_id", 
			"ac_descripcion", 
			"ac_tipo", 
			"ac_documento", 
			"ac_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ac_id", 
			"ac_descripcion", 
			"ac_tipo", 
			"ac_documento", 
			"ac_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ac_id", 
			"ac_descripcion", 
			"ac_tipo", 
			"ac_documento", 
			"ac_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ac_id", 
			"ac_descripcion", 
			"ac_tipo", 
			"ac_documento", 
			"ac_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ac_id", 
			"ac_descripcion", 
			"ac_tipo", 
			"ac_documento", 
			"ac_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
