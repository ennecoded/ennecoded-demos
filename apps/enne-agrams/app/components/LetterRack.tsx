import { useDroppable } from "@dnd-kit/core";
import { Tile, TileType } from "./Tile";

export const LetterRack = ({ tiles }: { tiles: TileType[] }) => {
  const { setNodeRef } = useDroppable({ id: "rack" });
  const unusedTiles = tiles.filter((tile) => !tile.isOnGrid);

  return (
    <div id="rack" ref={setNodeRef} className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {unusedTiles.map((tile) => (
          <div key={tile.id} className="flex-shrink-0">
            <Tile tile={tile} />
          </div>
        ))}
      </div>
    </div>
  );
};
