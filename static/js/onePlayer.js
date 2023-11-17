document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    let selectedPiece = null;
    let turn = true;

    // Create the checkerboard
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = `square ${((row + col) % 2 === 0) ? 'red' : 'black'}`;
            square.addEventListener("click", () => handleSquareClick(row, col));
            board.appendChild(square);

            // Add pieces to the board (for demonstration purposes)
            if (((row + col) % 2 === 1) && (row < 3 || row > 4)) {
                addPiece(row, col, row < 3 ? 'red' : 'white')
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
            const parentSquare = selectedPiece.parentNode;
            const currentIndex = Array.from(parentSquare.parentNode.children).indexOf(parentSquare);
            const currentRow = Math.floor(currentIndex / 8);
            const currentCol = currentIndex % 8;
            const targetIndex = Array.from(square.parentNode.children).indexOf(square);
            const targetRow = Math.floor(targetIndex / 8);
            const targetCol = targetIndex % 8;

            console.log('Selected Piece Row:', currentRow+1);
            console.log('Selected Piece Column:', currentCol+1);
            console.log('Target Row:', targetRow+1);
            console.log('Target Column:', targetCol+1);

            if(isValidSquare(currentRow, currentCol, targetRow, targetCol, selectedPiece)){
                square.appendChild(selectedPiece);
                selectedPiece = null;
                document.querySelectorAll('.square').forEach(s => s.classList.remove('selected'));
            } else{

            }
        }
    }

    function isValidSquare(currentRow, currentCol, targetRow, targetCol, piece) {
        //for red's turn
        if(getPieceColor(piece) === 'red' || getPieceColor(piece) === 'red-king'){
            if(turn){
                console.log("It's not your turn.");
                return false;
            }
            else if((targetRow + targetCol) % 2 === 0){
                console.log('Invalid move: Cannot move to a red space.');
                return false;
            }
            else if(currentRow > targetRow && getPieceColor(piece) != 'red-king'){
                console.log('Invalid move: cannot move backwards.');
                return false;
            }
            else if(Math.abs(currentRow - targetRow) === 2 && Math.abs(currentCol - targetCol) === 2){
                const jumpedRow = (currentRow + targetRow) / 2;
                const jumpedCol = (currentCol + targetCol) / 2;

                // Directly access the square at the jumped-over position
                const jumpedSquare = document.querySelector(`#board > div:nth-child(${jumpedRow * 8 + jumpedCol + 1})`);

                if (jumpedSquare.children.length > 0) {
                    // There's a piece at the jumped-over position
                    const jumpedPiece = jumpedSquare.children[0];

                    // Assuming getPieceColor is defined elsewhere in your code
                    if (getPieceColor(jumpedPiece) !== getPieceColor(piece)) {
                        // Valid jump, opponent's piece is between current and target positions
                        console.log("Jumping over an opponent's piece is valid.");
                        jumpedSquare.removeChild(jumpedPiece);

                        if (getPieceColor(piece) === 'red' && targetRow === 7) {
                            // If the piece has reached the last row, add a class to make it a king
                            piece.classList.add('red-king-piece');
                        }
                        turn = !turn; // Toggle turn after a successful jump
                        return true;
                    }
                    else {
                        console.log('Invalid move: Cannot jump over your own piece.');
                        return false;
                    }
                }
                else {
                    console.log('Invalid move: No piece to jump over.');
                    return false;
                }
            }
            else if(Math.abs(currentRow - targetRow) != 1 || Math.abs(currentCol - targetCol) != 1){
                console.log('Invalid move: Target tile too far.');
                return false;
            }
            else {
                console.log('Destination square is valid.');
                if (getPieceColor(piece) === 'red' && targetRow === 7) {
                    // If the piece has reached the last row, add a class to make it a king
                    piece.classList.add('red-king-piece');
                }
                turn = !turn;
                return true;
            }
        }
        //for white's turn
        else if(getPieceColor(piece) === 'white' || getPieceColor(piece) === 'white-king'){
            if(!turn){
                console.log("It's not your turn.");
                return false;
            }
            else if((targetRow + targetCol) % 2 === 0){
                console.log('Invalid move: Cannot move to a red space.');
                return false;
            }
            else if(currentRow < targetRow && getPieceColor(piece) != 'white-king'){
                console.log('Invalid move: cannot move backwards.');
                return false;
            }
            else if(Math.abs(currentRow - targetRow) === 2 && Math.abs(currentCol - targetCol) === 2){
                const jumpedRow = (currentRow + targetRow) / 2;
                const jumpedCol = (currentCol + targetCol) / 2;

                // Directly access the square at the jumped-over position
                const jumpedSquare = document.querySelector(`#board > div:nth-child(${jumpedRow * 8 + jumpedCol + 1})`);

                if (jumpedSquare.children.length > 0) {
                    // There's a piece at the jumped-over position
                    const jumpedPiece = jumpedSquare.children[0];

                    // Assuming getPieceColor is defined elsewhere in your code
                    if (getPieceColor(jumpedPiece) !== getPieceColor(piece)) {
                        // Valid jump, opponent's piece is between current and target positions
                        console.log("Jumping over an opponent's piece is valid.");
                        jumpedSquare.removeChild(jumpedPiece);

                        if (getPieceColor(piece) === 'white' && targetRow === 0) {
                            // If the piece has reached the last row, add a class to make it a king
                            piece.classList.add('white-king-piece');
                        }
                        turn = !turn; // Toggle turn after a successful jump
                        return true;
                    }
                    else {
                        console.log('Invalid move: Cannot jump over your own piece.');
                        return false;
                    }
                }
                else {
                    console.log('Invalid move: No piece to jump over.');
                    return false;
                }
            }
            else if(Math.abs(currentRow - targetRow) != 1 || Math.abs(currentCol - targetCol) != 1){
                console.log('Invalid move: Target tile too far.');
                return false;
            }
            else{
                console.log('Destination square is valid.');
                if (getPieceColor(piece) === 'white' && targetRow === 0) {
                    // If the piece has reached the last row, add a class to make it a king
                    piece.classList.add('white-king-piece');
                }
                turn = !turn;
                return true;
            }
        }
        else{
            console.log('How did you get here?');
            return false;
        }
    }

    function getPieceColor(piece) {
        if (piece.classList.contains('red-king-piece')) {
            return 'red-king'
        }
        else if (piece.classList.contains('white-king-piece')) {
            return 'white-king';
        }
        else if (piece.classList.contains('red-piece')) {
            return 'red';
        }
        else if (piece.classList.contains('white-piece')) {
            return 'white';
        }
        else {
            console.log("somehow, this piece doesn't have a color!");
            return 'unknown';
        }
}

    // Enable drag and drop for pieces, not implemented properly
    /*document.addEventListener("dragstart", function (event) {
        if (event.target.classList.contains('piece')) {
            selectedPiece = event.target;
            event.dataTransfer.setData("text/plain", ''); // Required for Firefox
        }
    });*/

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
    piece.draggable = false;
    document.querySelector(`#board > div:nth-child(${row * 8 + col + 1})`).appendChild(piece);
}
