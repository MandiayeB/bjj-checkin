import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { formatDate } from "../utils/date";
import BeltBadge from "./BeltBadge";

export default function CoachDashboard() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [promotingMember, setPromotingMember] = useState(null);

  // Live members; attendance fetched once (plus manual refresh)
  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("name"));
    const unsub = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "attendance"));
    setAttendance(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const rows = useMemo(() => {
    const map = new Map();
    for (const m of members) {
      map.set(m.id, { ...m, total: 0, last: null });
    }
    for (const a of attendance) {
      const entry = map.get(a.memberId);
      if (!entry) continue;
      entry.total += 1;
      const lastTs = entry.last?.ts;
      const currentTs = a.ts || a.date;
      if (!lastTs) {
        entry.last = a;
      } else {
        const left = a.ts?.toMillis?.() ?? Date.parse(a.date || "1970-01-01");
        const right =
          entry.last.ts?.toMillis?.() ??
          Date.parse(entry.last.date || "1970-01-01");
        if (left > right) entry.last = a;
      }
    }

    let results = Array.from(map.values());
    const searchTerm = search.trim().toLowerCase();
    if (searchTerm) {
      results = results.filter(
        (r) =>
          r.name?.toLowerCase().includes(searchTerm) ||
          r.belt?.toLowerCase().includes(searchTerm)
      );
    }

    return results;
  }, [members, attendance, search]);

  const BELTS = ["Blanche", "Bleue", "Violette", "Marron", "Noire"];
  const BELTS_EN = ["White", "Blue", "Purple", "Brown", "Black"];

  const handlePromote = async () => {
    if (!promotingMember) return;

    let currentBeltIndex = BELTS.indexOf(promotingMember.belt);
    if (currentBeltIndex === -1) {
      currentBeltIndex = BELTS_EN.indexOf(promotingMember.belt);
    }

    const currentStripes = Number(promotingMember.stripes || 0);

    let newBelt = promotingMember.belt;
    let newStripes = currentStripes;

    if (currentStripes < 4) {
      newStripes = currentStripes + 1;
    } else if (currentBeltIndex < BELTS.length - 1) {
      newBelt = BELTS[currentBeltIndex + 1];
      newStripes = 0;
    } else {
      return;
    }

    try {
      const memberRef = doc(db, "members", promotingMember.id);
      await updateDoc(memberRef, {
        belt: newBelt,
        stripes: newStripes,
      });
      setPromotingMember(null);
    } catch (e) {
      console.error("Failed to promote member:", e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Tableau de Présence</h2>
          <p className="text-zinc-400">
            Résumé des enregistrements des membres.
          </p>
        </div>
        <button
          onClick={fetchAttendance}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 ring-1 ring-zinc-700"
        >
          Actualiser
        </button>
      </div>

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou ceinture..."
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 placeholder-zinc-500 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl ring-1 ring-zinc-800 bg-zinc-900/60">
        <table className="min-w-full text-left">
          <thead className="uppercase text-xs text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Ceinture & Grade</th>
              <th className="px-4 py-3">Total Présences</th>
              <th className="px-4 py-3">Dernière Présence</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-800/40">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">
                  <BeltBadge belt={r.belt} stripes={r.stripes} />
                </td>
                <td className="px-4 py-3 font-semibold">{r.total}</td>
                <td className="px-4 py-3">
                  {r.last
                    ? r.last.ts
                      ? formatDate(r.last.ts)
                      : formatDate(r.last.date)
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setPromotingMember(r)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
                  >
                    Promouvoir
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-400">
                  {loading ? "Chargement…" : "Aucune donnée pour le moment."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {promotingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setPromotingMember(null)}
          />
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-950 ring-1 ring-zinc-800">
            <h3 className="text-xl font-semibold mb-4">
              Promouvoir {promotingMember.name}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Grade actuel:</span>
                <BeltBadge
                  belt={promotingMember.belt}
                  stripes={promotingMember.stripes}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Nouveau grade:</span>
                <BeltBadge
                  belt={(() => {
                    const stripes = Number(promotingMember.stripes || 0);
                    if (stripes < 4) return promotingMember.belt;
                    let idx = BELTS.indexOf(promotingMember.belt);
                    if (idx === -1)
                      idx = BELTS_EN.indexOf(promotingMember.belt);
                    return idx < BELTS.length - 1
                      ? BELTS[idx + 1]
                      : promotingMember.belt;
                  })()}
                  stripes={
                    Number(promotingMember.stripes || 0) < 4
                      ? Number(promotingMember.stripes || 0) + 1
                      : 0
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePromote}
                  disabled={
                    promotingMember.belt === "Noire" &&
                    promotingMember.stripes >= 4
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold disabled:bg-zinc-800 disabled:text-zinc-400"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setPromotingMember(null)}
                  className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
