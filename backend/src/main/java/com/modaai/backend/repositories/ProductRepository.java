package com.modaai.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByColorIgnoreCase(String color);
    List<Product> findByCategoryIgnoreCase(String category);
}
