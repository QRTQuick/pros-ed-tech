const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt'); // For password hashing
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve HTML, CSS, JS files

// Initialize SQLite DB
const db = new sqlite3.Database('./mrprosperity.db', (err) => {
    if (err) console.error('DB Error:', err);
    else console.log('Connected to SQLite DB');
});

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure your file is named index.html
});

// API: Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        return res.status(400).json({ message: 'Email already registered' });
                    } else {
                        console.error(err);
                        return res.status(500).json({ message: 'Database error' });
                    }
                }
                res.status(201).json({ message: 'Registration successful' });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// API: Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!row) return res.status(400).json({ message: 'Invalid email or password' });

        const match = await bcrypt.compare(password, row.password);
        if (!match) return res.status(400).json({ message: 'Invalid email or password' });

        res.json({ message: `Welcome back, ${row.name}!` });
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));