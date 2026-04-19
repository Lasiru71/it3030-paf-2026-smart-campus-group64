package com.booking.booking_management.controller;

import com.booking.booking_management.dto.request.ProfileUpdateRequest;
import com.booking.booking_management.model.User;
import com.booking.booking_management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody ProfileUpdateRequest request) {
        return userRepository.findById(id).map(user -> {
            if (request.getFullName() != null) user.setFullName(request.getFullName());
            if (request.getPhone() != null) user.setPhone(request.getPhone());
            if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
            if (request.getBio() != null) user.setBio(request.getBio());
            if (request.getStudentId() != null) user.setStudentId(request.getStudentId());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @NonNull String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable @NonNull String id) {
        return userRepository.findById(id).map(user -> {
            String currentStatus = user.getStatus();
            user.setStatus(currentStatus.equals("Active") ? "Inactive" : "Active");
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
