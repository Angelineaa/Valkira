package com.modaai.backend;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.modaai.backend.entities.Product;
import com.modaai.backend.repositories.ProductRepository;
import com.modaai.backend.repositories.UserRepository;

@Component
public class TestDatabase implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public TestDatabase(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("Usuarios encontrados: " + userRepository.count());

        if (productRepository.count() == 0) {
            System.out.println("No se encontraron productos. Creando datos...");
            List<Product> products = List.of(
                    createProduct("Summer Dress", "Vestido ajustado con efecto degradado en tonos rosa, coral y naranja inspirado en los colores del atardecer.", 80000, "/img/summer_dress.jpg", "vestidos", "mujer", "Negro", "Valkira", 100),
                    createProduct("Black Dress", "Un vestido negro que combina sofisticación y modernidad en cada detalle.", 80000, "/img/Black_dress.jpg", "vestidos", "mujer", "Negro", "Valkira", 100),
                    createProduct("Body Liso", "Minivestido de satén con acabado brillante suave.", 69000, "/img/Body_Liso.jpg", "blusas", "mujer", "Negro", "Valkira", 100),
                    createProduct("Noviembre", "Blusa de seda natural en tono marfil.", 38000, null, "blusas", "mujer", "Blush", "Valkira", 100),
                    createProduct("Falda Brillante", "Falda brillante, perfecta para conciertos y elevar cualquier outfit.", 62000, null, "faldas", "mujer", "Hueso", "Valkira", 100),
                    createProduct("Baguette Clasico Liso", "La combinación perfecta entre elegancia y practicidad.", 45000, "/img/clasico_liso.jpg", "accesorios", "mujer", "", "Valkira", 100),
                    createProduct("Sweet", "Un bolso versátil diseñado para acompañarte en cada momento del día.", 45000, null, "accesorios", "mujer", "", "Valkira", 100),
                    createProduct("Aurora", "La combinación perfecta entre elegancia y practicidad.", 45000, null, "accesorios", "mujer", "", "Valkira", 100),
                    createProduct("BJean", "Jean + Bolso= BJean!", 45000, null, "accesorios", "mujer", "", "Valkira", 100),
                    createProduct("Low cost", "Una opción más casual pero igual de hermosa.", 29000, null, "accesorios", "mujer", "", "Valkira", 100)
            );
            productRepository.saveAll(products);
            System.out.println("Productos cargados: " + products.size());
        } else {
            System.out.println("Actualizando stock de productos existentes...");
            // Actualizar stock de todos los productos a 100
            List<Product> allProducts = productRepository.findAll();
            for (Product p : allProducts) {
                p.setStock(100);
            }
            productRepository.saveAll(allProducts);
            System.out.println("Stock actualizado para " + allProducts.size() + " productos");
        }
    }

    private Product createProduct(String name, String description, int price, String imageUrl, String category, String gender, String color, String brand, int stock) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(BigDecimal.valueOf(price));
        p.setImageUrl(imageUrl);
        p.setCategory(category);
        p.setGender(gender);
        p.setColor(color);
        p.setBrand(brand);
        p.setStock(stock);
        return p;
    }
}
