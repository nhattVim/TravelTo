package com.nhattVim.TravelTo.user.controller;

import com.nhattVim.TravelTo.user.dto.UserProfileDto;
import com.nhattVim.TravelTo.user.dto.UserProfileUpdateRequest;
import com.nhattVim.TravelTo.user.dto.PasswordUpdateRequest;
import com.nhattVim.TravelTo.user.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfileDto> getProfile(Principal principal) {
    return ResponseEntity.ok(userService.getProfile(principal.getName()));
  }

  @PutMapping("/me")
  public ResponseEntity<UserProfileDto> updateProfile(Principal principal,
      @Valid @RequestBody UserProfileUpdateRequest request) {
    return ResponseEntity.ok(userService.updateProfile(principal.getName(), request));
  }

  @PutMapping("/me/password")
  public ResponseEntity<Void> changePassword(Principal principal,
      @Valid @RequestBody PasswordUpdateRequest request) {
    userService.changePassword(principal.getName(), request);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/me")
  public ResponseEntity<Void> deleteAccount(Principal principal) {
    userService.deleteAccount(principal.getName());
    return ResponseEntity.ok().build();
  }
}
