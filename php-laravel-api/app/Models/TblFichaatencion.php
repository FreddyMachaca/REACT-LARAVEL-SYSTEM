<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblFichaatencion extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_fichaatencion';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'fic_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["fic_correlativo","fic_atencionsolicitud","fic_atencioninicio","fic_atencionfinal","fic_usr_id","fic_usrname","fic_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(fic_id AS TEXT) LIKE ?  OR 
				fic_usrname LIKE ?  OR 
				fic_estado LIKE ? 
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
			"fic_id", 
			"fic_correlativo", 
			"fic_atencionsolicitud", 
			"fic_atencioninicio", 
			"fic_atencionfinal", 
			"fic_usr_id", 
			"fic_usrname", 
			"fic_estado" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"fic_id", 
			"fic_correlativo", 
			"fic_atencionsolicitud", 
			"fic_atencioninicio", 
			"fic_atencionfinal", 
			"fic_usr_id", 
			"fic_usrname", 
			"fic_estado" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"fic_id", 
			"fic_correlativo", 
			"fic_atencionsolicitud", 
			"fic_atencioninicio", 
			"fic_atencionfinal", 
			"fic_usr_id", 
			"fic_usrname", 
			"fic_estado" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"fic_id", 
			"fic_correlativo", 
			"fic_atencionsolicitud", 
			"fic_atencioninicio", 
			"fic_atencionfinal", 
			"fic_usr_id", 
			"fic_usrname", 
			"fic_estado" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"fic_id", 
			"fic_correlativo", 
			"fic_atencionsolicitud", 
			"fic_atencioninicio", 
			"fic_atencionfinal", 
			"fic_usr_id", 
			"fic_usrname", 
			"fic_estado" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
