<?php
// backend/public/api/login.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once '../../config/Database.php';
require_once '../../controllers/AuthController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $controller = new AuthController($db);

    // Only allow POST requests for login
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $controller->login($data);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}