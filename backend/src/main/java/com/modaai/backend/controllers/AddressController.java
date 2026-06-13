package com.modaai.backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.AddressRequest;
import com.modaai.backend.entities.Address;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.AddressRepository;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Address>> list(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        return ResponseEntity.ok(addressRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<Address> create(Principal principal, @RequestBody AddressRequest req) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        Address a = new Address();
        a.setUser(user);
        a.setCountry(req.getCountry());
        a.setState(req.getState());
        a.setCity(req.getCity());
        a.setAddressLine1(req.getAddressLine1());
        a.setAddressLine2(req.getAddressLine2());
        a.setPostalCode(req.getPostalCode());
        a.setReferences(req.getReferences());
        a.setIsDefault(Boolean.TRUE.equals(req.getIsDefault()));
        Address saved = addressRepository.save(a);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> update(Principal principal, @PathVariable Long id, @RequestBody AddressRequest req) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        Address a = addressRepository.findById(id).orElse(null);
        if (a == null || !a.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        a.setCountry(req.getCountry());
        a.setState(req.getState());
        a.setCity(req.getCity());
        a.setAddressLine1(req.getAddressLine1());
        a.setAddressLine2(req.getAddressLine2());
        a.setPostalCode(req.getPostalCode());
        a.setReferences(req.getReferences());
        if (req.getIsDefault() != null) {
            a.setIsDefault(Boolean.TRUE.equals(req.getIsDefault()));
        }
        addressRepository.save(a);
        return ResponseEntity.ok(a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        Address a = addressRepository.findById(id).orElse(null);
        if (a == null || !a.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        addressRepository.delete(a);
        return ResponseEntity.noContent().build();
    }
}
