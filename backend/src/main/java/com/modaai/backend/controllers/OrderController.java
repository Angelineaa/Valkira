package com.modaai.backend.controllers;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dtos.OrderResponseDTO;
import com.modaai.backend.dtos.OrderResponseDTO.OrderItemDTO;
import com.modaai.backend.dtos.OrderResponseDTO.ShippingAddressDTO;
import com.modaai.backend.entities.Order;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.OrderRepository;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getOrders(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        if (username == null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                username = ((UserDetails) authentication.getPrincipal()).getUsername();
            } else if (authentication != null && authentication.getPrincipal() instanceof String) {
                username = (String) authentication.getPrincipal();
            }
        }
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        List<OrderResponseDTO> orderDTOs = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(Principal principal, @PathVariable Long id) {
        String username = (principal != null) ? principal.getName() : null;
        if (username == null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                username = ((UserDetails) authentication.getPrincipal()).getUsername();
            } else if (authentication != null && authentication.getPrincipal() instanceof String) {
                username = (String) authentication.getPrincipal();
            }
        }
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        Order o = orderRepository.findById(id).orElse(null);
        if (o == null || !o.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDTO(o));
    }

    private OrderResponseDTO convertToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                item.getId(),
                item.getSize(),
                item.getColor(),
                item.getQuantity(),
                item.getUnitPrice()
        ))
                .collect(Collectors.toList());

        ShippingAddressDTO addressDTO = null;
        if (order.getShippingAddress() != null) {
            addressDTO = new ShippingAddressDTO(
                    order.getShippingAddress().getId(),
                    order.getShippingAddress().getCountry(),
                    order.getShippingAddress().getState(),
                    order.getShippingAddress().getCity(),
                    order.getShippingAddress().getAddressLine1(),
                    order.getShippingAddress().getAddressLine2(),
                    order.getShippingAddress().getPostalCode(),
                    order.getShippingAddress().getReferences()
            );
        }

        return new OrderResponseDTO(
                order.getId(),
                order.getSubtotal(),
                order.getShippingCost(),
                order.getTax(),
                order.getTotal(),
                order.getStatus(),
                order.getCreatedAt(),
                itemDTOs,
                addressDTO
        );
    }
}
