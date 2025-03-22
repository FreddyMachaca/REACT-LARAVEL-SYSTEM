<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblPersonaAddRequest extends FormRequest
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
                "per_ap_casada" => "nullable|string",
                "per_ap_materno" => "required|string",
                "per_ap_paterno" => "required|string",
                "per_estado_civil" => "required|numeric",
                "per_fecha_nac" => "required|date",  
                "per_lugar_exp" => "required|numeric",
                "per_lugar_nac" => "required|numeric",
                "per_nombres" => "required|string",
                "per_num_doc" => "required|numeric",
                "per_procedencia" => "required|numeric",
                "per_sexo" => "required|string",
                "per_tipo_doc" => "required|numeric"
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
