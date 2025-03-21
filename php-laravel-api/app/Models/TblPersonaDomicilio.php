<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TblPersonaDomicilio extends Model
{
    use HasFactory;
    protected $table= 'tbl_persona_domicilio';
    public $timestamps = false;

    /**
     * The table primary key field
     *
     * @var string
     */
    protected $primaryKey = 'perd_id';
    public $incrementing = false;

    /**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = [
        "perd_id", 
        "perd_per_id", 
        "perd_ciudad_residencia", 
        "perd_zona", 
        "perd_tipo_via", 
        "perd_descripcion_via", 
        "perd_numero", 
        "perd_edificio", 
        "perd_bloque", 
        "perd_piso", 
        "perd_dpto", 
        "perd_telefono", 
        "perd_celular", 
        "perd_email_trabajo", 
        "perd_email_personal", 
        "perd_fam_emergencia", 
        "perd_dir_emergencia", 
        "perd_tel_emergencia", 
        "perd_coordenadas", 
        "perd_estado", 
        "perd_usuario_creacion", 
        "perd_fecha_creacion"
    ];

    public static function listFields(){
        return [
            "perd_id", 
            "perd_per_id", 
            "perd_ciudad_residencia", 
            "perd_zona", 
            "perd_tipo_via", 
            "perd_descripcion_via", 
            "perd_numero", 
            "perd_edificio", 
            "perd_bloque", 
            "perd_piso", 
            "perd_dpto", 
            "perd_telefono", 
            "perd_celular", 
            "perd_email_trabajo", 
            "perd_email_personal", 
            "perd_fam_emergencia", 
            "perd_dir_emergencia", 
            "perd_tel_emergencia", 
            "perd_coordenadas", 
            "perd_estado", 
            "perd_usuario_creacion", 
            "perd_fecha_creacion"
        ];
    }	

    public static function editFields()
    {
        return [
            "perd_per_id",
            "perd_bloque",
            "perd_celular",
            "perd_ciudad_residencia",
            "perd_descripcion_via",
            "perd_dir_emergencia",
            "perd_dpto",
            "perd_edificio",
            "perd_email_personal",
            "perd_email_trabajo",
            "perd_fam_emergencia",
            "perd_numero",
            "perd_piso",
            "perd_tel_emergencia",
            "perd_telefono",
            "perd_tipo_via",
            "perd_zona"
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
				CAST(perd_id AS TEXT) LIKE ?  OR 
				CAST(perd_per_id AS TEXT) LIKE ?  OR 
				perd_telefono LIKE ?  OR 
				perd_zona LIKE ?  OR 
				perd_ciudad_residencia LIKE ?  OR
                perd_email_trabajo LIKE ? 
		)';
		$search_params = [
			"%$text%","%$text%","%$text%","%$text%","%$text%","%$text%"
		];
		//setting search conditions
		$query->whereRaw($search_condition, $search_params);
	}

    /**
     * Relationship with table TblPersona
     */
    public function persona(): BelongsTo{
        return $this->belongsTo(TblPersona::class, 'perd_per_id');
    }
}
