<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblMpMemosHistoricos extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_memos_historico';
    /**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'mh_id';
	public $incrementing = false;

    /**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["mh_id","mh_qr","mh_per_id","mh_te_id","mh_nro_memo", "mh_contenido"];

    /**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
    public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(mh_id AS TEXT) LIKE ?  OR 
				mh_per_id LIKE ?  OR 
				mh_nro_memo LIKE ?  OR 
				mh_te_id LIKE ?  
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%"
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
			"mh_id",
            "mh_qr",
            "mh_per_id",
            "mh_te_id",
            "mh_nro_memo", 
            "mh_contenido"
		];
	}

    
	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"mh_id",
            "mh_qr",
            "mh_per_id",
            "mh_te_id",
            "mh_nro_memo", 
            "mh_contenido"
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"mh_id",
            "mh_qr",
            "mh_per_id",
            "mh_te_id",
            "mh_nro_memo", 
            "mh_contenido"
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"mh_id",
            "mh_qr",
            "mh_per_id",
            "mh_te_id",
            "mh_nro_memo", 
            "mh_contenido"
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"mh_id",
            "mh_qr",
            "mh_per_id",
            "mh_te_id",
            "mh_nro_memo", 
            "mh_contenido"
		];
	}

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
