<?php
// 1. BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// 2. PRE-FLIGHT INTERCEPTOR
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // --- GET METHOD: Fetch all members ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $query = "SELECT * FROM members ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $members]);
        exit();
    }
    
    // --- POST METHOD: Add a new member ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        // Basic validation
        if (empty($data->first_name) || empty($data->last_name)) {
            http_response_code(400);
            echo json_encode(["message" => "First name and Last name are required."]);
            exit();
        }
        
        $query = "INSERT INTO members (first_name, last_name, phone, gender, status) 
                  VALUES (:first_name, :last_name, :phone, :gender, :status)";
                  
        $stmt = $db->prepare($query);
        
        // Clean and bind data
        $first_name = htmlspecialchars(strip_tags($data->first_name));
        $last_name = htmlspecialchars(strip_tags($data->last_name));
        $phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : null;
        $gender = isset($data->gender) ? htmlspecialchars(strip_tags($data->gender)) : null;
        $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : 'active';
        
        $stmt->bindParam(":first_name", $first_name);
        $stmt->bindParam(":last_name", $last_name);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":gender", $gender);
        $stmt->bindParam(":status", $status);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Member added successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to add member."]);
        }
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>