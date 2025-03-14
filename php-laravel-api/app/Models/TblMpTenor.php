<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblMpTenor extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_tenor';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'te_id';
	public $incrementing = false;
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["te_id", "te_tipo_reg", "te_descripcion", "te_contenido", "te_estado", "te_usuario_creacion",];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(te_id AS TEXT) LIKE ?  OR 
				te_tipo_reg LIKE ?  OR 
				te_contenido LIKE ?  OR 
				te_estado LIKE ?  OR 
				te_usuario_creacion LIKE ? 
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
			"te_id", 
			"te_tipo_reg", 
			"te_descripcion", 
			"te_usuario_creacion", 
			"te_fecha_creacion" ,
            "te_fecha_modificacion"
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"te_id", 
			"te_tipo_reg", 
			"te_descripcion", 
			"te_usuario_creacion", 
			"te_fecha_creacion" ,
            "te_fecha_modificacion"
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"te_id", 
			"te_tipo_reg", 
			"te_descripcion", 
			"te_usuario_creacion", 
			"te_fecha_creacion" ,
            "te_fecha_modificacion"
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"te_id", 
			"te_tipo_reg", 
			"te_descripcion", 
			"te_usuario_creacion", 
			"te_fecha_creacion" ,
            "te_fecha_modificacion"
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"te_id", 
			"te_tipo_reg", 
			"te_descripcion", 
			"te_usuario_creacion", 
			"te_fecha_creacion" ,
            "te_fecha_modificacion"
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
