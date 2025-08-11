import sqlite3 from 'sqlite3';
import { open } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const initDatabase = async () => {
  // Ensure data directory exists
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const db = await open({
    filename: path.join(dataDir, 'mindmap.db'),
    driver: sqlite3.Database
  });

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create mindmaps table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS mindmaps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create nodes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS nodes (
      id TEXT PRIMARY KEY,
      mindmap_id TEXT NOT NULL,
      type TEXT,
      label TEXT NOT NULL,
      description TEXT,
      position_x REAL NOT NULL,
      position_y REAL NOT NULL,
      background TEXT,
      color TEXT,
      border TEXT,
      border_radius TEXT,
      FOREIGN KEY (mindmap_id) REFERENCES mindmaps (id) ON DELETE CASCADE
    )
  `);

  // Create edges table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS edges (
      id TEXT PRIMARY KEY,
      mindmap_id TEXT NOT NULL,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      type TEXT,
      stroke TEXT,
      stroke_width INTEGER,
      FOREIGN KEY (mindmap_id) REFERENCES mindmaps (id) ON DELETE CASCADE,
      FOREIGN KEY (source) REFERENCES nodes (id) ON DELETE CASCADE,
      FOREIGN KEY (target) REFERENCES nodes (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    CREATE INDEX IF NOT EXISTS idx_mindmaps_user_id ON mindmaps (user_id);
    CREATE INDEX IF NOT EXISTS idx_nodes_mindmap_id ON nodes (mindmap_id);
    CREATE INDEX IF NOT EXISTS idx_edges_mindmap_id ON edges (mindmap_id);
    CREATE INDEX IF NOT EXISTS idx_edges_source ON edges (source);
    CREATE INDEX IF NOT EXISTS idx_edges_target ON edges (target);
  `);

  console.log('Database initialized successfully!');
  await db.close();
};

initDatabase().catch(console.error);
