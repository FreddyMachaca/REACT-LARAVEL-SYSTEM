<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPlaCas extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_pla_cas';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'cs_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["cs_id", "cs_per_id", "cs_res_adm", "cs_nro_cas", "cs_fecha_cas", "cs_anos", "cs_meses", "cs_dias", "cs_tipo_reg", "cs_procesado", "cs_estado"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(cs_id AS TEXT) LIKE ?  OR 
				cs_res_adm LIKE ?  OR 
				cs_nro_cas LIKE ?  OR 
				cs_fecha_cas LIKE ?  OR 
				cs_tipo_reg LIKE ? 
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
			"cs_id", 
            "cs_per_id", 
            "cs_res_adm", 
            "cs_nro_cas", 
            "cs_fecha_cas", 
            "cs_anos", 
            "cs_meses", 
            "cs_dias", 
            "cs_tipo_reg", 
            "cs_procesado", 
            "cs_estado"
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"cs_id", 
            "cs_per_id", 
            "cs_res_adm", 
            "cs_nro_cas", 
            "cs_fecha_cas", 
            "cs_anos", 
            "cs_meses", 
            "cs_dias", 
            "cs_tipo_reg", 
            "cs_procesado", 
            "cs_estado"
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"cs_id", 
            "cs_per_id", 
            "cs_res_adm", 
            "cs_nro_cas", 
            "cs_fecha_cas", 
            "cs_anos", 
            "cs_meses", 
            "cs_dias", 
            "cs_tipo_reg", 
            "cs_procesado", 
            "cs_estado"
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"cs_id", 
            "cs_per_id", 
            "cs_res_adm", 
            "cs_nro_cas", 
            "cs_fecha_cas", 
            "cs_anos", 
            "cs_meses", 
            "cs_dias", 
            "cs_tipo_reg", 
            "cs_procesado", 
            "cs_estado"
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"cs_id", 
            "cs_per_id", 
            "cs_res_adm", 
            "cs_nro_cas", 
            "cs_fecha_cas", 
            "cs_anos", 
            "cs_meses", 
            "cs_dias", 
            "cs_tipo_reg", 
            "cs_procesado", 
            "cs_estado"
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
