<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblPersonaFamiliaresAddRequest extends FormRequest
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
            "pf_per_id" => "required|numeric",
            "pf_fecha_nac" => "required|date",
            "pf_materno" => "required|string",
            "pf_nombres" => "required|string",
            "pf_paterno" => "nullable|string",
            "pf_tipo_parentesco" => "required|numeric",
            "pf_ap_esposo" => "nullable|string",
            "pf_estado" => "required|string",
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
