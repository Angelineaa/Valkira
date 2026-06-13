package com.modaai.backend.services;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.modaai.backend.dto.CartItemRequest;
import com.modaai.backend.dto.CartItemResponse;
import com.modaai.backend.dto.CartResponse;
import com.modaai.backend.entities.Cart;
import com.modaai.backend.entities.CartItem;
import com.modaai.backend.entities.Product;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.CartItemRepository;
import com.modaai.backend.repositories.CartRepository;
import com.modaai.backend.repositories.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public CartResponse getCartForUser(User user) {
        CartResponse resp = new CartResponse();
        Optional<Cart> opt = cartRepository.findByUser(user);
        if (opt.isEmpty()) {
            return resp;
        }

        Cart cart = opt.get();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {
            CartItemResponse ir = toResponse(ci);
            resp.getItems().add(ir);
            subtotal = subtotal.add(ir.getUnitPrice().multiply(BigDecimal.valueOf(ir.getQuantity())));
        }

        resp.setSubtotal(subtotal);
        // Simple tax and shipping rules (can be extended)
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.19));
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(150000)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(10000);
        resp.setTax(tax);
        resp.setShipping(shipping);
        resp.setTotal(subtotal.add(tax).add(shipping));

        return resp;
    }

    private CartItemResponse toResponse(CartItem ci) {
        CartItemResponse r = new CartItemResponse();
        r.setId(ci.getId());
        r.setProductId(ci.getProduct().getId());
        r.setName(ci.getProduct().getName());
        r.setImageUrl(ci.getProduct().getImageUrl());
        r.setSize(ci.getSize());
        r.setColor(ci.getColor());
        r.setQuantity(ci.getQuantity());
        r.setUnitPrice(ci.getUnitPrice() != null ? ci.getUnitPrice() : ci.getProduct().getPrice());
        return r;
    }

    @Transactional
    public CartItemResponse addItemToCart(User user, CartItemRequest req) {
        Product p = productRepository.findById(req.getProductId()).orElse(null);
        if (p == null) {
            return null;
        }

        Integer rq = req.getQuantity();
        int qtyRequested = rq == null ? 1 : rq;
        if (p.getStock() != null && p.getStock() < qtyRequested) {
            throw new IllegalArgumentException("Stock insuficiente");
        }

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepository.save(c);
        });

        CartItem ci = new CartItem();
        ci.setCart(cart);
        ci.setProduct(p);
        ci.setSize(req.getSize());
        ci.setColor(req.getColor());
        ci.setQuantity(qtyRequested);
        ci.setUnitPrice(p.getPrice());

        cart.addItem(ci);
        cartRepository.save(cart);

        return toResponse(ci);
    }

    @Transactional
    public CartItemResponse updateItemQuantity(User user, Long itemId, Integer qty) {
        CartItem ci = cartItemRepository.findById(itemId).orElseThrow(() -> new IllegalArgumentException("Item no encontrado"));
        if (!ci.getCart().getUser().getId().equals(user.getId())) {
            throw new SecurityException("No autorizado");
        }

        Product p = ci.getProduct();
        if (p.getStock() != null && p.getStock() < qty) {
            throw new IllegalArgumentException("Stock insuficiente");
        }

        ci.setQuantity(qty);
        cartItemRepository.save(ci);
        return toResponse(ci);
    }

    @Transactional
    public void removeItem(User user, Long itemId) {
        CartItem ci = cartItemRepository.findById(itemId).orElse(null);
        if (ci == null) {
            return;
        }
        if (!ci.getCart().getUser().getId().equals(user.getId())) {
            throw new SecurityException("No autorizado");
        }

        Cart cart = ci.getCart();
        cart.removeItem(ci);
        cartRepository.save(cart);
    }

    @Transactional
    public void mergeItems(User user, java.util.List<CartItemRequest> items) {
        if (items == null || items.isEmpty()) {
            return;
        }

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepository.save(c);
        });

        for (CartItemRequest req : items) {
            CartItem existing = cartItemRepository.findByCartAndProductIdAndSizeAndColor(cart, req.getProductId(), req.getSize(), req.getColor());
            if (existing != null) {
                int existingQty = existing.getQuantity() == null ? 0 : existing.getQuantity();
                Integer rq2 = req.getQuantity();
                int addQty = rq2 == null ? 1 : rq2;
                int newQty = existingQty + addQty;
                Product p = existing.getProduct();
                if (p.getStock() != null && p.getStock() < newQty) {
                    existing.setQuantity(p.getStock());
                } else {
                    existing.setQuantity(newQty);
                }
                cartItemRepository.save(existing);
            } else {
                // reuse addItemToCart behavior
                CartItemRequest r = new CartItemRequest();
                r.setProductId(req.getProductId());
                r.setSize(req.getSize());
                r.setColor(req.getColor());
                r.setQuantity(req.getQuantity());
                addItemToCart(user, r);
            }
        }
    }

    @Transactional
    public void clearCart(User user) {
        cartRepository.findByUser(user).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }
}
