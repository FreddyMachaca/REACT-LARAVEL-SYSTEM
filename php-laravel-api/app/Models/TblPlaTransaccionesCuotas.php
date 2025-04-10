<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TblPlaTransaccionesCuotas extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_pla_transacciones_cuotas';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'tc_id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tc_tr_id',
        'tc_cant_cuotas',
        'tc_monto',
        'tc_estado'
    ];

    /**
     * Get the transaction that owns the installments.
     */
    public function transaccion()
    {
        return $this->belongsTo(TblPlaTransacciones::class, 'tc_tr_id', 'tr_id');
    }
}
