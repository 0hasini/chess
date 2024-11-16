class ChessFigure {
    constructor(position, color, boardSelector) {
        this.position = position; 
        this.color = color; 
        this.board = document.querySelector('#chess-board'); // Set board reference directly
        this.cols = ["H", "G", "F", "E", "D", "C", "B", "A"]
    }

    getSquare(position) {
        const postionVal=this.cols[position[0]];
        const positionCol=position[1]+1;
        const result=postionVal+positionCol;
        console.log("Result ",result);
        return this.board.querySelector(`[data-cell="${result}"]`);
    }

    isWithinBoard(position) {
        const [file, rank] = position;
        return file >= 0 && file <= 7 && rank >= 0 && rank <= 7;
    }

    isOpponentPiece(square) {
        const piece = square.querySelector('.chess-piece');
        return piece && piece.dataset.color !== this.color;
    }

    isSameColorPiece(square) {
        const piece = square.querySelector('.chess-piece');
        return piece && piece.dataset.color === this.color;
    }
}


class Pawn extends ChessFigure {
  move(toPosition) {
      const [targetFile, targetRank] = toPosition;
      const [currentFile, currentRank] = this.position;
      const fileDiff = Math.abs(targetFile - currentFile);
      const rankDiff = targetRank - currentRank;
      
      const forward = this.color === 'white' ? 1 : -1;
      const initialRank = this.color === 'white' ? 1 : 6;

      const targetSquare = this.getSquare(toPosition);

      // Single move forward
      const isSingleMove = fileDiff === 0 && rankDiff === forward && !targetSquare.querySelector('.chess-piece');

      // Double move forward on initial rank
      const isInitialDoubleMove = fileDiff === 0 && rankDiff === 2 * forward && currentRank === initialRank &&
                                  !this.getSquare([currentFile, currentRank + forward]).querySelector('.chess-piece') &&
                                  !targetSquare.querySelector('.chess-piece');
      
      // Capture move diagonally
      const isCaptureMove = fileDiff === 1 && rankDiff === forward && targetSquare && this.isOpponentPiece(targetSquare);

      if (isSingleMove || isInitialDoubleMove || isCaptureMove) {
          this.position = toPosition;
          console.log("Pawn moved to", toPosition);
          return this.position;
      } else {
          console.log("Invalid move for the pawn");
          return null;
      }
  }

  // Helper method to check if a piece on a square is an opponent
  isOpponentPiece(square) {
      const pieceOnSquare = square.querySelector('.chess-piece');
      if (pieceOnSquare) {
          const pieceColor = pieceOnSquare.getAttribute('data-color');
          return pieceColor !== this.color;
      }
      return false;
  }
}


class Rook extends ChessFigure {
  move(toPosition) {
      const [targetFile, targetRank] = toPosition;
      const [currentFile, currentRank] = this.position;

      const fileDiff = targetFile - currentFile;
      const rankDiff = targetRank - currentRank;

      // Check if the move is horizontal or vertical
      if ((fileDiff !== 0 && rankDiff === 0) || (fileDiff === 0 && rankDiff !== 0)) {
          const stepFile = fileDiff === 0 ? 0 : (fileDiff > 0 ? 1 : -1);
          const stepRank = rankDiff === 0 ? 0 : (rankDiff > 0 ? 1 : -1);

          let f = currentFile + stepFile;
          let r = currentRank + stepRank;

          // Traverse the path to check for obstacles
          while (f !== targetFile || r !== targetRank) {
              const square = this.getSquare([f, r]);
              const pieceOnSquare = square.querySelector('.chess-piece');

              if (pieceOnSquare) {
                  const pieceColor = pieceOnSquare.getAttribute('data-color');
                  
                  // Path is blocked by a piece of the same color
                  if (pieceColor === this.color) {
                      console.log("Path blocked by a piece of the same color");
                      return null;
                  } else if (f === targetFile && r === targetRank) {
                      // Capture opponent's piece at the target position
                      this.position = toPosition;
                      console.log("Rook captured opponent at", toPosition);
                      return this.position;
                  } else {
                      console.log("Path blocked by opponent's piece before reaching target");
                      return null;
                  }
              }

              f += stepFile;
              r += stepRank;
          }

          // Move rook to the target position
          this.position = toPosition;
          console.log("Rook moved to", toPosition);
          return this.position;
      }

      // Invalid move for the rook if not a straight line
      console.log("Invalid move for the rook");
      return null;
  }
}

