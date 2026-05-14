// Completion celebration — the 3.5-second sequence from the top-apps spec.

import { el } from "./dom.js";

export interface CelebrationProps {
  canvasContainer: HTMLElement;
  originX?: number;
  originY?: number;
  storyTitle: string;
  onSave: () => void;
  onReplay: () => void;
  onNext: () => void;
  onDismiss: () => void;
}

const CONFETTI_COLORS = ["#E8B547", "#6FBF73", "#F08A6E", "#5B9CFF", "#FBF3E4"];

export function showCelebration(props: CelebrationProps): () => void {
  const overlay = el("div", { class: "celebration modal" });

  overlay.appendChild(el("div", { class: "sparkle-sweep" }));

  // Confetti burst from the last-tap point.
  const cw = props.canvasContainer.clientWidth;
  const ch = props.canvasContainer.clientHeight;
  const ox = props.originX ?? cw / 2;
  const oy = props.originY ?? ch / 2;
  for (let i = 0; i < 40; i++) {
    const p = el("div", { class: "confetti-particle" });
    p.style.left = `${ox}px`;
    p.style.top = `${oy}px`;
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? "#E8B547";
    const angle = (Math.random() - 0.5) * Math.PI * 1.4 - Math.PI / 2;
    const dist = 180 + Math.random() * 320;
    const cx = Math.cos(angle) * dist;
    const cy = Math.sin(angle) * dist + (Math.random() * 200 + 100);
    p.style.setProperty("--cx", `${cx}px`);
    p.style.setProperty("--cy", `${cy}px`);
    p.style.animationDelay = `${Math.random() * 0.15}s`;
    overlay.appendChild(p);
  }

  const card = el("div", { class: "celebration-card" }, [
    el("div", { class: "celebration-emoji" }, "🎉"),
    el("div", { class: "celebration-title" }, "Great job!"),
    el("div", { class: "celebration-sub" }, `You finished ${props.storyTitle}!`),
    el("div", { class: "celebration-actions" }, [
      btn("secondary", "↻ Replay", props.onReplay),
      btn("primary", "💾 Save", props.onSave),
      btn("secondary", "→ Next", props.onNext),
    ]),
  ]);
  overlay.appendChild(card);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) props.onDismiss();
  });

  document.body.appendChild(overlay);
  playChime();

  return () => overlay.remove();
}

function btn(variant: "primary" | "secondary", label: string, onClick: () => void): HTMLElement {
  const b = el("button", { class: `celebration-btn ${variant}` }, label);
  b.addEventListener("click", onClick);
  return b;
}

function playChime(): void {
  try {
    type WindowWithAudio = Window & typeof globalThis & {
      webkitAudioContext?: typeof AudioContext;
    };
    const w = window as WindowWithAudio;
    const AC = w.AudioContext ?? w.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const playNote = (freq: number, when: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + when);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + when + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + when);
      osc.stop(ctx.currentTime + when + dur);
    };
    playNote(523.25, 0.30, 0.6);
    playNote(659.25, 0.45, 0.8);
    playNote(783.99, 0.60, 1.0);
  } catch {
    // Silent failure.
  }
}

export function showConfettiBurst(container: HTMLElement, x: number, y: number, count = 18): void {
  for (let i = 0; i < count; i++) {
    const p = el("div", { class: "confetti-particle" });
    p.style.position = "absolute";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? "#E8B547";
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 120;
    p.style.setProperty("--cx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--cy", `${Math.sin(angle) * dist + 80}px`);
    container.appendChild(p);
    setTimeout(() => p.remove(), 2400);
  }
}

/**
 * Quick "splash" feedback when a region fills. Two layered elements:
 *  - tap-ripple: a soft radial glow that scales out
 *  - tap-pop: a chunky ring outline that scales out faster
 *
 * Plus a short audio "pop" so the action has multi-sensory feedback. This
 * is the single most important polish for matching Happy Color's feel —
 * every tap-fill should land with satisfaction.
 */
export function showTapPop(container: HTMLElement, x: number, y: number, color: string): void {
  const ripple = el("div", { class: "tap-ripple" });
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = "120px";
  ripple.style.height = "120px";
  ripple.style.setProperty("--ripple-color", color);
  container.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);

  const pop = el("div", { class: "tap-pop" });
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;
  pop.style.setProperty("--ripple-color", color);
  container.appendChild(pop);
  setTimeout(() => pop.remove(), 520);

  // Audio "pop" — short, low-pitched, satisfying.
  playPop();

  // Haptic on supported devices (iOS Safari, Android Chrome).
  try { navigator.vibrate?.(15); } catch { /* ignore */ }
}

function playPop(): void {
  try {
    type WindowWithAudio = Window & typeof globalThis & {
      webkitAudioContext?: typeof AudioContext;
    };
    const w = window as WindowWithAudio;
    const AC = w.AudioContext ?? w.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(560, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.10);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch { /* ignore */ }
}
