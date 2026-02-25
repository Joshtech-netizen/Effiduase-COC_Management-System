<?php
// BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

    require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));

        if (!$data || json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid JSON payload."]);
            exit();
        }
        
        if (empty($data->user_id) || empty($data->current_password) || empty($data->new_password)) {
            http_response_code(400);
            echo json_encode(["message" => "All fields are required."]);
            exit();
        }

        // 1. Find the user and check their current password
        $stmt = $db->prepare("SELECT password FROM users WHERE id = :id");
        $stmt->execute([':id' => $data->user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data->current_password, $user['password'])) {
            // 2. Hash the new password and update the database
            $new_hash = password_hash($data->new_password, PASSWORD_DEFAULT);
            $update = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
            $update->execute([
                ':password' => $new_hash,
                ':id' => $data->user_id
            ]);
            echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Incorrect current password."]);    
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>