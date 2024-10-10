let gameStarted = false;
let startTime;
let intervalID;

function startGame() {
  gameStarted = true;
  startTime = new Date();
  intervalID = setInterval(updatePlaytime, 1000); // Update playtime every second when game starts
}

function endGame() {
  gameStarted = false;
  clearInterval(intervalID); // Stop updating playtime when game ends
}

function calculatePlayTime() {
  const currentTime = new Date();
  const timeDifference = currentTime - startTime;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `Playtime: ${minutes} minutes ${remainingSeconds} seconds`;
}

function updatePlaytime() {
  const playtimeElement = document.getElementById("playtime");
  if (gameStarted) {
    playtimeElement.textContent = calculatePlayTime();   //this will update the playtime in html file
  }
}

function gameTime() {
  const currentTime = new Date();
  const timeDifference = currentTime - startTime;

  
  return timeDifference;
}

function restartGame(){
  gameStarted = false;
  readyToMove = null;
  posNewPosition = [];
  capturedPosition = [];
  currentPlayer = 1;
  initializeBoard();
  resetPlayerClass(); // Reset the player class when restarting the game
  createBoard();
}

function resetPlayerClass() {
  var container = document.getElementById("next-player");
  container.setAttribute("class", "occupied " + originalPlayerClass);
}