class Knight extends ChessFigure {
  move(toPosition) {
      const [targetFile, targetRank] = toPosition;
      const [currentFile, currentRank] = this.position;

      const fileDiff = Math.abs(targetFile - currentFile);
      const rankDiff = Math.abs(targetRank - currentRank);

      if ((fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2)) {
          const targetSquare = this.getSquare(toPosition);
          const pieceOnSquare = targetSquare.querySelector('.chess-piece');

          if (pieceOnSquare) {
              const pieceColor = pieceOnSquare.getAttribute('data-color');

              if (pieceColor === this.color) {
                  console.log("Cannot capture own piece");
                  return null;
              } else {
                  this.position = toPosition;
                  console.log("Knight captured opponent at", toPosition);
                  return this.position;
              }
          }

          this.position = toPosition;
          console.log("Knight moved to", toPosition);
          return this.position;
      }

      console.log("Invalid move for the knight");
      return null;
  }
}





class Bishop extends ChessFigure {
  move(toPosition) {
      const [targetFile, targetRank] = toPosition;
      const [currentFile, currentRank] = this.position;

      const fileDiff = Math.abs(targetFile - currentFile);
      const rankDiff = Math.abs(targetRank - currentRank);

      if (fileDiff === rankDiff) {  
          const stepFile = targetFile > currentFile ? 1 : -1;
          const stepRank = targetRank > currentRank ? 1 : -1;

          let f = currentFile + stepFile;
          let r = currentRank + stepRank;

          while (f !== targetFile || r !== targetRank) {
              const square = this.getSquare([f, r]);
              const pieceOnSquare = square.querySelector('.chess-piece');

              if (pieceOnSquare) {
                  const pieceColor = pieceOnSquare.getAttribute('data-color');
                  
                  if (pieceColor === this.color) {
                      console.log("Path blocked by a piece of the same color");
                      return null;  // Blocked by same color piece
                  } else if (f === targetFile && r === targetRank) {
                      this.position = toPosition;
                      console.log("Bishop captured opponent at", toPosition);
                      return this.position;
                  } else {
                      console.log("Path blocked by opponent's piece before reaching target");
                      return null;
                  }
              }
              f += stepFile;
              r += stepRank;
          }

          this.position = toPosition;
          console.log("Bishop moved to", toPosition);
          return this.position;
      }

      console.log("Invalid move for the bishop");
      return null;
  }
}


