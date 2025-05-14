import { useDraggable } from "@dnd-kit/core";

// Define tile type
export type TileType = {
  id: string;
  letter: string;
  row: number;
  col: number;
  isOnGrid: boolean;
};

export const Tile = ({ tile }: { tile: TileType }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tile.id,
    data: {
      letter: tile.letter,
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-10 h-10 border border-gray-400 flex items-center justify-center cursor-grab transition-colors duration-200 bg-cocoa dark:bg-pinky text-ivory dark:text-cocoa z-999"}`}
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
