<?php
// BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Ensure the users table exists (Safety check)
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // --- GET: Fetch all users (Never send passwords back!) ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->query("SELECT id, full_name, email, role, created_at FROM users ORDER BY role ASC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $users]);
        exit();
    }
    
    // --- POST: Create a new user ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->full_name) || empty($data->email) || empty($data->password) || empty($data->role)) {
            http_response_code(400);
            echo json_encode(["message" => "All fields are required."]);
            exit();
        }

        // Check if email already exists
        $check = $db->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute([':email' => $data->email]);
        if ($check->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Email already exists."]);
            exit();
        }
        
        $query = "INSERT INTO users (full_name, email, password, role) VALUES (:name, :email, :password, :role)";
        $stmt = $db->prepare($query);
        $stmt->execute([
            ':name' => htmlspecialchars(strip_tags($data->full_name)),
            ':email' => htmlspecialchars(strip_tags($data->email)),
            ':password' => password_hash($data->password, PASSWORD_DEFAULT), // Encrypt password
            ':role' => htmlspecialchars(strip_tags($data->role))
        ]);
        
        echo json_encode(["status" => "success", "message" => "User created successfully."]);
        exit();
    }

    // --- DELETE: Remove a user ---
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(["message" => "User ID is required."]);
            exit();
        }
        
        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $data->id]);
        
        echo json_encode(["status" => "success", "message" => "User deleted."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>