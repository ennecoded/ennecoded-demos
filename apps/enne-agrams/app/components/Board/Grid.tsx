import { useState } from "react";
import { Tile, TileType } from "../Tile";
import { Cell } from "./Cell";

export const Grid = ({
  tiles,
  setTiles,
}: {
  tiles: TileType[];
  setTiles: React.Dispatch<React.SetStateAction<TileType[]>>;
}) => {
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(10);

  const expandGrid = (direction: "top" | "bottom" | "left" | "right") => {
    if ((direction === "top" || direction === "bottom") && rowCount < 144) {
      if (direction === "top") {
        if (tiles.some((tile) => tile.row === rowCount - 1)) {
          setRowCount((prev) => prev + 1);
        }
        if (!tiles.some((tile) => tile.row === rowCount - 1)) {
          setTiles((prevTiles) =>
            prevTiles.map((tile) => ({
              ...tile,
              row: tile.row + 1,
            }))
          );
        }
      }
      if (direction === "bottom") {
        if (tiles.some((tile) => tile.row === 0)) {
          setRowCount((prev) => prev + 1);
        }
        if (!tiles.some((tile) => tile.row === 0)) {
          setTiles((prevTiles) =>
            prevTiles.map((tile) => ({
              ...tile,
              row: tile.row - 1,
            }))
          );
        }
      }
    } else if (
      (direction === "left" || direction === "right") &&
      colCount < 144
    ) {
      if (direction === "left") {
        if (tiles.some((tile) => tile.col === colCount - 1)) {
          setColCount((prev) => prev + 1);
        }
        if (!tiles.some((tile) => tile.col === colCount - 1)) {
          setTiles((prevTiles) =>
            prevTiles.map((tile) => ({
              ...tile,
              col: tile.col + 1,
            }))
          );
        }
      }
      if (direction === "right") {
        if (tiles.some((tile) => tile.col === 0)) {
          setColCount((prev) => prev + 1);
        }
        if (!tiles.some((tile) => tile.col === 0)) {
          setTiles((prevTiles) =>
            prevTiles.map((tile) => ({
              ...tile,
              col: tile.col - 1,
            }))
          );
        }
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      <div
        className="border border-gray-300 rounded-lg box-border flex overflow-x-auto overflow-y-scroll"
        style={{
          maxWidth: "80vw",
          maxHeight: "1200px",

        }}
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${colCount}, 2.5rem)`,
            gridTemplateRows: `repeat(${rowCount}, 2.5rem)`,
            height: `${rowCount * 3}rem`,
          }}
        >
          {Array.from({ length: rowCount * colCount }).map((_, index) => {
            const row = Math.floor(index / colCount);
            const col = index % colCount;
            const occupyingTile = tiles.find(
              (tile) => tile.isOnGrid && tile.row === row && tile.col === col
            );
            return (
              <Cell key={`cell-${row}-${col}`} row={row} col={col}>
                {occupyingTile && <Tile tile={occupyingTile} />}
              </Cell>
            );
          })}
        </div>
      </div>

      {/* Expand Buttons */}
      <button
        onClick={() => expandGrid("top")}
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
        aria-label="Expand top"
      >
        ↑
      </button>
      <button
        onClick={() => expandGrid("bottom")}
        className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
        aria-label="Expand bottom"
      >
        ↓
      </button>
      <button
        onClick={() => expandGrid("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
        aria-label="Expand left"
      >
        ←
      </button>
      <button
        onClick={() => expandGrid("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 z-10"
        aria-label="Expand right"
      >
        →
      </button>
    </div>
  );
};
