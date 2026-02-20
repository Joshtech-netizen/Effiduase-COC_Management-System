<?php
class Database {
    public $conn;

public function getConnection() {
        $this->conn = null;

        try {
            $dbPath = __DIR__ . '/../database.sqlite';
            
            if (!file_exists($dbPath)) {
                touch($dbPath);
            }

            $this->conn = new PDO("sqlite:" . $dbPath);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // 🔥 THE BULLDOZER: Force create the table every time it connects
            $this->conn->exec("CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone TEXT,
                gender TEXT,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");

            $this->conn->exec("CREATE TABLE IF NOT EXISTS finances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL, -- e.g., Tithe, Offering, Donation
                amount REAL NOT NULL,
                description TEXT,
                transaction_date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            
            //  Welfare Table
            $this->conn->exec("CREATE TABLE IF NOT EXISTS welfare (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                member_id INTEGER,
                transaction_type TEXT NOT NULL, -- 'Due' (Income) or 'Payout' (Expense)
                amount REAL NOT NULL,
                description TEXT,
                transaction_date DATE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (member_id) REFERENCES members(id)
            )");

            // Children Table (Prepping for next step)
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
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?> 