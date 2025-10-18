const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mrprosperity.db', (err) => {
    if (err) {
        console.error('Database opening error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Initialize tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    // Optional: Insert a default user if table is empty
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (!err && row.count === 0) {
            db.run("INSERT INTO users (name) VALUES (?)", ['Chisom']);
        }
    });
});

module.exports = db;