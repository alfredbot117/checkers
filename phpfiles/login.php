<?php
$servername = "localhost";
$username = "alfredo117";
$password = "hAxOeFMly3Uby4H)";
$dbname = "playerDB";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

$loginUsername = $data['username'];
$loginPassword = sha1($data['password']);

// Check if loginUsername and loginPassword match the values in the users table
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $loginUsername, $loginPassword);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {

    echo "Login successful";
} else {

    echo "Invalid username or password";
}

$stmt->close();




/*
$conn->select_db($dbname);
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    wins INT(6) DEFAULT 0,
    games INT(6) DEFAULT 0
)";

*/



$conn->close();


?>