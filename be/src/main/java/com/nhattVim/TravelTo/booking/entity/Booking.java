package com.nhattVim.TravelTo.booking.entity;

import com.nhattVim.TravelTo.common.model.BaseAuditEntity;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.user.entity.User;
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
import java.time.LocalDate;
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
@Table(name = "bookings")
public class Booking extends BaseAuditEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "tour_id", nullable = false)
  private Tour tour;

  @Column(nullable = false)
  private LocalDate travelDate;

  @Column(nullable = false)
  private int guests;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal totalPrice;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private BookingStatus status;
}
