"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Stroke = {
  points: Point[];
  color: string;
  width: number;
  mode: "pen" | "eraser" | "line";
  start?: Point;
};
type Note = { x: number; y: number; text: string; color: string };
type Tool = "pen" | "eraser" | "line";
const colors = ["#424858", "#6d60b0", "#e27468", "#5d9a79", "#dfad4f", "#508cb0"];

export default function CollabBoardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(colors[1]);
  const [width, setWidth] = useState(4);
  const [template, setTemplate] = useState("Blank canvas");
  const [notice, setNotice] = useState("");
  const currentStroke = useRef<Stroke | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const bounds = wrapper.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = bounds.width * ratio;
    canvas.height = bounds.height * ratio;
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.fillStyle = "#fffefa";
    context.fillRect(0, 0, bounds.width, bounds.height);
    if (template === "Grid") {
      context.strokeStyle = "#e8e8ed";
      context.lineWidth = 1;
      for (let x = 0; x < bounds.width; x += 25) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, bounds.height);
        context.stroke();
      }
      for (let y = 0; y < bounds.height; y += 25) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(bounds.width, y);
        context.stroke();
      }
    }
    [...strokes, ...(currentStroke.current ? [currentStroke.current] : [])].forEach((stroke) => {
      if (!stroke.points.length) return;
      context.beginPath();
      context.lineWidth = stroke.width;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = stroke.mode === "eraser" ? "#fffefa" : stroke.color;
      const first = stroke.mode === "line" && stroke.start ? stroke.start : stroke.points[0];
      context.moveTo(first.x * bounds.width, first.y * bounds.height);
      if (stroke.mode === "line") {
        const point = stroke.points.at(-1)!;
        context.lineTo(point.x * bounds.width, point.y * bounds.height);
      } else {
        for (const point of stroke.points.slice(1))
          context.lineTo(point.x * bounds.width, point.y * bounds.height);
      }
      context.stroke();
    });
    notes.forEach((note) => {
      const x = note.x * bounds.width;
      const y = note.y * bounds.height;
      context.fillStyle = note.color;
      context.fillRect(x, y, 150, 112);
      context.fillStyle = "#46413b";
      context.font = "12px sans-serif";
      note.text
        .split("\n")
        .slice(0, 6)
        .forEach((line, index) => context.fillText(line.slice(0, 23), x + 12, y + 24 + index * 17));
    });
  }, [strokes, notes, template]);

  const pointFrom = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };
  const pointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFrom(event);
    currentStroke.current = {
      points: [point],
      color,
      width,
      mode: tool,
      ...(tool === "line" ? { start: point } : {}),
    };
    event.currentTarget.dispatchEvent(new Event("draw-update"));
    setStrokes((current) => [...current]);
  };
  const pointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!currentStroke.current || event.buttons !== 1) return;
    currentStroke.current.points.push(pointFrom(event));
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    const stroke = currentStroke.current;
    const points = stroke.points;
    if (!context || points.length < 2) return;
    context.beginPath();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = stroke.width;
    context.strokeStyle = stroke.mode === "eraser" ? "#fffefa" : stroke.color;
    const previous = points.at(-2)!;
    const next = points.at(-1)!;
    context.moveTo(previous.x * rect.width, previous.y * rect.height);
    context.lineTo(next.x * rect.width, next.y * rect.height);
    context.stroke();
  };
  const pointerUp = () => {
    const completedStroke = currentStroke.current;
    if (!completedStroke) return;
    setStrokes((current) => [...current, completedStroke]);
    currentStroke.current = null;
    setRedoStack([]);
  };
  const undo = () => {
    if (!strokes.length) return;
    setRedoStack((current) => [...current, strokes]);
    setStrokes((current) => current.slice(0, -1));
  };
  const redo = () => {
    if (!redoStack.length) return;
    setStrokes(redoStack.at(-1)!);
    setRedoStack((current) => current.slice(0, -1));
  };
  const addNote = () => {
    const text = window.prompt("Write a short sticky note");
    if (text?.trim())
      setNotes((current) => [
        ...current,
        {
          x: 0.46,
          y: 0.28 + (current.length % 3) * 0.16,
          text: text.trim(),
          color: ["#fff0a8", "#dff3e5", "#fbe1dc"][current.length % 3],
        },
      ]);
  };
  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "collabboard-local-board.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Local demo URL copied. It does not enable shared editing.");
    } catch {
      setNotice("Clipboard is unavailable. Copy the current address to revisit this demo.");
    }
  };
  const clearBoard = () => {
    setStrokes([]);
    setRedoStack([]);
    setNotes([]);
  };

  return (
    <main className="whiteboard-app">
      <header className="board-header">
        <a className="board-brand" href="#board">
          <span>c</span> collabboard
        </a>
        <div className="board-breadcrumb">
          <span>My boards</span>
          <b>/</b>
          <strong>Untitled board</strong>
          <i>⌄</i>
          <em>LOCAL</em>
        </div>
        <div className="header-people">
          <span className="mini-avatar purple">WI</span>
          <span className="mini-avatar green">MC</span>
          <span className="mini-avatar orange">LP</span>
          <button
            onClick={() =>
              setNotice(
                "Voice chat requires a signaling and media service, which is not connected.",
              )
            }
          >
            ◖ Voice
          </button>
        </div>
        <div className="header-controls">
          <button onClick={undo} disabled={!strokes.length} aria-label="Undo">
            ↶
          </button>
          <button onClick={redo} disabled={!redoStack.length} aria-label="Redo">
            ↷
          </button>
          <button className="share-board" onClick={share}>
            Share <span>↗</span>
          </button>
        </div>
      </header>
      <section className="board-toolbar">
        <div className="tool-group" aria-label="Drawing tools">
          {(
            [
              { id: "pen", icon: "✎", label: "Pen" },
              { id: "line", icon: "╱", label: "Line" },
              { id: "eraser", icon: "▱", label: "Eraser" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={tool === item.id ? "tool-active" : ""}
              onClick={() => setTool(item.id)}
              aria-label={item.label}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
          <i />
        </div>
        <div className="tool-colors">
          {colors.map((item) => (
            <button
              key={item}
              className={color === item ? "color-selected" : ""}
              onClick={() => setColor(item)}
              style={{ "--swatch": item } as React.CSSProperties}
              aria-label={`Use ${item} ink`}
            />
          ))}
          <label className="size-control">
            Size{" "}
            <input
              type="range"
              min="2"
              max="14"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
              aria-label="Brush size"
            />
          </label>
        </div>
        <div className="toolbar-spacer" />
        <label className="template-select">
          Template{" "}
          <select value={template} onChange={(event) => setTemplate(event.target.value)}>
            <option>Blank canvas</option>
            <option>Grid</option>
            <option>Planning board</option>
          </select>
        </label>
        <button className="note-tool" onClick={addNote}>
          ▧ <span>Sticky note</span>
        </button>
        <button className="export-tool" onClick={exportPng}>
          ↓ <span>Export PNG</span>
        </button>
      </section>
      <section className="canvas-region" id="board">
        <div className="canvas-meta">
          <div>
            <span className="board-status-dot" /> All changes are local <span>·</span>{" "}
            {strokes.length + notes.length} objects
          </div>
          <button
            onClick={() =>
              setNotice("Layers are represented as a simple object count in this prototype.")
            }
          >
            ▤ Layers <span>{strokes.length + notes.length}</span>
          </button>
        </div>
        <div
          className={`canvas-wrap template-${template.toLowerCase().replaceAll(" ", "-")}`}
          ref={wrapperRef}
        >
          <canvas
            ref={canvasRef}
            aria-label="Interactive whiteboard. Select a drawing tool and draw with pointer or touch."
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
          />
          {strokes.length === 0 && notes.length === 0 && (
            <div className="canvas-empty">
              <span>✳</span>
              <strong>A clear space for the next idea.</strong>
              <small>
                Select a tool and start sketching. Your board stays in this browser session.
              </small>
            </div>
          )}
          <div className="zoom-control">
            <button
              onClick={() =>
                setNotice("Zoom control is a visual prototype; canvas scale remains at 100%.")
              }
            >
              −
            </button>
            <span>100%</span>
            <button
              onClick={() =>
                setNotice("Zoom control is a visual prototype; canvas scale remains at 100%.")
              }
            >
              ＋
            </button>
          </div>
        </div>
        <footer className="canvas-footer">
          <span>
            BOARD / 01 <i>·</i> INDEPENDENT SHOWCASE
          </span>
          <span>
            Pointer and touch drawing <kbd>⌘</kbd>
            <kbd>Z</kbd> to undo
          </span>
          <button onClick={clearBoard}>Clear board</button>
        </footer>
      </section>
      {notice && (
        <div className="board-toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
