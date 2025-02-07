<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblGlosaAddRequest extends FormRequest
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
            
				"gl_valor_pk" => "required|string",
				"gl_nombre_pk" => "required|string",
				"gl_tabla" => "required|string",
				"gl_tipo_mov" => "required|numeric",
				"gl_tipo_doc" => "required|numeric",
				"gl_glosa" => "required",
				"gl_numero_doc" => "nullable|string",
				"gl_fecha_doc" => "required|date",
				"gl_estado" => "required|string",
				"gl_usuario" => "nullable|numeric",
				"gl_fecha_registro" => "nullable|date",
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
