<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblSegUsuarioEditRequest extends FormRequest
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
            
				"us_usuario" => "filled|string",
				"us_contrasena" => "nullable|string",
				"us_per_id" => "filled|numeric",
				"us_estado_clave" => "nullable|numeric",
				"us_estado_sesion" => "nullable|numeric",
				"us_correo_interno" => "filled|string",
				"us_nombre_equipo" => "nullable|string",
				"us_fecha_inicio" => "nullable|date",
				"us_fecha_fin" => "nullable|date",
				"us_estado" => "filled|string",
				"us_usuario_creacion" => "filled|numeric",
				"us_fecha_creacion" => "nullable|date",
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
