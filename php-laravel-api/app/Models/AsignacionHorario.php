<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\TblCatalogo;

class AsignacionHorario extends Model
{

    use HasFactory;

    protected $table = 'tbl_cp_asignacion_horario';
    protected $primaryKey = 'ah_id';

    protected $fillable = [
        'ah_per_id',
        'ah_tipo_horario',
        'ah_fecha_inicial',
        'ah_fecha_final',
        'ah_autorizado',
        'ah_json',
        'ah_estado',
        'ah_lun_ing1',
        'ah_lun_sal1',
        'ah_lun_ing2',
        'ah_lun_sal2',
        'ah_mar_ing1',
        'ah_mar_sal1',
        'ah_mar_ing2',
        'ah_mar_sal2',
        'ah_mie_ing1',
        'ah_mie_sal1',
        'ah_mie_ing2',
        'ah_mie_sal2',
        'ah_jue_ing1',
        'ah_jue_sal1',
        'ah_jue_ing2',
        'ah_jue_sal2',
        'ah_vie_ing1',
        'ah_vie_sal1',
        'ah_vie_ing2',
        'ah_vie_sal2',
        'ah_sab_ing1',
        'ah_sab_sal1',
        'ah_sab_ing2',
        'ah_sab_sal2',
        'ah_dom_ing1',
        'ah_dom_sal1',
        'ah_dom_ing2',
        'ah_dom_sal2',
    ];

    public function tipoHorario()
    {
        return $this->belongsTo(Tblcatalogo::class, 'ah_tipo_horario', 'cat_id');
    }
    public static function listFields()
    {
        return [
            "ah_id",

            'ah_per_id',
            'ah_tipo_horario',
            'ah_fecha_inicial',
            'ah_fecha_final',
            'ah_autorizado',
            'ah_json',
            'ah_estado',
            'ah_lun_ing1',
            'ah_lun_sal1',
            'ah_lun_ing2',
            'ah_lun_sal2',
            'ah_mar_ing1',
            'ah_mar_sal1',
            'ah_mar_ing2',
            'ah_mar_sal2',
            'ah_mie_ing1',
            'ah_mie_sal1',
            'ah_mie_ing2',
            'ah_mie_sal2',
            'ah_jue_ing1',
            'ah_jue_sal1',
            'ah_jue_ing2',
            'ah_jue_sal2',
            'ah_vie_ing1',
            'ah_vie_sal1',
            'ah_vie_ing2',
            'ah_vie_sal2',
            'ah_sab_ing1',
            'ah_sab_sal1',
            'ah_sab_ing2',
            'ah_sab_sal2',
            'ah_dom_ing1',
            'ah_dom_sal1',
            'ah_dom_ing2',
            'ah_dom_sal2',
        ];
    }


    /**
     * return exportList page fields of the model.
     *
     * @return array
     */
    public static function exportListFields()
    {
        return [
            "ah_id",

            'ah_per_id',
            'ah_tipo_horario',
            'ah_fecha_inicial',
            'ah_fecha_final',
            'ah_autorizado',
            'ah_json',
            'ah_estado',
            'ah_lun_ing1',
            'ah_lun_sal1',
            'ah_lun_ing2',
            'ah_lun_sal2',
            'ah_mar_ing1',
            'ah_mar_sal1',
            'ah_mar_ing2',
            'ah_mar_sal2',
            'ah_mie_ing1',
            'ah_mie_sal1',
            'ah_mie_ing2',
            'ah_mie_sal2',
            'ah_jue_ing1',
            'ah_jue_sal1',
            'ah_jue_ing2',
            'ah_jue_sal2',
            'ah_vie_ing1',
            'ah_vie_sal1',
            'ah_vie_ing2',
            'ah_vie_sal2',
            'ah_sab_ing1',
            'ah_sab_sal1',
            'ah_sab_ing2',
            'ah_sab_sal2',
            'ah_dom_ing1',
            'ah_dom_sal1',
            'ah_dom_ing2',
            'ah_dom_sal2',
        ];
    }


