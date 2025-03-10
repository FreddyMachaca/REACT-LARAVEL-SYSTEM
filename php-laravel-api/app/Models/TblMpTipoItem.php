<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TblMpTipoItem extends Model 
{
	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_tipo_item';
	
	/**
     * The primary key for the model.
     * This model uses a composite primary key.
     *
     * @var array
     */
	protected $primaryKey = ['ti_item', 'ti_tipo'];
    
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected $fillable = [
		"ti_item",
		"ti_descripcion",
		"ti_estado",
		"ti_tipo",
		"ti_item_suplencia",
		"ti_orden",
		"ti_tipo_pago",
		"ti_control",
		"ti_tipo_item_gral"
	];
	
	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				ti_item LIKE ?  OR 
				ti_descripcion LIKE ?  OR 
				ti_estado LIKE ?  OR 
				ti_tipo LIKE ?  OR 
				ti_tipo_pago LIKE ?  OR
				ti_tipo_item_gral LIKE ? 
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
			"ti_item", 
			"ti_descripcion", 
			"ti_estado", 
			"ti_tipo", 
			"ti_item_suplencia", 
			"ti_orden", 
			"ti_tipo_pago", 
			"ti_control", 
			"ti_tipo_item_gral" 
		];
	}
	
	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"ti_item", 
			"ti_descripcion", 
			"ti_estado", 
			"ti_tipo", 
			"ti_item_suplencia", 
			"ti_orden", 
			"ti_tipo_pago", 
			"ti_control", 
			"ti_tipo_item_gral" 
		];
	}
	
	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"ti_item", 
			"ti_descripcion", 
			"ti_estado", 
			"ti_tipo", 
			"ti_item_suplencia", 
			"ti_orden", 
			"ti_tipo_pago", 
			"ti_control", 
			"ti_tipo_item_gral" 
		];
	}
	
	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"ti_item", 
			"ti_descripcion", 
			"ti_estado", 
			"ti_tipo", 
			"ti_item_suplencia", 
			"ti_orden", 
			"ti_tipo_pago", 
			"ti_control", 
			"ti_tipo_item_gral" 
		];
	}
	
	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"ti_item", 
			"ti_descripcion", 
			"ti_estado", 
			"ti_tipo", 
			"ti_item_suplencia", 
			"ti_orden", 
			"ti_tipo_pago", 
			"ti_control", 
			"ti_tipo_item_gral" 
		];
	}
	
	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
