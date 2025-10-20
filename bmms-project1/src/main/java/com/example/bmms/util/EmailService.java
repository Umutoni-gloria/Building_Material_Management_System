package com.example.bmms.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendEmail(String to, String subject, String text) {
        try {
            if (to == null || to.trim().isEmpty()) {
                throw new IllegalArgumentException("Recipient email address cannot be empty");
            }
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            System.out.println("Attempting to send email to: " + to);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (MailException me) {
            System.err.println("Mail server error: " + me.getMessage());
            throw new RuntimeException("Mail server error. Please check SMTP settings or try again later.", me);
        } catch (Exception e) {
            System.err.println("Unexpected error while sending email: " + e.getMessage());
            throw new RuntimeException("Failed to send email due to an unexpected error.", e);
        }
    }

    public void sendPasswordResetEmail(String recipient, String resetToken) {
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        String subject = "Reset Your Password";
        String body = "Click the link to reset your password:\n" + resetLink;
        sendEmail(recipient, subject, body);
    }

}
