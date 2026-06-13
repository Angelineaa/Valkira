package com.modaai.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.Cart;
import com.modaai.backend.entities.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart(Cart cart);

    CartItem findByCartAndProductIdAndSizeAndColor(Cart cart, Long productId, String size, String color);
}
