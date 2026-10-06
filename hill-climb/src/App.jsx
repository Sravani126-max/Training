import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  const game = useRef({
    car: {
      x: 150,
      y: 250,
      width: 60,
      height: 30,
      velocityY: 0,
      rotation: 0,
    },

    cameraX: 0,
    speed: 0,

    keys: {
      left: false,
      right: false,
    },

    terrain: [],
    coins: [],
    fuelCans: [],
  });

  // Generate terrain
  function generateTerrain() {
    const terrain = [];

    for (let x = 0; x < 5000; x += 20) {
      const y =
        350 +
        Math.sin(x * 0.01) * 50 +
        Math.sin(x * 0.025) * 25;

      terrain.push({ x, y });
    }

    game.current.terrain = terrain;
  }

  // Generate coins
  function generateCoins() {
    const newCoins = [];

    for (let i = 300; i < 5000; i += 300) {
      newCoins.push({
        x: i,
        y: 250 + Math.random() * 50,
        collected: false,
      });
    }

    game.current.coins = newCoins;
  }

  // Generate fuel cans
  function generateFuel() {
    const newFuel = [];

    for (let i = 600; i < 5000; i += 900) {
      newFuel.push({
        x: i,
        y: 250,
        collected: false,
      });
    }

    game.current.fuelCans = newFuel;
  }

  // Get terrain height
  function getTerrainY(x) {
    const terrain = game.current.terrain;

    if (x < 0 || x >= terrain.length * 20) {
      return 400;
    }

    const index = Math.floor(x / 20);

    return terrain[index]?.y || 400;
  }

  // Keyboard controls
  useEffect(() => {
    function keyDown(event) {
      if (event.key === "ArrowRight") {
        game.current.keys.right = true;
      }

      if (event.key === "ArrowLeft") {
        game.current.keys.left = true;
      }
    }

    function keyUp(event) {
      if (event.key === "ArrowRight") {
        game.current.keys.right = false;
      }

      if (event.key === "ArrowLeft") {
        game.current.keys.left = false;
      }
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  // Start game
  useEffect(() => {
    generateTerrain();
    generateCoins();
    generateFuel();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;

    function gameLoop() {
      if (gameOver) return;

      update();
      draw();

      animationFrame = requestAnimationFrame(gameLoop);
    }

    function update() {
      const state = game.current;
      const car = state.car;

      // Acceleration
      if (state.keys.right) {
        state.speed += 0.08;
      }

      // Brake / reverse
      if (state.keys.left) {
        state.speed -= 0.08;
      }

      // Friction
      state.speed *= 0.98;

      // Limit speed
      state.speed = Math.max(-3, Math.min(state.speed, 6));

      // Move car
      car.x += state.speed;

      // Gravity
      car.velocityY += 0.5;
      car.y += car.velocityY;

      // Terrain collision
      const groundY = getTerrainY(car.x);

      if (car.y + car.height / 2 >= groundY) {
        car.y = groundY - car.height / 2;
        car.velocityY = 0;
      }

      // Calculate car rotation based on terrain
      const frontY = getTerrainY(car.x + 30);
      const backY = getTerrainY(car.x - 30);

      car.rotation = Math.atan2(frontY - backY, 60);

      // Camera
      state.cameraX = car.x - 150;

      // Distance
      setScore(Math.floor(car.x / 10));

      // Fuel decreases
      if (Math.abs(state.speed) > 0.2) {
        setFuel((oldFuel) => Math.max(0, oldFuel - 0.01));
      }

      // Collect coins
      state.coins.forEach((coin) => {
        const distance = Math.sqrt(
          Math.pow(car.x - coin.x, 2) +
            Math.pow(car.y - coin.y, 2)
        );

        if (distance < 40 && !coin.collected) {
          coin.collected = true;
          setCoins((oldCoins) => oldCoins + 1);
        }
      });

      // Collect fuel
      state.fuelCans.forEach((can) => {
        const distance = Math.sqrt(
          Math.pow(car.x - can.x, 2) +
            Math.pow(car.y - can.y, 2)
        );

        if (distance < 40 && !can.collected) {
          can.collected = true;
          setFuel((oldFuel) => Math.min(100, oldFuel + 30));
        }
      });

      // Game over
      if (fuel <= 0 || car.y > 500) {
        setGameOver(true);
      }
    }

    function draw() {
      const state = game.current;
      const car = state.car;

      // Sky
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      ctx.fillStyle = "#FFD93D";
      ctx.beginPath();
      ctx.arc(700, 80, 45, 0, Math.PI * 2);
      ctx.fill();

      // Mountains
      ctx.fillStyle = "#8FB996";

      ctx.beginPath();
      ctx.moveTo(0, 300);

      for (let x = 0; x <= canvas.width; x += 50) {
        const y =
          250 +
          Math.sin((x + state.cameraX) * 0.01) * 40;

        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      // Ground
      ctx.fillStyle = "#7C5C3B";

      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        const worldX = x + state.cameraX;
        const terrainY = getTerrainY(worldX);

        ctx.lineTo(x, terrainY);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Grass
      ctx.strokeStyle = "#3A8F3A";
      ctx.lineWidth = 5;

      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 10) {
        const worldX = x + state.cameraX;
        const terrainY = getTerrainY(worldX);

        ctx.lineTo(x, terrainY);
      }

      ctx.stroke();

      // Coins
      state.coins.forEach((coin) => {
        if (coin.collected) return;

        const screenX = coin.x - state.cameraX;

        if (screenX < -30 || screenX > canvas.width + 30) {
          return;
        }

        ctx.fillStyle = "#FFD700";

        ctx.beginPath();
        ctx.arc(
          screenX,
          coin.y,
          12,
          0,
          Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#B8860B";
        ctx.font = "bold 14px Arial";
        ctx.fillText("$", screenX - 4, coin.y + 5);
      });

      // Fuel cans
      state.fuelCans.forEach((can) => {
        if (can.collected) return;

        const screenX = can.x - state.cameraX;

        ctx.fillStyle = "#E53935";

        ctx.fillRect(
          screenX - 12,
          can.y - 15,
          24,
          30
        );

        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.fillText("F", screenX - 5, can.y + 5);
      });

      // Car
      const screenCarX = car.x - state.cameraX;

      ctx.save();

      ctx.translate(
        screenCarX,
        car.y
      );

      ctx.rotate(car.rotation);

      // Car body
      ctx.fillStyle = "#E53935";

      ctx.fillRect(
        -30,
        -15,
        60,
        25
      );

      // Car roof
      ctx.fillStyle = "#B71C1C";

      ctx.fillRect(
        -15,
        -30,
        30,
        15
      );

      // Windows
      ctx.fillStyle = "#87CEEB";

      ctx.fillRect(
        -10,
        -27,
        20,
        10
      );

      // Wheels
      ctx.fillStyle = "#222";

      ctx.beginPath();
      ctx.arc(-20, 12, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(20, 12, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [gameOver]);

  // Restart
  function restartGame() {
    game.current.car = {
      x: 150,
      y: 250,
      width: 60,
      height: 30,
      velocityY: 0,
      rotation: 0,
    };

    game.current.speed = 0;
    game.current.cameraX = 0;

    generateTerrain();
    generateCoins();
    generateFuel();

    setScore(0);
    setCoins(0);
    setFuel(100);
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
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        h1 {
          color: white;
          margin-bottom: 15px;
          font-size: 38px;
        }

        .info {
          width: min(90vw, 900px);
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 10px;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        .fuel {
          width: 120px;
          height: 15px;
          background: #374151;
          border-radius: 10px;
          overflow: hidden;
        }

        .fuel-bar {
          height: 100%;
          background: #22c55e;
          transition: width 0.2s;
        }

        canvas {
          width: min(90vw, 900px);
          height: auto;
          border: 4px solid #374151;
          border-radius: 12px;
          display: block;
        }

        .controls {
          color: #d1d5db;
          margin-top: 15px;
          text-align: center;
        }

        .game-over {
          margin-top: 20px;
          text-align: center;
          color: white;
        }

        .game-over h2 {
          color: #ef4444;
          margin-bottom: 10px;
          font-size: 30px;
        }

        button {
          margin-top: 15px;
          padding: 12px 25px;
          border: none;
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
      `}</style>

      <h1>🏎️ Hill Climb</h1>

      <div className="info">
        <div>
          Distance: {score}m
        </div>

        <div>
          🪙 {coins}
        </div>

        <div>
          Fuel
          <div className="fuel">
            <div
              className="fuel-bar"
              style={{ width: `${fuel}%` }}
            ></div>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width="900"
        height="450"
      />

      {!gameOver && (
        <div className="controls">
          ⬅️ Left &nbsp;&nbsp; ➡️ Right
          <br />
          Use the arrow keys to control the car
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>

          <p>
            Distance: {score}m | Coins: {coins}
          </p>

          <button onClick={restartGame}>
            🔄 Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;