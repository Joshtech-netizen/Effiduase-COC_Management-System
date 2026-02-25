<?php
// backend/controllers/UserController.php
require_once 'BaseController.php';

class UserController extends BaseController {

    // GET: List all system accounts (Security: Password NOT included)
    public function index() {
        $stmt = $this->db->query("SELECT id, full_name, email, role, created_at FROM users ORDER BY role ASC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $this->sendResponse("success", $users);
    }

    // POST: Create a new minister account
    public function store($data) {
        if (empty($data->email) || empty($data->password) || empty($data->role)) {
            return $this->sendResponse("error", [], "Missing required account fields", 400);
        }

        // Check for duplicates
        $check = $this->db->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute([':email' => $data->email]);
        if ($check->rowCount() > 0) {
            return $this->sendResponse("error", [], "Email already in use", 400);
        }

        $query = "INSERT INTO users (full_name, email, password, role) VALUES (:name, :email, :pass, :role)";
        $stmt = $this->db->prepare($query);
        
        $success = $stmt->execute([
            ':name'  => $this->sanitize($data->full_name),
            ':email' => $this->sanitize($data->email),
            ':pass'  => password_hash($data->password, PASSWORD_DEFAULT),
            ':role'  => $this->sanitize($data->role)
        ]);

        return $this->sendResponse("success", [], "Account created");
    }

    // POST: Specific method for password changes (Self-service)
    public function updatePassword($data) {
        if (empty($data->user_id) || empty($data->current_password) || empty($data->new_password)) {
            return $this->sendResponse("error", [], "All password fields required", 400);
        }

        $stmt = $this->db->prepare("SELECT password FROM users WHERE id = :id");
        $stmt->execute([':id' => $data->user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($data->current_password, $user['password'])) {
            $new_hash = password_hash($data->new_password, PASSWORD_DEFAULT);
            $update = $this->db->prepare("UPDATE users SET password = :pass WHERE id = :id");
            $update->execute([':pass' => $new_hash, ':id' => $data->user_id]);
            return $this->sendResponse("success", [], "Password updated");
        }
        
        return $this->sendResponse("error", [], "Current password incorrect", 401);
    }
}