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
            
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?> 