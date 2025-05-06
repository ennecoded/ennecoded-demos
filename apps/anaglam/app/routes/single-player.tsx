import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  rectIntersection,
} from "@dnd-kit/core";
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
    const localPool = { ...pool };
    const expandedLetters = Object.entries(localPool).flatMap(
      ([letter, count]) => Array(count).fill(letter),
    );
    for (let i = expandedLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [expandedLetters[i], expandedLetters[j]] = [
        expandedLetters[j],
        expandedLetters[i],
      ];
    }
    while (newTiles.length < 21 && expandedLetters.length > 0) {
      const letter = expandedLetters.pop();
      if (letter && localPool[letter] > 0) {
        newTiles.push({
          id: newTiles.length,
          letter,
          row: -1,
          col: -1,
          isOnGrid: false,
        });
        localPool[letter] -= 1;
      }
    }
    setPool(localPool);
    setTiles(newTiles);
  };

  useEffect(() => {
    generateTiles();
  }, []);

  const expandGrid = (direction: "top" | "bottom" | "left" | "right") => {
    if ((direction === "top" || direction === "bottom") && rowCount < 144) {
      setRowCount((prev) => prev + 1);
      if (direction === "top") {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => ({
            ...tile,
            row: tile.row + 1,
          })),
        );
      }
    } else if (
      (direction === "left" || direction === "right") &&
      colCount < 144
    ) {
      setColCount((prev) => prev + 1);
      if (direction === "left") {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => ({
            ...tile,
            col: tile.col + 1,
          })),
        );
      }
    }
  };

  const Tile = ({ tile }: { tile: any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: tile.id,
    });
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`w-10 h-10 border border-gray-400 flex items-center justify-center cursor-grab transition-colors duration-200 ${isDarkMode ? "bg-[#4B3621] text-pink-300" : "bg-[#F9D5E5] text-[#4B3621]"}`}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          touchAction: "none",
        }}
      >
        {tile.letter}
      </div>
    );
  };

  const LetterRack = () => {
    const { setNodeRef, isOver } = useDroppable({ id: "rack" });
    return (
      <div
        id="rack"
        ref={setNodeRef}
        className={`grid gap-1 p-5 mt-6 border ${isDarkMode ? "border-[#A1866F]" : "border-pink-300"}`}
        style={{
          gridTemplateColumns: `repeat(7, 2.5rem)`,
          gridTemplateRows: `repeat(3, 2.5rem)`,
        }}
      >
        {tiles
          .filter((tile) => !tile.isOnGrid)
          .map((tile) => (
            <Tile key={tile.id} tile={tile} />
          ))}
      </div>
    );
  };

  const DumpArea = () => {
    const { setNodeRef, isOver } = useDroppable({ id: "dump" });
    return (
      <div
        ref={setNodeRef}
        className={`mt-4 px-4 py-2 rounded-full border-2 border-dashed text-sm font-medium transition-all ${Object.values(pool).reduce((a, b) => a + b, 0) < 3 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isDarkMode ? "border-pink-300 text-pink-300" : "border-[#4B3621] text-[#4B3621]"}`}
        style={{
          minHeight: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Dump Tile Here
      </div>
    );
  };

  const Cell = ({
    row,
    col,
    children,
  }: {
    row: number;
    col: number;
    children?: React.ReactNode;
  }) => {
    const id = `cell-${row}-${col}`;
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <div
        ref={setNodeRef}
        className={`w-10 h-10 flex items-center justify-center border ${isDarkMode ? "border-[#A1866F]" : "border-pink-400"}`}
        style={{
          backgroundColor: isOver
            ? "lightblue"
            : isDarkMode
              ? "#1f1f1f"
              : "white",
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 transition-colors ${isDarkMode ? "bg-[#2C1E1E] text-white" : "bg-[#FFF1F5] text-black"}`}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-current flex items-center justify-center transition duration-300 hover:rotate-180"
        aria-label="Toggle dark mode"
      >
        <span className="text-xl">{isDarkMode ? "🌞" : "🌙"}</span>
      </button>

      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={(event: DragEndEvent) => {
          const { over, active } = event;
          console.log("over", over);
          console.log("active", active);
          if (!over) return;

          const overId = over?.id?.toString();

          if (overId === "dump") {
            if (Object.values(pool).reduce((a, b) => a + b, 0) < 3) return;
            setTiles((prevTiles) => {
              const updatedTiles = prevTiles.filter(
                (tile) => tile.id !== active.id,
              );
              const availableLetters = Object.entries(pool).flatMap(
                ([letter, count]) => Array(count).fill(letter),
              );

              const drawnLetters: string[] = [];
              const newPool = { ...pool };

              for (let i = 0; i < 3 && availableLetters.length > 0; i++) {
                const letter =
                  availableLetters[
                    Math.floor(Math.random() * availableLetters.length)
                  ];
                drawnLetters.push(letter);
                newPool[letter] -= 1;
                const indexToRemove = availableLetters.indexOf(letter);
                availableLetters.splice(indexToRemove, 1);
              }

              setPool(newPool);

              const maxId = Math.max(...prevTiles.map((t) => t.id), 0);
              const newTiles = drawnLetters.map((letter, i) => ({
                id: maxId + i + 1,
                letter,
                row: -1,
                col: -1,
                isOnGrid: false,
              }));

              return [...updatedTiles, ...newTiles];
            });
            return;
          } else if (over.id.toString().startsWith("cell-")) {
            const [_, rowStr, colStr] = over.id.toString().split("-");
            const row = parseInt(rowStr);
            const col = parseInt(colStr);

            setTiles((prevTiles) => {
              const draggedTile = prevTiles.find((t) => t.id === active.id);
              if (!draggedTile) return prevTiles;

              const updatedTiles = prevTiles.map((tile) => {
                if (tile.id === active.id) {
                  return {
                    ...tile,
                    isOnGrid: true,
                    row,
                    col,
                  };
                } else if (
                  tile.isOnGrid &&
                  tile.row === row &&
                  tile.col === col
                ) {
                  return {
                    ...tile,
                    isOnGrid: false,
                    row: -1,
                    col: -1,
                  };
                }
                return tile;
              });

              return updatedTiles;
            });
          } else if (over.id === "rack") {
            setTiles((prevTiles) => {
              const idx = prevTiles.findIndex((t) => t.id === active.id);
              if (idx === -1) return prevTiles;
              const updated = [...prevTiles];
              updated[idx] = {
                ...updated[idx],
                isOnGrid: false,
                row: -1,
                col: -1,
              };
              return updated;
            });
          }
        }}
      >
        <div
          className={`grid gap-1 border ${isDarkMode ? "border-[#A1866F]" : "border-pink-300"}`}
          style={{
            gridTemplateColumns: `repeat(${colCount}, 2.5rem)`,
            gridTemplateRows: `repeat(${rowCount}, 2.5rem)`,
          }}
        >
          {Array.from({ length: rowCount * colCount }).map((_, index) => {
            const row = Math.floor(index / colCount);
            const col = index % colCount;
            const occupyingTile = tiles.find(
              (tile) => tile.isOnGrid && tile.row === row && tile.col === col,
            );
            return (
              <Cell key={`cell-${row}-${col}`} row={row} col={col}>
                {occupyingTile && <Tile tile={occupyingTile} />}
              </Cell>
            );
          })}
        </div>

        <LetterRack />
        <button
          onClick={() => {
            const availableLetters = Object.entries(pool).flatMap(
              ([letter, count]) => Array(count).fill(letter),
            );
            if (availableLetters.length === 0) return;
            const letter =
              availableLetters[
                Math.floor(Math.random() * availableLetters.length)
              ];
            setPool((prev) => ({ ...prev, [letter]: prev[letter] - 1 }));
            setTiles((prev) => [
              ...prev,
              {
                id: prev.length,
                letter,
                row: -1,
                col: -1,
                isOnGrid: false,
              },
            ]);
          }}
          className={`mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300`}
        >
          Reveal
        </button>
        <DumpArea />
      </DndContext>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => expandGrid("top")}
          className={`p-2 rounded-full transition-colors ${isDarkMode ? "bg-[#4B3621] text-pink-300" : "bg-[#F9D5E5] text-[#4B3621]"}`}
          aria-label="Expand top"
        >
          ⬆️
        </button>
        <button
          onClick={() => expandGrid("bottom")}
          className="bg-gray-200 p-2 rounded-full"
          aria-label="Expand bottom"
        >
          ⬇️
        </button>
        <button
          onClick={() => expandGrid("left")}
          className="bg-gray-200 p-2 rounded-full"
          aria-label="Expand left"
        >
          ⬅️
        </button>
        <button
          onClick={() => expandGrid("right")}
          className="bg-gray-200 p-2 rounded-full"
          aria-label="Expand right"
        >
          ➡️
        </button>
      </div>
    </main>
  );
}
