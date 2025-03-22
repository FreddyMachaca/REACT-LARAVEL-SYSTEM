<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class ActaentregacabAddRequest extends FormRequest
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
            
				"ae_actaid" => "required|numeric",
				"ae_correlativo" => "nullable|numeric",
				"punto_recaud_id" => "required",
				"ae_fecha" => "required|date",
				"ae_grupo" => "nullable|string",
				"ae_operador1erturno" => "nullable|numeric",
				"ae_operador2doturno" => "nullable|numeric",
				"ae_cambiobs" => "nullable|numeric",
				"ae_cajachicabs" => "nullable|numeric",
				"ae_llaves" => "nullable|numeric",
				"ae_fechero" => "nullable|numeric",
				"ae_tampo" => "nullable|numeric",
				"ae_candados" => "nullable|numeric",
				"ae_observacion" => "nullable",
				"ae_recaudaciontotalbs" => "nullable|numeric",
				"ae_usuario" => "nullable|numeric",
				"ae_usuarioarqueo" => "nullable|numeric",
				"ae_fecharegistro" => "nullable|date",
				"ae_fechaarqueo" => "nullable|date",
				"ae_estado" => "nullable|string",
				"arqueoid" => "nullable|numeric",
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
