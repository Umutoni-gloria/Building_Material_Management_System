package com.example.bmms.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenUtil {

    private static final String SECRET_KEY = "my-super-secret-key-that-should-be-32-bytes-minimum"; // 32+ chars
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generate JWT token
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email from the token
    public String extractEmail(String token) {
        return parseToken(token).getBody().getSubject();
    }

    // Extract role from the token
    public String extractRole(String token) {
        return parseToken(token).getBody().get("role", String.class);
    }

    // Validate the token
    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Parse the token to get claims
    private Jws<Claims> parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
