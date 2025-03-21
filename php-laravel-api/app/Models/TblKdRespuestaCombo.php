<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblKdRespuestaCombo extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_kd_respuesta_combo';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'rc_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["rc_id", "rc_rq_id", "rc_desc", "rc_equivalencia", "rc_estado", "rc_usuario_creacion", "rc_fecha_creacion"];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(rc_id AS TEXT) LIKE ?  OR 
				rc_desc LIKE ?  OR 
				rc_estado LIKE ?  OR 
				rc_usuario_creacion LIKE ?  OR 
				rc_fecha_creacion LIKE ? 
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
			"rc_id", 
            "rc_rq_id", 
            "rc_desc", 
            "rc_equivalencia", 
            "rc_estado", 
            "rc_usuario_creacion", 
            "rc_fecha_creacion"
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"rc_id", 
            "rc_rq_id", 
            "rc_desc", 
            "rc_equivalencia", 
            "rc_estado", 
            "rc_usuario_creacion", 
            "rc_fecha_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"rc_id", 
            "rc_rq_id", 
            "rc_desc", 
            "rc_equivalencia", 
            "rc_estado", 
            "rc_usuario_creacion", 
            "rc_fecha_creacion"
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"rc_id", 
            "rc_rq_id", 
            "rc_desc", 
            "rc_equivalencia", 
            "rc_estado", 
            "rc_usuario_creacion", 
            "rc_fecha_creacion"
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"rc_id", 
            "rc_rq_id", 
            "rc_desc", 
            "rc_equivalencia", 
            "rc_estado", 
            "rc_usuario_creacion", 
            "rc_fecha_creacion"
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
