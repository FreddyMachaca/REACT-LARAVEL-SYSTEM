<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHelper
{
    public static function createToken($data)
    {
        $key = env('JWT_SECRET');
        $algorithm = env('JWT_ALGORITHM', 'HS256');
        $duration = env('JWT_DURATION', 1);

        $payload = array(
            "iss" => env('APP_URL'),
            "aud" => env('APP_URL'),
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24 * $duration), // token expira en X días
            "data" => $data
        );

        return JWT::encode($payload, $key, $algorithm);
    }

    public static function validateToken($token)
    {
        try {
            $key = env('JWT_SECRET');
            $algorithm = env('JWT_ALGORITHM', 'HS256');
            
            $decoded = JWT::decode($token, new Key($key, $algorithm));
            return (array) $decoded->data;
        } catch (\Exception $e) {
            return false;
        }
    }
}