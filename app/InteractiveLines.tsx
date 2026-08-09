"use client";

import { useEffect, useRef } from "react";

type Vec = { x: number; y: number };
const vec = (x: number, y: number): Vec => ({ x, y });
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const mult = (a: Vec, n: number): Vec => ({ x: a.x * n, y: a.y * n });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const vecLerp = (a: Vec, b: Vec, t: number): Vec => vec(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const map = (v: number, a: number, b: number, c: number, d: number) => ((v - a) / (b - a)) * (d - c) + c;

export default function InteractiveLines() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const el = host.current;
    const cnv = canvas.current;
    const ctx = cnv?.getContext("2d", { alpha: false });
    if (!el || !cnv || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lineCount = 58;
    let bias = 0.5;

    const resize = () => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      cnv.width = width * dpr;
      cnv.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.current = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    };

    const drawCurve = (start: Vec, end: Vec, target: Vec, weight: number, power: number) => {
      const center = vecLerp(start, end, 0.5);
      const displacement = sub(target, center);
      ctx.beginPath();
      for (let step = 0; step <= 50; step++) {
        const t = step / 50;
        const base = vecLerp(start, end, t);
        const force = 2 * Math.pow(t, power * (1 - weight) * 2) * Math.pow(1 - t, power * weight * 2);
        const point = add(base, mult(displacement, force));
        step ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y);
      }
      ctx.stroke();
    };

    const render = () => {
      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.05;
      p.y += (p.ty - p.y) * 0.1;
      ctx.fillStyle = "#ff3d16";
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const mobile = width < 600;
      const offset = mobile ? height * 0.42 : 0;
      const power = mobile ? 1.35 : 0.72;
      const start = vec(width, -height * 1.1 + offset);
      const base = vec(0, height * 2);
      const far = vec(-width, -height + offset);
      const targetCount = clamp(map(p.y, 0, height, 110, 28), 28, 110);
      lineCount = lerp(lineCount, targetCount, 0.08);
      bias = lerp(bias, clamp(map(p.x, 0, width, 0.6, 0.4), 0.4, 0.6), 0.05);
      ctx.strokeStyle = "rgba(255,255,255,.82)";
      ctx.lineWidth = 0.55;

      for (let i = 0; i < lineCount; i++) {
        const t = i / Math.max(1, lineCount - 1);
        const end = vec(lerp(base.x, far.x, 1 - t * t), lerp(base.y, far.y, 1 - t * t));
        const mid = add(mult(start, 0.5), mult(end, 0.5));
        drawCurve(start, end, mult(add(base, mid), 0.5), bias, power);
      }
      ctx.restore();
      if (visible) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      pointer.current.tx = event.clientX - box.left;
      pointer.current.ty = event.clientY - box.top;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(render);
    });

    resize();
    observer.observe(el);
    frame = requestAnimationFrame(render);
    window.addEventListener("resize", resize, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={host} className="lines" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
