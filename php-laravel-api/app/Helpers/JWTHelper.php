<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHelper
{
    private static function getSecret()
    {
        return env('JWT_SECRET');
    }
    
    private static function getAlgorithm()
    {
        return env('JWT_ALGORITHM', 'HS256');
    }
    
    private static function getDuration()
    {
        return (int)env('JWT_DURATION', 1); 
    }

    public static function createToken($payload)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 60 * 60 * 24 * self::getDuration();

        $data = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $payload
        ];

        return JWT::encode($data, self::getSecret(), self::getAlgorithm());
    }

    public static function decodeToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key(self::getSecret(), self::getAlgorithm()));
            return $decoded->data;
        } catch (\Exception $e) {
            \Log::error('Error decoding token: ' . $e->getMessage());
            return null;
        }
    }

    public static function getUserIdFromToken($authHeader)
    {
        if (empty($authHeader)) {
            return null;
        }

        $token = str_replace('Bearer ', '', $authHeader);
        
        try {
            $decoded = self::decodeToken($token);
            return $decoded ? $decoded->user_id : null;
        } catch (\Exception $e) {
            return null;
        }
    }
}