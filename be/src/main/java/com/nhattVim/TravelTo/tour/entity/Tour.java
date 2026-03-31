package com.nhattVim.TravelTo.tour.entity;

import com.nhattVim.TravelTo.common.model.BaseAuditEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
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

  @Column(name = "province_code", nullable = false)
  private String provinceCode;

  @Column(name = "province_name", nullable = false)
  private String provinceName;

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

  @ElementCollection
  @CollectionTable(name = "tour_images", joinColumns = @JoinColumn(name = "tour_id"))
  @OrderColumn(name = "sort_order")
  @Column(name = "image_url", nullable = false, length = 500)
  @Builder.Default
  private List<String> imageUrls = new ArrayList<>();

  @Column(nullable = false, length = 120)
  private String departureLocation;

  @Column(nullable = false, length = 120)
  private String destinationLocation;

  @Column(length = 240)
  private String attractions;

  @Column(length = 240)
  private String cuisine;

  @Column(length = 240)
  private String suitableFor;

  @Column(length = 240)
  private String idealTime;

  @Column(length = 240)
  private String transport;

  @Column(length = 240)
  private String promotion;

  @Column(length = 1200)
  private String notes;

  @Column(nullable = false)
  private int slotsTotal;

  @Column(nullable = false)
  private int slotsAvailable;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TourStatus status;
}
