package com.nhattVim.TravelTo.province.repository;

import com.nhattVim.TravelTo.province.entity.Province;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinceRepository extends JpaRepository<Province, Long> {

  Optional<Province> findByCodeIgnoreCase(String code);
}
