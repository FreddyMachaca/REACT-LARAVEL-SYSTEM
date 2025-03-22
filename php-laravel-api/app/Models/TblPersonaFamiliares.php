<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPersonaFamiliares extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_persona_familiares';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'pf_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["pf_id", "pf_per_id", "pf_tipo_parentesco", "pf_paterno", "pf_materno", "pf_nombres", "pf_ap_esposo", "pf_fecha_nac", "pf_estado", "pf_estado_vivo", "pf_fecha_defuncion", "pf_sexo"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(pf_per_id AS TEXT) LIKE ?  OR 
				pf_paterno LIKE ?  OR 
				pf_materno LIKE ?  OR 
				pf_nombres LIKE ?  OR 
				pf_estado_vivo LIKE ? 
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
			"pf_id", 
            "pf_per_id", 
            "pf_tipo_parentesco", 
            "pf_paterno", 
            "pf_materno", 
            "pf_nombres", 
            "pf_ap_esposo", 
            "pf_fecha_nac", 
            "pf_estado", 
            "pf_estado_vivo", 
            "pf_fecha_defuncion", 
            "pf_sexo"
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"pf_id", 
            "pf_per_id", 
            "pf_tipo_parentesco", 
            "pf_paterno", 
            "pf_materno", 
            "pf_nombres", 
            "pf_ap_esposo", 
            "pf_fecha_nac", 
            "pf_estado", 
            "pf_estado_vivo", 
            "pf_fecha_defuncion", 
            "pf_sexo"
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"pf_id", 
            "pf_per_id", 
            "pf_tipo_parentesco", 
            "pf_paterno", 
            "pf_materno", 
            "pf_nombres", 
            "pf_ap_esposo", 
            "pf_fecha_nac", 
            "pf_estado", 
            "pf_estado_vivo", 
            "pf_fecha_defuncion", 
            "pf_sexo"
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"pf_id", 
            "pf_per_id", 
            "pf_tipo_parentesco", 
            "pf_paterno", 
            "pf_materno", 
            "pf_nombres", 
            "pf_ap_esposo", 
            "pf_fecha_nac", 
            "pf_estado", 
            "pf_estado_vivo", 
            "pf_fecha_defuncion", 
            "pf_sexo"
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"pf_id", 
            "pf_per_id", 
            "pf_tipo_parentesco", 
            "pf_paterno", 
            "pf_materno", 
            "pf_nombres", 
            "pf_ap_esposo", 
            "pf_fecha_nac", 
            "pf_estado", 
            "pf_estado_vivo", 
            "pf_fecha_defuncion", 
            "pf_sexo"
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