function movePiece(e) { //e is the short var reference for event object which be passed to event handlers   //Original function
  
  if(!gameStarted){
    return;   //Prevent piece movement if the game hasn't started
  }
    let piece = e.target;  //the target property returns the element where the event occured
    const row = parseInt(piece.getAttribute("row"));
    const column = parseInt(piece.getAttribute("column"));
    let p = new Piece(row, column);   //this will set a new instance
    
    if(capturedPosition.length > 0 && !hasCapturedPiece(p)){
      capturedPosition = [];  //clear captured positions if the clicked piece cannot capture
    }
    
    if (capturedPosition.length > 0) {   //capturedPosition include value "newPostion" and "pieceCaptured" will be pushed in findPieceCaptured()
      enableToCapture(p);
    } else {
      if (posNewPosition.length > 0) {    //push in markPossiblePosition()
        enableToMove(p);
      }
    }
    const pieceValue = board[row][column];

   
    if (currentPlayer === board[row][column]) {
       //the reason it reverse the current player is because it can check in the findPieceCaptured(p, player) 
       //that if it can capture or not in the if conditions 
      player = reverse(currentPlayer);
      if (!findPieceCaptured(p, player)) {  //if no capture pieces found, we execute below function
        findPossibleNewPosition(p, player);
      }
    }
  }

  function hasCapturedPiece(p) {
    return capturedPosition.some((capture) => {
        return capture.newPosition.row === p.row && capture.newPosition.column === p.column;
    });
 }


  function enableToCapture(p) {    // ---Original, come back to this one
    //initialPlayer = currentPlayer;  //store the initial player before any changes
    
    let find = false;
    let pos = null;
    capturedPosition.forEach((element) => {
      if (element.newPosition.match(p)) {    //check the newPosition in capturedPosition with the cell that we click on if we have the same row and column or not
        find = true;
        pos = element.newPosition;
        old = element.pieceCaptured;
        return;
      }
    });
  
    if (find) {

      // if the current piece can move on, edit the board and rebuild
      board[pos.row][pos.column] = currentPlayer; // move the piece
      board[readyToMove.row][readyToMove.column] = 0; // delete the old position
      // delete the piece that had been captured
      board[old.row][old.column] = 0;
  
      // reinit ready to move value
  
      readyToMove = null;
      capturedPosition = [];
      posNewPosition = [];
      displayCurrentPlayer();
      createBoard();
      // check if there are possibility to capture other piece
      currentPlayer = reverse(currentPlayer);

     
    } else {
      createBoard();
    }
  }
  
  function enableToMove(p) {
    let find = false;
    let newPosition = null;
   
 
    // check if the case where the player play the selected piece can move on
    posNewPosition.forEach((element) => {     //it iterates through the 'posNewPostion' array, which likely contains the positions
      if (element.match(p)) {               //to which the selected piece can move. Within the iteration, it checks if the current 
        find = true;                          //element ('element') in the array matches the selected piece 'p' using the 'compare' 
        newPosition = element;                //method of the 'Piece' class. After the iteration, if a valid position was found ('find' is 'true)
        return;                               //it calls the 'moveThePiece' function with the found 'newPosition'.
      }                                       //if no valid position is found ('find' remains 'false'), it calls 'createBoard()', likely
    });                                       //to rebuild or refresh the game board, indicating that there are no valid moves for selected piece
  
    if (find) moveThePiece(newPosition);
    else createBoard();
  }
  
  //'newPosition' as a parameter, representing the coordinates of the position where the piece will move
  //It updates the game board by assigning the current player's piece to the newPosition and removing the 
  //piece from the readyToMove position on the board.

  function moveThePiece(newPosition) { //   Original cone back to this one
    // if the current piece can move on, edit the board and rebuild
    board[newPosition.row][newPosition.column] = currentPlayer;
    board[readyToMove.row][readyToMove.column] = 0;       //in the beginning when we first move, readyToMove comes from findPossibleNewPosition()
    
    // Store the current piece's color
  let pieceColor;
  if (currentPlayer === 1) {
    pieceColor = document.getElementById('player1ColorSelector').value;
  } else {
    pieceColor = document.getElementById('player2ColorSelector').value;
  }
    // reset value after move the piece
    readyToMove = null;
    posNewPosition = [];
    capturedPosition = [];
  
    currentPlayer = reverse(currentPlayer);  //i believe this is where we switch player turn after move the piece
  
    displayCurrentPlayer();
    createBoard();
  }
  
  function findPossibleNewPosition(piece, player) {
    if (board[piece.row + player][piece.column + 1] === 0) {
      readyToMove = piece;
      markPossiblePosition(piece, player, 1);  
    }
  
    if (board[piece.row + player][piece.column - 1] === 0) {
      readyToMove = piece;
      markPossiblePosition(piece, player, -1);
    }
  }
  
  //the 'player' argument in markPossiblePosition determines the direction in which the piece is 
  //allow to move, either forward or backward on the board
  //moving backward would be indicate by player = -1 and forward indicate by player = 1
  //remember the white piece in row 5 (forward of it means backward in array)
  function markPossiblePosition(p, player = 0, direction = 0) {
    attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);
  
    position = document.querySelector("[data-position='" + attribute + "']");
    if (position) {
      position.style.background = "green";
      // // save where it can move
      posNewPosition.push(new Piece(p.row + player, p.column + direction));
    }
  }

  let originalPosition = 1;
  function findPieceCaptured(p, player) {
    let found = false;
    let originalPosition; 
  
    /* Check top-left direction
     "p.row -2 >= 0 && p.column - 2 >= 0" these conditions ensure that the move being checked
     does't go out of the bounds of the game board
     "board[p.row - 1][p.column - 1] === player" this condition checks if the adjacent
     cell diaganally to the top-left of the current piece contains an opponent's piece ('players').
     It's verifying that there's an opponent's piece one cell away in the top-left direction
     "board[p.row - 2][p.column - 2] === 0": This condition ensures that the cell two steps diagonally to 
     the top-left of the current piece is empty. It confirms that the move is capturing the opponent's piece 
     and landing in an empty cell, making it a valid capture move.*/
    if (p.row - 2 >= 0 && p.column - 2 >= 0 && board[p.row - 1][p.column - 1] === player && board[p.row - 2][p.column - 2] === 0) {
      found = true;
      newPosition = new Piece(p.row - 2, p.column - 2);
      readyToMove = p;
      markPossiblePosition(newPosition);
      capturedPosition.push({
        newPosition: newPosition,
        pieceCaptured: new Piece(p.row - 1, p.column - 1),
      });
    }
  
    // Check top-right direction
    if (p.row - 2 >= 0 && p.column + 2 < board.length && board[p.row - 1][p.column + 1] === player && board[p.row - 2][p.column + 2] === 0) {
      found = true;
      newPosition = new Piece(p.row - 2, p.column + 2);
      readyToMove = p;
      markPossiblePosition(newPosition);
      capturedPosition.push({
        newPosition: newPosition,
        pieceCaptured: new Piece(p.row - 1, p.column + 1),
      });
    }
  
    // Check bottom-left direction
    if (p.row + 2 < board.length && p.column - 2 >= 0 && board[p.row + 1][p.column - 1] === player && board[p.row + 2][p.column - 2] === 0) {
      found = true;
      newPosition = new Piece(p.row + 2, p.column - 2);
      readyToMove = p;
      markPossiblePosition(newPosition);
      capturedPosition.push({
        newPosition: newPosition,
        pieceCaptured: new Piece(p.row + 1, p.column - 1),
      });
    }
  
    // Check bottom-right direction
    if (p.row + 2 < board.length && p.column + 2 < board.length && board[p.row + 1][p.column + 1] === player && board[p.row + 2][p.column + 2] === 0) {
      found = true;
      newPosition = new Piece(p.row + 2, p.column + 2);
      readyToMove = p;
      markPossiblePosition(newPosition);
      capturedPosition.push({
        newPosition: newPosition,
        pieceCaptured: new Piece(p.row + 1, p.column + 1),
      });
    }
    return found;
  }
 
  function createBoard() {
    game.innerHTML = "";
    let black = 0;
    let white = 0;
  
    const boardSize = board.length; // Get the board size dynamically
  
    for (let i = 0; i < boardSize; i++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");
  
      for (let j = 0; j < boardSize; j++) {
        let col = document.createElement("div");
        let piece = document.createElement("div");
        let caseType = "";
        let occupied = "";
  
        if ((i + j) % 2 === 0) {
          caseType = "Whitecase";
        } else {
          caseType = "blackCase";
        }
  
        // Add the piece if the case isn't empty
        if (board[i][j] === 1) {
          occupied = "whitePiece";
          piece.style.backgroundColor = player1PieceColor; // Set color from selected color
        } else if (board[i][j] === -1) {
          occupied = "blackPiece";
          piece.style.backgroundColor = player2PieceColor; // Set color from selected color
        } else {
          occupied = "empty";
        }
  
        piece.setAttribute("class", "occupied " + occupied);
        piece.setAttribute("row", i);
        piece.setAttribute("column", j);
        piece.setAttribute("data-position", i + "-" + j);
        //add event listerner to each piece
        piece.addEventListener("click", movePiece);
  
        col.appendChild(piece);
        col.setAttribute("class", "column " + caseType);
  
        row.appendChild(col);
  
        // Counter number of each piece
        if (board[i][j] === -1) {
          black++;
        } else if (board[i][j] === 1) {
          white++;
        }
      }
      game.appendChild(row);
    }
    console.log(black);
    // Display the number of pieces for each player
    displayCounter(black, white);
  
    if (black === 0 || white === 0) {  //this will be where we determine who win the game. When createBoard, it will count number of 
       
      endGame();                       //of white and black piece left. Who ever has 0 left, it will call modalOpen()
      modalOpen(black, white);                    
     
    }
  }

  function displayCurrentPlayer() {
    var container = document.getElementById("next-player");
    var player1PieceColor = document.getElementById('player1ColorSelector').value;
    var player2PieceColor = document.getElementById('player2ColorSelector').value;
  
    if (container.classList.contains("whitePiece")) {
      container.setAttribute("class", "occupied blackPiece");
      container.style.backgroundColor = player2PieceColor;
    } else {
      container.setAttribute("class", "occupied whitePiece");
      container.style.backgroundColor = player1PieceColor;
    }
  }
  
  function displayCounter(black, white) {
    var blackContainer = document.getElementById("black-player-count-pieces");
    var whiteContainer = document.getElementById("white-player-count-pieces");
    blackContainer.innerHTML = black;
  
    whiteContainer.innerHTML = white;
  }

  
  function modalOpen(black, white) {
    let timer = gameTime();
    console.log(timer);
    console.log(white);
    document.getElementById("time").innerHTML = calculatePlayTime();
    document.getElementById("winner").innerHTML = black === 0 ? player1PieceColor : player2PieceColor;
    document.getElementById("loser").innerHTML = black !== 0 ? player1PieceColor : player2PieceColor;
    modal.classList.add("effect");
    
    updateStats(globalUsername, black, timer, white);
  }
  
  function modalClose() {
    modal.classList.remove("effect");
  }
  
  function reverse(player) {
    return player === -1 ? 1 : -1;
  }


