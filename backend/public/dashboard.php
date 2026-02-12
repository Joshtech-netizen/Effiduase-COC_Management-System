<?php
session_start();

// Security Check: Kick them out if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<h1>Welcome, <?php echo $_SESSION['user_name']; ?>!</h1>
<p>You are logged in as: <strong><?php echo $_SESSION['role']; ?></strong></p>
<a href="login.php" style="color: red;">Logout</a>