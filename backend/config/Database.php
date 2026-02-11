<?php
class Database {
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // SQLite Connection: It just looks for a file!
            $this->conn = new PDO("sqlite:/var/www/database.sqlite");
            
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>