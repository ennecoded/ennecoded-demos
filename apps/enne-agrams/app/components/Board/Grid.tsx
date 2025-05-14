import { Tile, TileType } from "../Tile";
import { Cell } from "./Cell";
import { useEffect, useRef } from "react";

interface GridProps {
  tiles: TileType[];
  disableScroll?: boolean;
}

export const Grid = ({ tiles, disableScroll = false }: GridProps) => {
  const rowCount = 20;
  const colCount = 20;
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // Set up grid height and manage scroll behavior
  useEffect(() => {
    const calculateHeight = () => {
      if (gridContainerRef.current) {
        const viewportHeight = window.innerHeight;
        // Account for header (assume ~80px) and bottom rack (~100px)
        const availableHeight = viewportHeight - 180;
        gridContainerRef.current.style.height = `${availableHeight}px`;
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  // Handle scroll disabling/enabling
  useEffect(() => {
    if (!gridContainerRef.current) return;

    if (disableScroll) {
      // Store current scroll position when disabling scroll
      scrollPositionRef.current = gridContainerRef.current.scrollTop;
    }

    // Create a scroll event handler that maintains position during disable
    const handleScroll = () => {
      if (disableScroll && gridContainerRef.current) {
        gridContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    };

    // Add event listener
    const gridContainer = gridContainerRef.current;
    gridContainer.addEventListener("scroll", handleScroll);

    return () => {
      if (gridContainer) {
        gridContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [disableScroll]);

  // Calculate grid width based on cell size and column count
  const gridWidth = 2.5 * colCount + 0.25 * (colCount - 1) + 1; // 2.5rem per cell + 0.25rem gap + padding

  return (
    <div className="flex w-full justify-center">
      <div
        ref={gridContainerRef}
        className={`border border-gray-300 rounded-lg ${disableScroll ? "overflow-hidden" : "overflow-auto"}`}
        style={{
          width: `min(95vw, ${gridWidth}rem)`,
          maxWidth: "95vw",
        }}
      >
        <div
          className="grid gap-1 p-2"
          style={{
            gridTemplateColumns: `repeat(${colCount}, 2.5rem)`,
            gridTemplateRows: `repeat(${rowCount}, 2.5rem)`,
            width: "max-content",
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
      </div>
    </div>
  );
};
