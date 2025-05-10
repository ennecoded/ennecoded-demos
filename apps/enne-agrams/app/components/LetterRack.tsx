import { useDroppable } from "@dnd-kit/core";
import { Tile, TileType } from "./Tile";

export const LetterRack = ({ tiles }: { tiles: TileType[] }) => {
  const { setNodeRef } = useDroppable({ id: "rack" });
  return (
    <div
      id="rack"
      ref={setNodeRef}
      className={`bg-inherit border-t-2 px-4 py-3  border-pinky dark:border-ivory`}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(2.5rem, 1fr))",
        gridAutoRows: "2.5rem",
        gap: "0.5rem",
        maxWidth: "50rem",
        width: "80vw",
        justifyContent: "center",
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
