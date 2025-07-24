package com.example.demo.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {
    private int id;
    private String imageName;
    private String title;
    private String description;
    private String category;
    private String condition;
    private BigDecimal price;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

