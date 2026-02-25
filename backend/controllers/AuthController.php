<?php

require_once 'BaseController.php';

class AuthController extends BaseController {

    public function login($data) {
        if (empty($data->email) || empty($data->password)) {
            return $this->sendResponse("error", [], "Email and password are required", 400);
        }

        // 1. Find user by email
        $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':email' => $this->sanitize($data->email)]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // 2. Verify password
        if ($user && password_verify($data->password, $user['password'])) {
            // 3. Generate a simple token (In a real enterprise app, use JWT)
            $token = base64_encode(bin2hex(random_bytes(32)));

            return $this->sendResponse("success", [
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['full_name'],
                    "role" => $user['role']
                ]
            ], "Login successful");
        }

        // 4. Fail if user not found or password wrong
        return $this->sendResponse("error", [], "Invalid email or password", 401);
    }
}