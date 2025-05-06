import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Anaglam" },
  { name: "description", content: "Anaglam (inspired by bananagrams)" },
];

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(10);
  // A=13, B=3, C=3, D=6, E=18, F=3, G=4, H=3, I=12, J=2, K=2, L=5, M=3, N=8, O=11, P=3, Q=2, R=9, S=6, T=9, U=6, V=3, W=3, X=2, Y=3, Z=2.
  const [pool, setPool] = useState<Record<string, number>>({
    A: 13,
    B: 3,
    C: 3,
    D: 6,
    E: 18,
    F: 3,
    G: 4,
    H: 3,
    I: 12,
    J: 2,
    K: 2,
    L: 5,
    M: 3,
    N: 8,
    O: 11,
    P: 3,
    Q: 2,
    R: 9,
    S: 6,
    T: 9,
    U: 6,
    V: 3,
    W: 3,
    X: 2,
    Y: 3,
    Z: 2,
  });
  const [tiles, setTiles] = useState<
    {
      id: number;
      letter: string;
      row: number;
      col: number;
      isOnGrid: boolean;
    }[]
  >([]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const generateTiles = () => {
    const newTiles = [];
    const localPool = { ...pool }; // Create a local copy of the pool

    const expandedLetters = Object.keys(localPool).reduce(
      (acc: string[], letter) => {
        const count = localPool[letter];
        for (let i = 0; i < count; i++) {
          acc.push(letter);
        }
        return acc;
      },
      [],
    );

    // Shuffle the expanded letters array
    for (let i = expandedLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [expandedLetters[i], expandedLetters[j]] = [
        expandedLetters[j],
        expandedLetters[i],
      ];
    }

    while (newTiles.length < 21) {
      const randomIndex = Math.floor(Math.random() * expandedLetters.length);
      const letter = expandedLetters[randomIndex];

      if (localPool[letter] > 0) {
        newTiles.push({
          id: newTiles.length,
          letter: letter,
          row: -1,
          col: -1,
          isOnGrid: false,
        });
        localPool[letter] -= 1; // Update the local pool
      }
    }

    setPool(localPool); // Update the pool state once after the loop
    setTiles(newTiles); // Update the tiles state
  };

  useEffect(() => {
    generateTiles();
  }, []);

  const revealNewTile = () => {
    const expandedLetters = Object.keys(pool).reduce(
      (acc: string[], letter) => {
        const count = pool[letter];
        for (let i = 0; i < count; i++) {
          acc.push(letter);
        }
        return acc;
      },
      [],
    );

    // Shuffle the expanded letters array
    for (let i = expandedLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [expandedLetters[i], expandedLetters[j]] = [
        expandedLetters[j],
        expandedLetters[i],
      ];
    }

    const randomIndex = Math.floor(Math.random() * expandedLetters.length);
    const letter = expandedLetters[randomIndex];
    setPool((prevPool) => ({
      ...prevPool,
      [letter]: prevPool[letter] - 1,
    }));
    setTiles((prevTiles) => [
      ...prevTiles,
      { id: tiles.length, letter: letter, row: -1, col: -1, isOnGrid: false },
    ]);
  };

  const expandGrid = (direction: "top" | "bottom" | "left" | "right") => {
    if (direction === "top" || direction === "bottom") {
      if (rowCount < 144) setRowCount(rowCount + 1);
      if (direction === "top") {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => ({ ...tile, col: tile.col + 1 })),
        );
      }
    } else if (direction === "left" || direction === "right") {
      if (colCount < 144) setColCount(colCount + 1);
      if (direction === "left") {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => ({ ...tile, row: tile.row + 1 })),
        );
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, tileId: number) => {
    e.dataTransfer.setData("tileId", tileId.toString());
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    const tileId = parseInt(e.dataTransfer.getData("tileId"), 10);
    setTiles((prevTiles) =>
      prevTiles.map((tile) => {
        if (tile.id === tileId) {
          return { ...tile, row: col, col: row, isOnGrid: true };
        }
        if (
          tile.id !== tileId &&
          tile.isOnGrid &&
          tile.row === col &&
          tile.col === row
        ) {
          return { ...tile, isOnGrid: false };
        }
        return tile;
      }),
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 transition-colors">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-current flex items-center justify-center transition duration-300 hover:rotate-180"
        aria-label="Toggle dark mode"
      >
        <span className="text-xl">{isDarkMode ? "🌞" : "🌙"}</span>
      </button>

      <div className="grid-container relative">
        <div
          className={`grid gap-1 border border-gray-300`}
          style={{
            gridTemplateColumns: `repeat(${colCount}, 2.5rem)`,
            gridTemplateRows: `repeat(${rowCount}, 2.5rem)`,
          }}
        >
          {Array.from({ length: rowCount * colCount }).map((_, index) => {
            const row = Math.floor(index / colCount);
            const col = index % colCount;
            return (
              <div
                key={index}
                className="w-10 h-10 border border-gray-400 flex items-center justify-center bg-white"
                onDrop={(e) => handleDrop(e, row, col)}
                onDragOver={handleDragOver}
                style={{
                  backgroundColor: tiles.find(
                    (tile) =>
                      tile.isOnGrid && tile.row === col && tile.col === row,
                  )
                    ? "lightblue"
                    : "white",
                }}
                draggable={
                  tiles.find(
                    (tile) =>
                      tile.isOnGrid && tile.row === col && tile.col === row,
                  ) !== undefined
                }
                onDragStart={(e) =>
                  handleDragStart(
                    e,
                    tiles.find(
                      (tile) =>
                        tile.isOnGrid && tile.row === col && tile.col === row,
                    )?.id ?? -1,
                  )
                }
              >
                {
                  tiles.find(
                    (tile) =>
                      tile.isOnGrid && tile.row === col && tile.col === row,
                  )?.letter
                }
              </div>
            );
          })}
        </div>
        <button
          onClick={() => expandGrid("top")}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-200 p-2 rounded-full"
          aria-label="Expand top"
        >
          +
        </button>
        <button
          onClick={() => expandGrid("bottom")}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-200 p-2 rounded-full"
          aria-label="Expand bottom"
        >
          +
        </button>
        <button
          onClick={() => expandGrid("left")}
          className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
          aria-label="Expand left"
        >
          +
        </button>
        <button
          onClick={() => expandGrid("right")}
          className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
          aria-label="Expand right"
        >
          +
        </button>
      </div>

      <div
        className="grid gap-1 border border-gray-300 p-5"
        style={{
          gridTemplateColumns: `repeat(7, 2.5rem)`,
          gridTemplateRows: `repeat(7, 2.5rem)`,
        }}
      >
        {tiles
          .filter((tile) => !tile.isOnGrid)
          .map((tile) => (
            <div
              key={tile.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.id)}
              className="w-10 h-10 border border-gray-400 flex items-center justify-center bg-yellow-300 cursor-grab"
            >
              {tile.letter}
            </div>
          ))}
      </div>

      <div>
        <button
          onClick={revealNewTile}
          disabled={
            Object.values(pool).every((count) => count === 0) ||
            tiles.some((tile) => !tile.isOnGrid)
          }
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300"
        >
          Reveal
        </button>
        {/* <button onDrop={dumpTile}>Dump</button> */}
      </div>
    </main>
  );
}
