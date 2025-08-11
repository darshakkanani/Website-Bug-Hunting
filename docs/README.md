# MindMap Application

A modern, interactive mind mapping application built with React, TypeScript, and SQLite database for persistent storage.

## 🏗️ Project Structure

```
mindmap-application/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend server
│   ├── server.js            # Express server
│   ├── init-db.js           # Database initialization
│   ├── data/                # Database files (auto-created)
│   └── package.json         # Backend dependencies
├── docs/                     # Documentation
├── scripts/                  # Build and setup scripts
├── package.json              # Root package.json with workspaces
├── Dockerfile               # Docker configuration
└── docker-compose.yml       # Docker Compose configuration
```

## ✨ Features

- 🧠 Interactive mind map creation and editing
- 🎨 Customizable node styles and colors
- 💾 Persistent storage with SQLite database
- 📱 Responsive design with Tailwind CSS
- 🌙 Dark/Light theme support
- 📤 Export functionality (PNG, SVG, JSON)
- 🔄 Real-time auto-save
- 🐳 Docker support for easy deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Option 1: Using Root Scripts (Recommended)

1. **Install all dependencies and setup:**
   ```bash
   npm run setup
   ```

2. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

### Option 2: Manual Setup

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend && npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend && npm install
   ```

4. **Initialize database:**
   ```bash
   cd backend && npm run init-db
   ```

5. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 🐳 Docker Deployment

### Development with Docker
```bash
# Build and start containers
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Production Build
```bash
# Build production image
docker build -t mindmap-app .

# Run production container
docker run -p 3000:3001 mindmap-app
```

## 📚 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build frontend for production
- `npm run setup` - Install all dependencies and initialize database
- `npm run clean` - Remove all node_modules
- `npm run docker:build` - Build Docker image
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run init-db` - Initialize database schema

## 🗄️ Database Schema

The application uses SQLite with three main tables:

### mindmaps
- `id` (TEXT, PRIMARY KEY) - Unique identifier
- `title` (TEXT, NOT NULL) - Mindmap title
- `description` (TEXT) - Optional description
- `created_at` (DATETIME) - Creation timestamp
- `updated_at` (DATETIME) - Last update timestamp

### nodes
- `id` (TEXT, PRIMARY KEY) - Node identifier
- `mindmap_id` (TEXT, FOREIGN KEY) - Reference to mindmap
- `type` (TEXT) - Node type
- `label` (TEXT, NOT NULL) - Node label
- `description` (TEXT) - Node description
- `position_x` (REAL, NOT NULL) - X coordinate
- `position_y` (REAL, NOT NULL) - Y coordinate
- `background` (TEXT) - Background color
- `color` (TEXT) - Text color
- `border` (TEXT) - Border style
- `border_radius` (TEXT) - Border radius

### edges
- `id` (TEXT, PRIMARY KEY) - Edge identifier
- `mindmap_id` (TEXT, FOREIGN KEY) - Reference to mindmap
- `source` (TEXT, FOREIGN KEY) - Source node ID
- `target` (TEXT, FOREIGN KEY) - Target node ID
- `type` (TEXT) - Edge type
- `stroke` (TEXT) - Stroke color
- `stroke_width` (INTEGER) - Stroke width

## 🔌 API Endpoints

### Mindmaps
- `GET /api/mindmaps` - List all mindmaps with node and edge counts
- `GET /api/mindmaps/:id` - Get specific mindmap with all nodes and edges
- `POST /api/mindmaps` - Create new mindmap
- `PUT /api/mindmaps/:id` - Update mindmap
- `DELETE /api/mindmaps/:id` - Delete mindmap

### Health Check
- `GET /api/health` - Check server status

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Flow** for mind map visualization
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **SQLite** database for data persistence
- **CORS** enabled for frontend communication
- **UUID** for unique identifiers

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **Nodemon** for backend development
- **Concurrently** for running multiple processes

## 🔧 Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Frontend
- `VITE_API_URL` - Backend API URL (optional, defaults to localhost:3001)

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components with hooks
- Implement proper error handling

### Database
- Use prepared statements to prevent SQL injection
- Implement proper foreign key constraints
- Use transactions for complex operations

### API Design
- Follow RESTful conventions
- Return consistent JSON responses
- Implement proper HTTP status codes
- Add input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the documentation in the `docs/` folder
3. Create a new issue with detailed information

## 🔄 Changelog

### v1.0.0
- Initial release with React frontend and Node.js backend
- SQLite database integration
- Docker support
- Complete mindmap CRUD operations
- Auto-save functionality
- Export capabilities
