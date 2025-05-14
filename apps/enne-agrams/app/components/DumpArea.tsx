import { useDroppable } from "@dnd-kit/core";

export const DumpArea = ({
  pool,
}: {
  pool: Record<string, { id: string; letter: string }[]>;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: "dump" });

  const hoverStyles = isOver
    ? {
        backgroundColor: "#FFD1DC",
        borderColor: "#FF69B4",
        borderStyle: "solid",
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      className={`mt-2 px-4 py-2 rounded-full border-2 border-dashed text-sm font-medium z-10 transition-all border-cocoa bg-pinky dark:border-pinky text-cocoa dark:text-pinky dark:bg-cocoa ${
        Object.values(pool).reduce((a, b) => a + b.length, 0) < 3
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
      style={{
        minHeight: "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...hoverStyles,
      }}
    >
      Dump ({Object.values(pool).flatMap((letter) => letter).length} remaining)
    </div>
  );
};
