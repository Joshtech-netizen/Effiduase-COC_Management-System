<?php
class Database {
    private $conn;
public function getConnection() {
        $this->conn = null;

        try {
            $dbPath = __DIR__ . '/../database.sqlite';
            
            // Create the file if it got deleted
            if (!file_exists($dbPath)) {
                touch($dbPath);
            }

            $this->conn = new PDO("sqlite:" . $dbPath);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // 1. Members Table (Now with 'photo' column included!)
            $this->conn->exec("CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone TEXT,
                gender TEXT,
                status TEXT DEFAULT 'active',
                photo TEXT, 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");

            // 2. Finances Table
            $this->conn->exec("CREATE TABLE IF NOT EXISTS finances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                amount REAL NOT NULL,
                description TEXT,
                transaction_date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");

            // 3. Welfare Table
            $this->conn->exec("CREATE TABLE IF NOT EXISTS welfare (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                member_id INTEGER,
                transaction_type TEXT NOT NULL,
                amount REAL NOT NULL,
                description TEXT,
                transaction_date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (member_id) REFERENCES members(id)
            )");

            // 4. Children Table
            $this->conn->exec("CREATE TABLE IF NOT EXISTS children (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                parent_id INTEGER,
                date_of_birth DATE,
                gender TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES members(id)
            )");

            // Safety check: If the table survived but doesn't have the photo column, add it quietly
            try {
                $this->conn->exec("ALTER TABLE members ADD COLUMN photo TEXT");
            } catch(PDOException $e) {
                // Column already exists, do nothing
            }
            
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>