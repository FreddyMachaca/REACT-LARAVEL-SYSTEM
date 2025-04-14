<?php 
namespace App\Http\Controllers;

use App\Models\TblPersona;
use App\Models\TblSegUsuario;
use Exception;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Autenticación de usuario
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required',
                'password' => 'required',
            ]);

            $user = TblSegUsuario::where(function($query) use ($request) {
                $query->where('us_usuario', $request->username)
                      ->orWhere('us_correo_interno', $request->username);
            })->where('us_estado', 'V')->first();

            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no encontrado'
                ], 401);
            }

            if ($user->us_contrasena !== sha1($request->password)) {
                return response()->json([
                    'error' => 'Contraseña incorrecta'
                ], 401);
            }

            $persona = $user->persona;
            if (!$persona) {
                return response()->json([
                    'error' => 'Error en datos de usuario'
                ], 500);
            }

            $token = JWTHelper::createToken([
                'user_id' => $user->us_id,
                'username' => $user->us_usuario,
                'email' => $user->us_correo_interno,
                'per_id' => $user->us_per_id
            ]);

            return response()->json([
                'token' => $token,
                'user' => $user,
                'persona' => $persona
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error en el servidor'
            ], 500);
        }
    }

    /**
     * Registro de nuevo usuario
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'per_nombres' => 'required|max:60',
            'per_ap_paterno' => 'required|max:50',
            'per_ap_materno' => 'required|max:50',
            'per_num_doc' => 'required|max:25|unique:tbl_persona,per_num_doc',
            'per_sexo' => 'required|in:F,M',
            'usuario' => 'required|max:30|unique:tbl_seg_usuario,us_usuario',
            'correo' => 'required|email|max:100|unique:tbl_seg_usuario,us_correo_interno',
            'password' => 'required|min:6'
        ]);

        try {
            DB::beginTransaction();

            // Crear persona con el Max ID (max + 1)
            $maxPerId = DB::table('tbl_persona')->max('per_id');
            $nextPerId = $maxPerId + 1;

            $persona = new TblPersona();
            $persona->per_id = $nextPerId;
            $persona->per_nombres = $request->per_nombres;
            $persona->per_ap_paterno = $request->per_ap_paterno;
            $persona->per_ap_materno = $request->per_ap_materno;
            $persona->per_num_doc = $request->per_num_doc;
            $persona->per_tipo_doc = 1;  
            $persona->per_lugar_exp = 1; 
            $persona->per_sexo = $request->per_sexo;
            $persona->per_procedencia = 1; 
            $persona->per_fecha_registro = Carbon::now();
            $persona->save();

            // Crear usuario usando sha1 para obtener un hash de 40 caracteres
            $usuario = new TblSegUsuario();
            $usuario->us_usuario = $request->usuario;
            $usuario->us_contrasena = sha1($request->password);
            $usuario->us_per_id = $persona->per_id;
            $usuario->us_estado_clave = 1;
            $usuario->us_estado_sesion = 0;
            $usuario->us_correo_interno = $request->correo;
            $usuario->us_estado = 'V'; 
            $usuario->us_usuario_creacion = 1;
            $usuario->us_fecha_creacion = Carbon::now();
            $usuario->save();

            DB::commit();

            $token = JWTHelper::createToken([
                'user_id' => $usuario->us_id,
                'username' => $usuario->us_usuario,
                'email' => $usuario->us_correo_interno,
                'per_id' => $usuario->us_per_id
            ]);

            return response()->json([
                'token' => $token,
                'user' => $usuario,
                'persona' => $persona
            ]);

        } catch (Exception $e) {
            DB::rollback();
            \Log::error('Error en registro: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error en el registro',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar la contraseña del usuario
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'currentPassword' => 'required',
                'newPassword' => 'required|min:6',
            ]);

            // Obtener el token del encabezado
            $token = str_replace('Bearer ', '', $request->header('Authorization'));
            if (!$token) {
                return response()->json(['message' => 'Token no proporcionado'], 401);
            }

            try {
                // Decodificar el token para obtener el ID del usuario
                $decoded = JWTHelper::decodeToken($token);
                $userId = $decoded->user_id;
                
                if (!$userId) {
                    return response()->json(['message' => 'ID de usuario no encontrado en el token'], 401);
                }
            } catch (\Exception $e) {
                \Log::error('Error decodificando token: ' . $e->getMessage());
                return response()->json(['message' => 'Token inválido'], 401);
            }

            // Buscar el usuario
            $user = TblSegUsuario::find($userId);
            if (!$user) {
                \Log::error('Usuario no encontrado: ' . $userId);
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Verificar la contraseña actual
            $currentPasswordHash = sha1($request->currentPassword);
            if ($user->us_contrasena !== $currentPasswordHash) {
                \Log::info('Contraseña incorrecta para usuario: ' . $userId);
                return response()->json(['message' => 'La contraseña actual es incorrecta'], 400);
            }

            // Actualizar la contraseña
            $newPasswordHash = sha1($request->newPassword);
            $user->us_contrasena = $newPasswordHash;
            $saved = $user->save();
            
            if (!$saved) {
                \Log::error('Error al guardar nueva contraseña para usuario: ' . $userId);
                return response()->json(['message' => 'Error al actualizar la contraseña en la base de datos'], 500);
            }
            return response()->json(['message' => 'Contraseña actualizada correctamente']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la contraseña',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
