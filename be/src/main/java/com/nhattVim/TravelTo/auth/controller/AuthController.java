package com.nhattVim.TravelTo.auth.controller;

import com.nhattVim.TravelTo.auth.dto.AuthResponse;
import com.nhattVim.TravelTo.auth.dto.GoogleAuthRequest;
import com.nhattVim.TravelTo.auth.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final GoogleAuthService googleAuthService;

  public AuthController(GoogleAuthService googleAuthService) {
    this.googleAuthService = googleAuthService;
  }

  @PostMapping("/google")
  ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleAuthRequest request) {
    return ResponseEntity.ok(googleAuthService.authenticate(request));
  }
}
