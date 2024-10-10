
<?php

$data = json_decode(file_get_contents('php://input'), true);
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

$loginUsername = $data['username'];

// Initialize an empty array to store the game stats
$gameStats = [];

// Query to select rows from the games table with matching username
$sql = "SELECT * FROM games WHERE username = '$loginUsername'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $score = $row['score'];
        $opponent = $row['opponent'];
        $res = $row['result'];
        $timer = $row['time'];

        $gameStats[] = [
            'score' => $score,
            'opponent' => $opponent,
            'result' => $res,
            'time' => $timer
        ];
    }
}

$conn->close();

echo json_encode($gameStats);




/*
// Check if the 'users' key exists in the decoded data
if (isset($data['users'])) {
    $users = $data['users'];

    // Loop through each user
    foreach ($users as $user) {
        // Check if the 'username' key matches the login username
        if ($user['username'] === $loginUsername) {
            // Retrieve the games for the matching user
            $games = $user['games'];

            // Loop through each game
            foreach ($games as $game) {
                // Access the game stats
                $stats = $game['stats'];

                // Retrieve the desired properties (time, win, pieces)
                $time = $stats['time'];
                $win = $stats['win'];

                // Add the game stats to the array
                $gameStats[] = [
                    'time' => $time,
                    'win' => $win,

                ];
            }
        }
    }
}
*/

?>
