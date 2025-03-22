<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Actaentregadet extends Model
{


	/**
     * The table associated with the model.
     *
     * @var string
     */
	protected $table = 'actaentregadet';


	/**
     * The table primary key field
     *
     * @var string
     */
	protected $primaryKey = 'aed_actaid';
	public $incrementing = true;
	protected $keyType = 'int';

	/**
     * Table fillable fields
     *
     * @var array
     */
	protected $fillable = ["aed_actaid","ae_actaid","servicio_idop1","aed_desdenumeroop1","aed_hastanumeroop1","aed_vendidohastaop1","aed_cantidadop1","aed_importebsop1","servicio_idop2","aed_desdenumeroop2","aed_hastanumeroop2","aed_vendidohastaop2","aed_cantidadop2","aed_importebsop2","aed_estado","aed_preciounitario"];


	/**
     * Set search query for the model
	 * @param \Illuminate\Database\Eloquent\Builder $query
	 * @param string $text
     */
	public static function search($query, $text){
		//search table record
		$search_condition = '(
				CAST(aed_actaid AS TEXT) LIKE ?  OR
				aed_estado LIKE ?
		)';
		$search_params = [
			"%$text%","%$text%"
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
			"aed_actaid",
			"ae_actaid",
			"servicio_idop1",
			"aed_desdenumeroop1",
			"aed_hastanumeroop1",
			"aed_vendidohastaop1",
			"aed_cantidadop1",
			"aed_importebsop1",
			"servicio_idop2",
			"aed_desdenumeroop2",
			"aed_hastanumeroop2",
			"aed_vendidohastaop2",
			"aed_cantidadop2",
			"aed_importebsop2",
			"aed_estado",
			"aed_preciounitario"
		];
	}


	/**
     * return exportList page fields of the model.
     *
     * @return array
     */
	public static function exportListFields(){
		return [
			"aed_actaid",
			"ae_actaid",
			"servicio_idop1",
			"aed_desdenumeroop1",
			"aed_hastanumeroop1",
			"aed_vendidohastaop1",
			"aed_cantidadop1",
			"aed_importebsop1",
			"servicio_idop2",
			"aed_desdenumeroop2",
			"aed_hastanumeroop2",
			"aed_vendidohastaop2",
			"aed_cantidadop2",
			"aed_importebsop2",
			"aed_estado",
			"aed_preciounitario"
		];
	}


	/**
     * return view page fields of the model.
     *
     * @return array
     */
	public static function viewFields(){
		return [
			"aed_actaid",
			"ae_actaid",
			"servicio_idop1",
			"aed_desdenumeroop1",
			"aed_hastanumeroop1",
			"aed_vendidohastaop1",
			"aed_cantidadop1",
			"aed_importebsop1",
			"servicio_idop2",
			"aed_desdenumeroop2",
			"aed_hastanumeroop2",
			"aed_vendidohastaop2",
			"aed_cantidadop2",
			"aed_importebsop2",
			"aed_estado",
			"aed_preciounitario"
		];
	}


	/**
     * return exportView page fields of the model.
     *
     * @return array
     */
	public static function exportViewFields(){
		return [
			"aed_actaid",
			"ae_actaid",
			"servicio_idop1",
			"aed_desdenumeroop1",
			"aed_hastanumeroop1",
			"aed_vendidohastaop1",
			"aed_cantidadop1",
			"aed_importebsop1",
			"servicio_idop2",
			"aed_desdenumeroop2",
			"aed_hastanumeroop2",
			"aed_vendidohastaop2",
			"aed_cantidadop2",
			"aed_importebsop2",
			"aed_estado",
			"aed_preciounitario"
		];
	}


	/**
     * return edit page fields of the model.
     *
     * @return array
     */
	public static function editFields(){
		return [
			"aed_actaid",
			"ae_actaid",
			"servicio_idop1",
			"aed_desdenumeroop1",
			"aed_hastanumeroop1",
			"aed_vendidohastaop1",
			"aed_cantidadop1",
			"aed_importebsop1",
			"servicio_idop2",
			"aed_desdenumeroop2",
			"aed_hastanumeroop2",
			"aed_vendidohastaop2",
			"aed_cantidadop2",
			"aed_importebsop2",
			"aed_estado",
			"aed_preciounitario"
		];
	}


	/**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
	public $timestamps = false;
}
