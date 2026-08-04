import { useEffect, useRef } from "react";
import Portfolio from "./Portfolio";
import { createScrollSequence } from "./scrollSequence";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sequence = createScrollSequence(canvas);
    return () => sequence.destroy();
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="sequence-canvas" />
      <div className="frame-veil" aria-hidden="true" />
      <Portfolio />
    </>
  );
}
