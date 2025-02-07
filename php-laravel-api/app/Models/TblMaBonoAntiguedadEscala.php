<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblMaBonoAntiguedadEscala extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_ma_bono_antiguedad_escala';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'ba_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["ba_id","ba_tiempo_minimo","ba_tiempo_maximo","ba_porcentaje","ba_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(ba_id AS TEXT) LIKE ?  OR 
				ba_estado LIKE ? 
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
			"ba_id", 
			"ba_tiempo_minimo", 
			"ba_tiempo_maximo", 
			"ba_porcentaje", 
			"ba_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ba_id", 
			"ba_tiempo_minimo", 
			"ba_tiempo_maximo", 
			"ba_porcentaje", 
			"ba_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ba_id", 
			"ba_tiempo_minimo", 
			"ba_tiempo_maximo", 
			"ba_porcentaje", 
			"ba_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ba_id", 
			"ba_tiempo_minimo", 
			"ba_tiempo_maximo", 
			"ba_porcentaje", 
			"ba_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ba_id", 
			"ba_tiempo_minimo", 
			"ba_tiempo_maximo", 
			"ba_porcentaje", 
			"ba_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
