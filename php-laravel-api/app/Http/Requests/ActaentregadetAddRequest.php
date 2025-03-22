<?php
namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
class ActaentregadetAddRequest extends FormRequest
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
            
				"aed_actaid" => "required|numeric",
				"ae_actaid" => "nullable|numeric",
				"servicio_idop1" => "required|numeric",
				"aed_desdenumeroop1" => "nullable|numeric",
				"aed_hastanumeroop1" => "nullable|numeric",
				"aed_vendidohastaop1" => "nullable|numeric",
				"aed_cantidadop1" => "nullable|numeric",
				"aed_importebsop1" => "nullable|numeric",
				"servicio_idop2" => "nullable|numeric",
				"aed_desdenumeroop2" => "nullable|numeric",
				"aed_hastanumeroop2" => "nullable|numeric",
				"aed_vendidohastaop2" => "nullable|numeric",
				"aed_cantidadop2" => "nullable|numeric",
				"aed_importebsop2" => "nullable|numeric",
				"aed_estado" => "nullable|string",
				"aed_preciounitario" => "nullable|numeric",
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
