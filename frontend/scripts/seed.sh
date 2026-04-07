#!/bin/bash
# Seed script para popular o BISHA Store com dados de teste
# Requer backend rodando em http://localhost:8080

BASE_URL="http://localhost:8080/api"

echo "🌱 Populando BISHA Store com dados de teste..."
echo ""

# ===== 1. Registrar Vendedor =====
echo "👤 Registrando vendedor (Maria)..."
curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@university.com",
    "password": "senha123",
    "cpf": "12345678901",
    "phone": "11999990001"
  }' > /dev/null

# Login vendedor
echo "🔑 Login do vendedor..."
SELLER_TOKEN=$(curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@university.com", "password": "senha123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "   Token: ${SELLER_TOKEN:0:20}..."

# Ativar perfil de vendedor
echo "🏪 Ativando perfil de vendedor..."
curl -s -X POST "$BASE_URL/seller/activate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -d '{
    "storeName": "Brechó da Maria",
    "description": "Eletrônicos e materiais universitários seminovos",
    "paymentMethods": ["PIX", "DINHEIRO"],
    "pixKey": "maria@university.com"
  }' > /dev/null

echo ""

# ===== 2. Registrar Segundo Vendedor =====
echo "👤 Registrando vendedor (Carlos)..."
curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Souza",
    "email": "carlos@university.com",
    "password": "senha123",
    "cpf": "98765432100",
    "phone": "11999990002"
  }' > /dev/null

SELLER2_TOKEN=$(curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "carlos@university.com", "password": "senha123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s -X POST "$BASE_URL/seller/activate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER2_TOKEN" \
  -d '{
    "storeName": "Tech do Carlos",
    "description": "Gadgets e acessórios de tecnologia",
    "paymentMethods": ["PIX", "CREDITO", "DEBITO"],
    "pixKey": "carlos@university.com"
  }' > /dev/null

echo ""

# ===== 3. Registrar Comprador =====
echo "👤 Registrando comprador (João)..."
curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Oliveira",
    "email": "joao@university.com",
    "password": "senha123",
    "cpf": "11122233344",
    "phone": "11999990003"
  }' > /dev/null

echo ""

# ===== 4. Criar Categorias =====
echo "📂 Criando categorias..."
for cat in "Eletrônicos" "Livros" "Roupas" "Veículos" "Material Escolar" "Esportes"; do
  curl -s -X POST "$BASE_URL/categories" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $SELLER_TOKEN" \
    -d "{\"name\": \"$cat\"}" > /dev/null
  echo "   ✅ $cat"
done

echo ""

# ===== 5. Criar Produtos (Maria) =====
echo "📦 Criando produtos da Maria..."

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -d '{
    "name": "iPhone 12 - 64GB Seminovo",
    "description": "iPhone 12 em ótimo estado, bateria 87%, desbloqueado para todas as operadoras. Acompanha carregador e capinha.",
    "price": 1800.00,
    "stock": 1,
    "categoryId": 1
  }' > /dev/null
echo "   ✅ iPhone 12"

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -d '{
    "name": "Notebook Dell Inspiron 15 - i5 11ª Geração",
    "description": "Notebook Dell Inspiron 15 3000, 8GB RAM, SSD 256GB, usado por 1 ano. Ótimo para programação e estudos.",
    "price": 2200.00,
    "stock": 1,
    "categoryId": 1
  }' > /dev/null
echo "   ✅ Notebook Dell"

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -d '{
    "name": "Cálculo Vol. 1 - James Stewart (8ª Edição)",
    "description": "Livro de Cálculo 1, em bom estado, com algumas anotações a lápis. Edição completa.",
    "price": 45.00,
    "stock": 3,
    "categoryId": 2
  }' > /dev/null
echo "   ✅ Livro Cálculo"

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -d '{
    "name": "Bicicleta Caloi Aro 29 - Mountain Bike",
    "description": "Bicicleta Caloi em bom estado, 21 marchas, freio a disco. Ótima para ir à faculdade.",
    "price": 650.00,
    "stock": 1,
    "categoryId": 6
  }' > /dev/null
echo "   ✅ Bicicleta Caloi"

echo ""

# ===== 6. Criar Produtos (Carlos) =====
echo "📦 Criando produtos do Carlos..."

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER2_TOKEN" \
  -d '{
    "name": "Fone Bluetooth JBL Tune 510BT",
    "description": "Fone JBL original, usado poucas vezes, bateria dura 40h. Na caixa original com cabo USB-C.",
    "price": 150.00,
    "stock": 2,
    "categoryId": 1
  }' > /dev/null
echo "   ✅ Fone JBL"

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER2_TOKEN" \
  -d '{
    "name": "Calculadora Científica HP 50g",
    "description": "Calculadora HP 50g gráfica, essencial para engenharia. Funcionando perfeitamente, com capa protetora.",
    "price": 280.00,
    "stock": 1,
    "categoryId": 5
  }' > /dev/null
echo "   ✅ Calculadora HP"

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER2_TOKEN" \
  -d '{
    "name": "Moletom Universitário - Engenharia de Software",
    "description": "Moletom oficial do curso, tamanho M, usado apenas em eventos. Cor preta com logo bordado.",
    "price": 85.00,
    "stock": 2,
    "categoryId": 3
  }' > /dev/null
echo "   ✅ Moletom Universitário"

curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER2_TOKEN" \
  -d '{
    "name": "Mouse Gamer Logitech G203",
    "description": "Mouse gamer Logitech G203, RGB, 8000 DPI, sensor óptico. Perfeito para jogos e produtividade.",
    "price": 95.00,
    "stock": 3,
    "categoryId": 1
  }' > /dev/null
echo "   ✅ Mouse Logitech"

echo ""
echo "✨ Seed completo! Dados criados:"
echo "   👤 3 usuários (maria, carlos, joao)"
echo "   🏪 2 vendedores (Brechó da Maria, Tech do Carlos)"
echo "   📂 6 categorias"
echo "   📦 8 produtos"
echo ""
echo "🔐 Credenciais de teste:"
echo "   Vendedor 1: maria@university.com / senha123"
echo "   Vendedor 2: carlos@university.com / senha123"
echo "   Comprador:  joao@university.com / senha123"