// Get the select element
const selectBoardColor = document.getElementById('boardColor');

// Store the original board color
const originalBoardColor = getComputedStyle(document.querySelector('.game')).backgroundColor;

// Add an event listener to detect changes in the selected color
selectBoardColor.addEventListener('change', function() {
  const selectedColor = this.value; // Get the selected color

  if (selectedColor === 'default') {
    // If the default option is selected, reset to the original color
    document.querySelector('.game').style.backgroundColor = originalBoardColor;
  } else {
    // Update the board's background color based on the selected color
    document.querySelector('.game').style.backgroundColor = selectedColor;
  }
});


/************Dealing with piece color****************/
// Global variables to store the selected colors for each player
let player1PieceColor = "white";
let player2PieceColor = "black";

// Function to update the piece colors based on player selections
function updatePieceColors() {
  player1PieceColor = document.getElementById('player1ColorSelector').value;
  player2PieceColor = document.getElementById('player2ColorSelector').value;

   // Update the background color of white pieces (class: .occupied.whitePiece)
   const whitePieces = document.querySelectorAll('.occupied.whitePiece');
   whitePieces.forEach(piece => {
     piece.style.backgroundColor = player1PieceColor;
   });
 
   // Update the background color of black pieces (class: .occupied.blackPiece)
   const blackPieces = document.querySelectorAll('.occupied.blackPiece');
   blackPieces.forEach(piece => {
     piece.style.backgroundColor = player2PieceColor;
   });

  // Call createBoard() or any relevant function to update the board with new colors
  createBoard();
}
//php and cookie
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


var globalUsername = getCookie('username');
console.log(globalUsername)

window.addEventListener('load', function() {
  //document.getElementById('loggedin').innerHTML = `You are logged in as: ${globalUsername}`;
});


