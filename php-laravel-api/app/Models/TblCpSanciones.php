<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TblCpSanciones extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_cp_sanciones';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'sa_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     * Since the type is integer, we assume it's not auto-incrementing unless specified otherwise.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sa_id',
        'sa_per_id',
        'sa_tipo_sancion',
        'sa_minutos',
        'sa_fecha_inicio',
        'sa_fecha_fin',
        'sa_dias_sancion',
        'sa_estado'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sa_fecha_inicio' => 'date',
        'sa_fecha_fin' => 'date',
        'sa_dias_sancion' => 'float',
        'sa_minutos' => 'integer',
    ];

    /**
     * Get the persona associated with the sancion.
     */
    public function persona(): BelongsTo
    {
        return $this->belongsTo(TblPersona::class, 'sa_per_id', 'per_id');
    }

    /**
     * Get the factor associated with the sancion.
     * Assuming TblPlaFactor is the correct model for sa_factor.
     */
    public function factor(): BelongsTo
    {
        // Adjust TblPlaFactor::class and 'fa_id' if the related model/key is different
        return $this->belongsTo(TblPlaFactor::class, 'sa_factor', 'fa_id');
    }

    /**
     * Set search query for the model
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $text
     */
    public static function search($query, $text)
    {
        // Basic search implementation
        $query->where(function ($subQuery) use ($text) {
            $subQuery->where('sa_tipo_sancion', 'LIKE', "%{$text}%")
                     ->orWhere('sa_estado', 'LIKE', "%{$text}%")
                     ->orWhereHas('persona', function ($q) use ($text) {
                         $q->where('per_nombres', 'ILIKE', "%{$text}%")
                           ->orWhere('per_ap_paterno', 'ILIKE', "%{$text}%")
                           ->orWhere('per_ap_materno', 'ILIKE', "%{$text}%")
                           ->orWhere('per_num_doc', 'ILIKE', "%{$text}%");
                     })
                     ->orWhereHas('factor', function ($q) use ($text) {
                         $q->where('fa_descripcion', 'ILIKE', "%{$text}%");
                     });
        });
    }
}