    /**
     * return view page fields of the model.
     *
     * @return array
     */
    public static function viewFields()
    {
        return [
            "ah_id",

            'ah_per_id',
            'ah_tipo_horario',
            'ah_fecha_inicial',
            'ah_fecha_final',
            'ah_autorizado',
            'ah_json',
            'ah_estado',
            'ah_lun_ing1',
            'ah_lun_sal1',
            'ah_lun_ing2',
            'ah_lun_sal2',
            'ah_mar_ing1',
            'ah_mar_sal1',
            'ah_mar_ing2',
            'ah_mar_sal2',
            'ah_mie_ing1',
            'ah_mie_sal1',
            'ah_mie_ing2',
            'ah_mie_sal2',
            'ah_jue_ing1',
            'ah_jue_sal1',
            'ah_jue_ing2',
            'ah_jue_sal2',
            'ah_vie_ing1',
            'ah_vie_sal1',
            'ah_vie_ing2',
            'ah_vie_sal2',
            'ah_sab_ing1',
            'ah_sab_sal1',
            'ah_sab_ing2',
            'ah_sab_sal2',
            'ah_dom_ing1',
            'ah_dom_sal1',
            'ah_dom_ing2',
            'ah_dom_sal2',
        ];
    }


    /**
     * return exportView page fields of the model.
     *
     * @return array
     */
    public static function exportViewFields()
    {
        return [
            "ah_id",

            'ah_per_id',
            'ah_tipo_horario',
            'ah_fecha_inicial',
            'ah_fecha_final',
            'ah_autorizado',
            'ah_json',
            'ah_estado',
            'ah_lun_ing1',
            'ah_lun_sal1',
            'ah_lun_ing2',
            'ah_lun_sal2',
            'ah_mar_ing1',
            'ah_mar_sal1',
            'ah_mar_ing2',
            'ah_mar_sal2',
            'ah_mie_ing1',
            'ah_mie_sal1',
            'ah_mie_ing2',
            'ah_mie_sal2',
            'ah_jue_ing1',
            'ah_jue_sal1',
            'ah_jue_ing2',
            'ah_jue_sal2',
            'ah_vie_ing1',
            'ah_vie_sal1',
            'ah_vie_ing2',
            'ah_vie_sal2',
            'ah_sab_ing1',
            'ah_sab_sal1',
            'ah_sab_ing2',
            'ah_sab_sal2',
            'ah_dom_ing1',
            'ah_dom_sal1',
            'ah_dom_ing2',
            'ah_dom_sal2',
        ];
    }


    /**
     * return edit page fields of the model.
     *
     * @return array
     */
    public static function editFields()
    {
        return [
            "ah_id",
            'ah_per_id',
            'ah_tipo_horario',
            'ah_fecha_inicial',
            'ah_fecha_final',
            'ah_autorizado',
            'ah_json',
            'ah_estado',
            'ah_lun_ing1',
            'ah_lun_sal1',
            'ah_lun_ing2',
            'ah_lun_sal2',
            'ah_mar_ing1',
            'ah_mar_sal1',
            'ah_mar_ing2',
            'ah_mar_sal2',
            'ah_mie_ing1',
            'ah_mie_sal1',
            'ah_mie_ing2',
            'ah_mie_sal2',
            'ah_jue_ing1',
            'ah_jue_sal1',
            'ah_jue_ing2',
            'ah_jue_sal2',
            'ah_vie_ing1',
            'ah_vie_sal1',
            'ah_vie_ing2',
            'ah_vie_sal2',
            'ah_sab_ing1',
            'ah_sab_sal1',
            'ah_sab_ing2',
            'ah_sab_sal2',
            'ah_dom_ing1',
            'ah_dom_sal1',
            'ah_dom_ing2',
            'ah_dom_sal2',
        ];
    }


    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
