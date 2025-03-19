<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblSegMenu extends Model 
{
    protected $table = 'tbl_seg_menu';
    protected $primaryKey = 'me_id';
    public $timestamps = false;

    protected $fillable = [
        "me_descripcion",
        "me_url",
        "me_icono",
        "me_id_padre",
        "me_vista",
        "me_orden",
        "me_estado",
        "me_usuario_creacion",
        "me_fecha_creacion"
    ];

    protected $casts = [
        'me_fecha_creacion' => 'datetime',
        'me_vista' => 'integer',
        'me_orden' => 'integer',
        'me_id_padre' => 'integer',
        'me_usuario_creacion' => 'integer'
    ];

    /**
     * Set search query for the model
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $text
     */
    public static function search($query, $text){
        $search_condition = '(
                CAST(me_id AS TEXT) LIKE ?  OR 
                me_descripcion LIKE ?  OR 
                me_url LIKE ?  OR 
                me_icono LIKE ?  OR 
                me_estado LIKE ? 
        )';
        $search_params = [
            "%$text%","%$text%","%$text%","%$text%","%$text%"
        ];
        $query->whereRaw($search_condition, $search_params);
    }

    /**
     * return list page fields of the model.
     * 
     * @return array
     */
    public static function listFields(){
        return [ 
            "me_id", 
            "me_descripcion", 
            "me_url", 
            "me_icono", 
            "me_id_padre", 
            "me_vista", 
            "me_orden", 
            "me_estado", 
            "me_usuario_creacion", 
            "me_fecha_creacion" 
        ];
    }

    /**
     * return exportList page fields of the model.
     * 
     * @return array
     */
    public static function exportListFields(){
        return [ 
            "me_id", 
            "me_descripcion", 
            "me_url", 
            "me_icono", 
            "me_id_padre", 
            "me_vista", 
            "me_orden", 
            "me_estado", 
            "me_usuario_creacion", 
            "me_fecha_creacion" 
        ];
    }

    /**
     * return view page fields of the model.
     * 
     * @return array
     */
    public static function viewFields(){
        return [ 
            "me_id", 
            "me_descripcion", 
            "me_url", 
            "me_icono", 
            "me_id_padre", 
            "me_vista", 
            "me_orden", 
            "me_estado", 
            "me_usuario_creacion", 
            "me_fecha_creacion" 
        ];
    }

    /**
     * return exportView page fields of the model.
     * 
     * @return array
     */
    public static function exportViewFields(){
        return [ 
            "me_id", 
            "me_descripcion", 
            "me_url", 
            "me_icono", 
            "me_id_padre", 
            "me_vista", 
            "me_orden", 
            "me_estado", 
            "me_usuario_creacion", 
            "me_fecha_creacion" 
        ];
    }

    /**
     * return edit page fields of the model.
     * 
     * @return array
     */
    public static function editFields(){
        return [ 
            "me_id", 
            "me_descripcion", 
            "me_url", 
            "me_icono", 
            "me_id_padre", 
            "me_vista", 
            "me_orden", 
            "me_estado", 
            "me_usuario_creacion", 
            "me_fecha_creacion" 
        ];
    }

    public function parent()
    {
        return $this->belongsTo(TblSegMenu::class, 'me_id_padre');
    }

    public function children()
    {
        return $this->hasMany(TblSegMenu::class, 'me_id_padre');
    }
}
