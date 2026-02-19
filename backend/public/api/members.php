<?php
// 1. BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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
    
    // --- GET: Fetch all members ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $query = "SELECT * FROM members ORDER BY created_at DESC";
        $stmt = $db->query($query);
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $members]);
        exit();
    }
    
    // --- POST: Add a new member ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->first_name) || empty($data->last_name)) {
            http_response_code(400);
            echo json_encode(["message" => "First name and Last name are required."]);
            exit();
        }
        
        $query = "INSERT INTO members (first_name, last_name, phone, gender, status) 
                  VALUES (:first_name, :last_name, :phone, :gender, :status)";
        $stmt = $db->prepare($query);
        
        $stmt->execute([
            ':first_name' => htmlspecialchars(strip_tags($data->first_name)),
            ':last_name' => htmlspecialchars(strip_tags($data->last_name)),
            ':phone' => $data->phone ?? null,
            ':gender' => $data->gender ?? 'Male',
            ':status' => $data->status ?? 'active'
        ]);
        
        echo json_encode(["message" => "Member added successfully."]);
        exit();
    }

    // --- PUT: Update an existing member ---
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id) || empty($data->first_name) || empty($data->last_name)) {
            http_response_code(400);
            echo json_encode(["message" => "ID, First name, and Last name are required."]);
            exit();
        }
        
        $query = "UPDATE members SET first_name = :first_name, last_name = :last_name, 
                  phone = :phone, gender = :gender, status = :status WHERE id = :id";
        $stmt = $db->prepare($query);
        
        $stmt->execute([
            ':id' => $data->id,
            ':first_name' => htmlspecialchars(strip_tags($data->first_name)),
            ':last_name' => htmlspecialchars(strip_tags($data->last_name)),
            ':phone' => $data->phone ?? null,
            ':gender' => $data->gender ?? 'Male',
            ':status' => $data->status ?? 'active'
        ]);
        
        echo json_encode(["message" => "Member updated successfully."]);
        exit();
    }

    // --- DELETE: Remove a member ---
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(["message" => "Member ID is required."]);
            exit();
        }
        
        $query = "DELETE FROM members WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->execute([':id' => $data->id]);
        
        echo json_encode(["message" => "Member deleted successfully."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>