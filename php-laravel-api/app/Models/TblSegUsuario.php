<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblSegUsuario extends Model 
{
	

	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_seg_usuario';
	

	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'us_id';
	

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = [
        'us_usuario',
        'us_contrasena',
        'us_per_id',
        'us_estado_clave',
        'us_estado_sesion',
        'us_correo_interno',
        'us_nombre_equipo',
        'us_fecha_inicio',
        'us_fecha_fin',
        'us_estado',
        'us_usuario_creacion',
        'us_fecha_creacion'
    ];
	

	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(us_id AS TEXT) LIKE ?  OR 
				us_usuario LIKE ?  OR 
				us_contrasena LIKE ?  OR 
				us_correo_interno LIKE ?  OR 
				us_nombre_equipo LIKE ?  OR 
				us_estado LIKE ? 
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
			"us_id", 
			"us_usuario", 
			"us_contrasena", 
			"us_per_id", 
			"us_estado_clave", 
			"us_estado_sesion", 
			"us_correo_interno", 
			"us_nombre_equipo", 
			"us_fecha_inicio", 
			"us_fecha_fin", 
			"us_estado", 
			"us_usuario_creacion", 
			"us_fecha_creacion" 
		];
	}
	

	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"us_id", 
			"us_usuario", 
			"us_contrasena", 
			"us_per_id", 
			"us_estado_clave", 
			"us_estado_sesion", 
			"us_correo_interno", 
			"us_nombre_equipo", 
			"us_fecha_inicio", 
			"us_fecha_fin", 
			"us_estado", 
			"us_usuario_creacion", 
			"us_fecha_creacion" 
		];
	}
	

	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"us_id", 
			"us_usuario", 
			"us_contrasena", 
			"us_per_id", 
			"us_estado_clave", 
			"us_estado_sesion", 
			"us_correo_interno", 
			"us_nombre_equipo", 
			"us_fecha_inicio", 
			"us_fecha_fin", 
			"us_estado", 
			"us_usuario_creacion", 
			"us_fecha_creacion" 
		];
	}
	

	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"us_id", 
			"us_usuario", 
			"us_contrasena", 
			"us_per_id", 
			"us_estado_clave", 
			"us_estado_sesion", 
			"us_correo_interno", 
			"us_nombre_equipo", 
			"us_fecha_inicio", 
			"us_fecha_fin", 
			"us_estado", 
			"us_usuario_creacion", 
			"us_fecha_creacion" 
		];
	}
	

	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"us_id", 
			"us_usuario", 
			"us_contrasena", 
			"us_per_id", 
			"us_estado_clave", 
			"us_estado_sesion", 
			"us_correo_interno", 
			"us_nombre_equipo", 
			"us_fecha_inicio", 
			"us_fecha_fin", 
			"us_estado", 
			"us_usuario_creacion", 
			"us_fecha_creacion" 
		];
	}
	

	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;

    public function persona()
    {
        return $this->belongsTo(TblPersona::class, 'us_per_id', 'per_id');
    }
}
