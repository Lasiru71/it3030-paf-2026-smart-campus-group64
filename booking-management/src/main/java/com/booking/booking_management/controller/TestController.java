package com.booking.booking_management.controller;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private MongoClient mongoClient;

    @GetMapping("/db")
    public Map<String, String> testDbConnection() {
        try {
            MongoDatabase db = mongoClient.getDatabase("bookingdb");
            db.runCommand(new Document("ping", 1));

            return Map.of(
                    "status", "SUCCESS",
                    "database", "bookingdb",
                    "message", "MongoDB Atlas connection is working!"
            );
        } catch (Exception e) {
            return Map.of(
                    "status", "FAILED",
                    "message", e.getMessage()
            );
        }
    }
}