class Queen extends ChessFigure {
  move(toPosition) {
      const [targetFile, targetRank] = toPosition;
      const [currentFile, currentRank] = this.position;

      const fileDiff = Math.abs(targetFile - currentFile);
      const rankDiff = Math.abs(targetRank - currentRank);

      // Check for horizontal, vertical, or diagonal movement
      if (fileDiff === 0 || rankDiff === 0 || fileDiff === rankDiff) {
          const stepFile = fileDiff === 0 ? 0 : (targetFile > currentFile ? 1 : -1);
          const stepRank = rankDiff === 0 ? 0 : (targetRank > currentRank ? 1 : -1);

          let f = currentFile + stepFile;
          let r = currentRank + stepRank;

          // Traverse the path to check for obstacles before the target position
          while (f !== targetFile || r !== targetRank) {
              const square = this.getSquare([f, r]);
              const pieceOnSquare = square.querySelector('.chess-piece');

              if (pieceOnSquare) {
                  const pieceColor = pieceOnSquare.getAttribute('data-color');

                  // If path is blocked by a piece of the same color
                  if (pieceColor === this.color) {
                      console.log("Path blocked by a piece of the same color");
                      return null;
                  } else {
                      console.log("Path blocked by opponent's piece before reaching target");
                      return null;
                  }
              }

              // Move to the next square along the path
              f += stepFile;
              r += stepRank;
          }

          // Check if the destination square is empty or occupied by an opponent
          const targetSquare = this.getSquare(toPosition);
          const targetPiece = targetSquare.querySelector('.chess-piece');
          
          if (!targetPiece || targetPiece.getAttribute('data-color') !== this.color) {
              // Move the Queen to the target position
              this.position = toPosition;
              console.log("Queen moved to", toPosition);
              return this.position;
          } else {
              console.log("Path blocked by a piece of the same color at target");
              return null;
          }
      }

      // If move is not valid (not horizontal, vertical, or diagonal)
      console.log("Invalid move for the queen");
      return null;
  }
}


