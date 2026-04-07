#!/bin/bash
# BISHA Store — Inicia backend e frontend juntos

export DB_USER=bisha
export DB_PASSWORD=bisha1234
export JWT_SECRET=bishastorejwtsecretkey2026xxxxxxxxxxx

# Salva o diretório raiz do projeto antes de qualquer cd
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "========================================"
echo "  BISHA Store — Iniciando sistema..."
echo "========================================"

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
