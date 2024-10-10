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
$opponentPieces = $data['opponentPieces'];
$timer = $data['timer'];
$myPieces = $data['myPieces'];

if ($opponentPieces == 0) {
    $sql = "UPDATE users SET wins = wins + 1 WHERE username = '$loginUsername'";
    if ($conn->query($sql) === TRUE) {
        echo "Wins incremented successfully";
    } else {
        echo "Error updating wins: " . $conn->error;
    }
}

$sql = "UPDATE users SET games = games + 1 WHERE username = '$loginUsername'";
if ($conn->query($sql) === TRUE) {
    echo "games incremented successfully";
} else {
    echo "Error updating wins: " . $conn->error;
}

$sql = "UPDATE users SET time = time + $timer WHERE username = '$loginUsername'";
if ($conn->query($sql) === TRUE) {
    echo "times incremented successfully";
} else {
    echo "Error updating wins: " . $conn->error;
}

$sql = "UPDATE users SET score = score + $myPieces WHERE username = '$loginUsername'";
if ($conn->query($sql) === TRUE) {
    echo "score incremented successfully";
} else {
    echo "Error updating wins: " . $conn->error;
}




/*
$sql = "CREATE TABLE IF NOT EXISTS games (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    score INT(6) DEFAULT 0,
    opponent INT(6) DEFAULT 0,
    result VARCHAR(10) NOT NULL
)";

*/
$gameResult;
if ($opponentPieces == 0) {
    $gameResult = "won";
}
else{
    $gameResult = "lost";
}

$sql = "INSERT INTO games (username, score, time, opponent, result) VALUES ('$loginUsername', $myPieces,$timer, $opponentPieces, '$gameResult')";
if ($conn->query($sql) === TRUE) {
    echo "games updated successfully";
} else {
    echo "games updated successfully" . $conn->error;
}






$jsonFilePath = 'playerStats.json';


if (file_exists($jsonFilePath)) {
    $gameResult;//checks if player won or loss
    if($opponentPieces == 0){
        $gameResult = "won";
    }
    else{
        $gameResult = "lost";
    }
    $jsonFileContents = file_get_contents($jsonFilePath);

    // Decode the JSON data
    $userData = json_decode($jsonFileContents, true);

    if ($userData) {
        $user = $loginUsername; // Replace with the desired username

        // Find the user by username
        $userIndex = findUserByUsername($user, $userData['users']);

        if ($userIndex !== false) {
            // Add new game stats for the user
            $newGameStats = array(
                'time' => $timer,
                'win' => $gameResult,
      
            );

            $userData['users'][$userIndex]['games'][]['stats'] = $newGameStats;


            echo "New game stats added successfully!";
        } else {
            $newUser = array(
                'username' => $user,
                'games' => [
                    [
                        'stats' => array(
                            'time' => $timer,
                            'win' => $gameResult,

                        )
                    ]
                ]
            );

            $userData['users'][] = $newUser;
        }
        $updatedJsonData = json_encode($userData, JSON_PRETTY_PRINT);

        
        file_put_contents($jsonFilePath, $updatedJsonData);
    } else {
        echo "Error decoding JSON data.";
    }
} else {
    echo "JSON file not found.";
}


function findUserByUsername($name, $users) {
    foreach ($users as $index => $user) {
        if ($user['username'] === $name) {
            return $index;
        }
    }
    return false;
}




///////////////////////////////


/*
example of my database
$conn->select_db($dbname);
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    wins INT(6) DEFAULT 0,
    games INT(6) DEFAULT 0,
    time INT(30) DEFAULT 0
)";

*/



$conn->close();


?>