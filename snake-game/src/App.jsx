import { useEffect, useState } from "react";

function App() {
  const rows = 20;
  const cols = 20;

  const [snake, setSnake] = useState([
    { row: 10, col: 10 },
    { row: 10, col: 9 },
    { row: 10, col: 8 },
  ]);

  const [food, setFood] = useState({ row: 5, col: 5 });
  const [direction, setDirection] = useState({ row: 0, col: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Generate food at a random position
  function generateFood(currentSnake) {
    let newFood;

    do {
      newFood = {
        row: Math.floor(Math.random() * rows),
        col: Math.floor(Math.random() * cols),
      };
    } while (
      currentSnake.some(
        (part) =>
          part.row === newFood.row && part.col === newFood.col
      )
    );

    return newFood;
  }

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(event) {
      if (gameOver) return;

      if (event.key === "ArrowUp" && direction.row !== 1) {
        setDirection({ row: -1, col: 0 });
      }

      if (event.key === "ArrowDown" && direction.row !== -1) {
        setDirection({ row: 1, col: 0 });
      }

      if (event.key === "ArrowLeft" && direction.col !== 1) {
        setDirection({ row: 0, col: -1 });
      }

      if (event.key === "ArrowRight" && direction.col !== -1) {
        setDirection({ row: 0, col: 1 });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];

        const newHead = {
          row: head.row + direction.row,
          col: head.col + direction.col,
        };

        // Wall collision
        if (
          newHead.row < 0 ||
          newHead.row >= rows ||
          newHead.col < 0 ||
          newHead.col >= cols
        ) {
          setGameOver(true);
          return currentSnake;
        }

        // Self collision
        const hitSnake = currentSnake.some(
          (part) =>
            part.row === newHead.row &&
            part.col === newHead.col
        );

        if (hitSnake) {
          setGameOver(true);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Food collision
        if (
          newHead.row === food.row &&
          newHead.col === food.col
        ) {
          setScore((previousScore) => previousScore + 1);

          setFood(generateFood(newSnake));

          return newSnake;
        }

        // Remove tail if food was not eaten
        newSnake.pop();

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver]);

  // Restart game
  function restartGame() {
    const initialSnake = [
      { row: 10, col: 10 },
      { row: 10, col: 9 },
      { row: 10, col: 8 },
    ];

    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ row: 0, col: 1 });
    setScore(0);
    setGameOver(false);
  }

  return (
    <div className="game">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background: #111827;
        }

        .game {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          color: white;
        }

        h1 {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .score {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .board {
          width: min(90vw, 500px);
          aspect-ratio: 1;
          display: grid;
          grid-template-columns: repeat(20, 1fr);
          background: #1f2937;
          border: 4px solid #374151;
          border-radius: 10px;
          overflow: hidden;
        }

        .cell {
          border: 1px solid #293241;
        }

        .snake {
          background: #22c55e;
          border-radius: 4px;
        }

        .head {
          background: #16a34a;
          border-radius: 6px;
        }

        .food {
          background: #ef4444;
          border-radius: 50%;
          margin: 2px;
        }

        .game-over {
          margin-top: 20px;
          text-align: center;
        }

        .game-over h2 {
          color: #ef4444;
          margin-bottom: 12px;
        }

        button {
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          background: #22c55e;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        button:hover {
          background: #16a34a;
        }

        .controls {
          margin-top: 20px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        @media (max-width: 500px) {
          h1 {
            font-size: 32px;
          }

          .score {
            font-size: 18px;
          }
        }
      `}</style>

      <h1>🐍 Snake Game</h1>

      <div className="score">
        Score: <strong>{score}</strong>
      </div>

      <div className="board">
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;

          const isSnake = snake.some(
            (part) => part.row === row && part.col === col
          );

          const isHead =
            snake[0]?.row === row &&
            snake[0]?.col === col;

          const isFood =
            food.row === row &&
            food.col === col;

          let className = "cell";

          if (isSnake) {
            className += " snake";
          }

          if (isHead) {
            className += " head";
          }

          if (isFood) {
            className += " food";
          }

          return (
            <div
              key={index}
              className={className}
            ></div>
          );
        })}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>

          <br />

          <button onClick={restartGame}>
            Restart Game
          </button>
        </div>
      )}

      {!gameOver && (
        <div className="controls">
          Use ⬆️ ⬇️ ⬅️ ➡️ arrow keys to move
        </div>
      )}
    </div>
  );
}

export default App;