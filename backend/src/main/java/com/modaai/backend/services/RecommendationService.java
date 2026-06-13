package com.modaai.backend.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.modaai.backend.dto.ProductResponse;
import com.modaai.backend.entities.Favorite;
import com.modaai.backend.entities.Order;
import com.modaai.backend.entities.Product;
import com.modaai.backend.entities.ProductView;
import com.modaai.backend.entities.User;
import com.modaai.backend.entities.UserPreferences;
import com.modaai.backend.repositories.FavoriteRepository;
import com.modaai.backend.repositories.OrderRepository;
import com.modaai.backend.repositories.ProductRepository;
import com.modaai.backend.repositories.ProductViewRepository;
import com.modaai.backend.repositories.UserPreferencesRepository;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;
    private final FavoriteRepository favoriteRepository;
    private final OrderRepository orderRepository;
    private final ProductViewRepository productViewRepository;
    private final UserPreferencesRepository userPreferencesRepository;

    public RecommendationService(
            ProductRepository productRepository,
            FavoriteRepository favoriteRepository,
            OrderRepository orderRepository,
            ProductViewRepository productViewRepository,
            UserPreferencesRepository userPreferencesRepository) {
        this.productRepository = productRepository;
        this.favoriteRepository = favoriteRepository;
        this.orderRepository = orderRepository;
        this.productViewRepository = productViewRepository;
        this.userPreferencesRepository = userPreferencesRepository;
    }

    public List<ProductResponse> getRecommendationsForUser(User user) {
        List<Product> products = productRepository.findAll();
        List<Favorite> favorites = favoriteRepository.findByUser(user);
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        List<ProductView> views = productViewRepository.findTop10ByUserOrderByViewedAtDesc(user);
        UserPreferences preferences = userPreferencesRepository.findByUser(user).orElse(null);

        Set<Long> favoriteProductIds = favorites.stream()
                .map(f -> f.getProduct().getId())
                .collect(Collectors.toSet());

        Set<String> favoriteCategories = favorites.stream()
                .map(f -> safeLower(f.getProduct().getCategory()))
                .filter(c -> !c.isBlank())
                .collect(Collectors.toSet());

        Set<String> favoriteColors = favorites.stream()
                .map(f -> safeLower(f.getProduct().getColor()))
                .filter(c -> !c.isBlank())
                .collect(Collectors.toSet());

        Set<String> purchasedCategories = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(item -> safeLower(item.getProduct().getCategory()))
                .filter(c -> !c.isBlank())
                .collect(Collectors.toSet());

        Set<String> purchasedColors = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(item -> safeLower(item.getColor()))
                .filter(c -> !c.isBlank())
                .collect(Collectors.toSet());

        Set<String> viewedCategories = views.stream()
                .map(view -> safeLower(view.getProduct().getCategory()))
                .filter(c -> !c.isBlank())
                .collect(Collectors.toSet());

        Set<String> viewedColors = views.stream()
                .map(view -> safeLower(view.getProduct().getColor()))
                .filter(c -> !c.isBlank())
                .collect(Collectors.toSet());

        Set<String> preferredCategories = preferences == null ? Set.of()
                : csvToSet(preferences.getPreferredCategories());
        Set<String> preferredColors = preferences == null ? Set.of()
                : csvToSet(preferences.getFavoriteColors());

        String preferredGender = preferences == null ? null : safeLower(preferences.getPreferredGender());

        Map<Long, Double> scoreMap = new HashMap<>();
        Map<Long, List<String>> reasonsMap = new HashMap<>();
        boolean hasPhysicalProfile = preferences != null && ((preferences.getHeightCm() != null) || (preferences.getWeightKg() != null)
                || (preferences.getBodyType() != null && !preferences.getBodyType().isBlank()));

        for (Product product : products) {
            double score = 0.0;
            List<String> reasons = new ArrayList<>();
            String productCategory = safeLower(product.getCategory());
            String productColor = safeLower(product.getColor());
            String productGender = safeLower(product.getGender());
            String productBrand = safeLower(product.getBrand());

            if (product.getStock() != null && product.getStock() > 0) {
                score += 0.5;
                reasons.add("Stock disponible");
            }
            if (favoriteProductIds.contains(product.getId())) {
                score += 2.0;
                reasons.add("Basado en tus favoritos");
            }
            if (!preferredCategories.isEmpty() && preferredCategories.contains(productCategory)) {
                score += 2.0;
                reasons.add("Basado en tus categorías preferidas");
            }
            if (!preferredColors.isEmpty() && preferredColors.contains(productColor)) {
                score += 1.5;
                reasons.add("Basado en tus colores favoritos");
            }
            if (!favoriteCategories.isEmpty() && favoriteCategories.contains(productCategory)) {
                score += 1.2;
                reasons.add("Coincide con categorías de tus favoritos");
            }
            if (!favoriteColors.isEmpty() && favoriteColors.contains(productColor)) {
                score += 1.0;
                reasons.add("Coincide con los colores de tus favoritos");
            }
            if (!purchasedCategories.isEmpty() && purchasedCategories.contains(productCategory)) {
                score += 1.2;
                reasons.add("Basado en compras anteriores");
            }
            if (!purchasedColors.isEmpty() && purchasedColors.contains(productColor)) {
                score += 0.8;
                reasons.add("Color familiar de tus compras");
            }
            if (!viewedCategories.isEmpty() && viewedCategories.contains(productCategory)) {
                score += 0.8;
                reasons.add("Categoría similar a productos vistos");
            }
            if (!viewedColors.isEmpty() && viewedColors.contains(productColor)) {
                score += 0.6;
                reasons.add("Color similar a productos vistos");
            }
            if (preferredGender != null && !preferredGender.isBlank() && preferredGender.equals(productGender)) {
                score += 1.5;
                reasons.add("Coincide con tu género preferido");
            }

            if (productBrand != null && !productBrand.isBlank()) {
                if (favoriteCategories.contains(productBrand) || purchasedCategories.contains(productBrand)) {
                    score += 0.5;
                    reasons.add("Marca afín a tu historial de compras");
                }
            }

            if (hasPhysicalProfile && productCategory != null && !productCategory.isBlank() && !productCategory.equals("accesorios")) {
                score += 0.2;
                reasons.add("Recomendado según tu perfil corporal");
            }

            if (score < 0.1) {
                score = 0.1;
            }
            scoreMap.put(product.getId(), score);
            reasonsMap.put(product.getId(), reasons.stream().distinct().collect(Collectors.toList()));
        }

        return products.stream()
                .sorted(Comparator.comparingDouble((Product p) -> scoreMap.getOrDefault(p.getId(), 0.0)).reversed())
                .limit(8)
                .map(product -> toResponse(product, scoreMap.getOrDefault(product.getId(), 0.0), reasonsMap.getOrDefault(product.getId(), List.of())))
                .collect(Collectors.toList());
    }

    public void recordView(User user, Long productId) {
        productRepository.findById(productId).ifPresent(product -> {
            ProductView view = new ProductView();
            view.setUser(user);
            view.setProduct(product);
            view.setViewedAt(LocalDateTime.now());
            productViewRepository.save(view);
        });
    }

    private String safeLower(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private Set<String> csvToSet(String csv) {
        if (csv == null || csv.isBlank()) {
            return Set.of();
        }
        return Set.copyOf(
                List.of(csv.split(","))
                        .stream()
                        .map(String::trim)
                        .filter(s -> !s.isBlank())
                        .map(this::safeLower)
                        .collect(Collectors.toSet())
        );
    }

    private ProductResponse toResponse(Product product, Double score, List<String> reasons) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setImageUrl(product.getImageUrl());
        response.setCategory(product.getCategory());
        response.setGender(product.getGender());
        response.setColor(product.getColor());
        response.setBrand(product.getBrand());
        response.setStock(product.getStock());
        response.setRelevanceScore(score);
        if (reasons != null && !reasons.isEmpty()) {
            response.setRecommendationReason(String.join(" · ", reasons));
        }
        return response;
    }
}
