package com.nhattVim.TravelTo.auth.controller;

import com.nhattVim.TravelTo.auth.dto.AuthResponse;
import com.nhattVim.TravelTo.auth.dto.EmailPasswordLoginRequest;
import com.nhattVim.TravelTo.auth.dto.ForgotPasswordDto;
import com.nhattVim.TravelTo.auth.dto.GoogleAuthRequest;
import com.nhattVim.TravelTo.auth.dto.ResetPasswordDto;
import com.nhattVim.TravelTo.auth.dto.SetPasswordRequest;
import com.nhattVim.TravelTo.auth.dto.VerifyResetCodeDto;
import com.nhattVim.TravelTo.auth.service.PasswordResetService;
import com.nhattVim.TravelTo.auth.service.GoogleAuthService;
import com.nhattVim.TravelTo.common.service.EmailService;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import com.nhattVim.TravelTo.user.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final GoogleAuthService googleAuthService;
  private final PasswordResetService passwordResetService;
  private final UserRepository userRepository;
  private final EmailService emailService;
  private final UserService userService;

  public AuthController(GoogleAuthService googleAuthService, PasswordResetService passwordResetService,
      UserRepository userRepository, EmailService emailService, UserService userService) {
    this.googleAuthService = googleAuthService;
    this.passwordResetService = passwordResetService;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.userService = userService;
  }

  @PostMapping("/google")
  ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleAuthRequest request) {
    return ResponseEntity.ok(googleAuthService.authenticate(request));
  }

  @PostMapping("/login")
  ResponseEntity<AuthResponse> loginWithPassword(@Valid @RequestBody EmailPasswordLoginRequest request) {
    return ResponseEntity.ok(googleAuthService.authenticateWithPassword(request));
  }

  @PostMapping("/password")
  ResponseEntity<Void> setPassword(@Valid @RequestBody SetPasswordRequest request, Principal principal) {
    googleAuthService.createPassword(principal.getName(), request.password());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordDto dto) {
    User user = userRepository.findByEmailIgnoreCase(dto.getEmail()).orElse(null);

    if (user == null) {
      return ResponseEntity.badRequest().body(Map.of(
          "success", false,
          "message", "Email chưa được đăng ký trong hệ thống"));
    }

    String code = passwordResetService.generateAndStoreResetCode(dto.getEmail());
    emailService.sendPasswordResetCode(dto.getEmail(), code);

    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", "Mã xác thực đã được gửi đến email của bạn"));
  }

  @PostMapping("/verify-reset-code")
  public ResponseEntity<Map<String, Object>> verifyResetCode(@Valid @RequestBody VerifyResetCodeDto dto) {
    boolean isValid = passwordResetService.verifyResetCode(dto.getEmail(), dto.getCode());

    if (!isValid) {
      return ResponseEntity.badRequest().body(Map.of(
          "success", false,
          "message", "Mã xác thực không đúng hoặc đã hết hạn"));
    }

    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", "Mã xác thực hợp lệ"));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordDto dto) {
    if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
      return ResponseEntity.badRequest().body(Map.of(
          "success", false,
          "message", "Mật khẩu xác nhận không khớp"));
    }

    boolean isValid = passwordResetService.verifyResetCode(dto.getEmail(), dto.getCode());
    if (!isValid) {
      return ResponseEntity.badRequest().body(Map.of(
          "success", false,
          "message", "Mã xác thực không đúng hoặc đã hết hạn"));
    }

    passwordResetService.resetPassword(dto.getEmail(), dto.getCode());
    userService.updatePasswordByEmail(dto.getEmail(), dto.getNewPassword());

    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", "Đặt lại mật khẩu thành công"));
  }
}
