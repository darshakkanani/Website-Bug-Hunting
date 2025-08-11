import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
let db;

const initDb = async () => {
  // Ensure data directory exists
  const dataDir = path.join(__dirname, 'data');
  const fs = await import('fs');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  db = await open({
    filename: path.join(dataDir, 'mindmap.db'),
    driver: sqlite3.Database
  });
  console.log('Connected to SQLite database');
};

// Initialize database on startup
initDb().then(() => {
  // Make db available to routes
  app.locals.db = db;
});

// API Routes
app.use('/api/auth', authRoutes);

// Get all mindmaps for authenticated user
app.get('/api/mindmaps', authenticateToken, async (req, res) => {
  try {
    const mindmaps = await db.all(`
      SELECT 
        m.id,
        m.title,
        m.description,
        m.created_at as createdAt,
        m.updated_at as updatedAt,
        COUNT(DISTINCT n.id) as nodeCount,
        COUNT(DISTINCT e.id) as edgeCount
      FROM mindmaps m
      LEFT JOIN nodes n ON m.id = n.mindmap_id
      LEFT JOIN edges e ON m.id = e.mindmap_id
      WHERE m.user_id = ?
      GROUP BY m.id
      ORDER BY m.updated_at DESC
    `, [req.user.userId]);
    res.json(mindmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single mindmap with all nodes and edges
app.get('/api/mindmaps/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get mindmap (only if owned by user)
    const mindmap = await db.get('SELECT * FROM mindmaps WHERE id = ? AND user_id = ?', [id, req.user.userId]);
    if (!mindmap) {
      return res.status(404).json({ error: 'Mindmap not found' });
    }

    // Get nodes
    const nodes = await db.all(`
      SELECT 
        id,
        type,
        label,
        description,
        position_x as 'position.x',
        position_y as 'position.y',
        background,
        color,
        border,
        border_radius as borderRadius
      FROM nodes 
      WHERE mindmap_id = ?
    `, [id]);

    // Get edges
    const edges = await db.all(`
      SELECT 
        id,
        source,
        target,
        type,
        stroke,
        stroke_width as strokeWidth
      FROM edges 
      WHERE mindmap_id = ?
    `, [id]);

    // Transform nodes to match frontend format
    const transformedNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      data: {
        label: node.label,
        description: node.description
      },
      position: {
        x: node['position.x'],
        y: node['position.y']
      },
      style: {
        background: node.background,
        color: node.color,
        border: node.border,
        borderRadius: node.borderRadius
      }
    }));

    // Transform edges to match frontend format
    const transformedEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      style: {
        stroke: edge.stroke,
        strokeWidth: edge.strokeWidth
      }
    }));

    const result = {
      id: mindmap.id,
      title: mindmap.title,
      description: mindmap.description,
      nodes: transformedNodes,
      edges: transformedEdges,
      createdAt: mindmap.created_at,
      updatedAt: mindmap.updated_at
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new mindmap
app.post('/api/mindmaps', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = uuidv4();
    
    await db.run(`
      INSERT INTO mindmaps (id, user_id, title, description)
      VALUES (?, ?, ?, ?)
    `, [id, req.user.userId, title, description]);

    const mindmap = await db.get('SELECT * FROM mindmaps WHERE id = ?', [id]);
    res.status(201).json({
      id: mindmap.id,
      title: mindmap.title,
      description: mindmap.description,
      nodes: [],
      edges: [],
      createdAt: mindmap.created_at,
      updatedAt: mindmap.updated_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a mindmap
app.put('/api/mindmaps/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, nodes, edges } = req.body;

    // Verify mindmap ownership
    const mindmap = await db.get('SELECT id FROM mindmaps WHERE id = ? AND user_id = ?', [id, req.user.userId]);
    if (!mindmap) {
      return res.status(404).json({ error: 'Mindmap not found' });
    }

    // Update mindmap
    await db.run(`
      UPDATE mindmaps 
      SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, id]);

    // Delete existing nodes and edges
    await db.run('DELETE FROM edges WHERE mindmap_id = ?', [id]);
    await db.run('DELETE FROM nodes WHERE mindmap_id = ?', [id]);

    // Insert new nodes
    for (const node of nodes) {
      await db.run(`
        INSERT INTO nodes (
          id, mindmap_id, type, label, description, 
          position_x, position_y, background, color, border, border_radius
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        node.id, id, node.type, node.data.label, node.data.description,
        node.position.x, node.position.y, node.style?.background, 
        node.style?.color, node.style?.border, node.style?.borderRadius
      ]);
    }

    // Insert new edges
    for (const edge of edges) {
      await db.run(`
        INSERT INTO edges (
          id, mindmap_id, source, target, type, stroke, stroke_width
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        edge.id, id, edge.source, edge.target, edge.type,
        edge.style?.stroke, edge.style?.strokeWidth
      ]);
    }

    res.json({ message: 'Mindmap updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a mindmap
app.delete('/api/mindmaps/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify mindmap ownership
    const mindmap = await db.get('SELECT id FROM mindmaps WHERE id = ? AND user_id = ?', [id, req.user.userId]);
    if (!mindmap) {
      return res.status(404).json({ error: 'Mindmap not found' });
    }
    
    // Delete mindmap (cascade will handle nodes and edges)
    await db.run('DELETE FROM mindmaps WHERE id = ?', [id]);
    
    res.json({ message: 'Mindmap deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
});
