#!/bin/bash
# Script para iniciar o backend da BISHA Store
# Ajuste DB_USER e DB_PASSWORD conforme seu MySQL

export DB_USER=bisha
export DB_PASSWORD=bisha1234
export JWT_SECRET=bishastorejwtsecretkey2026xxxxxxxxxxx

echo "Iniciando backend com DB_USER=$DB_USER na porta 8080..."
./mvnw spring-boot:run
