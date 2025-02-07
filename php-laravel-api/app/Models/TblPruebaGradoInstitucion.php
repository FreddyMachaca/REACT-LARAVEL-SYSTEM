<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblPruebaGradoInstitucion extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_prueba_grado_institucion';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = '';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["id_grado","id_depto","depto","universidad","id_intitucion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(id_grado AS TEXT) LIKE ?  OR 
				depto LIKE ?  OR 
				universidad LIKE ? 
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
			"id_grado", 
			"id_depto", 
			"depto", 
			"universidad", 
			"id_intitucion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"id_grado", 
			"id_depto", 
			"depto", 
			"universidad", 
			"id_intitucion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
