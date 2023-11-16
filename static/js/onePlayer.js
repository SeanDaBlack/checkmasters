document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    let selectedPiece = null;

    // Create the checkerboard
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = `square ${((row + col) % 2 === 0) ? 'white' : 'black'}`;
            square.addEventListener("click", () => handleSquareClick(row, col));
            board.appendChild(square);

            // Add pieces to the board (for demonstration purposes)
            if (((row + col) % 2 === 0) && (row < 3 || row > 4)) {
                addPiece(row, col, row < 3 ? 'red' : 'black');
            }
        }
    }

    function handleSquareClick(row, col) {
        const square = document.querySelector(`#board > div:nth-child(${row * 8 + col + 1})`);
        if (square.classList.contains('selected')) {
            // Deselect the piece
            square.classList.remove('selected');
            selectedPiece = null;
        } else if (square.children.length > 0) {
            // Select the piece
            square.classList.add('selected');
            selectedPiece = square.children[0];
        } else if (selectedPiece) {
            // Move the selected piece to the empty square
            square.appendChild(selectedPiece);
            selectedPiece = null;
            document.querySelectorAll('.square').forEach(s => s.classList.remove('selected'));
        }
    }

    // Enable drag and drop for pieces
    document.addEventListener("dragstart", function (event) {
        if (event.target.classList.contains('piece')) {
            selectedPiece = event.target;
            event.dataTransfer.setData("text/plain", ''); // Required for Firefox
        }
    });

    document.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    document.addEventListener("drop", function (event) {
        event.preventDefault();
        if (event.target.classList.contains('square') && !event.target.children.length && selectedPiece) {
            event.target.appendChild(selectedPiece);
            selectedPiece = null;
            document.querySelectorAll('.square').forEach(s => s.classList.remove('selected'));
        }
    });
});

function addPiece(row, col, color) {
    const piece = document.createElement("div");
    piece.className = `piece ${color}-piece`;
    piece.draggable = true;
    document.querySelector(`#board > div:nth-child(${row * 8 + col + 1})`).appendChild(piece);
}
