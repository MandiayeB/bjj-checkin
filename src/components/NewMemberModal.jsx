import React, { useState } from "react";
import { db, now } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const BELTS = ["Blanche", "Bleue", "Violette", "Marron", "Noire"];

export default function NewMemberModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [belt, setBelt] = useState("Blanche");
  const [stripes, setStripes] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setName("");
    setBelt("Blanche");
    setStripes(0);
    setSaving(false);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Veuillez entrer un nom complet.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "members"), {
        name: name.trim(),
        belt,
        stripes: Number(stripes || 0),
        createdAt: now(),
      });
      reset();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full sm:w-[34rem] p-6 rounded-t-2xl sm:rounded-2xl bg-zinc-950 ring-1 ring-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Nouveau Membre</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Fermer
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-zinc-400">
              Nom Complet
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Jean Dupont"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 placeholder-zinc-500 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-zinc-400">
                Ceinture
              </label>
              <select
                value={belt}
                onChange={(e) => setBelt(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {BELTS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-zinc-400">
                Barrettes
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={stripes}
                onChange={(e) => setStripes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold"
          >
            {saving ? "Enregistrement…" : "Créer Membre"}
          </button>
        </form>
      </div>
    </div>
  );
}
