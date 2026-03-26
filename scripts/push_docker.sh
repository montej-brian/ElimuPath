#!/bin/bash

# Configuration
USERNAME="montejbrian"
PROJECT="elimupath"

echo "🚀 Starting Docker Build and Push process..."

# Build Backend
echo "📦 Building Backend..."
docker build -t $USERNAME/$PROJECT-backend:latest ./backend

# Build Frontend
echo "📦 Building Frontend (Production)..."
docker build -t $USERNAME/$PROJECT-frontend:latest ./frontend

# Push to Docker Hub
echo "📤 Pushing Backend to Docker Hub..."
docker push $USERNAME/$PROJECT-backend:latest

echo "📤 Pushing Frontend to Docker Hub..."
docker push $USERNAME/$PROJECT-frontend:latest

echo "✅ Build and Push complete!"
