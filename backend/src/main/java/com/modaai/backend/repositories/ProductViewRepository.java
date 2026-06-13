package com.modaai.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.ProductView;
import com.modaai.backend.entities.User;

public interface ProductViewRepository extends JpaRepository<ProductView, Long> {

    List<ProductView> findTop10ByUserOrderByViewedAtDesc(User user);
}
