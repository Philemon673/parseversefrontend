import { Pool } from 'pg';
import crypto from 'crypto';

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
export const db = new Pool(dbConfig);

// Encryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

export const encryption = {
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  },

  decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};

// Database queries with prepared statements
export const userQueries = {
  // Get user by ID
  async getUserById(userId: number) {
    const query = `
      SELECT 
        id, name, email, country, phone, city, 
        member_since, role, avatar, stats, 
        created_at, updated_at, is_active, last_login
      FROM users 
      WHERE id = $1 AND is_active = true
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error in getUserById:', error);
      throw new Error('Database query failed');
    }
  },

  // Update user profile
  async updateUser(userId: number, updateData: any) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic query based on provided fields
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at timestamp
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());
    paramCount++;

    // Add user ID for WHERE clause
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND is_active = true
      RETURNING 
        id, name, email, country, phone, city, 
        member_since, role, avatar, stats, 
        created_at, updated_at, is_active, last_login
    `;

    try {
      const result = await db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error in updateUser:', error);
      throw new Error('Database update failed');
    }
  },

  // Check if email exists
  async emailExists(email: string, excludeUserId?: number) {
    let query = 'SELECT id FROM users WHERE email = $1 AND is_active = true';
    const values = [email.toLowerCase()];

    if (excludeUserId) {
      query += ' AND id != $2';
      values.push(excludeUserId);
    }

    try {
      const result = await db.query(query, values);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database error in emailExists:', error);
      throw new Error('Database query failed');
    }
  },

  // Log user activity
  async logActivity(userId: number, action: string, details?: any) {
    const query = `
      INSERT INTO user_activity_logs (user_id, action, details, created_at)
      VALUES ($1, $2, $3, $4)
    `;

    try {
      await db.query(query, [
        userId,
        action,
        JSON.stringify(details || {}),
        new Date().toISOString()
      ]);
    } catch (error) {
      console.error('Database error in logActivity:', error);
      // Don't throw error for logging failures
    }
  }
};

// Database initialization and migration functions
export const dbInit = {
  // Create tables if they don't exist
  async createTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        country VARCHAR(100),
        phone VARCHAR(20),
        city VARCHAR(100),
        member_since VARCHAR(50),
        role VARCHAR(20) DEFAULT 'STUDENT',
        avatar TEXT,
        stats JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP
      );
    `;

    const createActivityLogsTable = `
      CREATE TABLE IF NOT EXISTS user_activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        details JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON user_activity_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON user_activity_logs(created_at);
    `;

    try {
      await db.query(createUsersTable);
      await db.query(createActivityLogsTable);
      await db.query(createIndexes);
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error creating database tables:', error);
      throw error;
    }
  },

  // Insert sample data
  async insertSampleData() {
    const checkUsers = 'SELECT COUNT(*) FROM users';
    const result = await db.query(checkUsers);
    
    if (parseInt(result.rows[0].count) === 0) {
      const insertUsers = `
        INSERT INTO users (name, email, country, phone, city, member_since, role, avatar, stats)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9),
        ($10, $11, $12, $13, $14, $15, $16, $17, $18)
      `;

      const values = [
        'Lora Azuwesi', 'lora.azuwesi@gmail.com', 'Bangladesh', '+880 1712 345 678', 
        'Dhaka, Bangladesh', 'Member since Oct 2023', 'STUDENT', '/assets/student.jpg',
        JSON.stringify({ enrolledCourses: 203, certificates: 15, points: 480, hoursStudied: 120, completedCourses: 4 }),
        'Rajib Kumar', 'rajib.kumar@gmail.com', 'India', '+91 9876543210',
        'Mumbai, India', 'Member since Sep 2023', 'MENTOR', '/assets/mentor.jpg',
        JSON.stringify({ enrolledCourses: 0, certificates: 25, points: 1200, hoursStudied: 300, completedCourses: 12 })
      ];

      await db.query(insertUsers, values);
      console.log('Sample data inserted successfully');
    }
  }
};

// Connection health check
export async function checkDatabaseConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    return { healthy: true, timestamp: result.rows[0].now };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { healthy: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Graceful shutdown
export async function closeDatabaseConnection() {
  try {
    await db.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}