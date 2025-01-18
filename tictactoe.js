function cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (column, row, player) => {
    if (getBoard()[row][column].getValue() === 0)
      getBoard()[row][column].addToken(player);
  };

  return { dropToken, getBoard };
}

const checkWin = function (board) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board.getBoard()[i][0].getValue() === board.getBoard()[i][1].getValue() &&
      board.getBoard()[i][1].getValue() === board.getBoard()[i][2].getValue() &&
      board.getBoard()[i][0].getValue() !== 0
    ) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board.getBoard()[0][i].getValue() === board.getBoard()[1][i].getValue() &&
      board.getBoard()[1][i].getValue() === board.getBoard()[2][i].getValue() &&
      board.getBoard()[0][i].getValue() !== 0
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() &&
    board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue() &&
    board.getBoard()[0][0].getValue() !== 0
  ) {
    return true;
  }

  if (
    board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() &&
    board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue() &&
    board.getBoard()[0][2].getValue() !== 0
  ) {
    return true;
  }

  // No win condition found
  return false;
};

function checkDraw(board) {
  // Initialize a flag to track if all cells are filled
  let allCellsFilled = true;

  // Iterate through each row of the board
  board.getBoard().forEach((row) => {
    // Iterate through each cell in the row
    row.forEach((cell) => {
      // Check if the cell value is 0 (empty)
      if (cell.getValue() === 0) {
        // If an empty cell is found, set flag to false
        allCellsFilled = false;
        return;
      }
    });
    if (!allCellsFilled) {
      return;
    }
  });

  // Return the flag indicating whether all cells are filled
  return allCellsFilled;
}

const firstplayer = document.getElementById("first_player");

let added = 0;
let added2 = 0;

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = gameBoard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },

    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (column, row) => {
    console.log(`Droppping ${getActivePlayer().name}'s token`);

    board.dropToken(column, row, getActivePlayer().token);

    if (checkWin(board)) {
      const winningEl = document.querySelector(".winning");
      const winningtext = document.querySelector(".winningtext");

      winningEl.classList.add("winner");
      winningtext.innerText = `${getActivePlayer().name} wins`;

      const playerScorEl = document.querySelector("#score1");
      const playerScorEl2 = document.querySelector("#score2");
      if (getActivePlayer().name === "Player One") {
        added++;

        playerScorEl.innerText = `${added}`;
      } else {
        added2++;
        playerScorEl2.innerText = `${added2}`;
      }

      return;
    }

    if (checkDraw(board)) {
      console.log("draw");
      const winningEl = document.querySelector(".winning");
      const winningtext = document.querySelector(".winningtext");

      winningEl.classList.add("winner");

      winningtext.innerText = `DRAW`;
    }

    switchPlayerTurn();
  };

  return {
    board,
    playRound,
    getActivePlayer,
  };
}

function createGameboardDOM(gameController) {
  const gameboardDiv = document.getElementById("gameboard");
  gameboardDiv.innerHTML = ""; // Clear any previous board

  const board = gameController.board.getBoard(); // Retrieve the board statee

  // Create a div for each cell on the gameboard
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.className = "square";
      cell.setAttribute("class", "ruta");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.textContent =
        board[row][col].getValue() === 1
          ? "X"
          : board[row][col].getValue() === 2
          ? "O"
          : "";
      gameboardDiv.appendChild(cell);
      // Set contenteditable to false to prevent blinking curs

      // Add click event listener to each cell
      cell.addEventListener("click", () => {
        if (board[row][col].getValue() === 0) {
          gameController.playRound(col, row);
          updateGameboard(gameController);
        }
      });
    }
  }
}

// Function to update the gameboard DOM and display player's turn
function updateGameboard(gameController) {
  createGameboardDOM(gameController); // Create the gameboard DOM

  // Display the active player's turn
  const playerTurnDiv = document.getElementById("player-turn");
  playerTurnDiv.textContent = `${
    gameController.getActivePlayer().name
  }'s turn.`;

  // Optionally, you can check for game over conditions here and display a message if needed
}

// Function to initialize the game and set up the DOM
function initGame() {
  const game = GameController(); // Create a new game controller
  createGameboardDOM(game); // Initialize the gameboard DOM

  // Set up restart button
  const restartButton = document.getElementById("restart-btn");
  restartButton.addEventListener("click", () => {
    gameController = GameController(); // Reset the game controller
    createGameboardDOM(gameController); // Recreate the gameboard DOM
    updateGameboard(gameController); // Update the DOM with the new game state
    console.log("hej");
    // Retrieve the element with class 'winning'

    const winningEl = document.querySelector(".winner");
    // Remove the 'winner' class
    winningEl.classList.remove("winner");
  });

  // Display the initial player's turn
  updateGameboard(game);
}

const form = document.querySelector(".formstart");
form.addEventListener("submit", (event) => {
  // Prevent the form from being submitted
  event.preventDefault();

  // Add your logic here to handle the input value
  // For example, you can read the value from the input field
  const inputValue = document.getElementById("first_player").value;

  const thegame = document.querySelector(".thegame");

  if (inputValue.length !== 0) {
    form.style.display = "none";
    thegame.style.display = "block";
    const playerOneName = document.getElementById("playerscore1");

    playerOneName.innerText = `${inputValue}'s score:`;

    return inputValue;
  }

  //
});

window.onload = initGame();
