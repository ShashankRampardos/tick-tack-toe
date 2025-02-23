/* script.js */
window.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let running = true;

    const winningCombinations = [
        [0,1,2], [3,4,5], [6,7,8], // Rows
        [0,3,6], [1,4,7], [2,5,8], // Columns
        [0,4,8], [2,4,6]           // Diagonals
    ];

    initializeGame();

    function initializeGame() {
        cells.forEach(cell => cell.addEventListener('click', cellClicked));
        restartButton.addEventListener('click', restartGame);
        statusText.textContent = `Your turn!`;
    }

    function cellClicked() {
        const cellIndex = this.getAttribute('data-index');

        if (board[cellIndex] !== '' || !running) {
            return;
        }

        updateCell(this, cellIndex, currentPlayer);
        if (checkWin(currentPlayer)) {
            statusText.textContent = `You win! 🎉`;
            running = false;
        } else if (isBoardFull()) {
            statusText.textContent = `It's a draw! 🤝`;
            running = false;
        } else {
            statusText.textContent = `Computer's turn...`;
            setTimeout(computerTurn, 1200);
        }
    }

    function updateCell(cell, index, player) {
        board[index] = player;
        cell.textContent = player;
    }

    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === player);
        });
    }

    function isBoardFull() {
        return board.every(cell => cell !== '');
    }

    function computerTurn() {
        currentPlayer = 'O';

        // Try to win
        let moveMade = tryToWinOrBlock('O');//if there is a straight winning move for computer then make that move

        // Block player's win, if player has a straight winning move then block that move
        if (!moveMade) {
            moveMade = tryToWinOrBlock('X');
        }


        // first two conditions will give priority to center then corners, and if both are not available then make a random move
        // Take center if available
        if (!moveMade && board[4] === '') {
            makeMove(4);
            moveMade = true;
        }

        // not using corner strategy,instead of making it challenging, it is making game too easy for player once he figure out the plan of logic.
        // Take a random corner
        // if (!moveMade) {
        //     moveMade = takeRandomCell([0, 2, 6, 8]);
        // }

        // Take any available cell
        if (!moveMade) {
            moveMade = takeRandomCell([1, 3, 5, 7]);
        }

        if (checkWin(currentPlayer)) {
            statusText.textContent = `Computer wins! 💻`;
            running = false;
        } else if (isBoardFull()) {
            statusText.textContent = `It's a draw! 🤝`;
            running = false;
        } else {
            currentPlayer = 'X';
            statusText.textContent = `Your turn!`;
        }
    }

    function tryToWinOrBlock(player) {// it is a modular function with the help of which we can check if there is a straight winning move for both computer or player
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                if (checkWin(player)) {
                    makeMove(i);
                    return true;
                }
                board[i] = '';
            }
        }
        return false;
    }

    function getSecureRandomInt(max) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }
    
    function takeRandomCell() {
        const availableIndices = board
            .map((cell, index) => (cell === '' ? index : null))
            .filter(index => index !== null);
    
        if (availableIndices.length > 0) {
            const randomIndex = getSecureRandomInt(availableIndices.length);
            const selectedCellIndex = availableIndices[randomIndex];
            makeMove(selectedCellIndex);
            return true;
        }
        return false;
    }

    function makeMove(index) {
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        updateCell(cell, index, currentPlayer);
    }

    function restartGame() {
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        running = true;
        cells.forEach(cell => {
            cell.textContent = '';
        });
        statusText.textContent = `Your turn!`;
    }
});
