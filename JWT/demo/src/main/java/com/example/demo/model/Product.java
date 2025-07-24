package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageName;
    private String imageType;
    private String condition;
    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] imageData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @ManyToOne
    private User user;

    

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Category {
        MEN, WOMEN, KIDS, SHOES, ACCESSORIES, KITCHEN, APPLIANCES, ELECTRONICS, PHONES,
        COMPUTERS, GAMING, GARDEN, OUTDOOR, FURNITURE, ART, TOYS, HEALTH,
        BEAUTY, AUTOMOTIVE, SPORTS, TOOLS, MUSIC, PETS, JEWELRY, FASHION, BOOKS
    }

    public enum Condition {
        NEW, USED, POOR
    }
}