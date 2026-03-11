package com.nhattVim.TravelTo.auth.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nhattVim.TravelTo.auth.dto.AuthResponse;
import com.nhattVim.TravelTo.auth.dto.GoogleAuthRequest;
import com.nhattVim.TravelTo.common.exception.BadRequestException;
import com.nhattVim.TravelTo.config.properties.GoogleProperties;
import com.nhattVim.TravelTo.config.properties.SecurityProperties;
import com.nhattVim.TravelTo.security.JwtService;
import com.nhattVim.TravelTo.user.entity.AuthProvider;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.entity.UserRole;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class GoogleAuthService {

  private final UserRepository userRepository;
  private final SecurityProperties securityProperties;
  private final GoogleProperties googleProperties;
  private final JwtService jwtService;
  private final RestClient restClient;

  public GoogleAuthService(
      UserRepository userRepository,
      SecurityProperties securityProperties,
      GoogleProperties googleProperties,
      JwtService jwtService,
      RestClient.Builder restClientBuilder) {
    this.userRepository = userRepository;
    this.securityProperties = securityProperties;
    this.googleProperties = googleProperties;
    this.jwtService = jwtService;
    this.restClient = restClientBuilder.build();
  }

  public AuthResponse authenticate(GoogleAuthRequest request) {
    GoogleTokenInfo tokenInfo = verifyToken(request.idToken());
    if (tokenInfo.email() == null || tokenInfo.email().isBlank()) {
      throw new BadRequestException("Google token không chứa email hợp lệ");
    }
    if (!"true".equalsIgnoreCase(tokenInfo.emailVerified())) {
      throw new BadRequestException("Email Google chưa được xác thực");
    }

    User user = userRepository.findByEmailIgnoreCase(tokenInfo.email())
        .map(existing -> updateExistingUser(existing, tokenInfo))
        .orElseGet(() -> createUser(tokenInfo));

    String accessToken = jwtService.generateToken(user.getEmail());
    return new AuthResponse(
        accessToken,
        new AuthResponse.UserInfo(user.getId(), user.getEmail(), user.getFullName(), user.getAvatarUrl(),
            user.getRole().name()));
  }

  private GoogleTokenInfo verifyToken(String idToken) {
    try {
      GoogleTokenInfo tokenInfo = restClient.get()
          .uri(googleProperties.tokenInfoUrl() + "?id_token={idToken}", idToken)
          .retrieve()
          .body(GoogleTokenInfo.class);

      if (tokenInfo == null || tokenInfo.subject() == null || tokenInfo.subject().isBlank()) {
        throw new BadRequestException("Google token không hợp lệ");
      }
      return tokenInfo;
    } catch (RestClientException ex) {
      throw new BadRequestException("Không thể xác thực Google token");
    }
  }

  private User updateExistingUser(User user, GoogleTokenInfo tokenInfo) {
    user.setFullName(normalizeName(tokenInfo.name(), user.getEmail()));
    user.setAvatarUrl(tokenInfo.picture());
    user.setProvider(AuthProvider.GOOGLE);
    user.setProviderUserId(tokenInfo.subject());
    if (isAdminEmail(user.getEmail())) {
      user.setRole(UserRole.ADMIN);
    }
    return userRepository.save(user);
  }

  private User createUser(GoogleTokenInfo tokenInfo) {
    UserRole role = isAdminEmail(tokenInfo.email()) ? UserRole.ADMIN : UserRole.USER;
    User user = User.builder()
        .email(tokenInfo.email().trim().toLowerCase(Locale.ROOT))
        .fullName(normalizeName(tokenInfo.name(), tokenInfo.email()))
        .avatarUrl(tokenInfo.picture())
        .provider(AuthProvider.GOOGLE)
        .providerUserId(tokenInfo.subject())
        .role(role)
        .build();
    return userRepository.save(user);
  }

  private String normalizeName(String name, String email) {
    if (name != null && !name.isBlank()) {
      return name.trim();
    }
    return email;
  }

  private boolean isAdminEmail(String email) {
    if (securityProperties.adminEmails() == null) {
      return false;
    }
    return securityProperties.adminEmails().stream()
        .filter(item -> item != null && !item.isBlank())
        .anyMatch(adminEmail -> adminEmail.equalsIgnoreCase(email));
  }

  private record GoogleTokenInfo(
      @JsonProperty("sub") String subject,
      String email,
      @JsonProperty("email_verified") String emailVerified,
      String name,
      String picture) {
  }
}
