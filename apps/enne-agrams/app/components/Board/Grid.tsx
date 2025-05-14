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
  const scrollPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Calculate the most extreme grid positions to determine used area
  const gridBounds = tiles.reduce(
    (bounds, tile) => {
      if (tile.isOnGrid) {
        bounds.minRow = Math.min(bounds.minRow, tile.row);
        bounds.maxRow = Math.max(bounds.maxRow, tile.row);
        bounds.minCol = Math.min(bounds.minCol, tile.col);
        bounds.maxCol = Math.max(bounds.maxCol, tile.col);
      }
      return bounds;
    },
    {
      minRow: Infinity,
      maxRow: -Infinity,
      minCol: Infinity,
      maxCol: -Infinity,
    },
  );

  // Check if grid has any tiles
  const hasGridTiles = gridBounds.minRow !== Infinity;

  // Auto-center the grid on the used area
  useEffect(() => {
    if (!gridContainerRef.current || !hasGridTiles) return;

    const grid = gridContainerRef.current;
    // Cell size including gap (2.5rem = 40px for the cell + 0.25rem = 4px for the gap)
    const cellWidth = 44; // 2.5rem (40px) + gap
    const cellHeight = 44; // 2.5rem (40px) + gap

    // Calculate center point
    const centerRow = (gridBounds.minRow + gridBounds.maxRow) / 2;
    const centerCol = (gridBounds.minCol + gridBounds.maxCol) / 2;

    // Calculate scroll position
    const scrollLeft =
      centerCol * cellWidth - grid.clientWidth / 2 + cellWidth / 2;
    const scrollTop =
      centerRow * cellHeight - grid.clientHeight / 2 + cellHeight / 2;

    // Apply scroll position
    grid.scrollLeft = Math.max(0, scrollLeft);
    grid.scrollTop = Math.max(0, scrollTop);
  }, [gridBounds, hasGridTiles]);

  // Handle scroll disabling/enabling during drag
  useEffect(() => {
    if (!gridContainerRef.current) return;

    if (disableScroll) {
      // Store current scroll position when disabling scroll
      scrollPositionRef.current = {
        x: gridContainerRef.current.scrollLeft,
        y: gridContainerRef.current.scrollTop,
      };
    }

    // Create a scroll event handler that maintains position during disable
    const handleScroll = () => {
      if (disableScroll && gridContainerRef.current) {
        gridContainerRef.current.scrollLeft = scrollPositionRef.current.x;
        gridContainerRef.current.scrollTop = scrollPositionRef.current.y;
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

  return (
    <div className="relative h-full w-full">
      <div
        ref={gridContainerRef}
        className={`border border-gray-300 rounded-lg ${disableScroll ? "overflow-hidden" : "overflow-auto"} h-full`}
        style={{
          overflowX: disableScroll ? "hidden" : "auto",
          overflowY: disableScroll ? "hidden" : "auto",
          maxWidth: "85vw", // Adjusted width for better responsiveness
        }}
      >
        <div
          className="grid gap-1 p-4"
          style={{
            gridTemplateColumns: `repeat(${colCount}, 2.5rem)`,
            gridTemplateRows: `repeat(${rowCount}, 2.5rem)`,
            width: `calc(${colCount} * 2.5rem + (${colCount} - 1) * 0.25rem + 2rem)`, // Total width calculation including gaps and padding
            height: `calc(${rowCount} * 2.5rem + (${rowCount} - 1) * 0.25rem + 2rem)`, // Total height calculation including gaps and padding
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
