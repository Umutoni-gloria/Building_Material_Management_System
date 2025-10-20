package com.example.bmms.controller;

import com.example.bmms.model.UserProfile;
import com.example.bmms.repository.PasswordResetTokenRepository;
import com.example.bmms.repository.UserProfileRepository;
import com.example.bmms.service.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import com.example.bmms.dto.LoginRequest;
import com.example.bmms.dto.RegisterRequest;
import com.example.bmms.dto.ResetPasswordRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import com.example.bmms.util.JwtTokenUtil;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // ========= Register =========
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserProfile user = userProfileService.register(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFullName(),
                    request.getRole()
            );
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========= Login =========
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> response = userProfileService.loginWithToken(
                    request.getEmail(),
                    request.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

// ========= 2FA Verification =========
    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestParam String email, @RequestParam String enteredCode) {
        try {
            Map<String, Object> authResponse = userProfileService.completeLoginWith2FA(email, enteredCode);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========= Request Password Reset =========
    @PostMapping("/request-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestParam String email) {
        Optional<UserProfile> optionalUser = userProfileRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not found.");
        }

        UserProfile user = optionalUser.get();
        userProfileService.createPasswordResetToken(user);
        return ResponseEntity.ok("Password reset link sent to email.");
    }

    // ========= Reset Password With Token =========
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @RequestBody ResetPasswordRequest request
    ) {
        String newPassword = request.getNewPassword();

        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Missing or empty newPassword.");
        }

        try {
            userProfileService.resetPasswordWithToken(token, newPassword);
            return ResponseEntity.ok("Password successfully reset.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
