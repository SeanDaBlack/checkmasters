document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    let selectedPiece = null;
    let turn = true;
    var jumped = false;

    // Create the checkerboard
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = `square ${((row + col) % 2 === 0) ? 'red' : 'black'}`;
            square.addEventListener("click", () => handleSquareClick(row, col));
            board.appendChild(square);

            // Add pieces to the board
            if (((row + col) % 2 === 1) && (row < 3 || row > 4)) {
                addPiece(row, col, row < 3 ? 'red' : 'white')
            }
        }
    }
    console.log("White's turn");

    function handleSquareClick(row, col) {
        const square = document.querySelector(`#board > div:nth-child(${row * 8 + col + 1})`);
        if (square.classList.contains('selected')) {
            console.log('piece unselected.');
            // Deselect the piece
            square.classList.remove('selected');
            selectedPiece = null;
        } else if (square.children.length > 0) {
            // Select the piece
            square.classList.add('selected');
            selectedPiece = square.children[0];
            console.log(getPieceColor(selectedPiece), 'selected.');
        } else if (selectedPiece) {
            const parentSquare = selectedPiece.parentNode;

            const currentIndex = Array.from(parentSquare.parentNode.children).indexOf(parentSquare);
            const currentRow = Math.floor(currentIndex / 8);
            const currentCol = currentIndex % 8;

            const targetIndex = Array.from(square.parentNode.children).indexOf(square);
            const targetRow = Math.floor(targetIndex / 8);
            const targetCol = targetIndex % 8;

            console.log('Original Location:', currentRow+1, currentCol+1);
            console.log('Target Location:', targetRow+1, targetCol+1);
            if(jumped){
                if(hasValidJumps(currentRow, currentCol, selectedPiece)){
                    // Allow the player to choose the next square to jump to
                    if(isValidJump(currentRow, currentCol, targetRow, targetCol, selectedPiece)){
                        square.appendChild(selectedPiece);
                        selectedPiece = null;
                        document.querySelectorAll('.square').forEach(s => s.classList.remove('selected'));
                    }
                }
                else{
                    // No more valid jumps, end the turn
                    selectedPiece = null;
                    document.querySelectorAll('.square').forEach(s => s.classList.remove('selected'));
                    turn = !turn;
                    jumped = false;
                    if(turn){
                        console.log("White's turn");
                    }
                    else{
                        console.log("Red's turn");
                    }
                }
            }
            else{
                if(isValidSquare(currentRow, currentCol, targetRow, targetCol, selectedPiece)){
                    square.appendChild(selectedPiece);

                    if(jumped && hasValidJumps(targetRow, targetCol, selectedPiece)){
                        console.log("Valid jump found!")
                    }
                    selectedPiece = null;
                    document.querySelectorAll('.square').forEach(s => s.classList.remove('selected'));
                }
            }
        }

    }

    function isValidJump(currentRow, currentCol, targetRow, targetCol, piece){
        if(getPieceColor(piece) === 'red' || getPieceColor(piece) === 'red-king'){
            if(Math.abs(currentRow - targetRow) === 2 && Math.abs(currentCol - targetCol) === 2){
                console.log('check1');
                const jumpedRow = (currentRow + targetRow) / 2;
                const jumpedCol = (currentCol + targetCol) / 2;

                // Directly access the square at the jumped-over position
                const jumpedSquare = document.querySelector(`#board > div:nth-child(${jumpedRow * 8 + jumpedCol + 1})`);

                if (jumpedSquare.children.length > 0) {
                    console.log('check2');
                    // There's a piece at the jumped-over position
                    const jumpedPiece = jumpedSquare.children[0];

                    if (getPieceColor(jumpedPiece) == 'white' || getPieceColor(jumpedPiece) == 'white-king') {
                        // Valid jump, opponent's piece is between current and target positions
                        console.log("Jumping over an opponent's piece is valid.");
                        jumpedSquare.removeChild(jumpedPiece);

                        if (getPieceColor(piece) == 'red' && targetRow == 7) {
                            // If the piece has reached the last row, add a class to make it a king
                            piece.classList.add('red-king-piece');
                        }
                        jumped = true;
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
            else {
                console.log('How did you get here? Please tell the dev if you see this.');
                return false;
            }
        }
        else if(getPieceColor(piece) == 'white' || getPieceColor(piece) == 'white-king'){
            if(Math.abs(currentRow - targetRow) == 2 && Math.abs(currentCol - targetCol) == 2){
                const jumpedRow = (currentRow + targetRow) / 2;
                const jumpedCol = (currentCol + targetCol) / 2;

                // Directly access the square at the jumped-over position
                const jumpedSquare = document.querySelector(`#board > div:nth-child(${jumpedRow * 8 + jumpedCol + 1})`);

                if (jumpedSquare.children.length > 0) {
                    // There's a piece at the jumped-over position
                    const jumpedPiece = jumpedSquare.children[0];

                    if (getPieceColor(jumpedPiece) == 'red' || getPieceColor(jumpedPiece) == 'red-king') {
                        // Valid jump, opponent's piece is between current and target positions
                        console.log("Jumping over an opponent's piece is valid.");
                        jumpedSquare.removeChild(jumpedPiece);

                        if (getPieceColor(piece) == 'white' && targetRow == 0) {
                            // If the piece has reached the last row, add a class to make it a king
                            piece.classList.add('white-king-piece');
                        }
                        jumped = true;
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
            else {
                console.log('How did you get here? Please tell the dev if you see this.');
                return false;
            }
        }
    }


    function isValidSquare(currentRow, currentCol, targetRow, targetCol, piece) {
        //for red's turn
        if(getPieceColor(piece) == 'red' || getPieceColor(piece) == 'red-king'){
            if(turn){
                console.log("It's not your turn.");
                return false;
            }
            else if((targetRow + targetCol) % 2 == 0){
                console.log('Invalid move: Cannot move to a red space.');
                return false;
            }
            else if(currentRow > targetRow && getPieceColor(piece) != 'red-king'){
                // Doesn't tigger if the piece is a king as they can move backwards
                console.log('Invalid move: cannot move backwards.');
                return false;
            }

            // Checks if the target tile is exactly 2 diagonal titles from original piece
            else if(Math.abs(currentRow - targetRow) == 2 && Math.abs(currentCol - targetCol) == 2){

                const jumpedRow = (currentRow + targetRow) / 2;
                const jumpedCol = (currentCol + targetCol) / 2;

                // Directly access the square at the jumped-over position
                const jumpedSquare = document.querySelector(`#board > div:nth-child(${jumpedRow * 8 + jumpedCol + 1})`);

                if (jumpedSquare.children.length > 0) {
                    // There's a piece at the jumped-over position
                    const jumpedPiece = jumpedSquare.children[0];

                    if (getPieceColor(jumpedPiece) == 'white' || getPieceColor(jumpedPiece) == 'white-king') {
                        // Valid jump, opponent's piece is between current and target positions
                        console.log("Jumping over an opponent's piece is valid.");
                        jumpedSquare.removeChild(jumpedPiece);

                        if (getPieceColor(piece) == 'red' && targetRow == 7) {
                            // If the piece has reached the last row, add a class to make it a king
                            piece.classList.add('red-king-piece');
                        }
                        jumped = true;
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
            // Checks to see if the target tile is more than 1 tile away
            else if(Math.abs(currentRow - targetRow) != 1 || Math.abs(currentCol - targetCol) != 1){
                console.log('Invalid move: Target tile too far.');
                return false;
            }
            else {
                console.log('Destination square is valid.');
                if (getPieceColor(piece) == 'red' && targetRow == 7) {
                    // If the piece has reached the last row, add a class to make it a king
                    piece.classList.add('red-king-piece');
                }
                turn = !turn; // Ends turn
                if(turn){
                    console.log("White's turn");
                }
                else{
                    console.log("Red's turn");
                }
                return true;
            }
        }


        // For white's turn
        else if(getPieceColor(piece) == 'white' || getPieceColor(piece) == 'white-king'){
            if(!turn){
                console.log("It's not your turn.");
                return false;
            }
            else if((targetRow + targetCol) % 2 == 0){
                console.log('Invalid move: Cannot move to a red space.');
                return false;
            }
            else if(currentRow < targetRow && getPieceColor(piece) != 'white-king'){
                // Doesn't tigger if the piece is a king as they can move backwards
                console.log('Invalid move: cannot move backwards.');
                return false;
            }
            // Checks if the target tile is exactly 2 diagonal titles from original piece
            else if(Math.abs(currentRow - targetRow) == 2 && Math.abs(currentCol - targetCol) == 2){
                const jumpedRow = (currentRow + targetRow) / 2;
                const jumpedCol = (currentCol + targetCol) / 2;

                // Directly access the square at the jumped-over position
                const jumpedSquare = document.querySelector(`#board > div:nth-child(${jumpedRow * 8 + jumpedCol + 1})`);

                if (jumpedSquare.children.length > 0) {
                    // There's a piece at the jumped-over position
                    const jumpedPiece = jumpedSquare.children[0];

                    if (getPieceColor(jumpedPiece) == 'red' || getPieceColor(jumpedPiece) == 'red-king') {
                        // Valid jump, opponent's piece is between current and target positions
                        console.log("Jumping over an opponent's piece is valid.");
                        jumpedSquare.removeChild(jumpedPiece);

                        if (getPieceColor(piece) == 'white' && targetRow == 0) {
                            // If the piece has reached the last row, add a class to make it a king
                            piece.classList.add('white-king-piece');
                        }
                        jumped = true;
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
            // Checks to see if the target tile is more than 1 tile away
            else if(Math.abs(currentRow - targetRow) != 1 || Math.abs(currentCol - targetCol) != 1){
                console.log('Invalid move: Target tile too far.');
                return false;
            }
            else{
                console.log('Destination square is valid.');
                if (getPieceColor(piece) == 'white' && targetRow == 0) {
                    // If the piece has reached the last row, add a class to make it a king
                    piece.classList.add('white-king-piece');
                }
                turn = !turn; // Ends turn
                if(turn){
                    console.log("White's turn");
                }
                else{
                    console.log("Red's turn");
                }
                return true;
            }
        }
        else{
            // This should be impossible to reach. If this happens, tell me ASAP
            console.log('How did you get here? Please tell the dev if you see this.');
            return false;
        }
    }

    function hasValidJumps(row, col, piece){
        const pieceColor = getPieceColor(piece);
        // for white pieces
        if(pieceColor == 'white' || pieceColor == 'white-king'){
            if(row - 2 >= 0 && col - 2 >= 0){
                const square = document.querySelector(`#board > div:nth-child(${(row - 1) * 8 + (col - 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'red' || getPieceColor(piece2) == 'red-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row - 2) * 8 + (col - 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
            if(row - 2 >= 0 && col + 2 < 8){
                const square = document.querySelector(`#board > div:nth-child(${(row - 1) * 8 + (col + 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'red' || getPieceColor(piece2) == 'red-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row - 2) * 8 + (col + 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
            if(row + 2 < 8 && col - 2 >= 0 && pieceColor == 'white-king'){
                const square = document.querySelector(`#board > div:nth-child(${(row + 1) * 8 + (col - 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'red' || getPieceColor(piece2) == 'red-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row + 2) * 8 + (col - 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
            if(row + 2 < 8 && col + 2 < 8 && pieceColor == 'white-king'){
                const square = document.querySelector(`#board > div:nth-child(${(row + 1) * 8 + (col + 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'red' || getPieceColor(piece2) == 'red-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row + 2) * 8 + (col + 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
        }
        // for red pieces
        else if(pieceColor == 'red' || pieceColor == 'red-king'){
            if(row + 2 < 8 && col + 2 < 8){
                const square = document.querySelector(`#board > div:nth-child(${(row + 1) * 8 + (col + 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'white' || getPieceColor(piece2) == 'white-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row + 2) * 8 + (col + 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
            if(row + 2 < 8 && col - 2 >= 0){
                const square = document.querySelector(`#board > div:nth-child(${(row + 1) * 8 + (col - 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'white' || getPieceColor(piece2) == 'white-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row + 2) * 8 + (col - 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
            if(row - 2 >= 0 && col + 2 < 8 && pieceColor == 'red-king'){
                const square = document.querySelector(`#board > div:nth-child(${(row - 1) * 8 + (col + 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'white' || getPieceColor(piece2) == 'white-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row - 2) * 8 + (col + 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
            if(row - 2 >= 0 && col - 2 >= 0 && pieceColor == 'red-king'){
                const square = document.querySelector(`#board > div:nth-child(${(row - 1) * 8 + (col - 1) + 1})`);
                if (square.children.length > 0) {
                    const piece2 = square.children[0];
                    if(getPieceColor(piece2) == 'white' || getPieceColor(piece2) == 'white-king'){
                        const square2 = document.querySelector(`#board > div:nth-child(${(row - 2) * 8 + (col - 2) + 1})`);
                        if (square2.children.length == 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }


    // Returns piece color
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
    // An attempt to add drag and drop. breaks if removed
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

// Adds a piece of the specified color at the provided location
function addPiece(row, col, color) {
    const piece = document.createElement("div");
    piece.className = `piece ${color}-piece`;
    piece.draggable = false;
    document.querySelector(`#board > div:nth-child(${row * 8 + col + 1})`).appendChild(piece);
}
