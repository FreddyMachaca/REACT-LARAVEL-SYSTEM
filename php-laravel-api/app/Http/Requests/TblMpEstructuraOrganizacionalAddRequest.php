<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblMpEstructuraOrganizacionalAddRequest extends FormRequest
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
				"eo_cp_id" => "required|numeric",
				"eo_cod_superior" => "required|numeric",
				"eo_obract" => "required|numeric",
				"eo_pr_id" => "required|numeric",
				"eo_prog" => "required|numeric",
				"eo_proy" => "required|numeric",
				"eo_sprog" => "required|numeric",
				"eo_unidad" => "required|numeric",
				"eo_descripcion" => "required|string",
				"eo_estado" => "required|string",
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
