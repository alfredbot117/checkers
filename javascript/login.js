function createDB() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'phpfiles/createDB.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Database created successfully');
            } else {
                console.error('Error creating database:', xhr.statusText);
            }
        }
    };
    xhr.send();
}


function signup() {
    var username = document.getElementById('signupUsername').value;
    var password = document.getElementById('signupPassword').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'phpfiles/signup.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Sign up successful');
                var response = xhr.responseText;
              
                console.log('Server response:', response);
            } else {
                console.error('Error signing up:', xhr.statusText);
            }
        }
    };
    
    var data = {
        username: username,
        password: password
    };
    
    xhr.send(JSON.stringify(data));
}


function login() {
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'phpfiles/login.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            //document.getElementById('loggedin').innerHTML = response;

            if (response === 'Login successful') {
                
                setCookie('username', username, 7);
                
                console.log(`${username} logged in successfully`)
                // Redirect to another page after successful login
                window.location.href = 'index.html';
            }
            else {
                console.log(response);
            }
        }
    };

    var data = {
        username: username,
        password: password
    };

    xhr.send(JSON.stringify(data));
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}



function updateStats(username, opponentPieces, timer, myPieces) {
   
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'phpfiles/updatePlayerStats.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Player stats updated successfully');
                var response = xhr.responseText;
                console.log('Server response:', response);
            } else {
                console.error('Error updating player stats:', xhr.statusText);
            }
        }
    };

    // Add your data here
    var data = {
        username: username,
        opponentPieces: opponentPieces,
        timer: timer,
        myPieces: myPieces
    };

    xhr.send(JSON.stringify(data));
}

function loadLeaderboard(order){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'phpfiles/leaderboard.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Leaderboard loaded successfully');
                var response = xhr.responseText;
                console.log('Server response:', response);

                var leaderboardData = JSON.parse(response);

                var leaderboardDiv = document.getElementById('test');

                // Clear the existing content of the div
                leaderboardDiv.innerHTML = '';

                // Create the table element
                var table = document.createElement('table');
                table.style.borderCollapse = 'collapse';

                




                                var headerRow = document.createElement('tr');
                                headerRow.style.borderBottom = '1px solid black';

                                var headers = ['Username', 'Wins', 'Games', 'Time', 'Score'];
                                headers.forEach(function(headerText) {
                                    var headerCell = document.createElement('th');
                                    headerCell.style.border = '1px solid black';
                                    headerCell.style.padding = '12px'; // Increase the padding value here
                                    headerCell.textContent = headerText;
                                    headerRow.appendChild(headerCell);
                                });
                                table.style.margin = '0 auto';
                                table.style.width = '100%';

                                table.appendChild(headerRow);
                                leaderboardData.forEach(function(player) {
                                    var row = document.createElement('tr');
                                    row.style.borderBottom = '1px solid black';

                                    // Create the table cells
                                    var usernameCell = document.createElement('td');
                                    usernameCell.style.border = '1px solid black';
                                    usernameCell.style.padding = '12px'; // Increase the padding value here
                                    usernameCell.textContent = player.username;

                                    var winsCell = document.createElement('td');
                                    winsCell.style.border = '1px solid black';
                                    winsCell.style.padding = '12px'; // Increase the padding value here
                                    winsCell.textContent = player.wins;

                                    var gamesCell = document.createElement('td');
                                    gamesCell.style.border = '1px solid black';
                                    gamesCell.style.padding = '12px'; // Increase the padding value here
                                    gamesCell.textContent = player.games;

                                    var timeCell = document.createElement('td');
                                    timeCell.style.border = '1px solid black';
                                    timeCell.style.padding = '12px'; // Increase the padding value here
                                    var minutes = Math.floor(player.time / 60000);
                                    var seconds = Math.floor((player.time % 60000) / 1000);
                                    timeCell.textContent = minutes + ' minutes ' + seconds + ' seconds';

                                    var scoreCell = document.createElement('td');
                                    scoreCell.style.border = '1px solid black';
                                    scoreCell.style.padding = '12px'; // Increase the padding value here
                                    scoreCell.textContent = player.score;

                                    // Append the cells to the row
                                    row.appendChild(usernameCell);
                                    row.appendChild(winsCell);
                                    row.appendChild(gamesCell);
                                    row.appendChild(timeCell);
                                    row.appendChild(scoreCell);

                                    // Append the row to the table
                                    table.appendChild(row);
                                });



                // Append the table to the div
                leaderboardDiv.appendChild(table);
            } else {
                console.error('Error loading leaderboard:', xhr.statusText);
            }
        }
    };
    
    xhr.send(JSON.stringify({order: order}));
}


function loadGames() {
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    var userData = getCookie('username');
    //console.log(globalUsername);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "phpfiles/mygames.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Handle the response here
            var response = xhr.response;
            console.log(response);
            /*example response:
            yang[{"time":100310,"win":"won","pieces":80},{"time":100310,"win":"won","pieces":80}]
            */

            var games = JSON.parse(response);

            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");

            // Create header row
            var headerRow = document.createElement("tr");
            var headers = ["Score", "Opponent Score", "Result", "Time"];
            headers.forEach(function(header) {
                var th = document.createElement("th");
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Insert games data into the table
            games.forEach(function(game) {
                var row = document.createElement("tr");
                var scoreCell = document.createElement("td");
                scoreCell.textContent = game.score;
                scoreCell.style.padding = "20px"; // Change padding to 20px
                row.appendChild(scoreCell);

                var opponentScoreCell = document.createElement("td");
                opponentScoreCell.textContent = game.opponent;
                opponentScoreCell.style.padding = "20px"; // Change padding to 20px
                row.appendChild(opponentScoreCell);

                var resultCell = document.createElement("td");
                resultCell.textContent = game.result;
                resultCell.style.padding = "20px"; // Change padding to 20px
                row.appendChild(resultCell);

                var timeCell = document.createElement("td");
                var minutes = Math.floor(game.time / (1000 * 60));
                var seconds = Math.floor((game.time % (1000 * 60)) / 1000);
                timeCell.textContent = minutes + "m " + seconds + "s";
                timeCell.style.padding = "20px"; // Change padding to 20px
                row.appendChild(timeCell);

                tbody.appendChild(row);

                // Insert lines between rows
                var lineRow = document.createElement("tr");
                var lineCell = document.createElement("td");
                lineCell.setAttribute("colspan", "4");
                lineCell.style.borderTop = "1px solid #000";
                lineRow.appendChild(lineCell);
                tbody.appendChild(lineRow);
            });

            // Apply CSS styles to center the table
            table.style.margin = "0 auto";
            tbody.classList.add("centered-tbody");
            table.classList.add("centered-table");

            table.appendChild(tbody);
            document.getElementById("gamesTable").appendChild(table);
        }
    };

    
    var data = {
        username: userData
    };

    xhr.send(JSON.stringify(data));
}