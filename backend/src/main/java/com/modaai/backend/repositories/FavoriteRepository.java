package com.modaai.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.Favorite;
import com.modaai.backend.entities.User;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
