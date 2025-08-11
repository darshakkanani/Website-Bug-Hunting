#!/bin/bash

# Build the Docker image
echo "Building Mind Map application Docker image..."
docker build -t mindmap-notes .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "To run the container, use:"
    echo "docker run -p 3000:80 mindmap-notes"
    echo ""
    echo "Or use docker-compose:"
    echo "docker-compose up -d"
else
    echo "❌ Docker build failed!"
    exit 1
fi