package com.nhattVim.TravelTo.auth.dto;

public record AuthResponse(String accessToken, UserInfo user) {

  public record UserInfo(
      Long id,
      String email,
      String fullName,
      String avatarUrl,
      String role,
      boolean passwordConfigured) {
  }
}