class King extends ChessFigure {
    move(toPosition) {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;

        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if (fileDiff <= 1 && rankDiff <= 1) {
            const targetSquare = this.getSquare(toPosition);
            if (!targetSquare || !this.isSameColorPiece(targetSquare)) {
                this.position = toPosition;
                console.log("King moved to", toPosition);
                return this.position;
            }
        }
        console.log("Invalid move for the king");
        return null;
    }
}




  
  class ChessBoard {
    constructor(basePath, boardSelector) {
      this.basePath = basePath || './images/';
      this.board = document.querySelector(boardSelector);
      this.pieces = this.initializePieces();
      this.cols = ["H", "G", "F", "E", "D", "C", "B", "A"];
      this.selectedPiece = null; 
      this.currentTurn = "white";
    }
  
    initializePieces() {
      return {
        black: {
          rook1: { pos: 'A8', imgSrc: `${this.basePath}bR.png` },
          knight1: { pos: 'B8', imgSrc: `${this.basePath}bN.png` },
          bishop1: { pos: 'C8', imgSrc: `${this.basePath}bB.png` },
          queen: { pos: 'D8', imgSrc: `${this.basePath}bQ.png` },
          king: { pos: 'E8', imgSrc: `${this.basePath}bK.png` },
          bishop2: { pos: 'F8', imgSrc: `${this.basePath}bB.png` },
          knight2: { pos: 'G8', imgSrc: `${this.basePath}bN.png` },
          rook2: { pos: 'H8', imgSrc: `${this.basePath}bR.png` },
          pawn1: { pos: 'A7', imgSrc: `${this.basePath}bP.png` },
          pawn2: { pos: 'B7', imgSrc: `${this.basePath}bP.png` },
          pawn3: { pos: 'C7', imgSrc: `${this.basePath}bP.png` },
          pawn4: { pos: 'D7', imgSrc: `${this.basePath}bP.png` },
          pawn5: { pos: 'E7', imgSrc: `${this.basePath}bP.png` },
          pawn6: { pos: 'F7', imgSrc: `${this.basePath}bP.png` },
          pawn7: { pos: 'G7', imgSrc: `${this.basePath}bP.png` },
          pawn8: { pos: 'H7', imgSrc: `${this.basePath}bP.png` }
        },
        white: {
          rook1: { pos: 'A1', imgSrc: `${this.basePath}wR.png` },
          knight1: { pos: 'B1', imgSrc: `${this.basePath}wN.png` },
          bishop1: { pos: 'C1', imgSrc: `${this.basePath}wB.png` },
          queen: { pos: 'D1', imgSrc: `${this.basePath}wQ.png` },
          king: { pos: 'E1', imgSrc: `${this.basePath}wK.png` },
          bishop2: { pos: 'F1', imgSrc: `${this.basePath}wB.png` },
          knight2: { pos: 'G1', imgSrc: `${this.basePath}wN.png` },
          rook2: { pos: 'H1', imgSrc: `${this.basePath}wR.png` },
          pawn1: { pos: 'A2', imgSrc: `${this.basePath}wP.png` },
          pawn2: { pos: 'B2', imgSrc: `${this.basePath}wP.png` },
          pawn3: { pos: 'C2', imgSrc: `${this.basePath}wP.png` },
          pawn4: { pos: 'D2', imgSrc: `${this.basePath}wP.png` },
          pawn5: { pos: 'E2', imgSrc: `${this.basePath}wP.png` },
          pawn6: { pos: 'F2', imgSrc: `${this.basePath}wP.png` },
          pawn7: { pos: 'G2', imgSrc: `${this.basePath}wP.png` },
          pawn8: { pos: 'H2', imgSrc: `${this.basePath}wP.png` }
        }
      };
    }
  
    createBoard() {
      for (let i = 1; i <= 64; i++) {
        let row = Math.floor((64 - i) / 8) + 1;
        let col = (8 * (9 - row)) - i + 1;
        let color = (row % 2 === 0) ? (i % 2 === 0 ? "black" : "white") : (i % 2 === 0 ? "white" : "black");
        this.board.insertAdjacentHTML('beforeend', `<div class="square ${color}" data-cell="${this.cols[col - 1]}${row}"></div>`);
      }
    }
  
    setPieces() {
      this.mapPieces(this.pieces.black, "black");
      this.mapPieces(this.pieces.white, "white");
    }
  
    mapPieces(pieces, color) {
      for (let key in pieces) {
        let { pos, imgSrc } = pieces[key];
        let square = this.board.querySelector(`.square[data-cell="${pos}"]`);
        if (square) {
          square.insertAdjacentHTML('beforeend', `<div class="chess-piece" data-piece="${key}" data-color="${color}" data-position="${pos}">
            <img src="${imgSrc}" alt="${key}" class="piece-icon"/>
          </div>`);
        }
      }
    }
  
    addPieceClickListener() {
      this.board.addEventListener('click', (event) => {
        const piece = event.target.closest('.chess-piece');
        if (piece) {
          const pieceName = piece.getAttribute('data-piece');
          const pieceColor = piece.getAttribute('data-color');
          const piecePosition = piece.getAttribute('data-position');
          if(pieceColor!=this.currentTurn)return;
          console.log("selected piece ",this.selectedPiece);

          if(pieceColor==this.currentTurn){
            this.selectedPiece = { name: pieceName, color: pieceColor, position: piecePosition };
            console.log(`Piece clicked: ${pieceName}`);
            console.log(`Color: ${pieceColor}`);
            console.log(`Position: ${piecePosition}`);
            console.log("TURN ",this.currentTurn)
            this.addMoveClickListener();
            console.log("update selectedPiece ",this.selectedPiece);
          }
        }
      });
    }
  
    addMoveClickListener() {
      this.board.addEventListener('click', (event) => {
        const targetSquare = event.target.closest('.square');
        if (!targetSquare) return;
        console.log("checking target Square ",targetSquare)
        const targetPosition = targetSquare.getAttribute('data-cell');
        // console.log("TURN ",this.currentTurn);
        // If a piece is selected, validate its move
        if (this.selectedPiece) {
          const { name, color, position } = this.selectedPiece;
  
          let chessPiece;
          if (name.includes('pawn')) {
            chessPiece = new Pawn(this.convertPositionToCoordinates(position), color);  // Create Pawn instance
          } else if (name.includes('bishop')) {
            chessPiece = new Bishop(this.convertPositionToCoordinates(position), color);  // Create Bishop instance
          } else if (name.includes('rook')) {
            chessPiece = new Rook(this.convertPositionToCoordinates(position), color);  // Create Rook instance
          } else if (name.includes('knight')) {
            chessPiece = new Knight(this.convertPositionToCoordinates(position), color);  // Create Knight instance
          } else if (name.includes('queen')) {
            chessPiece = new Queen(this.convertPositionToCoordinates(position), color);  // Create Queen instance
          } else if (name.includes('king')) {
            chessPiece = new King(this.convertPositionToCoordinates(position), color);  // Create King instance
          }
  
        //   chessPiece.move(targetPosition); // Call the move function
        if (chessPiece) {
           const movePossible= chessPiece.move(this.convertPositionToCoordinates(targetPosition));
           if(movePossible) {
            this.updatePiecePosition(targetPosition);
            // if (movePossible) {
            //     this.updatePiecePosition(targetPosition);
            //   } 
        } 
          }
        }
      });
    }

    convertPositionToCoordinates(position) {
        const file = this.cols.indexOf(position[0]); // Get the column index from A-H
        const rank = parseInt(position[1]) - 1; // Get the row index (0-7), subtracting 1 for 0-based indexing
        return [file, rank];
      }

      updatePiecePosition(newPosition) {
        console.log("New position in posChange ",newPosition);
        const square = this.board.querySelector(`.square[data-cell="${newPosition}"]`); // Find the target square
        console.log("square detail ",square);
        if (square && this.selectedPiece) { // Check if square and piece are valid
            const { name, color } = this.selectedPiece; // Destructure name and color from the selected piece
    
            // Remove piece from its current square
            const currentSquare = this.board.querySelector(`.square[data-cell="${this.selectedPiece.position}"]`);
            if (currentSquare) {
                const pieceElement = currentSquare.querySelector(`[data-piece="${name}"]`);
                if (pieceElement) {
                    pieceElement.remove(); // Remove the piece element from the current square
                }
            }
    
            // Check if there's an opponent piece in the target square and remove it
            const targetPiece = square.querySelector('.chess-piece');
            console.log("target Piece to be remove ",targetPiece);
            if (targetPiece && targetPiece.getAttribute('data-color') !== color) {
              if(targetPiece.getAttribute('data-piece')=='king'){
                targetPiece.remove(); // Remove the opponent piece
                alert(`${this.currentTurn} Wins`)
                const allPieces = this.board.querySelectorAll('.chess-piece');
                allPieces.forEach(piece => piece.remove());

                // Reinitialize the pieces and board
                this.pieces = this.initializePieces();
                this.board.innerHTML = ''; // Clear the board
                this.createBoard(); // Recreate the board
                this.setPieces(); // Place the pieces back on the board
                this.currentTurn = 'white'; // Reset the turn
                return;
              }
              targetPiece.remove(); // Remove the opponent piece
                console.log(`Captured ${targetPiece.getAttribute('data-piece')} at ${newPosition}`);
            }
    
            // Update selected piece's position in the internal state
            this.pieces[color][name].pos = newPosition; // Update position in pieces object
            this.selectedPiece.position = newPosition; // Update selectedPiece's position
    
            // Add the piece element to the target square
            square.insertAdjacentHTML('beforeend', `
                <div class="chess-piece" data-piece="${name}" data-color="${color}" data-position="${newPosition}">
                    <img src="${this.pieces[color][name].imgSrc}" alt="${name}" class="piece-icon"/>
                </div>
            `);
    
            console.log(`${name} moved to ${newPosition}`);
            this.selectedPiece = null; // Reset the selected piece
            setTimeout(() => {
              this.currentTurn = this.currentTurn === "white" ? "black" : "white"; // Switch turns
            }, 500);

        }
    }
    
    
      
  }
  
  
  // Initialize the ChessBoard class
  const chessBoard = new ChessBoard('./images/', '#chess-board');
  chessBoard.createBoard();
  chessBoard.setPieces();
  chessBoard.addPieceClickListener(); // Add the click event listener
  