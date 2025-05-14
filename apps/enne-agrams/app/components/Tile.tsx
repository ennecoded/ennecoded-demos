import { useDraggable } from "@dnd-kit/core";

// Define tile type
export type TileType = {
  id: string;
  letter: string;
  row: number;
  col: number;
  isOnGrid: boolean;
};

export const Tile = ({
  tile,
  isDragOverlay = false,
}: {
  tile: TileType;
  isDragOverlay?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tile.id,
    data: {
      letter: tile.letter,
    },
  });

  // For drag overlay, we don't need the draggable functionality
  if (isDragOverlay) {
    return (
      <div
        className="w-10 h-10 border border-gray-400 flex items-center justify-center bg-cocoa dark:bg-pinky text-ivory dark:text-cocoa"
        style={{
          touchAction: "none",
        }}
      >
        {tile.letter}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="w-10 h-10 border border-gray-400 flex items-center justify-center cursor-grab transition-colors duration-200 bg-cocoa dark:bg-pinky text-ivory dark:text-cocoa"
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        touchAction: "none",
        // Using CSS variable to control visibility - set to hidden in the DnD Kit context
        opacity: isDragOverlay ? 1 : undefined,
      }}
    >
      {tile.letter}
    </div>
  );
};
