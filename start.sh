#!/bin/bash
# BISHA Store — Inicia backend e frontend juntos

export DB_USER="${DB_USER:-bisha}"
export DB_PASSWORD="${DB_PASSWORD:-BiSha@1234}"
export JWT_SECRET="${JWT_SECRET:-bishastorejwtsecretkey2026xxxxxxxxxxx}"

# Salva o diretório raiz do projeto antes de qualquer cd
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "========================================"
echo "  BISHA Store — Iniciando sistema..."
echo "========================================"

echo "[0/2] Garantindo acesso ao MySQL e ao banco ecommerce_db..."

if ! command -v mysql >/dev/null 2>&1; then
  echo "      Cliente mysql nao encontrado."
  echo "      Instale o MySQL client/server e tente novamente."
  exit 1
fi

if MYSQL_PWD="$DB_PASSWORD" mysql -u"$DB_USER" -h localhost -P 3306 -e "SELECT 1" >/dev/null 2>&1; then
  MYSQL_PWD="$DB_PASSWORD" mysql -u"$DB_USER" -h localhost -P 3306 \
    -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" \
    || {
      echo "      Usuario $DB_USER autenticou, mas nao conseguiu criar/verificar o banco."
      echo "      Tentando configuracao inicial com sudo..."
      sudo mysql -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; GRANT ALL PRIVILEGES ON ecommerce_db.* TO '$DB_USER'@'localhost'; FLUSH PRIVILEGES;" \
        || {
          echo "      Falha na configuracao inicial do MySQL."
          exit 1
        }
    }
else
  echo "      Usuario $DB_USER ainda nao esta pronto. Executando configuracao inicial..."
  sudo mysql -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; GRANT ALL PRIVILEGES ON ecommerce_db.* TO '$DB_USER'@'localhost'; FLUSH PRIVILEGES;" \
    || {
      echo "      Falha na configuracao inicial do MySQL."
      echo "      Verifique se o MySQL esta rodando e se sua conta pode executar sudo mysql."
      exit 1
    }
fi

echo "      Banco e usuario prontos! ✅"

# Inicia o backend em segundo plano
echo "[1/2] Iniciando backend (porta 8080)..."
cd "$ROOT/backend"
./mvnw spring-boot:run &
BACK_PID=$!

# Aguarda o backend subir
echo "      Aguardando backend ficar pronto..."
until curl -s http://localhost:8080/api/categories > /dev/null 2>&1; do
  sleep 2
done
echo "      Backend pronto! ✅"

# Inicia o frontend
echo "[2/2] Iniciando frontend (porta 5173)..."
cd "$ROOT/frontend"

if [ ! -d node_modules ]; then
  echo "      Dependencias do frontend nao encontradas. Instalando..."
  npm ci || {
    echo "      Falha ao instalar dependencias do frontend."
    exit 1
  }
  echo "      Dependencias instaladas! ✅"
fi

npm run dev &
FRONT_PID=$!

echo ""
echo "========================================"
echo "  Sistema no ar!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080"
echo "  Pressione Ctrl+C para encerrar tudo"
echo "========================================"

# Aguarda Ctrl+C e encerra os dois processos
trap "echo ''; echo 'Encerrando...'; kill $BACK_PID $FRONT_PID 2>/dev/null; exit 0" INT TERM
wait
