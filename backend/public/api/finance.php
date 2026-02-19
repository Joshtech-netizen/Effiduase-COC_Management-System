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
    
    // --- GET: Fetch all financial records ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Order by the date the transaction happened, newest first
        $query = "SELECT * FROM finances ORDER BY transaction_date DESC, created_at DESC";
        $stmt = $db->query($query);
        $finances = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $finances]);
        exit();
    }
    
    // --- POST: Add a new financial record ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->type) || empty($data->amount) || empty($data->transaction_date)) {
            http_response_code(400);
            echo json_encode(["message" => "Type, amount, and date are required."]);
            exit();
        }
        
        $query = "INSERT INTO finances (type, amount, description, transaction_date) 
                  VALUES (:type, :amount, :description, :transaction_date)";
        $stmt = $db->prepare($query);
        
        $stmt->execute([
            ':type' => htmlspecialchars(strip_tags($data->type)),
            ':amount' => (float) $data->amount, // Ensure it's treated as a number
            ':description' => isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null,
            ':transaction_date' => htmlspecialchars(strip_tags($data->transaction_date))
        ]);
        
        http_response_code(201);
        echo json_encode(["message" => "Record added successfully."]);
        exit();
    }

    // --- DELETE: Remove a record (in case of mistakes) ---
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(["message" => "Record ID is required."]);
            exit();
        }
        
        $query = "DELETE FROM finances WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->execute([':id' => $data->id]);
        
        echo json_encode(["message" => "Record deleted successfully."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>