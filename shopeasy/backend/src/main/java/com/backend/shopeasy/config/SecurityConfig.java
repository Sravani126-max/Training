package com.backend.shopeasy.config;

import com.backend.shopeasy.security.JwtAuthFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // Disable CSRF because we are using JWT
            .csrf(csrf -> csrf.disable())

            // Handle authentication and authorization errors
            .exceptionHandling(ex -> ex

                // 401 Unauthorized
                .authenticationEntryPoint((request, response, authException) -> {

                    System.out.println(">>> AUTH ENTRY POINT CALLED");
                    System.out.println(
                        "URI: " + request.getRequestURI()
                    );
                    System.out.println(
                        "Reason: " + authException.getMessage()
                    );

                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Unauthorized"
                    );
                })

                // 403 Forbidden
                .accessDeniedHandler((request, response, accessDeniedException) -> {

                    System.out.println(">>> ACCESS DENIED HANDLER CALLED");
                    System.out.println(
                        "URI: " + request.getRequestURI()
                    );
                    System.out.println(
                        "Reason: " + accessDeniedException.getMessage()
                    );

                    response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Forbidden"
                    );
                })
            )

            // JWT authentication is stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // Login and registration are public
                .requestMatchers("/api/auth/**").permitAll()

                // Allow Spring's error endpoint
                .requestMatchers("/error").permitAll()

                // Logged-in users can view products
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**"
                ).authenticated()

                // Only ADMIN can create products
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/products/**"
                ).hasRole("ADMIN")

                // Only ADMIN can update products
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/products/**"
                ).hasRole("ADMIN")

                // Only ADMIN can delete products
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/products/**"
                ).hasRole("ADMIN")

                // Only ADMIN can access admin orders
                .requestMatchers(
                    "/api/orders/admin/**"
                ).hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )

            // Run JWT filter before Spring Security's authentication filter
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}