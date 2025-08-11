# MindMap Backend Server

This is the backend server for the MindMap application, providing a REST API for storing and managing mindmaps in a SQLite database.

## Features

- SQLite database for persistent storage
- RESTful API endpoints for CRUD operations on mindmaps
- Automatic database initialization
- CORS enabled for frontend communication

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

## API Endpoints

### Mindmaps

- `GET /api/mindmaps` - Get all mindmaps with node and edge counts
- `GET /api/mindmaps/:id` - Get a specific mindmap with all nodes and edges
- `POST /api/mindmaps` - Create a new mindmap
- `PUT /api/mindmaps/:id` - Update an existing mindmap
- `DELETE /api/mindmaps/:id` - Delete a mindmap

### Health Check

- `GET /api/health` - Check server status

## Database Schema

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

## Environment Variables

- `PORT` - Server port (default: 3001)

## Development

The server uses nodemon for development, which will automatically restart when files change.
