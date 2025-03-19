<?php 
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TblMpEscalaSalarial extends Model 
{
	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'tbl_mp_escala_salarial';
	
	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'es_id';
	
	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = [
		"es_id",
		"es_pr_id",
		"es_ns_id",
		"es_escalafon",
		"es_descripcion",
		"es_estado",
		"es_ne_id",
		"es_rf_id",
		"es_categoria"
	];
	
	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record 
		$search_condition = '(
				CAST(es_id AS TEXT) LIKE ?  OR 
				es_escalafon LIKE ?  OR 
				es_descripcion LIKE ?  OR 
				es_estado LIKE ?  OR 
				es_categoria LIKE ? 
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
			"es_id", 
			"es_pr_id", 
			"es_ns_id", 
			"es_escalafon", 
			"es_descripcion", 
			"es_estado", 
			"es_ne_id", 
			"es_rf_id", 
			"es_categoria" 
		];
	}
	
	/**
     * return exportList page fields of the model.
     * 
     * @return array
     */
	public static function exportListFields(){
		return [ 
			"es_id", 
			"es_pr_id", 
			"es_ns_id", 
			"es_escalafon", 
			"es_descripcion", 
			"es_estado", 
			"es_ne_id", 
			"es_rf_id", 
			"es_categoria" 
		];
	}
	
	/**
     * return view page fields of the model.
     * 
     * @return array
     */
	public static function viewFields(){
		return [ 
			"es_id", 
			"es_pr_id", 
			"es_ns_id", 
			"es_escalafon", 
			"es_descripcion", 
			"es_estado", 
			"es_ne_id", 
			"es_rf_id", 
			"es_categoria" 
		];
	}
	
	/**
     * return exportView page fields of the model.
     * 
     * @return array
     */
	public static function exportViewFields(){
		return [ 
			"es_id", 
			"es_pr_id", 
			"es_ns_id", 
			"es_escalafon", 
			"es_descripcion", 
			"es_estado", 
			"es_ne_id", 
			"es_rf_id", 
			"es_categoria" 
		];
	}
	
	/**
     * return edit page fields of the model.
     * 
     * @return array
     */
	public static function editFields(){
		return [ 
			"es_id", 
			"es_pr_id", 
			"es_ns_id", 
			"es_escalafon", 
			"es_descripcion", 
			"es_estado", 
			"es_ne_id", 
			"es_rf_id", 
			"es_categoria" 
		];
	}
	
	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
	
	/**
     * Definir relación con nivel salarial
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function nivelSalarial()
	{
		return $this->belongsTo(TblMpNivelSalarial::class, 'es_ns_id', 'ns_id');
	}
}
