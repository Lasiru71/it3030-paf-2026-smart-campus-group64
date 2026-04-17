package com.booking.booking_management.controller;

import com.booking.booking_management.model.Booking;
import com.booking.booking_management.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STAFF')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'STAFF')")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('USER', 'TECHNICIAN', 'ADMIN', 'STAFF')")
    public Booking updateBookingStatus(@PathVariable @NonNull String id, @RequestBody Map<String, String> update) {
        String status = update.get("status");
        String locationSuggestions = update.get("locationSuggestions");
        String adminNote = update.get("adminNote");
        System.out.println(">>> REQUEST ARRIVED: updateBookingStatus for ID=" + id + " Status=" + status + " Location=" + locationSuggestions + " Note=" + adminNote);
        try {
            return bookingService.updateBookingStatus(id, status, locationSuggestions, adminNote);
        } catch (Exception e) {
            System.err.println(">>> ERROR in updateBookingStatus: " + e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteBooking(@PathVariable @NonNull String id) {
        bookingService.deleteBooking(id);
        return "Booking " + id + " deleted by Administrator.";
    }

    @PatchMapping("/{id}/message")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'STAFF')")
    public Booking updateBookingMessage(@PathVariable @NonNull String id, @RequestBody Map<String, String> messageUpdate) {
        return bookingService.updateBookingMessage(id, messageUpdate.get("message"));
    }

    @PatchMapping("/{id}/selection")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'STAFF')")
    public Booking updateStudentSelection(@PathVariable @NonNull String id, @RequestBody Map<String, String> selectionUpdate) {
        return bookingService.updateStudentSelection(id, selectionUpdate.get("selection"));
    }
}
