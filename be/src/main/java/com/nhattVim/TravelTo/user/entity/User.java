package com.nhattVim.TravelTo.user.entity;

import com.nhattVim.TravelTo.common.model.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseAuditEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 120)
  private String email;

  @Column(nullable = false, length = 120)
  private String fullName;

  @Column(length = 400)
  private String avatarUrl;

  @Column(nullable = false, length = 80)
  private String providerUserId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private AuthProvider provider;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private UserRole role;
}
