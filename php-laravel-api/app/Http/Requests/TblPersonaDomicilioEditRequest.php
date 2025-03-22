<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblPersonaDomicilioEditRequest extends FormRequest
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
                "perd_bloque"=> "nullable|string",
                "perd_celular"=> "filled|numeric",
                "perd_ciudad_residencia"=> "filled|numeric",
                "perd_descripcion_via"=> "filled|string",
                "perd_dir_emergencia"=> "filled|string",
                "perd_dpto"=> "nullable|string",
                "perd_edificio"=> "nullable|string",
                "perd_email_personal"=> "filled|string",
                "perd_email_trabajo"=> "nullable|string",
                "perd_fam_emergencia"=> "filled|numeric",
                "perd_numero"=> "filled|numeric",
                "perd_per_id"=> "filled|numeric",
                "perd_piso"=> "nullable|string",
                "perd_tel_emergencia"=> "filled|numeric",
                "perd_telefono"=> "nullable|numeric",
                "perd_tipo_via"=> "filled|numeric",
                "perd_zona"=> "filled|numeric",
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
