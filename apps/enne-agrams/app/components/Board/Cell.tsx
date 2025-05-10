import { useDroppable } from "@dnd-kit/core";

export const Cell = ({
  row,
  col,
  children,
}: {
  row: number;
  col: number;
  children?: React.ReactNode;
}) => {
  const id = `cell-${row}-${col}`;
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-10 h-10 flex items-center justify-center border border-pinky dark:border-ivory ${isOver ? "bg-pink-100" : "bg-white dark:bg-cocoa"}`}
    >
      {children}
    </div>
  );
};
