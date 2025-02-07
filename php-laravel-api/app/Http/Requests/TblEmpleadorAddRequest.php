<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblEmpleadorAddRequest extends FormRequest
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
            
				"em_id" => "required|numeric",
				"em_nombre" => "nullable|string",
				"em_razon_social" => "nullable|string",
				"em_nit" => "nullable|string",
				"em_departamento" => "nullable|string",
				"em_provincia" => "nullable|string",
				"em_localidad" => "nullable|string",
				"em_zona" => "nullable|string",
				"em_tipovia" => "nullable|string",
				"em_nombrevia" => "nullable|string",
				"em_numero" => "nullable|string",
				"em_telefono" => "nullable|string",
				"em_fax" => "nullable|string",
				"em_otros" => "nullable|string",
				"em_actividad" => "nullable|string",
				"em_estado" => "nullable|string",
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
