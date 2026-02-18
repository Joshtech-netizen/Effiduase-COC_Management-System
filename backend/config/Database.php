<?php
class Database {
    public $conn;

public function getConnection() {
        $this->conn = null;

        try {
            $dbPath = __DIR__ . '/../database.sqlite';
            
            // Check if file exists (Debug helper)
            if (!file_exists($dbPath)) {
                // Attempt to create it if missing (permissions allowing)
                touch($dbPath);
            }

            $this->conn = new PDO("sqlite:" . $dbPath);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?> 