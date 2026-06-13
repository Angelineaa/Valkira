package com.modaai.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.modaai.backend.dto.ProductResponse;
import com.modaai.backend.entities.Favorite;
import com.modaai.backend.entities.Product;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.FavoriteRepository;
import com.modaai.backend.repositories.ProductRepository;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, ProductRepository productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
    }

    public List<ProductResponse> listFavorites(User user) {
        return favoriteRepository.findByUser(user).stream()
                .map(Favorite::getProduct)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse addFavorite(User user, Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return null;
        }

        boolean exists = favoriteRepository.findByUser(user).stream()
                .anyMatch(f -> f.getProduct().getId().equals(productId));
        if (exists) {
            return toResponse(product);
        }

        Favorite fav = new Favorite();
        fav.setUser(user);
        fav.setProduct(product);
        favoriteRepository.save(fav);
        return toResponse(product);
    }

    public void removeFavorite(User user, Long productId) {
        favoriteRepository.deleteByUserIdAndProductId(user.getId(), productId);
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
        r.setStock(p.getStock());
        return r;
    }
}
