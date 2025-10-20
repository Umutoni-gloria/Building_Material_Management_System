package com.example.bmms.util;

import java.util.Random;

public class TwoFactorUtil {

    // Generate a random 6-digit number as the 2FA code
    public static String generate2FACode() {
        Random random = new Random();
        int code = random.nextInt(999999); // Generates a number between 0 and 999999
        return String.format("%06d", code); // Format it as a 6-digit number (padded with zeros if needed)
    }
}
