package com.backend.shopeasy.controller;

import com.backend.shopeasy.model.User;
import com.backend.shopeasy.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.backend.shopeasy.dto.AuthResponse;
import com.backend.shopeasy.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
public User register(@RequestBody User user) {
    return authService.register(user);
}

@PostMapping("/login")
public AuthResponse login(@RequestBody LoginRequest request) {
    return authService.login(request);
}
}
