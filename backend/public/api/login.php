<?php
// 1. BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// 2. PRE-FLIGHT INTERCEPTOR
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Clean the input (removes accidental spaces)
    $email = strtolower(trim($data->email));

    // 3. Find the user
    $query = "SELECT id, full_name, password, role FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    // 4. THE SQLITE FIX: Fetch first, ask questions later!
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // 5. Verify Password
        if (password_verify($data->password, $user['password'])) {
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['full_name'],
                    "role" => $user['role']
                ],
                "token" => bin2hex(random_bytes(16))
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>