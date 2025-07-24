package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Product getProduct(int id) {
        return repo.findById(id).orElse(null);
    }

    @Transactional
    public Product addProduct(Product product, MultipartFile images) throws IOException {
        product.setImageName(images.getOriginalFilename());
        product.setImageType(images.getContentType());
        product.setImageData(images.getBytes());
        return repo.save(product);
    }

    @Transactional
    public Product save(Product product) {
        return repo.save(product);
    }

    @Transactional
    public void delete(int id) {
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByUser(User user) {
        return repo.findByUserForListing(user);
    }
    
    @Transactional(readOnly = true)
    public Product getProductWithImage(int id) {
        return repo.findById(id).orElse(null);
    }

   @Transactional(readOnly = true)
    public List<Product> searchProductsByName(String title) {
    return repo.findByTitleContainingIgnoreCase(title);
    }

}