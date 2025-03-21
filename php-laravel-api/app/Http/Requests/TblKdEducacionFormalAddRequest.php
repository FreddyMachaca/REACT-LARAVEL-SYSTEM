<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblKdEducacionFormalAddRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
		
        return [
                "ef_per_id" => "required|numeric", 
                "ef_nivel_instruccion" => "required|numeric", 
                "ef_centro_form" => "required|numeric", 
                "ef_carrera_especialidad" => "required|numeric", 
                "ef_fecha_ini" => "required|date", 
                "ef_fecha_fin" => "required|date", 
                "ef_anios_estudio" => "required|numeric", 
                "ef_titulo_obtenido" => "required|numeric", 
                "ef_fecha_titulo_obtenido" => "required|date", 
                "ef_nro_titulo" => "required|numeric", 
                "ef_estado" => "required|string",
        ];
    }

	public function messages()
    {
        return [
            //using laravel default validation messages
        ];
    }

	/**
     * If validator fails return the exception in json form
     * @param Validator $validator
     * @return array
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
