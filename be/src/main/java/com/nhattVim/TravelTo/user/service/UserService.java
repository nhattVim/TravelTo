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
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UserProfileDto getProfile(String email) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return new UserProfileDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(),
        user.getAddress(), user.getAvatarUrl(), user.getProvider(), user.getRole());
  }

  public UserProfileDto updateProfile(String email, UserProfileUpdateRequest request) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    user.setFullName(request.fullName());
    if (request.phone() != null) user.setPhone(request.phone());
    if (request.address() != null) user.setAddress(request.address());
    if (request.avatarUrl() != null) user.setAvatarUrl(request.avatarUrl());

    userRepository.save(user);

    return new UserProfileDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(),
        user.getAddress(), user.getAvatarUrl(), user.getProvider(), user.getRole());
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
