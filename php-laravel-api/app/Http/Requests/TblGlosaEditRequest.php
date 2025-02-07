<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class TblGlosaEditRequest extends FormRequest
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
            
				"gl_valor_pk" => "filled|string",
				"gl_nombre_pk" => "filled|string",
				"gl_tabla" => "filled|string",
				"gl_tipo_mov" => "filled|numeric",
				"gl_tipo_doc" => "filled|numeric",
				"gl_glosa" => "filled",
				"gl_numero_doc" => "nullable|string",
				"gl_fecha_doc" => "filled|date",
				"gl_estado" => "filled|string",
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
