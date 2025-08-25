import React, { useEffect, useMemo, useState } from "react";
import { db, now } from "./firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { todayKey } from "./utils/date";
import BeltBadge from "./components/BeltBadge";
import MemberCard from "./components/MemberCard";
import NewMemberModal from "./components/NewMemberModal";
import CoachLogin from "./components/CoachLogin";
import CoachDashboard from "./components/CoachDashboard";
import UpdatePrompt from "./components/UpdatePrompt";
import logo from "./assets/logo.png";

const COACH_PASSWORD = import.meta.env.VITE_COACH_PASSWORD || "bjj";

export default function App() {
  const [view, setView] = useState(() => {
    // Persist coach auth across refreshes on the iPad
    const authed = localStorage.getItem("coachAuthed") === "true";
    return authed ? "coach-dashboard" : "practitioner";
  });

  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [checkedToday, setCheckedToday] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Members live subscription
  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("name"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMembers(list);
    });
    return () => unsub();
  }, []);

  // Checked-in-today subscription (to gray out buttons)
  useEffect(() => {
    const q = query(
      collection(db, "attendance"),
      where("date", "==", todayKey())
    );
    const unsub = onSnapshot(q, (snap) => {
      const ids = new Set(snap.docs.map((d) => d.data().memberId));
      setCheckedToday(ids);
    });
    return () => unsub();
  }, []);

  const filteredMembers = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return members;
    return members.filter((m) => (m.name || "").toLowerCase().includes(t));
  }, [members, search]);

  const handleCheckIn = async (member) => {
    const date = todayKey();
    const attendanceId = `${member.id}_${date}`;
    const ref = doc(db, "attendance", attendanceId);
    try {
      const exists = await getDoc(ref);
      if (exists.exists()) {
        setToast(`${member.name} déjà enregistré aujourd'hui. Oss! 🤙`);
        return;
      }
      await setDoc(ref, {
        memberId: member.id,
        name: member.name,
        belt: member.belt,
        stripes: Number(member.stripes || 0),
        date,
        ts: now(),
      });
      setToast(`${member.name} ✅`);
      setSearch("");
    } catch (e) {
      console.error(e);
      setToast("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setTimeout(() => setToast(null), 2000);
    }
  };

  const onCoachArea = () => setView("coach-login");
  const onCoachAuthed = () => {
    localStorage.setItem("coachAuthed", "true");
    setView("coach-dashboard");
  };
  const onLogout = () => {
    localStorage.removeItem("coachAuthed");
    setView("practitioner");
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur bg-zinc-950/70 border-b border-zinc-800 safe-top">
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-4 flex items-center gap-3">
          <img src={logo} alt="GFA Logo" className="h-12 w-12 object-contain" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              GFA Présences
            </h1>
          </div>
          {view === "practitioner" ? (
            <button
              onClick={onCoachArea}
              className="px-4 py-2 rounded-xl text-touch bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 ring-1 ring-zinc-700"
              aria-label="Coach Area"
            >
              Espace Coach
            </button>
          ) : view === "coach-dashboard" ? (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-touch bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 ring-1 ring-zinc-700"
            >
              Déconnexion
            </button>
          ) : null}
        </div>

        {view === "practitioner" && (
          <div className="max-w-6xl mx-auto px-4 pb-4">
            <div className="flex gap-3">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un membre par nom…"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 placeholder-zinc-500 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-touch"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="whitespace-nowrap px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-touch"
              >
                Nouveau ?
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {view === "practitioner" && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            {filteredMembers.length === 0 ? (
              <p className="text-zinc-400">
                Aucun membre trouvé. Essayez une autre recherche.
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((m) => (
                  <li key={m.id}>
                    <MemberCard
                      member={m}
                      checkedIn={checkedToday.has(m.id)}
                      onCheckIn={() => handleCheckIn(m)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === "coach-login" && (
          <div className="max-w-md mx-auto px-4 py-10">
            <CoachLogin
              expectedPassword={COACH_PASSWORD}
              onSuccess={onCoachAuthed}
              onCancel={() => setView("practitioner")}
            />
          </div>
        )}

        {view === "coach-dashboard" && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <CoachDashboard />
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 text-zinc-500 text-center text-sm py-3">
        Group Fight Academy • Never Give Up 🤙
      </footer>

      <NewMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 ring-1 ring-zinc-800 shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <UpdatePrompt />
    </div>
  );
}
