package com.nhattVim.TravelTo.user.repository;

import com.nhattVim.TravelTo.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmailIgnoreCase(String email);
}
