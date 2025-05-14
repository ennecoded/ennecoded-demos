import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  rectIntersection,
  DragOverlay,
} from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import type { MetaFunction } from "@remix-run/node";
import { TileType, Tile } from "../components/Tile";
import { LetterRack } from "../components/LetterRack";
import { DumpArea } from "../components/DumpArea";
import { Grid } from "../components/Board/Grid";

export const meta: MetaFunction = () => [
  { title: "Enne-agrams" },
  { name: "description", content: "Enne-agrams (inspired by Bananagrams)" },
];

export default function Index() {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTile, setActiveTile] = useState<TileType | null>(null);

  // Prevent global scrolling
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

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

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);

    // Find the tile being dragged
    const draggedTile = tiles.find((tile) => tile.id === event.active.id);
    if (draggedTile) {
      setActiveTile(draggedTile);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    setActiveTile(null);

    const { over, active } = event;
    if (!over) return;

    const overId = over?.id?.toString();
    if (overId === "dump") {
      // Check if we have enough letters in the pool for drawing 3 new ones
      if (Object.values(pool).flatMap((p) => p).length < 3) return;

      // Get the current letter from the active drag element
      const activeLetter = active.data.current?.letter;
      if (!activeLetter) return;

      // Create 3 new tiles from the pool
      const newTiles: TileType[] = [];
      const localPool = { ...pool };
      const expandedLetters = Object.values(localPool).flatMap(
        (letterArray) => letterArray,
      );

      // Shuffle the expanded letters
      for (let i = expandedLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [expandedLetters[i], expandedLetters[j]] = [
          expandedLetters[j],
          expandedLetters[i],
        ];
      }

      // Draw 3 new tiles
      while (newTiles.length < 3 && expandedLetters.length > 0) {
        const letter = expandedLetters.pop();
        if (!letter) break;

        newTiles.push({
          id: letter.id,
          letter: letter.letter,
          row: -1,
          col: -1,
          isOnGrid: false,
        });

        // Remove the drawn letter from the pool
        localPool[letter.letter] = localPool[letter.letter].filter(
          (l) => l.id !== letter.id,
        );
      }

      // Return the active tile to the pool
      localPool[activeLetter] = [
        ...(localPool[activeLetter] || []),
        {
          id: String(active.id),
          letter: activeLetter,
        },
      ];

      // Update the pool state
      setPool(localPool);

      // Update tiles - remove the dropped tile and add new ones
      setTiles((prevTiles) => [
        ...prevTiles.filter((t) => t.id !== active.id),
        ...newTiles,
      ]);
    } else if (overId === "rack") {
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
    } else if (overId?.startsWith("cell-")) {
      const [_, rowStr, colStr] = overId.split("-");
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
          } else if (tile.isOnGrid && tile.row === row && tile.col === col) {
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
    }
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-pinky dark:bg-cocoa">
        {/* Header - Adding safe area padding for mobile */}
        <div className="p-2 pt-4 text-center safe-top">
          <h1 className="text-2xl font-bold">Enne-agrams</h1>
        </div>

        {/* Main game board - takes available space */}
        <div className="flex-1 overflow-auto p-2 max-h-[calc(100vh-120px)]">
          <Grid tiles={tiles} disableScroll={isDragging} />
        </div>

        {/* Letter rack area - fixed height */}
        <div className="border-t border-cocoa dark:border-ivory">
          <div className="h-20 overflow-auto p-2">
            <LetterRack tiles={tiles} />
          </div>
        </div>

        {/* Dump button area - fixed height with safe area for bottom */}
        <div className="p-2 pb-4 flex justify-center border-t border-cocoa dark:border-ivory safe-bottom">
          <DumpArea pool={pool} />
        </div>
      </div>

      {/* Drag Overlay - This is the key component that ensures tiles remain visible during drag */}
      <DragOverlay>
        {activeTile ? <Tile tile={activeTile} isDragOverlay={true} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
