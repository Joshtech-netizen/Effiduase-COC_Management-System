<?php
// 1. CORS Headers (Allow React to talk to PHP)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle Pre-flight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

// 2. Get the JSON Input
$data = json_decode(file_get_contents("php://input"));

// Check if data is empty
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
    exit();
}

try {
    // 3. Connect to Database
    $database = new Database();
    $db = $database->getConnection();

    // 4. Check Email
    $query = "SELECT id, full_name, password, role FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // 5. Verify Password
        if (password_verify($data->password, $user['password'])) {
            // SUCCESS: Return the User Data (and a Token in real apps)
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['full_name'],
                    "role" => $user['role']
                ],
                "token" => bin2hex(random_bytes(16)) // Simple token for now
            ]);
        } else {
            // FAIL: Wrong Password
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        // FAIL: User not found
        http_response_code(404);
        echo json_encode(["message" => "User not found."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>