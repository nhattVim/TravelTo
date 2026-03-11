package com.nhattVim.TravelTo.common.exception;

import java.time.Instant;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  ResponseEntity<ApiErrorResponse> handleNotFound(NotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ApiErrorResponse(Instant.now(), HttpStatus.NOT_FOUND.value(), ex.getMessage()));
  }

  @ExceptionHandler(BadRequestException.class)
  ResponseEntity<ApiErrorResponse> handleBadRequest(BadRequestException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiErrorResponse(Instant.now(), HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(FieldError::getDefaultMessage)
        .collect(Collectors.joining(", "));
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiErrorResponse(Instant.now(), HttpStatus.BAD_REQUEST.value(), message));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiErrorResponse> handleAccessDenied() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(new ApiErrorResponse(Instant.now(), HttpStatus.FORBIDDEN.value(),
            "Bạn không có quyền truy cập tài nguyên này"));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ApiErrorResponse(Instant.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage()));
  }

  record ApiErrorResponse(Instant timestamp, int status, String message) {
  }
}
