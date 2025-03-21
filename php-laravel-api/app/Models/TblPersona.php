<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPersona extends Model
{
    use HasFactory;
    protected $table= 'tbl_persona';
    public $timestamps = false;

    /**
     * The table primary key field
     *
     * @var string
     */
    protected $primaryKey = 'per_id';
    public $incrementing = true;

    /**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = [
        "per_tipo_doc", 
        "per_num_doc", 
        "per_lugar_exp", 
        "per_ap_paterno", 
        "per_ap_materno", 
        "per_nombres", 
        "per_ap_casada", 
        "per_sexo", 
        "per_fecha_nac", 
        "per_procedencia", 
        "per_serie_libreta_militar", 
        "per_lugar_nac", 
        "per_estado_civil", 
        "per_fecha_registro"
    ];

    public static function listFields(){
        return [
            "per_id", "per_tipo_doc", "per_num_doc", "per_lugar_exp", "per_ap_paterno", "per_ap_materno", "per_nombres", "per_ap_casada", "per_sexo", "per_fecha_nac", "per_procedencia", "per_serie_libreta_militar", "per_lugar_nac", "per_estado_civil", "per_fecha_registro"
        ];
    }	

    /**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(per_id AS TEXT) LIKE ?  OR 
				per_ap_paterno LIKE ?  OR 
				per_ap_materno LIKE ?  OR 
				per_nombres LIKE ?  OR
                per_ap_casada LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%"
		];
		//setting search conditions
		$query->whereRaw($search_condition, $search_params);
	}

    public function domicilio()
    {
        return $this->hasOne(TblPersonaDomicilio::class, 'perd_per_id', 'per_id');
    }
}
