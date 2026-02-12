<?php
session_start();
require_once '../config/Database.php';

// 1. Check if data was sent
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    try {
        // 2. Connect to Database
        $database = new Database();
        $db = $database->getConnection();

        // 3. Find the user
        $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // 4. Verify Password
        if ($user && password_verify($password, $user['password'])) {
            // SUCCESS: Login!
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['full_name'];
            $_SESSION['role'] = $user['role'];
            
            // Redirect to Dashboard (We will build this next)
            header("Location: dashboard.php");
            exit();
        } else {
            // FAIL: Wrong password
            header("Location: login.php?error=Invalid email or password");
            exit();
        }

    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    header("Location: login.php");
    exit();
}
?>