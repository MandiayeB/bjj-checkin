import React from "react";

const BELT_STYLES = {
  White:
    "bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-900 ring-1 ring-zinc-300",
  Blue: "bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-1 ring-blue-400",
  Purple:
    "bg-gradient-to-r from-purple-500 to-purple-600 text-white ring-1 ring-purple-400",
  Brown:
    "bg-gradient-to-r from-amber-700 to-amber-800 text-white ring-1 ring-amber-600",
  Black:
    "bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 ring-1 ring-zinc-600",
  Blanche:
    "bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-900 ring-1 ring-zinc-300",
  Bleue:
    "bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-1 ring-blue-400",
  Violette:
    "bg-gradient-to-r from-purple-500 to-purple-600 text-white ring-1 ring-purple-400",
  Marron:
    "bg-gradient-to-r from-amber-700 to-amber-800 text-white ring-1 ring-amber-600",
  Noire:
    "bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 ring-1 ring-zinc-600",
};

const BELT_TRANSLATIONS = {
  White: "Blanche",
  Blue: "Bleue",
  Purple: "Violette",
  Brown: "Marron",
  Black: "Noire",
  Blanche: "Blanche",
  Bleue: "Bleue",
  Violette: "Violette",
  Marron: "Marron",
  Noire: "Noire",
};

export default function BeltBadge({ belt = "White", stripes = 0 }) {
  const style = BELT_STYLES[belt] || BELT_STYLES.White;
  const displayName = BELT_TRANSLATIONS[belt] || belt;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${style}`}
      >
        <span className="font-semibold">{displayName}</span>
        <span aria-hidden className="opacity-80">
          •
        </span>
        <span className="tabular-nums">
          {stripes || 0} barrette{Number(stripes) < 2 ? "" : "s"}
        </span>
      </span>
    </div>
  );
}
