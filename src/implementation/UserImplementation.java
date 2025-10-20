/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package implementation;

import dao.UserDao;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.*;
import javax.mail.internet.MimeMessage;
import model.SignUpModel;
import service.UserService;

/**
 *
 * @author HP
 */
public class UserImplementation extends UnicastRemoteObject implements UserService{
private Map<String, String> verificationCodes = new HashMap<>();
    private UserDao dadao = new UserDao();

    public UserImplementation() throws RemoteException {}

    @Override
    public boolean signUp(SignUpModel theSign) throws RemoteException {
        return dadao.registerUser(theSign);
    }

    @Override
    public String sendVerificationEmail(String email) throws RemoteException {
       String code = generateVerificationCode();
    verificationCodes.put(email, code);

    // SMTP server information for Gmail
    String host = "smtp.gmail.com";  // Gmail SMTP server
    final String user = "gloriaumutoni765@gmail.com";  // Replace with your Gmail address
    final String password = "ltki tqlr kvut hoip";  // Replace with your Gmail account password or app-specific password

    Properties properties = new Properties();
    properties.put("mail.smtp.host", host);
    properties.put("mail.smtp.port", "587");
    properties.put("mail.smtp.auth", "true");
    properties.put("mail.smtp.starttls.enable", "true");
    properties.put("mail.smtp.ssl.trust", "smtp.gmail.com"); // Bypass TLS certificate validation (insecure)
    properties.put("mail.debug", "true"); // Enable debug logging

    Session session = Session.getDefaultInstance(properties, new javax.mail.Authenticator() {
    protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(user, password);
    }
    });
    session.setDebug(true);
    try {
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(user));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        message.setSubject("Email Verification Code");
        message.setText("Your verification code is: " + code);

        Transport.send(message);
        System.out.println("Verification code sent successfully.");
    } catch (MessagingException e) {
        e.printStackTrace();
    }

    return code;
    }

    @Override
    public boolean verifyCode(String email, String code) throws RemoteException {
        String storedCode = verificationCodes.get(email);
        return storedCode != null && storedCode.equals(code);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    @Override
    public SignUpModel signIn(String username, String password) throws RemoteException {
       return dadao.loginUser(username, password);
    }

}