import { DndContext, DragEndEvent, rectIntersection } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { TileType } from "../components/Tile";
import { LetterRack } from "../components/LetterRack";
import { DumpArea } from "../components/DumpArea";
import { Grid } from "../components/Board/Grid";

export const meta: MetaFunction = () => [
  { title: "Enne-agrams" },
  { name: "description", content: "Enne-agrams (inspired by Bananagrams)" },
];

export default function Index() {
  const [pool, setPool] = useState<
    Record<string, { id: string; letter: string }[]>
  >({
    A: Array.from({ length: 13 }, (_, i) => ({ id: `A-${i}`, letter: "A" })),
    B: Array.from({ length: 3 }, (_, i) => ({ id: `B-${i}`, letter: "B" })),
    C: Array.from({ length: 3 }, (_, i) => ({ id: `C-${i}`, letter: "C" })),
    D: Array.from({ length: 6 }, (_, i) => ({ id: `D-${i}`, letter: "D" })),
    E: Array.from({ length: 18 }, (_, i) => ({ id: `E-${i}`, letter: "E" })),
    F: Array.from({ length: 3 }, (_, i) => ({ id: `F-${i}`, letter: "F" })),
    G: Array.from({ length: 4 }, (_, i) => ({ id: `G-${i}`, letter: "G" })),
    H: Array.from({ length: 3 }, (_, i) => ({ id: `H-${i}`, letter: "H" })),
    I: Array.from({ length: 12 }, (_, i) => ({ id: `I-${i}`, letter: "I" })),
    J: Array.from({ length: 2 }, (_, i) => ({ id: `J-${i}`, letter: "J" })),
    K: Array.from({ length: 2 }, (_, i) => ({ id: `K-${i}`, letter: "K" })),
    L: Array.from({ length: 5 }, (_, i) => ({ id: `L-${i}`, letter: "L" })),
    M: Array.from({ length: 3 }, (_, i) => ({ id: `M-${i}`, letter: "M" })),
    N: Array.from({ length: 8 }, (_, i) => ({ id: `N-${i}`, letter: "N" })),
    O: Array.from({ length: 11 }, (_, i) => ({ id: `O-${i}`, letter: "O" })),
    P: Array.from({ length: 3 }, (_, i) => ({ id: `P-${i}`, letter: "P" })),
    Q: Array.from({ length: 2 }, (_, i) => ({ id: `Q-${i}`, letter: "Q" })),
    R: Array.from({ length: 9 }, (_, i) => ({ id: `R-${i}`, letter: "R" })),
    S: Array.from({ length: 6 }, (_, i) => ({ id: `S-${i}`, letter: "S" })),
    T: Array.from({ length: 9 }, (_, i) => ({ id: `T-${i}`, letter: "T" })),
    U: Array.from({ length: 6 }, (_, i) => ({ id: `U-${i}`, letter: "U" })),
    V: Array.from({ length: 3 }, (_, i) => ({ id: `V-${i}`, letter: "V" })),
    W: Array.from({ length: 3 }, (_, i) => ({ id: `W-${i}`, letter: "W" })),
    X: Array.from({ length: 2 }, (_, i) => ({ id: `X-${i}`, letter: "X" })),
    Y: Array.from({ length: 3 }, (_, i) => ({ id: `Y-${i}`, letter: "Y" })),
    Z: Array.from({ length: 2 }, (_, i) => ({ id: `Z-${i}`, letter: "Z" })),
  });
  const [tiles, setTiles] = useState<TileType[]>([]);

  const generateTiles = () => {
    const newTiles = [];
    const localPool = { ...pool };
    const expandedLetters = Object.values(localPool).flatMap(
      (letterArray) => letterArray,
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

      if (!letter) break;
      newTiles.push({
        id: letter.id,
        letter: letter.letter,
        row: -1,
        col: -1,
        isOnGrid: false,
      });
      localPool[letter.letter] = localPool[letter.letter].filter(
        (l) => l.id !== letter.id,
      );
    }
    setPool(localPool);
    setTiles(newTiles);
  };

  useEffect(() => {
    generateTiles();
  }, []);

  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 transition-colors text-white dark:text-black bg-pinky dark:bg-coco box-border`}
    >
      <h1 className="text-2xl font-bold mb-8">Enne-agrams</h1>

      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={(event: DragEndEvent) => {
          const { over, active } = event;
          console.log("over", over);
          console.log("active", active);
          if (!over) return;

          const overId = over?.id?.toString();
          if (overId === "dump") {
            if (Object.values(pool).flatMap((p) => p).length < 3) return;
            const newTiles: TileType[] = [];
            const localPool = { ...pool };
            const expandedLetters = Object.values(localPool).flatMap(
              (letterArray) => letterArray,
            );
            for (let i = expandedLetters.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [expandedLetters[i], expandedLetters[j]] = [
                expandedLetters[j],
                expandedLetters[i],
              ];
            }
            while (newTiles.length < 3 && expandedLetters.length > 0) {
              const letter = expandedLetters.pop();
              console.log("letter", letter);

              if (!letter) break;
              newTiles.push({
                id: letter.id,
                letter: letter.letter,
                row: -1,
                col: -1,
                isOnGrid: false,
              });
              localPool[letter.letter] = localPool[letter.letter].filter(
                (l) => l.id !== letter.id,
              );
            }

            setPool({
              ...localPool,
              [active.data.current?.letter]: [
                ...(localPool[active.data.current?.letter] || []),
                {
                  id: String(active.id),
                  letter: String(active.data.current?.letter),
                },
              ],
            });

            setTiles((prevTiles) => {
              return [
                ...prevTiles.filter((t) => t.id !== active.id),
                ...newTiles,
              ];
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
        <Grid tiles={tiles} setTiles={setTiles} />
        <div className="sticky bottom-0 z-10 flex flex-col items-center justify-between w-screen px-4 py-2 bg-pinky dark:bg-cocoa border-b border-pinky dark:border-ivory">
          <LetterRack tiles={tiles} />
          <DumpArea pool={pool} />
        </div>
      </DndContext>
    </main>
  );
}
