package com.shopsync.config;

import com.shopsync.model.Inventory;
import com.shopsync.model.Product;
import com.shopsync.model.Role;
import com.shopsync.model.User;
import com.shopsync.repository.InventoryRepository;
import com.shopsync.repository.ProductRepository;
import com.shopsync.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(ProductRepository productRepository,
                          InventoryRepository inventoryRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("Seeding admin and customer users...");

        User admin = new User(
                "System Admin",
                "admin@shopsync.com",
                passwordEncoder.encode("admin123"),
                "9999999999",
                Role.ADMIN
        );
        userRepository.save(admin);

        User customer = new User(
                "Test Customer",
                "user@shopsync.com",
                passwordEncoder.encode("user123"),
                "8888888888",
                Role.CUSTOMER
        );
        userRepository.save(customer);
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            return;
        }

        System.out.println("Seeding products and inventory...");

        saveProductWithInventory(
                "Aashirvaad Shudh Chakki Atta",
                "10kg pack",
                new BigDecimal("499.00"),
                "https://via.placeholder.com/150",
                "Groceries",
                "BARCODE001",
                50,
                10
        );

        saveProductWithInventory(
                "Amul Taaza Toned Milk",
                "1L pouch",
                new BigDecimal("66.00"),
                "https://via.placeholder.com/150",
                "Dairy",
                "BARCODE002",
                12,
                20
        );

        saveProductWithInventory(
                "Tata Salt Iodized",
                "1kg",
                new BigDecimal("28.00"),
                "https://via.placeholder.com/150",
                "Groceries",
                "BARCODE003",
                200,
                50
        );

        saveProductWithInventory(
                "Maggi 2-Minute Noodles",
                "Pack of 4",
                new BigDecimal("56.00"),
                "https://via.placeholder.com/150",
                "Snacks",
                "BARCODE004",
                150,
                30
        );

        saveProductWithInventory(
                "Surf Excel Easy Wash Detergent",
                "1.5kg",
                new BigDecimal("199.00"),
                "https://via.placeholder.com/150",
                "Household",
                "BARCODE005",
                8,
                15
        );

        saveProductWithInventory(
                "Fortune Sunlite Sunflower Oil",
                "1L Pouch",
                new BigDecimal("145.00"),
                "https://via.placeholder.com/150",
                "Groceries",
                "BARCODE006",
                40,
                20
        );

        System.out.println("Database seeding completed.");
    }

    private void saveProductWithInventory(String name,
                                          String description,
                                          BigDecimal price,
                                          String imageUrl,
                                          String category,
                                          String barcode,
                                          int currentStock,
                                          int reorderLevel) {

        Product product = new Product(
                name,
                description,
                price,
                imageUrl,
                category,
                barcode
        );

        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory(
                savedProduct,
                currentStock,
                reorderLevel,
                LocalDateTime.now()
        );

        inventoryRepository.save(inventory);
    }
}