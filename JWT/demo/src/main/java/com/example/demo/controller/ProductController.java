package com.example.demo.controller;

import com.example.demo.dto.ProductDto;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api")
@RestController
public class ProductController {

    @Autowired
    private ProductService service;

    @Autowired
    private UserService userService;

    @GetMapping("/products")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        try {
            List<Product> products = service.getAllProducts();
            List<ProductDto> productDtos = products.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(productDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/my-listings")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductDto>> getMyListings(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.findByEmail(userDetails.getUsername());
            List<Product> products = service.getProductsByUser(user);
            List<ProductDto> productDtos = products.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(productDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
            @RequestPart("product") Product product,
            @RequestPart("images") MultipartFile images,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        try {
            User user = userService.findByEmail(userDetails.getUsername());
            product.setUser(user);
            
            Product created = service.addProduct(product, images);
            ProductDto productDTO = convertToDTO(created);
            return ResponseEntity.ok(productDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating product: " + e.getMessage());
        }
    }

    @PutMapping(value = "/product/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,
            @RequestPart("product") Product productUpdate,
            @RequestPart(value = "images", required = false) MultipartFile images,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Product existingProduct = service.getProduct(id);
            
            if (existingProduct == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Product not found");
            }
            existingProduct.setTitle(productUpdate.getTitle());
            existingProduct.setDescription(productUpdate.getDescription());
            existingProduct.setPrice(productUpdate.getPrice());
            existingProduct.setCategory(productUpdate.getCategory());
            existingProduct.setCondition(productUpdate.getCondition());
            if (images != null && !images.isEmpty()) {
                existingProduct.setImageName(images.getOriginalFilename());
                existingProduct.setImageType(images.getContentType());
                existingProduct.setImageData(images.getBytes());
            }
            
            Product updated = service.save(existingProduct);
            ProductDto productDTO = convertToDTO(updated);
            return ResponseEntity.ok(productDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable int id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Product product = service.getProduct(id);
            
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Product not found");
            }
            service.delete(id);
            return ResponseEntity.ok("Product deleted successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product: " + e.getMessage());
        }
    }
    
    private ProductDto convertToDTO(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setCondition(product.getCondition());
        dto.setImageName(product.getImageName());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
       
        if (product.getUser() != null) {
            dto.setUsername(product.getUser().getDisplayUsername());
        }

        return dto;
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable int id) {
        Product product = service.getProduct(id);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        ProductDto dto = convertToDTO(product);
        return ResponseEntity.ok(dto);
    }
     
    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId) {
        Product product = service.getProduct(productId);
        if (product == null || product.getImageData() == null || product.getImageType() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        byte[] imageFile = product.getImageData();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDto>> searchProductsByName(@RequestParam("title") String title) {
         try {
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        List<Product> products = service.searchProductsByName(title.trim());
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDtos);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
    }
    }



}