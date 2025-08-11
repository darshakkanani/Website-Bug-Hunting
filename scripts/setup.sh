#!/bin/bash

echo "🚀 Setting up MindMap Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

if [ $? -eq 0 ]; then
    echo "✅ Database initialized"
else
    echo "❌ Failed to initialize database"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend server: cd server && npm run dev"
echo "2. Start the frontend: npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:3001"
