package com.nhattVim.TravelTo.tour.entity;

import com.nhattVim.TravelTo.common.model.BaseAuditEntity;
import com.nhattVim.TravelTo.province.entity.Province;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
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
@Table(name = "tours")
public class Tour extends BaseAuditEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "province_id", nullable = false)
  private Province province;

  @Column(nullable = false, length = 180)
  private String title;

  @Column(nullable = false, length = 240)
  private String summary;

  @Column(nullable = false, length = 3000)
  private String description;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal price;

  @Column(nullable = false)
  private int days;

  @Column(nullable = false)
  private int nights;

  @Column(length = 400)
  private String imageUrl;

  @Column(nullable = false)
  private int slotsTotal;

  @Column(nullable = false)
  private int slotsAvailable;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TourStatus status;
}
