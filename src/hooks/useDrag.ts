import { useEffect, useState } from "react";

export const useDrag = () => {
  const [drag_comp_id, setDragCompId] = useState<string | null>(null);
  const [drag_loc, setDragLoc] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setDragLoc({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return {
    drag_comp_id,
    setDragCompId,
    drag_loc,
  };
};
