package com.example.demo.service;

import com.example.demo.dto.ForgotPasswordDto;
import com.example.demo.dto.LoginUserDto;
import com.example.demo.dto.RegisterUserDto;
import com.example.demo.dto.ResendDto;
import com.example.demo.dto.ResetPasswordDto;
import com.example.demo.dto.VerifyUserDto;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public User signup(RegisterUserDto input) {
        User user = new User(input.getFirstName(), input.getLastName(), input.getEmail(),passwordEncoder.encode(input.getPassword()), input.getUsername());
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return user;
    }

    public void verifyUser(VerifyUserDto input) {
        Optional<User> optionalUser = userRepository.findByVerificationCode(input.getVerificationCode());
    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);
        } else {
            throw new RuntimeException("Invalid verification code");
        }
    }

    public void resendVerificationCode(ResendDto resendDto) {
        Optional<User> optionalUser = userRepository.findByEmail(resendDto.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private void sendVerificationEmail(User user) { 
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
            + "<body style=\"font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #faf8f5;\">"
            + "<div style=\"max-width: 600px; margin: 0 auto; padding: 40px 20px;\">"
            + "<div style=\"background: linear-gradient(135deg, #f8e8e8 0%, #faf0f0 100%); border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(219, 112, 147, 0.15);\">"
            + "<div style=\"text-align: center; margin-bottom: 30px;\">"
            + "<p style=\"color: #b80960ff; font-size: 32px; margin: 10px 0 0 0; font-weight: 300;\">You're almost there!</p>"
            + "</div>"
            + "<div style=\"background: #fffceb; border-radius: 15px; padding: 30px; margin: 30px 0; border: 2px solid #f4d4da; backdrop-filter: blur(10px);\">"
            + "<p style=\"color: #6b3a4f; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;\">Please enter the verification code below to activate your account:</p>"
            + "<div style=\"background: linear-gradient(135deg, #d1477a 0%, #e07aa0 100%); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 4px 15px rgba(209, 71, 122, 0.3);\">"
            + "<p style=\"color: #fff; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);\">" + verificationCode + "</p>"
            + "</div>"
            + "</div>"
            + "<div style=\"text-align: center; margin-top: 30px;\">"
            + "<p style=\"color: #a8647a; font-size: 14px; margin: 0; line-height: 1.5;\">This code will expire in 15 minutes for your security.</p>"
            + "<p style=\"color: #a8647a; font-size: 14px; margin: 15px 0 0 0;\">If you didn't request this verification, please ignore this email.</p>"
            + "</div>"
            + "<div style=\"border-top: 1px solid #f4d4da; margin-top: 30px; padding-top: 20px; text-align: center;\">"
            + "<p style=\"color: #c4879a; font-size: 12px; margin: 0;\">Thank you for joining us! </p>"
            + "</div>"
            + "</div>"
            + "</div>"
            + "</body>"
            + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {

            e.printStackTrace();
        }
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

     public void sendPasswordResetCode(ForgotPasswordDto forgotPasswordDto) {
        Optional<User> optionalUser = userRepository.findByEmail(forgotPasswordDto.getEmail());
        
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();
        String resetCode = generateResetCode();
        user.setPasswordResetCode(resetCode);
        user.setPasswordResetCodeExpiresAt(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
    }

    public void resetPassword(ResetPasswordDto resetPasswordDto) {
        Optional<User> optionalUser = userRepository.findByEmail(resetPasswordDto.getEmail());
        
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = optionalUser.get();
        if (user.getPasswordResetCode() == null || 
            !user.getPasswordResetCode().equals(resetPasswordDto.getResetCode())) {
            throw new RuntimeException("Invalid reset code");
            }
        if (user.getPasswordResetCodeExpiresAt() == null || 
            user.getPasswordResetCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset code has expired");
        }
        user.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));
        user.setPasswordResetCode(null);
        user.setPasswordResetCodeExpiresAt(null);
        
        userRepository.save(user);
    }

    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
