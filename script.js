let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let botMode = "human";
let player1Score = 0;
let player2Score = 0;

const cells = document.querySelectorAll(".cell");
const statusDisplay = document.querySelector("#status");
const restartButton = document.querySelector("#restart");
const difficultySelector = document.querySelector("#difficulty");
const player1ScoreDisplay = document.querySelector("#player1-score");
const player2ScoreDisplay = document.querySelector("#player2-score");
const player2Label = document.querySelector("#player2-label");

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

function updateCell(index) {
  board[index] = currentPlayer;
  cells[index].innerText = currentPlayer;

  if (currentPlayer === "X") {
    cells[index].classList.add("text-[#EF4444]");
    cells[index].classList.remove("text-[#3B82F6]");
  } else {
    cells[index].classList.add("text-[#3B82F6]");
    cells[index].classList.remove("text-[#EF4444]");
  }
}

function checkWin() {
  return winningConditions.some(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function checkDraw() {
  return board.every((cell) => cell !== "");
}

function updatePlayer2Label() {
  if (botMode === "human") {
    player2Label.innerText = "Player 2";
  } else {
    player2Label.innerText = `${
      botMode.charAt(0).toUpperCase() + botMode.slice(1)
    } Bot`;
  }
}

function updateScore() {
  if (currentPlayer === "X") {
    player1Score++;
    player1ScoreDisplay.innerText = player1Score;
  } else {
    player2Score++;
    player2ScoreDisplay.innerText = player2Score;
  }
}

function botMove() {
  setTimeout(() => {
    if (botMode === "easy") easyBot();
    if (botMode === "medium") mediumBot();
    if (botMode === "impossible") impossibleBot();

    if (checkWin()) {
      statusDisplay.innerText = `Player ${currentPlayer} wins!`;
      updateScore();
      gameActive = false;
      return;
    }

    if (checkDraw()) {
      statusDisplay.innerText = "It's a draw!";
      gameActive = false;
      return;
    }

    currentPlayer = "X";
    statusDisplay.innerText = `Player ${currentPlayer}'s turn`;
  }, 500);
}

function easyBot() {
  const emptyCells = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter((idx) => idx !== null);
  const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  updateCell(randomMove);
}

function mediumBot() {
  for (let [a, b, c] of winningConditions) {
    if (board[a] === "X" && board[b] === "X" && board[c] === "")
      return updateCell(c);
    if (board[a] === "X" && board[c] === "X" && board[b] === "")
      return updateCell(b);
    if (board[b] === "X" && board[c] === "X" && board[a] === "")
      return updateCell(a);
  }
  easyBot();
}

function impossibleBot() {
  for (let [a, b, c] of winningConditions) {
    if (board[a] === "O" && board[b] === "O" && board[c] === "")
      return updateCell(c);
    if (board[a] === "O" && board[c] === "O" && board[b] === "")
      return updateCell(b);
    if (board[b] === "O" && board[c] === "O" && board[a] === "")
      return updateCell(a);
    if (board[a] === "X" && board[b] === "X" && board[c] === "")
      return updateCell(c);
    if (board[a] === "X" && board[c] === "X" && board[b] === "")
      return updateCell(b);
    if (board[b] === "X" && board[c] === "X" && board[a] === "")
      return updateCell(a);
  }
  const emptyCells = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter((idx) => idx !== null);
  updateCell(emptyCells[0]);
}

function handleCellClick(event) {
  const cellIndex = Array.from(cells).indexOf(event.target);
  if (
    board[cellIndex] !== "" ||
    !gameActive ||
    (botMode !== "human" && currentPlayer === "O")
  )
    return;

  updateCell(cellIndex);

  if (checkWin()) {
    statusDisplay.innerText = `Player ${currentPlayer} wins!`;
    updateScore();
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    statusDisplay.innerText = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerText = `Player ${currentPlayer}'s turn`;

  if (botMode !== "human" && currentPlayer === "O") botMove();
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("text-[#EF4444]", "text-[#3B82F6]");
  });
  statusDisplay.innerText = `Player ${currentPlayer}'s turn`;
}

difficultySelector.addEventListener("change", (event) => {
  botMode = event.target.value;
  updatePlayer2Label();
  restartGame();
});

function initializeGame() {
  updatePlayer2Label();
  statusDisplay.innerText = `Player ${currentPlayer}'s turn`;
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);

initializeGame();
