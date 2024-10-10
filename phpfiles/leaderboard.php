<?php
$servername = "localhost";
$username = "alfredo117";
$password = "hAxOeFMly3Uby4H)";
$dbname = "playerDB";

$conn = new mysqli($servername, $username, $password, $dbname);



if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$order = $data['order'];




switch ($order) {
    case 1:
        $sql = "SELECT username, wins, games, score, time FROM users ORDER BY wins DESC";
        sendit($conn->query($sql));
        // Code for case 1
        break;
    case 2:
        $sql = "SELECT username, wins, games, score, time FROM users ORDER BY wins ASC";
        sendit($conn->query($sql));
        // Code for case 2
        break;
    case 3:
        $sql = "SELECT username, wins, games, score, time FROM users ORDER BY games DESC";
        sendit($conn->query($sql));
        // Code for case 3
        break;
    case 4:
        $sql = "SELECT username, wins, games, score, time FROM users ORDER BY games ASC";
        sendit($conn->query($sql));
        // Code for case 4
        break;
    case 5:
        $sql = "SELECT username, wins, games, score, time FROM users ORDER BY time DESC";
        sendit($conn->query($sql));
        break;
    case 6:
        $sql = "SELECT username, wins, games, score, time FROM users ORDER BY time ASC";
        sendit($conn->query($sql));
        // Code for case 6
        break;
    default:
        // Code for default case
        $sql = "SELECT username, wins, games, time FROM users";
        break;
}






function sendit($result){
    if ($result->num_rows > 0) {
        $users = []; // Array to store users
    
        while ($row = $result->fetch_assoc()) {
            $username = $row["username"];
            $wins = $row["wins"];
            $games = $row["games"];
            $time = $row["time"];
            $score = $row["score"];
            
            // Create an object for each user
            $userObject = (object) [
                'username' => $username,
                'wins' => $wins,
                'games' => $games,
                'time' => $time,
                'score' => $score
            ];
    
            // Add user object to the array
            $users[] = $userObject;
        }
    
        // Convert the array to JSON and send it back to the request
        echo json_encode($users);
    } else {
        echo "No users found.";
    }

}



$conn->close();
        
        


?>