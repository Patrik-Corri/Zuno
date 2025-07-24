package com.example.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender emailSender;

    public void sendVerificationEmail(String to, String subject, String text) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);

        emailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetCode) {
        try {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject("Reset Your Zuno Password");
        String htmlContent = "<html>"
            + "<body style=\"font-family: Arial, sans-serif; background-color: #faf8f5; padding: 40px; color: #333;\">"
            + "<div style=\"max-width: 600px; margin: auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);\">"
            + "<h2 style=\"color: #C32163; text-align: center;\">Reset Your Password</h2>"
            + "<p style=\"font-size: 16px; text-align: center;\">We've received a request to reset your password. Use the code below to proceed:</p>"
            + "<div style=\"background: linear-gradient(135deg, #C32163 0%, #f2789f 100%); padding: 20px; color: white; text-align: center; font-size: 24px; font-weight: bold; border-radius: 10px; margin: 20px 0;\">"
            + resetCode
            + "</div>"
            + "<p style=\"text-align: center; font-size: 14px; color: #555;\">This code will expire in 1 hour for your security.</p>"
            + "<p style=\"text-align: center; font-size: 14px; color: #777;\">If you didn’t request this, you can safely ignore this email.</p>"
            + "<hr style=\"margin: 30px 0; border: none; border-top: 1px solid #f4d4da;\">"
            + "<p style=\"text-align: center; font-size: 12px; color: #C32163;\">Zuno</p>"
            + "</div>"
            + "</body></html>";

        helper.setText(htmlContent, true);
        emailSender.send(mimeMessage);
    } catch (MessagingException e) {
        e.printStackTrace();
    }
    }
}