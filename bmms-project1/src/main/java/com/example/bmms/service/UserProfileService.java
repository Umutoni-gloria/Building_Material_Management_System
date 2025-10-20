package com.example.bmms.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bmms.model.PasswordResetToken;
import com.example.bmms.model.UserProfile;
import com.example.bmms.repository.PasswordResetTokenRepository;
import com.example.bmms.repository.UserProfileRepository;
import com.example.bmms.util.EmailService;
import com.example.bmms.util.JwtTokenUtil;
import com.example.bmms.util.TwoFactorUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final JavaMailSender mailSender;
    private final EmailService emailService;

    // In-memory 2FA code store with expiration time
    private final Map<String, Map<String, Object>> stored2FACodes = new ConcurrentHashMap<>();
    private static final long TWO_FA_CODE_EXPIRY_MINUTES = 30;

    // ========== USER REGISTRATION ==========
    public UserProfile register(String email, String password, String fullName, String role) {
        if (userProfileRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        UserProfile user = new UserProfile();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role);
        return userProfileRepository.save(user);
    }

    // ========== LOGIN + 2FA ==========
public Map<String, Object> loginWithToken(String email, String password) {
    Optional<UserProfile> optionalUser = userProfileRepository.findByEmail(email);
    if (optionalUser.isEmpty() || !passwordEncoder.matches(password, optionalUser.get().getPassword())) {
        throw new RuntimeException("Invalid credentials");
    }

    UserProfile user = optionalUser.get();
    
    // Clear any existing 2FA code for this user
    stored2FACodes.remove(email);
    
    // Generate fresh 2FA code with expiration time
    String twoFactorCode = TwoFactorUtil.generate2FACode();
    Map<String, Object> codeData = Map.of(
        "code", twoFactorCode,
        "expiryTime", LocalDateTime.now().plusMinutes(TWO_FA_CODE_EXPIRY_MINUTES)
    );
    stored2FACodes.put(email, codeData);

    // Send 2FA email
    try {
        emailService.sendEmail(email, "2FA Verification Code", "Your 2FA code is: " + twoFactorCode);
    } catch (Exception e) {
        throw new RuntimeException("Failed to send 2FA email");
    }

    // Return temporary response (frontend will handle 2FA)
    return Map.of(
        "message", "2FA code sent to email",
        "email", email
    );
}

public Map<String, Object> completeLoginWith2FA(String email, String code) {
    if (!verify2FACode(email, code)) {
        throw new RuntimeException("Invalid 2FA code");
    }
    
    UserProfile user = userProfileRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
    String token = jwtTokenUtil.generateToken(email, user.getRole());
    
    return Map.of(
        "token", token,
        "user", Map.of(
            "email", user.getEmail(),
            "fullName", user.getFullName(),
            "role", user.getRole()
        )
    );
}

/**
 * Verifies the 2FA code for the given email.
 */
private boolean verify2FACode(String email, String code) {
    Map<String, Object> codeData = stored2FACodes.get(email);
    if (codeData == null) {
        throw new RuntimeException("No 2FA code found. Please request a new code.");
    }

    String storedCode = (String) codeData.get("code");
    LocalDateTime expiryTime = (LocalDateTime) codeData.get("expiryTime");

    if (LocalDateTime.now().isAfter(expiryTime)) {
        stored2FACodes.remove(email);
        throw new RuntimeException("2FA code has expired. Please request a new code.");
    }

    if (!storedCode.equals(code)) {
        throw new RuntimeException("Invalid 2FA code.");
    }

    stored2FACodes.remove(email); // Invalidate code after successful use
    return true;
}

    // ========== PASSWORD RESET FLOW ==========

    public void createPasswordResetToken(UserProfile user) {
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));

        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPasswordWithToken(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        UserProfile user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userProfileRepository.save(user);

        tokenRepository.delete(resetToken); // Clean up
    }

    private String buildResetEmail(String resetLink) {
        return "Hello,\n\n" +
                "You requested to reset your password. Please click the link below to proceed:\n" +
                resetLink + "\n\n" +
                "This link will expire in 30 minutes.\n\n" +
                "If you did not request this, please ignore the email.\n\n" +
                "Thanks,\nFitness Tracker Team";
    }

    public UserProfile findByEmail(String email) {
        return userProfileRepository.findByEmail(email).orElse(null);
    }

}
