<?php
// 1. BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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
    
    // --- GET: Fetch all children WITH parent's name ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $query = "SELECT c.*, m.first_name as parent_first, m.last_name as parent_last 
                  FROM children c 
                  LEFT JOIN members m ON c.parent_id = m.id 
                  ORDER BY c.first_name ASC";
        $stmt = $db->query($query);
        $children = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $children]);
        exit();
    }
    
    // --- POST: Add a new child ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->first_name) || empty($data->last_name) || empty($data->parent_id)) {
            http_response_code(400);
            echo json_encode(["message" => "Name and Parent are required."]);
            exit();
        }
        
        $query = "INSERT INTO children (first_name, last_name, parent_id, date_of_birth, gender) 
                  VALUES (:first_name, :last_name, :parent_id, :date_of_birth, :gender)";
        $stmt = $db->prepare($query);
        
        $stmt->execute([
            ':first_name' => htmlspecialchars(strip_tags($data->first_name)),
            ':last_name' => htmlspecialchars(strip_tags($data->last_name)),
            ':parent_id' => (int) $data->parent_id,
            ':date_of_birth' => $data->date_of_birth ?? null,
            ':gender' => $data->gender ?? 'Male'
        ]);
        
        http_response_code(201);
        echo json_encode(["message" => "Child added successfully."]);
        exit();
    }

    // --- DELETE: Remove a record ---
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(["message" => "Record ID is required."]);
            exit();
        }
        
        $query = "DELETE FROM children WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->execute([':id' => $data->id]);
        
        echo json_encode(["message" => "Child removed successfully."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>