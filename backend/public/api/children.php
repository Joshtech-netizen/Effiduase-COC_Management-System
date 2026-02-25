<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once '../../config/Database.php';
require_once '../../controllers/ChildrenController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $controller = new ChildrenController($db);

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents("php://input"));

    switch($method) {
        case 'GET':
            $controller->index();
            break;
        case 'POST':
            $controller->store($data);
            break;
         case 'DELETE':
            $controller->destroy($data);
            break;
        default:
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}