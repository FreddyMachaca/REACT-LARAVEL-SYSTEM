<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblBsEgs extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_bs_egs';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'egs_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["egs_abr","egs_descripcion","egs_fa_id","egs_ca_entidad"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(egs_id AS TEXT) LIKE ?  OR 
				egs_abr LIKE ?  OR 
				egs_descripcion LIKE ? 
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
			"egs_id", 
			"egs_abr", 
			"egs_descripcion", 
			"egs_fa_id", 
			"egs_ca_entidad" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"egs_id", 
			"egs_abr", 
			"egs_descripcion", 
			"egs_fa_id", 
			"egs_ca_entidad" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"egs_id", 
			"egs_abr", 
			"egs_descripcion", 
			"egs_fa_id", 
			"egs_ca_entidad" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"egs_id", 
			"egs_abr", 
			"egs_descripcion", 
			"egs_fa_id", 
			"egs_ca_entidad" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"egs_id", 
			"egs_abr", 
			"egs_descripcion", 
			"egs_fa_id", 
			"egs_ca_entidad" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
