package com.nhattVim.TravelTo.security;

import com.nhattVim.TravelTo.config.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final JwtProperties jwtProperties;

  public JwtService(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
  }

  public String generateToken(String email) {
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(jwtProperties.expirationMinutes() * 60);
    return Jwts.builder()
        .subject(email)
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiresAt))
        .signWith(getSigningKey())
        .compact();
  }

  public String extractEmail(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isTokenValid(String token) {
    try {
      parseClaims(token);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private SecretKey getSigningKey() {
    String secret = jwtProperties.secret();
    if (secret == null || secret.isBlank()) {
      throw new IllegalStateException("JWT secret chưa được cấu hình");
    }

    // Support both Base64/Base64URL secrets and plain text secrets.
    byte[] keyBytes;
    try {
      keyBytes = Decoders.BASE64.decode(secret);
    } catch (RuntimeException ex) {
      try {
        keyBytes = Decoders.BASE64URL.decode(secret);
      } catch (RuntimeException ignored) {
        keyBytes = secret.getBytes(StandardCharsets.UTF_8);
      }
    }
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
