package com.modaai.backend.controllers;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.ProductRequest;
import com.modaai.backend.dto.ProductResponse;
import com.modaai.backend.entities.Product;
import com.modaai.backend.repositories.ProductRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<ProductResponse> listAll() {
        return productRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getOne(@PathVariable Long id) {
        return productRepository.findById(id).map(p -> ResponseEntity.ok(toResponse(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        Product p = new Product();
        applyRequest(p, request);
        Product saved = productRepository.save(p);
        return ResponseEntity.created(URI.create("/api/products/" + saved.getId())).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productRepository.findById(id).map(p -> {
            applyRequest(p, request);
            Product saved = productRepository.save(p);
            return ResponseEntity.ok(toResponse(saved));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return productRepository.findById(id).map(p -> {
            productRepository.delete(p);
            return ResponseEntity.noContent().<Void>build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private void applyRequest(Product p, ProductRequest r) {
        p.setName(r.getName());
        p.setDescription(r.getDescription());
        p.setPrice(r.getPrice());
        p.setImageUrl(r.getImageUrl());
        p.setCategory(r.getCategory());
        p.setGender(r.getGender());
        p.setColor(r.getColor());
        p.setBrand(r.getBrand());
        p.setSizes(listToCsv(r.getSizes()));
        p.setStock(r.getStock());
    }

    private ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setImageUrl(p.getImageUrl());
        r.setCategory(p.getCategory());
        r.setGender(p.getGender());
        r.setColor(p.getColor());
        r.setBrand(p.getBrand());
        r.setSizes(csvToList(p.getSizes()));
        r.setStock(p.getStock());
        return r;
    }

    private String listToCsv(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return list.stream().collect(Collectors.joining(","));
    }

    private List<String> csvToList(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of();
        }
        return List.of(csv.split(","));
    }
}
