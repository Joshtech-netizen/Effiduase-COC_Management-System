<?php
class Database {
    // When using Docker, 'host' must match the service name in docker-compose
    private $host = "db"; 
    private $db_name = "church_system";
    private $username = "church_admin";
    private $password = "church_password_123";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            // This will help you debug if the DB isn't ready yet
            error_log("Connection error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}