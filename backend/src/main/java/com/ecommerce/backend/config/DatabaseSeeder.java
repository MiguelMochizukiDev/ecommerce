package com.ecommerce.backend.config;

import com.ecommerce.backend.domain.category.Category;
import com.ecommerce.backend.domain.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                Category.builder().name("Eletrônicos").description("Celulares, computadores e gadgets").build(),
                Category.builder().name("Moda e Vestuário").description("Roupas, calçados e acessórios").build(),
                Category.builder().name("Casa e Decoração").description("Móveis e utilidades domésticas").build(),
                Category.builder().name("Livros e Papelaria").description("Obras literárias e materiais").build(),
                Category.builder().name("Beleza e Saúde").description("Cosméticos e cuidados").build()
            ));
            System.out.println("Categorias iniciais populadas com sucesso!");
        }
    }
}
