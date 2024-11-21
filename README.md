# Chess Game (HTML, CSS, JavaScript)

This is a fully functional Chess game built using HTML, CSS, and JavaScript, utilizing Object-Oriented Programming (OOP) principles for a clean and modular code. The game features all the classic rules and mechanics of chess, and is designed for two players on the same device.

## OOP Concepts Used

- **Encapsulation**: The game objects (pieces, board, etc.) are encapsulated in classes that manage their own state and behavior.
- **Abstraction**: The user interacts with the game through a simple interface, without needing to understand the internal workings of the game.
- **Inheritance**: Various chess pieces (like King, Queen, Rook, etc.) inherit from a base `Piece` class, allowing shared properties and methods.
- **Polymorphism**: Different chess pieces implement their specific movement logic, overriding the base methods to handle unique piece behavior.

## Requirements

To run this game, you only need a web browser. The game works in any modern browser such as Chrome, Firefox, or Edge.

## How to Run the Game

1. Clone or download this repository to your local machine.
2. Open the `index.html` file in your web browser.

The game board will load, and you can start playing immediately.

## How to Play

- The game is for two players.
- Each player takes turns to move their pieces.
- The game ends when one player checkmates the other, or if there is a stalemate.
- Use the mouse to click on a piece, then click on the target square to make a move.
- The game will display a message when checkmate or stalemate occurs.

## Features

- Classic chess rules: Each piece has its unique movement and behavior.
- Player vs. Player gameplay on the same device.
- Valid moves checking: Only valid moves are allowed.
- Game status messages (Check, Checkmate, Stalemate).
- Object-Oriented structure with encapsulated game logic and UI components.

Enjoy the game!
