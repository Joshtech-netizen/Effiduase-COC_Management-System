<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        // These come from the .env file we just passed to Docker
        $this->host     = getenv('DB_HOST');
        $this->port     = getenv('DB_PORT');
        $this->db_name  = getenv('DB_DATABASE');
        $this->username = getenv('DB_USERNAME');
        $this->password = getenv('DB_PASSWORD');
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;

            $this->conn = new PDO($dsn, $this->username, $this->password);

            // Phase 2: Enable Strict Error Mode
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $exception) {
            // Phase 3: Log errors to Docker logs, don't show user
            error_log("Connection error: " . $exception->getMessage());
            echo "Database Connection Error. Check Docker logs.";
        }

        return $this->conn;
    }
}
?>