package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Product;
import com.example.demo.model.User;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    List<Product> findByUser(User user);
    
    @Query("SELECT p FROM Product p WHERE p.user = :user")
    List<Product> findByUserForListing(@Param("user") User user);
    
    @Query("SELECT p.id, p.title, p.description, p.price, p.category, p.condition, " +
           "p.imageName, p.imageType, p.createdAt, p.updatedAt, p.user " +
           "FROM Product p WHERE p.user = :user")
    List<Object[]> findProductSummaryByUser(@Param("user") User user);

    List<Product> findByTitleContainingIgnoreCase(String title);
}