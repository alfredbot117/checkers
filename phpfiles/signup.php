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

echo "Connected successfully";

// Get the POST data from login.js
$data = json_decode(file_get_contents('php://input'), true);


$loginUsername = $data['username'];
$loginPassword = sha1($data['password']);
echo json_encode($loginUsername);
$conn->select_db($dbname);

// Check if the username already exists
$checkQuery = "SELECT * FROM users WHERE username = '$loginUsername'";
$checkResult = $conn->query($checkQuery);

if ($checkResult->num_rows > 0) {
    echo "Username already exists";
} else {
    // Insert data into the database
    $insertQuery = "INSERT INTO users (username, password) VALUES ('$loginUsername', '$loginPassword')";
    if ($conn->query($insertQuery) === TRUE) {
        echo "Data inserted successfully";
    } else {
        echo "Error inserting data: " . $conn->error;
    }
}



/*
$conn->select_db($dbname);
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    wins INT(6) DEFAULT 0,
    games INT(6) DEFAULT 0,
    time INT(30) DEFAULT 0,
)";
*/







?>