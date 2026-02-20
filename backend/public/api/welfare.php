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
    
    // --- GET: Fetch all welfare records WITH the member's name ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $query = "SELECT w.*, m.first_name, m.last_name 
                  FROM welfare w 
                  LEFT JOIN members m ON w.member_id = m.id 
                  ORDER BY w.transaction_date DESC, w.created_at DESC";
        $stmt = $db->query($query);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $records]);
        exit();
    }
    
    // --- POST: Add a new welfare record (Due or Payout) ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->member_id) || empty($data->transaction_type) || empty($data->amount) || empty($data->transaction_date)) {
            http_response_code(400);
            echo json_encode(["message" => "Member, Type, Amount, and Date are required."]);
            exit();
        }
        
        $query = "INSERT INTO welfare (member_id, transaction_type, amount, description, transaction_date) 
                  VALUES (:member_id, :transaction_type, :amount, :description, :transaction_date)";
        $stmt = $db->prepare($query);
        
        $stmt->execute([
            ':member_id' => (int) $data->member_id,
            ':transaction_type' => htmlspecialchars(strip_tags($data->transaction_type)), // 'Due' or 'Payout'
            ':amount' => (float) $data->amount,
            ':description' => isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null,
            ':transaction_date' => htmlspecialchars(strip_tags($data->transaction_date))
        ]);
        
        http_response_code(201);
        echo json_encode(["message" => "Welfare record added successfully."]);
        exit();
    }

    // --- DELETE: Remove a mistake ---
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(["message" => "Record ID is required."]);
            exit();
        }
        
        $query = "DELETE FROM welfare WHERE id = :id";
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