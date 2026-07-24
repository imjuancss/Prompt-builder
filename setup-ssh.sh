#!/bin/bash

# Script para configurar SSH en GitHub

echo "🔐 Iniciando configuración de SSH..."
echo ""

# Configurar email (puedes cambiar esto)
EMAIL="imjuancss@gmail.com"

# Generar clave SSH
echo "📝 Generando clave SSH..."
ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/id_ed25519 -N ""

echo ""
echo "✅ Clave SSH generada en ~/.ssh/id_ed25519"
echo ""

# Iniciar ssh-agent
echo "🚀 Iniciando ssh-agent..."
eval "$(ssh-agent -s)"

# Agregar clave al agente
echo "🔑 Agregando clave al ssh-agent..."
ssh-add ~/.ssh/id_ed25519

echo ""
echo "📋 Tu clave pública:"
echo "================================================"
cat ~/.ssh/id_ed25519.pub
echo "================================================"
echo ""
echo "⚠️  IMPORTANTE: Copia la clave pública de arriba y agrégala a GitHub:"
echo "1. Ve a https://github.com/settings/keys"
echo "2. Haz clic en 'New SSH key'"
echo "3. Pega la clave pública"
echo "4. Guarda los cambios"
echo ""

# Cambiar URL remota
echo "🔄 Cambiando URL remota a SSH..."
cd "$(dirname "$0")"
git remote set-url origin git@github.com:imjuancss/Prompt-builder.git

echo ""
echo "✅ Configuración completa!"
echo ""
echo "🧪 Probando conexión..."
ssh -T git@github.com

echo ""
echo "✨ ¡Listo! Ya puedes hacer push/pull sin contraseña"
