
<?php
$servername = "localhost";
$username = "alfredo117";
$password = "hAxOeFMly3Uby4H)";
$dbname = "playerDB";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully";
} else {
    echo "Error creating database: " . $conn->error;
}

// Create table
$conn->select_db($dbname);
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    wins INT(6) DEFAULT 0,
    games INT(6) DEFAULT 0,
    time INT(30) DEFAULT 0,
    score INT(6) DEFAULT 0
)";
if ($conn->query($sql) === TRUE) {
    echo "Table 'users' created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

// Create table 'games'
$sql = "CREATE TABLE IF NOT EXISTS games (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    score INT(6) DEFAULT 0,
    opponent INT(6) DEFAULT 0,
    time INT(30) DEFAULT 0,
    result VARCHAR(10) NOT NULL
)";
if ($conn->query($sql) === TRUE) {
    echo "Table 'games' created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}



$conn->close();
?>

