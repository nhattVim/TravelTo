package com.nhattVim.TravelTo.user.service;

import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.user.dto.UserDto;
import com.nhattVim.TravelTo.user.dto.UserProfileDto;
import com.nhattVim.TravelTo.user.dto.UserProfileUpdateRequest;
import com.nhattVim.TravelTo.user.dto.UserStatusUpdateRequest;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.nhattVim.TravelTo.user.dto.PasswordUpdateRequest;
import com.nhattVim.TravelTo.user.repository.WishlistRepository;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final WishlistRepository wishlistRepository;
  private final BookingRepository bookingRepository;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
      WishlistRepository wishlistRepository, BookingRepository bookingRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.wishlistRepository = wishlistRepository;
    this.bookingRepository = bookingRepository;
  }

  public UserProfileDto getProfile(String email) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return new UserProfileDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(),
        user.getAddress(), user.getAvatarUrl(), user.getGender(), user.getDateOfBirth(), user.getIdentityCard(),
        user.getProvider(), user.getRole());
  }

  public UserProfileDto updateProfile(String email, UserProfileUpdateRequest request) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    user.setFullName(request.fullName());
    if (request.phone() != null) user.setPhone(request.phone());
    if (request.address() != null) user.setAddress(request.address());
    if (request.avatarUrl() != null) user.setAvatarUrl(request.avatarUrl());

    if (request.gender() != null) user.setGender(request.gender());
    if (request.dateOfBirth() != null) user.setDateOfBirth(request.dateOfBirth());
    if (request.identityCard() != null) user.setIdentityCard(request.identityCard());

    userRepository.save(user);

    return new UserProfileDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(),
        user.getAddress(), user.getAvatarUrl(), user.getGender(), user.getDateOfBirth(), user.getIdentityCard(),
        user.getProvider(), user.getRole());
  }

  @Transactional
  public void changePassword(String email, PasswordUpdateRequest request) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    if (user.getPasswordHash() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account does not have a password (e.g., registered via Google)");
    }

    if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect old password");
    }

    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);
  }

  @Transactional
  public void deleteAccount(String email) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    wishlistRepository.deleteByUserId(user.getId());
    bookingRepository.deleteByUserId(user.getId());
    userRepository.delete(user);
  }

  public PagedResponse<UserDto> getAllUsers(int page, int size) {
    Page<User> users = userRepository.findAll(PageRequest.of(page, size));
    return new PagedResponse<>(
        users.getContent().stream()
            .map(u -> new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getPhone(),
                u.getAddress(), u.getAvatarUrl(), u.getProvider(), u.getRole(), u.getCreatedAt(), u.getUpdatedAt()))
            .toList(),
        users.getTotalElements(),
        users.getTotalPages(),
        users.getNumber(),
        users.getSize());
  }

  public UserDto updateUserRole(Long id, UserStatusUpdateRequest request) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    
    user.setRole(request.role());
    userRepository.save(user);

    return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(),
        user.getAddress(), user.getAvatarUrl(), user.getProvider(), user.getRole(), user.getCreatedAt(), user.getUpdatedAt());
  }
}
