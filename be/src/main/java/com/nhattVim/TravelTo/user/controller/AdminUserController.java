package com.nhattVim.TravelTo.user.controller;

import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.user.dto.UserDto;
import com.nhattVim.TravelTo.user.dto.UserStatusUpdateRequest;
import com.nhattVim.TravelTo.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

  private final UserService userService;

  public AdminUserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<PagedResponse<UserDto>> getAllUsers(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(userService.getAllUsers(page, size));
  }

  @PatchMapping("/{id}/role")
  public ResponseEntity<UserDto> updateUserRole(@PathVariable Long id,
      @Valid @RequestBody UserStatusUpdateRequest request) {
    return ResponseEntity.ok(userService.updateUserRole(id, request));
  }
}
