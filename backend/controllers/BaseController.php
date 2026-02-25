<?php

class BaseController {
    protected $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Standardized JSON Response
     * Use this for every single API return
     */
    protected function sendResponse($status, $data = [], $message = "", $code = 200) {
        http_response_code($code);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode([
            "status" => $status,
            "data" => $data,
            "message" => $message
        ]);
        exit();
    }

    /**
     * Clean and Sanitize Inputs
     */
    protected function sanitize($data) {
        return htmlspecialchars(strip_tags($data));
    }
}