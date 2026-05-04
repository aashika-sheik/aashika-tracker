import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── CONSTANTS ───────────────────────────────────────────────
const TOTAL_BOOKS = 12;
const WATER_CUPS = 10;
const ML_PER_CUP = 300;

const QURAN_VERSES = [
  { text: "Say: He is Allah, the One and Only.", ref: "112:1" },
  { text: "Allah is with the patient.", ref: "2:153" },
  { text: "Indeed, with hardship comes ease.", ref: "94:6" },
  { text: "Do not despair of Allah's mercy.", ref: "12:87" },
  { text: "And I did not create the jinn and mankind except to worship Me.", ref: "51:56" },
  { text: "He is the First and the Last, the Evident and the Hidden.", ref: "57:3" },
  { text: "Allah is indeed close to us — I listen to the prayer of every suppliant.", ref: "2:186" },
  { text: "And We have indeed made the Qur'an easy to understand and remember.", ref: "54:17" },
  { text: "Every soul shall have a taste of death.", ref: "21:35" },
  { text: "Allah is the best of planners.", ref: "3:54" },
  { text: "To Allah belong the east and the West: Whithersoever ye turn, there is Allah.", ref: "2:115" },
  { text: "He Who created death and life, to test you which of you is best in deed.", ref: "67:2" },
  { text: "We have sent you not but as a mercy for all the worlds.", ref: "21:107" },
  { text: "Verily, the remembrance of Allah brings hearts to rest.", ref: "13:28" },
  { text: "Those who believe and do righteous deeds — they are the best of creatures.", ref: "98:7" },
  { text: "Whoever works righteousness, man or woman, and has Faith — We will give them a good life.", ref: "16:97" },
  { text: "Allah does not burden a soul beyond that it can bear.", ref: "2:286" },
  { text: "Be quick in the race for forgiveness from your Lord.", ref: "3:133" },
  { text: "Indeed Allah is with those who are patient.", ref: "8:46" },
  { text: "And He found you lost and guided you.", ref: "93:7" },
  { text: "So verily, with every difficulty there is relief.", ref: "94:5" },
  { text: "And your Lord says: Call upon Me; I will respond to you.", ref: "40:60" },
  { text: "Do not lose hope, nor be sad. You will surely be victorious if you are true in Faith.", ref: "3:139" },
  { text: "Whoever fears Allah — He will make for him a way out.", ref: "65:2" },
  { text: "The believers are but brothers, so make peace between your brothers.", ref: "49:10" },
  { text: "And it is He who created the night and day, the sun and the moon.", ref: "21:33" },
  { text: "On no soul does Allah place a burden greater than it can bear.", ref: "2:286" },
  { text: "Indeed, Allah will not change the condition of a people until they change themselves.", ref: "13:11" },
  { text: "And whoever relies upon Allah — then He is sufficient for him.", ref: "65:3" },
  { text: "Wealth and children are [but] adornment of the worldly life. But the enduring good deeds are better.", ref: "18:46" },
  { text: "And He is with you wherever you are. And Allah, of what you do, is Seeing.", ref: "57:4" },
  { text: "Then which of the favors of your Lord will you deny?", ref: "55:13" },
  { text: "O mankind, indeed you are laboring toward your Lord with [great] exertion and will meet it.", ref: "84:6" },
  { text: "And seek help through patience and prayer.", ref: "2:45" },
  { text: "Indeed, those who have said our Lord is Allah and then remained firm — the angels will descend upon them.", ref: "41:30" },
  { text: "He is Allah, the Creator, the Evolver, the Bestower of Forms. To Him belong the Most Beautiful Names.", ref: "59:24" },
  { text: "It is He who created you from a single soul and created from it its mate.", ref: "7:189" },
  { text: "So remember Me; I will remember you.", ref: "2:152" },
  { text: "Indeed, prayer prohibits immorality and wrongdoing.", ref: "29:45" },
  { text: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.", ref: "2:255" },
  { text: "Successful indeed are the believers.", ref: "23:1" },
  { text: "And He found you poor and made you self-sufficient.", ref: "93:8" },
  { text: "The most honored of you in the sight of Allah is the most righteous of you.", ref: "49:13" },
  { text: "Whatever good happens to you is from Allah; whatever evil, from yourself.", ref: "4:79" },
  { text: "Truly, Allah loves those who turn to Him constantly and loves those who keep themselves pure.", ref: "2:222" },
  { text: "Allah is the Light of the heavens and the earth.", ref: "24:35" },
  { text: "Whoever does an atom's weight of good will see it.", ref: "99:7" },
  { text: "And We have not sent you except as a mercy to the worlds.", ref: "21:107" },
  { text: "Speak good or remain silent.", ref: "Hadith" },
  { text: "Indeed, after hardship will come ease.", ref: "94:6" },
  { text: "Our Lord, give us good in this world and good in the Hereafter.", ref: "2:201" },
  { text: "And He is the Forgiving, the Loving.", ref: "85:14" },
  { text: "Say: My Lord, increase me in knowledge.", ref: "20:114" },
  { text: "He knows what is within the heavens and earth and knows what you conceal and what you declare.", ref: "64:4" },
  { text: "And when My servants ask you concerning Me — indeed I am near.", ref: "2:186" },
  { text: "Allah intends for you ease and does not intend for you hardship.", ref: "2:185" },
  { text: "And put your trust in Allah; Allah is sufficient as a trustee.", ref: "33:3" },
  { text: "Do not walk upon the earth exultantly — you will never tear the earth apart.", ref: "17:37" },
  { text: "Indeed, Allah is with those who fear Him and those who are doers of good.", ref: "16:128" },
  { text: "Not equal are the companions of the Fire and the companions of Paradise.", ref: "59:20" },
  { text: "He who obeys the Messenger has obeyed Allah.", ref: "4:80" },
  { text: "Gardens of Eternity — beneath them rivers flow.", ref: "18:31" },
  { text: "O you who have believed, seek help through patience and prayer.", ref: "2:153" },
  { text: "Indeed, the most noble of you in the sight of Allah is the most righteous.", ref: "49:13" },
  { text: "And He taught Adam the names of all things.", ref: "2:31" },
  { text: "We created you from a single pair of male and female, and made you into nations and tribes.", ref: "49:13" },
  { text: "Truly, my prayer, my rites of sacrifice, my living and my dying are for Allah.", ref: "6:162" },
  { text: "And He is the Oft-Returning, the Merciful.", ref: "110:3" },
  { text: "Nothing will befall us except what Allah has decreed for us.", ref: "9:51" },
  { text: "And your Lord has decreed that you not worship except Him, and to parents, good treatment.", ref: "17:23" },
  { text: "Do not follow that of which you have no knowledge.", ref: "17:36" },
  { text: "The Hour is surely coming — there is no doubt about it.", ref: "22:7" },
  { text: "Proclaim, He is Allah — One, the Eternal Refuge, neither begets nor is born.", ref: "112:1-4" },
  { text: "And rely upon the Ever-Living who does not die.", ref: "25:58" },
  { text: "Indeed, the patient will be given their reward without account.", ref: "39:10" },
  { text: "My mercy encompasses all things.", ref: "7:156" },
  { text: "Verily We: It is We Who have sent down the Quran and surely, We will guard it.", ref: "15:9" },
  { text: "Indeed, the righteous will be among gardens and springs.", ref: "51:15" },
  { text: "And He found you lost and guided [you].", ref: "93:7" },
  { text: "So be patient. Indeed, the promise of Allah is truth.", ref: "30:60" },
  { text: "Allah does not like the arrogant.", ref: "4:36" },
  { text: "And He is with you wherever you are.", ref: "57:4" },
  { text: "Indeed, the hearing, the sight and the heart — about all those one will be questioned.", ref: "17:36" },
  { text: "O you who believe! Enter into Islam wholeheartedly.", ref: "2:208" },
  { text: "Nay, We hurl Truth against falsehood, and it knocks out its brain.", ref: "21:18" },
  { text: "And walk upon the earth with humility.", ref: "25:63" },
  { text: "Indeed, those who give charity — their reward is with their Lord.", ref: "2:274" },
  { text: "And give glad tidings to the patient — who say when struck by affliction: Indeed, to Allah we belong.", ref: "2:155-156" },
  { text: "It is He Who accepts repentance from His servants.", ref: "9:104" },
  { text: "And spend from what We have provided you before death approaches one of you.", ref: "63:10" },
  { text: "Hold firmly to the rope of Allah all together and do not become divided.", ref: "3:103" },
  { text: "And He is the All-Forgiving, the All-Loving.", ref: "85:14" },
  { text: "Repel evil with that which is better.", ref: "41:34" },
  { text: "And lower your wing to those who follow you of the believers.", ref: "26:215" },
  { text: "Indeed, with the remembrance of Allah do hearts find rest.", ref: "13:28" },
  { text: "He is Allah, besides Whom there is no deity, Knower of the unseen and the witnessed.", ref: "59:22" },
  { text: "And Allah is Hearing and Knowing.", ref: "2:227" },
  { text: "O My servants who have transgressed against themselves — do not despair of the mercy of Allah.", ref: "39:53" },
];

const SCHEDULE = [
  { time: "9:30–11am",       label: "Focus Time",             icon: "🎧", type: "focus" },
  { time: "11–11:50am",      label: "Eng, Ops & CS Review",   icon: "🔵", type: "meeting" },
  { time: "11:10am",         label: "Short Break",             icon: "☕", type: "break" },
  { time: "11:30am–12:30pm", label: "Admin Block",             icon: "📋", type: "admin" },
  { time: "12:45–1:45pm",    label: "Lunch Break",             icon: "🍽️", type: "break" },
  { time: "2–5pm",           label: "Focus Time",              icon: "🎧", type: "focus" },
  { time: "4–4:50pm",        label: "Growth Team Sync",        icon: "🔵", type: "meeting" },
  { time: "5:10pm",          label: "Break",                   icon: "☕", type: "break" },
  { time: "6pm",             label: "Small Task",              icon: "⭕", type: "admin" },
];

const TASKS = [
  { text: "Fajr",    tag: "prayer" },
  { text: "Dhur",    tag: "prayer" },
  { text: "Asr",     tag: "prayer" },
  { text: "Maghrib", tag: "prayer" },
  { text: "Isha",    tag: "prayer" },
  { text: "Write 1000 words", tag: "habit" },
  { text: "Walk / sunlight",  tag: "habit" },
  { text: "Breakfast",        tag: "habit" },
  { text: "Lunch",            tag: "habit" },
  { text: "Dinner",           tag: "habit" },
  { text: "Deep work",  tag: "work" },
  { text: "Meetings",   tag: "work" },
  { text: "Admin",      tag: "work" },
];

const TAG_STYLE = {
  prayer: { bg: "#2d1f47", accent: "#c084fc", label: "🤲 Prayers" },
  habit:  { bg: "#1a3328", accent: "#4ade80", label: "⚡ Habits"  },
  work:   { bg: "#1a2d4a", accent: "#60a5fa", label: "💼 Work"    },
};

const SCH_STYLE = {
  focus:   "#1D3A6B",
  meeting: "#1a2d4a",
  break:   "#1a1f26",
  admin:   "#1e2d20",
};

// ─── HELPERS ─────────────────────────────────────────────────
function toKey(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString().split("T")[0];
}

function fmt(d) {
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

function fmtShort(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return "السلام عليكم 🌙";
  if (h < 12) return "السلام عليكم ☀️";
  if (h < 17) return "السلام عليكم 🌤️";
  if (h < 20) return "السلام عليكم 🌅";
  return "السلام عليكم 🌙";
}

// ─── THEME ───────────────────────────────────────────────────
const C = {
  bg:      "#07090d",
  surface: "#0e1117",
  card:    "#131921",
  card2:   "#161d27",
  border:  "#1e2837",
  border2: "#253347",
  text:    "#e8eef5",
  muted:   "#5a6a7e",
  muted2:  "#7a8fa8",
  green:   "#10b981",
  green2:  "#059669",
  teal:    "#0d9488",
  blue:    "#3b82f6",
  purple:  "#8b5cf6",
  gold:    "#f59e0b",
  period:  "#ec4899",
  grad1:   "linear-gradient(135deg, #10b981, #0d9488)",
  grad2:   "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  grad3:   "linear-gradient(135deg, #f59e0b, #ef4444)",
};

const s = {
  input: {
    width: "100%", padding: "8px 12px", background: "#0a0f16",
    border: `1px solid ${C.border}`, borderRadius: 8, color: C.text,
    fontSize: 13, boxSizing: "border-box", outline: "none",
    fontFamily: "'Outfit', -apple-system, sans-serif",
    transition: "border-color 0.2s",
  },
  btn: {
    padding: "8px 18px", background: C.green, border: "none",
    borderRadius: 9, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
    transition: "all 0.2s", letterSpacing: "0.02em",
  },
  nav: {
    padding: "7px 16px", background: C.card, border: `1px solid ${C.border2}`,
    borderRadius: 9, color: C.text, cursor: "pointer", fontSize: 12, fontWeight: 600,
    transition: "all 0.15s", letterSpacing: "0.01em",
    display: "flex", alignItems: "center", gap: 5,
  },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────
function Card({ children, style, glow }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, padding: "16px 18px",
      border: `1px solid ${glow ? C.border2 : C.border}`,
      boxShadow: glow ? `0 0 24px ${glow}18` : "none",
      ...style
    }}>
      {children}
    </div>
  );
}

function SectionHead({ children, accent }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.14em", color: accent || C.muted, marginBottom: 10,
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <div style={{ width: 3, height: 12, borderRadius: 2, background: accent || C.muted, flexShrink: 0 }} />
      {children}
    </div>
  );
}

function Stat({ label, value, accent, sub }) {
  return (
    <div style={{
      background: "#080d14", padding: "12px 8px", borderRadius: 12,
      textAlign: "center", border: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, background: `${accent || C.green}08`,
        borderRadius: 12,
      }} />
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || C.text, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{value}</div>
      <div style={{ fontSize: 9, color: C.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: accent, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(localStorage.getItem("cc_user") || "");
  const [nameInput, setNameInput] = useState("");

  const [date, setDate] = useState(new Date());
  const today = new Date();

  // Per-day state
  const [done,           setDone]          = useState({});
  const [notes,          setNotes]         = useState("");
  const [journal,        setJournal]       = useState(["", "", ""]);
  const [waterCups,      setWaterCups]     = useState(0);
  const [period,         setPeriod]        = useState(false);
  const [reading,        setReading]       = useState("");
  const [bookTitle,      setBookTitle]     = useState("");
  const [bookPoints,     setBookPoints]    = useState("");
  const [booksCompleted, setBooksCompleted]= useState(0);
  const [meals,          setMeals]         = useState({ breakfast: "", lunch: "", dinner: "", snacks: "" });
  const [driveLink,      setDriveLink]     = useState("");
  const [writingNote,    setWritingNote]   = useState("");
  const [officeTasks,    setOfficeTasks]   = useState([
    { id: 1, text: "", done: false },
    { id: 2, text: "", done: false },
    { id: 3, text: "", done: false },
  ]);

  const [waterStreak,   setWaterStreak]   = useState(0);
  const [loaded,        setLoaded]        = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [verseIdx,      setVerseIdx]      = useState(0);
  const [verseAnim,     setVerseAnim]     = useState(true);

  const bookBarRef = useRef(null);
  const isDragging = useRef(false);

  const dayKey    = toKey(date);
  const isToday   = dayKey === toKey(today);

  // ── Future date limit: Dec 31 2026 ──
  const maxDate = new Date(2026, 11, 31); // Dec 31 2026
  const isAtMax = toKey(date) >= toKey(maxDate);

  const isWeekend = [0, 6].includes(date.getDay());
  const readTarget = isWeekend ? "20–30 pages" : "10–15 pages";

  // Day label for nav
  const isFuture = date > today;
  const dayLabel = isToday ? "Today" : isFuture ? `📅 ${fmtShort(date)}` : `📅 Past · ${fmtShort(date)}`;

  // Rotate Quran verse every 30 seconds
  useEffect(() => {
    const seed = Math.floor(Date.now() / 30000) % QURAN_VERSES.length;
    setVerseIdx(seed);
    const interval = setInterval(() => {
      setVerseAnim(false);
      setTimeout(() => {
        setVerseIdx(i => (i + 1) % QURAN_VERSES.length);
        setVerseAnim(true);
      }, 400);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // LOGIN
  if (!user) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        minHeight: "100vh", background: C.bg,
        fontFamily: "'Outfit', -apple-system, sans-serif",
      }}>
        <div style={{
          background: C.card, padding: "40px 36px", borderRadius: 24,
          border: `1px solid ${C.border2}`, width: 360, maxWidth: "90vw",
          boxShadow: `0 0 60px ${C.green}15`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60, width: 180, height: 180,
            borderRadius: "50%", background: `${C.green}15`, filter: "blur(40px)",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40, width: 120, height: 120,
            borderRadius: "50%", background: `${C.purple}10`, filter: "blur(30px)",
          }} />

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 42, marginBottom: 8, textAlign: "center" }}>🌙</div>
            <h2 style={{
              margin: "0 0 4px", fontSize: 26, fontWeight: 800,
              textAlign: "center", color: C.text,
              background: C.grad1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Aashika's Daily Sanctuary</h2>
            <p style={{
              color: C.muted2, fontSize: 13, marginBottom: 6,
              textAlign: "center", lineHeight: 1.6,
            }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p style={{
              color: C.muted, fontSize: 12, marginBottom: 24,
              textAlign: "center", fontStyle: "italic",
            }}>Your personal command centre — powered by faith & purpose</p>

            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && nameInput.trim()) {
                  localStorage.setItem("cc_user", nameInput.trim());
                  setUser(nameInput.trim());
                }
              }}
              placeholder="Enter your name..."
              style={{
                ...s.input, marginBottom: 12, padding: "11px 14px", fontSize: 14,
                borderRadius: 10, textAlign: "center",
              }}
            />
            <button
              style={{
                ...s.btn, width: "100%", padding: "11px 0", fontSize: 14,
                borderRadius: 10, background: C.grad1, fontWeight: 700,
              }}
              onClick={() => {
                if (nameInput.trim()) {
                  localStorage.setItem("cc_user", nameInput.trim());
                  setUser(nameInput.trim());
                }
              }}
            >
              Enter your sanctuary →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOAD ──
  useEffect(() => {
    setLoaded(false);
    (async () => {
      const { data } = await supabase.from("tracker").select("data")
        .eq("user_name", user).eq("date", dayKey).maybeSingle();

      if (data?.data) {
        const d = data.data;
        setDone(d.done || {});
        setNotes(d.notes || "");
        setJournal(d.journal || ["", "", ""]);
        setWaterCups(d.waterCups ?? 0);
        setPeriod(d.period || false);
        setReading(d.reading || "");
        setBookTitle(d.bookTitle || "");
        setBookPoints(d.bookPoints || "");
        setBooksCompleted(d.booksCompleted ?? 0);
        setMeals(d.meals || { breakfast: "", lunch: "", dinner: "", snacks: "" });
        setDriveLink(d.driveLink || "");
        setWritingNote(d.writingNote || "");
        setOfficeTasks(d.officeTasks || [
          { id: 1, text: "", done: false },
          { id: 2, text: "", done: false },
          { id: 3, text: "", done: false },
        ]);
      } else {
        setDone({}); setNotes(""); setJournal(["", "", ""]);
        setWaterCups(0); setPeriod(false); setReading("");
        setBookTitle(""); setBookPoints(""); setBooksCompleted(0);
        setMeals({ breakfast: "", lunch: "", dinner: "", snacks: "" });
        setDriveLink(""); setWritingNote("");
        setOfficeTasks([
          { id: 1, text: "", done: false },
          { id: 2, text: "", done: false },
          { id: 3, text: "", done: false },
        ]);
      }

      // Water streak
      const keys = Array.from({ length: 30 }, (_, i) => {
        const d2 = new Date(today); d2.setDate(today.getDate() - i - 1);
        return toKey(d2);
      });
      const { data: history } = await supabase.from("tracker").select("date,data")
        .eq("user_name", user).in("date", keys);

      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const d2 = new Date(today); d2.setDate(today.getDate() - i - 1);
        const k = toKey(d2);
        const row = history?.find(r => r.date === k);
        if (row?.data?.waterCups >= WATER_CUPS) streak++;
        else break;
      }
      setWaterStreak(streak);
      setLoaded(true);
    })();
  }, [dayKey, user]);

  // ── SAVE ──
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      setSaving(true);
      await supabase.from("tracker").upsert(
        {
          user_name: user, date: dayKey,
          data: {
            done, notes, journal, waterCups, period, reading,
            bookTitle, bookPoints, booksCompleted, meals,
            driveLink, writingNote, officeTasks,
          }
        },
        { onConflict: "user_name,date" }
      );
      setSaving(false);
    })();
  }, [done, notes, journal, waterCups, period, reading, bookTitle, bookPoints, booksCompleted, meals, driveLink, writingNote, officeTasks, loaded, dayKey]);

  // ── HELPERS ──
  const toggle = (i) => { if (period) return; setDone(p => ({ ...p, [i]: !p[i] })); };

  // ── FIX: changeDay now works for ALL dates, past AND future, up to Dec 31 2026 ──
  const changeDay = (dir) => {
    const d = new Date(date);
    d.setDate(d.getDate() + dir);
    // Don't go beyond Dec 31 2026
    if (d > maxDate) return;
    setDate(d);
  };

  const grouped = { prayer: [], habit: [], work: [] };
  TASKS.forEach((t, i) => grouped[t.tag].push({ ...t, i }));

  const doneCount = Object.values(done).filter(Boolean).length;
  const pct = Math.round((doneCount / TASKS.length) * 100) || 0;
  const waterML = waterCups * ML_PER_CUP;

  const addOfficeTask = () => setOfficeTasks(prev => [...prev, { id: Date.now(), text: "", done: false }]);
  const updateOfficeTask = (id, field, val) => setOfficeTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));
  const removeOfficeTask = (id) => setOfficeTasks(prev => prev.filter(t => t.id !== id));

  const officeDone = officeTasks.filter(t => t.done && t.text.trim()).length;
  const officeTotal = officeTasks.filter(t => t.text.trim()).length;

  // Book bar drag
  const handleBookDrag = (clientX) => {
    if (!bookBarRef.current) return;
    const rect = bookBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setBooksCompleted(Math.round(ratio * TOTAL_BOOKS));
  };

  const verse = QURAN_VERSES[verseIdx];

  // ── RENDER ──
  return (
    <div style={{
      display: "flex", background: C.bg, color: C.text, minHeight: "100vh",
      fontFamily: "'Outfit', -apple-system, sans-serif",
    }}>
      {/* ══════════ LEFT PANEL ══════════ */}
      <div style={{
        flex: "0 0 370px", borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 20px 16px",
          background: `linear-gradient(180deg, ${C.green}08 0%, transparent 100%)`,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: 4,
        }}>
          {/* Greeting + name */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: C.green,
                letterSpacing: "0.04em", marginBottom: 2,
              }}>{getGreeting()}</div>
              <h2 style={{
                margin: "0 0 0", fontSize: 20, fontWeight: 800, lineHeight: 1.2,
                background: C.grad1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {user === "Aashika" || user === "aashika" ? "Aashika ✨" : user}
              </h2>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{dayLabel}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: saving ? C.gold : C.green,
                display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: saving ? C.gold : C.green,
                  boxShadow: `0 0 6px ${saving ? C.gold : C.green}`,
                }} />
                {saving ? "saving..." : "saved"}
              </div>
              <div style={{
                fontSize: 10, color: C.muted, marginTop: 4,
                background: C.surface, padding: "2px 8px", borderRadius: 6,
                border: `1px solid ${C.border}`,
              }}>{fmt(date)}</div>
            </div>
          </div>

          {/* ── IMPROVED DATE NAV ── */}
          <div style={{
            display: "flex", gap: 6, alignItems: "center",
            background: C.surface, borderRadius: 12, padding: "8px 10px",
            border: `1px solid ${C.border}`, marginBottom: 14,
          }}>
            {/* Prev */}
            <button
              style={{
                ...s.nav,
                background: "transparent", border: `1px solid ${C.border}`,
                borderRadius: 8, padding: "6px 12px", fontSize: 12,
                color: C.muted2,
              }}
              onClick={() => changeDay(-1)}
            >
              ← Prev
            </button>

            {/* Center: date display + today button */}
            <div style={{ flex: 1, textAlign: "center" }}>
              {!isToday ? (
                <button
                  style={{
                    background: `${C.green}18`, border: `1px solid ${C.green}40`,
                    borderRadius: 8, padding: "5px 14px", color: C.green,
                    cursor: "pointer", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.03em",
                  }}
                  onClick={() => setDate(new Date())}
                >
                  ↩ Jump to Today
                </button>
              ) : (
                <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>
                  ✦ Today
                </span>
              )}
            </div>

            {/* Next — enabled up to Dec 31 2026 */}
            <button
              style={{
                ...s.nav,
                background: "transparent",
                border: `1px solid ${isAtMax ? C.border : C.border2}`,
                borderRadius: 8, padding: "6px 12px", fontSize: 12,
                color: isAtMax ? C.muted : C.muted2,
                cursor: isAtMax ? "not-allowed" : "pointer",
                opacity: isAtMax ? 0.4 : 1,
              }}
              onClick={() => { if (!isAtMax) changeDay(1); }}
              disabled={isAtMax}
            >
              Next →
            </button>
          </div>

          {/* Future day banner */}
          {isFuture && !isToday && (
            <div style={{
              marginBottom: 10, padding: "8px 12px", borderRadius: 10,
              background: `${C.blue}12`, border: `1px solid ${C.blue}30`,
              fontSize: 11, color: C.blue, display: "flex", alignItems: "center", gap: 6,
            }}>
              🗓️ <strong>Future day</strong> — plan ahead for {fmt(date)}
            </div>
          )}

          {/* Quran verse */}
          <div style={{
            background: `linear-gradient(135deg, ${C.purple}12, ${C.green}08)`,
            border: `1px solid ${C.purple}30`, borderRadius: 12,
            padding: "12px 14px",
            transition: "opacity 0.4s",
            opacity: verseAnim ? 1 : 0,
          }}>
            <div style={{ fontSize: 9, color: C.purple, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 5, textTransform: "uppercase" }}>
              ✦ Quranic Reminder
            </div>
            <div style={{ fontSize: 12.5, color: "#d4bbff", lineHeight: 1.6, fontStyle: "italic" }}>
              "{verse.text}"
            </div>
            <div style={{ fontSize: 10, color: C.muted2, marginTop: 5, textAlign: "right", fontWeight: 600 }}>
              — Quran {verse.ref}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: "14px 20px 10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
            <Stat label="Done"  value={doneCount}   accent={C.green} />
            <Stat label="Left"  value={TASKS.length - doneCount} accent={C.muted2} />
            <Stat label="Score" value={`${pct}%`}   accent={pct === 100 ? C.green : C.blue} />
            <Stat label="Water" value={`${waterCups}/${WATER_CUPS}`} accent={C.blue} />
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: "#0a0f16", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: 4, borderRadius: 99,
              background: pct === 100 ? C.grad1 : `linear-gradient(90deg, ${C.green}, ${C.teal})`,
              width: `${pct}%`, transition: "width 0.5s ease",
            }} />
          </div>
          {pct === 100 && (
            <div style={{ textAlign: "center", fontSize: 11, color: C.green, marginTop: 6, fontWeight: 700 }}>
              🎉 MashAllah! Perfect day, Aashika!
            </div>
          )}
        </div>

        {/* Period toggle */}
        <div style={{ padding: "0 20px", marginBottom: 12 }}>
          <div onClick={() => setPeriod(p => !p)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 12, cursor: "pointer",
            background: period ? "#2d1020" : C.card,
            border: `1px solid ${period ? C.period + "60" : C.border}`,
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 36, height: 20, borderRadius: 99,
              background: period ? C.period : "#1e2837", position: "relative", flexShrink: 0,
              transition: "background 0.2s",
            }}>
              <div style={{
                position: "absolute", top: 2, left: period ? 18 : 2, width: 16, height: 16,
                borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: period ? C.period : C.text }}>🌸 Period Mode</div>
              <div style={{ fontSize: 11, color: C.muted }}>{period ? "Rest day — all tasks paused 💗" : "Toggle on period days"}</div>
            </div>
          </div>
        </div>

        {/* Task sections */}
        <div style={{ padding: "0 20px", flex: 1 }}>
          {["prayer", "habit", "work"].map(tag => {
            const list = grouped[tag];
            const ts = TAG_STYLE[tag];
            const tagDone = list.filter(t => done[t.i]).length;
            return (
              <div key={tag} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <SectionHead accent={ts.accent}>{ts.label}</SectionHead>
                  <span style={{
                    fontSize: 10, color: ts.accent, fontWeight: 700,
                    background: ts.bg, padding: "2px 8px", borderRadius: 6,
                  }}>{tagDone}/{list.length}</span>
                </div>
                {list.map(t => {
                  const isDone = !!done[t.i];
                  return (
                    <div key={t.i} onClick={() => toggle(t.i)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                      borderRadius: 10, marginBottom: 5, cursor: period ? "not-allowed" : "pointer",
                      background: isDone ? `${ts.bg}` : C.card,
                      border: `1px solid ${isDone ? ts.accent + "40" : C.border}`,
                      opacity: period ? 0.3 : 1,
                      transition: "all 0.15s",
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                        border: `1.5px solid ${isDone ? ts.accent : C.border}`,
                        background: isDone ? ts.accent : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {isDone && <span style={{ color: "#000", fontSize: 10, fontWeight: 800 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: 13, flex: 1,
                        textDecoration: isDone ? "line-through" : "none",
                        color: isDone ? C.muted : C.text,
                      }}>{t.text}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Schedule */}
        <div style={{ padding: "0 20px 24px" }}>
          <SectionHead accent={C.blue}>🗓 Today's Schedule</SectionHead>
          {SCHEDULE.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderRadius: 9, marginBottom: 4,
              background: SCH_STYLE[item.type],
              border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{item.time}</div>
              </div>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: item.type === "focus" ? C.blue : item.type === "meeting" ? C.purple : item.type === "break" ? C.muted : C.green,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MIDDLE PANEL ══════════ */}
      <div style={{ flex: 1, padding: "20px 18px", overflowY: "auto", borderRight: `1px solid ${C.border}` }}>

        {/* Water Tracker */}
        <Card style={{ marginBottom: 16 }} glow={C.blue}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <SectionHead accent={C.blue}>💧 Water Intake</SectionHead>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {waterStreak > 0 && (
                <span style={{
                  fontSize: 11, background: `${C.blue}20`, color: C.blue,
                  padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                  border: `1px solid ${C.blue}30`,
                }}>
                  🔥 {waterStreak}d streak
                </span>
              )}
              <span style={{
                fontSize: 12, color: waterCups >= WATER_CUPS ? C.green : C.muted2,
                fontWeight: 700, background: C.surface, padding: "3px 10px",
                borderRadius: 8, border: `1px solid ${C.border}`,
              }}>
                {waterML}ml / 3000ml
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {Array.from({ length: WATER_CUPS }).map((_, i) => {
              const filled = i < waterCups;
              return (
                <div key={i} onClick={() => setWaterCups(filled ? i : i + 1)}
                  style={{
                    width: 44, height: 54, borderRadius: 10, cursor: "pointer",
                    border: `2px solid ${filled ? C.blue : C.border}`,
                    background: filled
                      ? "linear-gradient(180deg, #93c5fd22 0%, #3b82f655 100%)"
                      : C.surface,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", transition: "all 0.15s", fontSize: 18,
                    boxShadow: filled ? `0 0 10px ${C.blue}30` : "none",
                  }}>
                  <span>{filled ? "💧" : "○"}</span>
                  <span style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>{(i + 1) * ML_PER_CUP}ml</span>
                </div>
              );
            })}
          </div>

          {waterCups >= WATER_CUPS && (
            <div style={{
              textAlign: "center", fontSize: 12, color: C.green, fontWeight: 700,
              padding: "8px", background: `${C.green}12`, borderRadius: 10,
              border: `1px solid ${C.green}30`,
            }}>
              🎉 Hydration goal reached! MashAllah Aashika! Streak: {waterStreak + 1} day{waterStreak !== 0 ? "s" : ""}
            </div>
          )}
        </Card>

        {/* Food Log */}
        <Card style={{ marginBottom: 16 }} glow={C.gold}>
          <SectionHead accent={C.gold}>🍽️ Food Log</SectionHead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { key: "breakfast", label: "🌅 Breakfast", placeholder: "What did you eat for breakfast?" },
              { key: "lunch",     label: "☀️ Lunch",     placeholder: "What did you have for lunch?" },
              { key: "dinner",    label: "🌙 Dinner",    placeholder: "What did you eat for dinner?" },
              { key: "snacks",    label: "🍎 Snacks",    placeholder: "Tea, coffee, snacks..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <div style={{ fontSize: 11, color: C.muted2, marginBottom: 4, fontWeight: 600 }}>{label}</div>
                <textarea
                  value={meals[key]}
                  onChange={e => setMeals(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ ...s.input, minHeight: 48, resize: "vertical", display: "block", fontSize: 12 }}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Writing Space */}
        <Card style={{ marginBottom: 16 }} glow={C.green}>
          <SectionHead accent={C.green}>✍️ 1000 Words Writing Space</SectionHead>
          <div style={{ fontSize: 11, color: C.muted2, marginBottom: 6, fontWeight: 600 }}>
            📁 Google Drive Folder Link
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={driveLink}
              onChange={e => setDriveLink(e.target.value)}
              placeholder="Paste your Drive folder URL here..."
              style={{ ...s.input, flex: 1 }}
            />
            <button
              onClick={() => { if (driveLink.trim()) window.open(driveLink, "_blank"); }}
              style={{
                ...s.btn, background: C.grad1, whiteSpace: "nowrap",
                padding: "8px 14px", fontSize: 12, borderRadius: 9,
              }}
            >
              📝 Write Day {fmtShort(date)}
            </button>
          </div>
          <div style={{ fontSize: 11, color: C.muted2, marginBottom: 4, fontWeight: 600 }}>
            📊 Writing log for {fmt(date)}
          </div>
          <textarea
            value={writingNote}
            onChange={e => setWritingNote(e.target.value)}
            placeholder={`Words written, ideas, blockers...\nTarget: 1000 words ✍️`}
            style={{ ...s.input, minHeight: 60, resize: "vertical", display: "block" }}
          />
        </Card>

        {/* Reading */}
        <Card style={{ marginBottom: 16 }}>
          <SectionHead accent={C.purple}>📖 Reading ({readTarget})</SectionHead>
          <input
            value={reading}
            onChange={e => setReading(e.target.value)}
            placeholder="Pages read today e.g. pp. 45–60..."
            style={s.input}
          />
        </Card>

        {/* Book Tracker */}
        <Card>
          <SectionHead accent={C.gold}>📚 Book Tracker — {TOTAL_BOOKS} Book Goal</SectionHead>
          <input
            value={bookTitle}
            onChange={e => setBookTitle(e.target.value)}
            placeholder="Currently reading..."
            style={{ ...s.input, marginBottom: 8 }}
          />
          <textarea
            value={bookPoints}
            onChange={e => setBookPoints(e.target.value)}
            placeholder="Key ideas, quotes, takeaways..."
            style={{ ...s.input, minHeight: 64, resize: "vertical", display: "block", marginBottom: 14 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 8 }}>
            <span>Annual progress</span>
            <span style={{ color: C.gold, fontWeight: 700 }}>{booksCompleted} of {TOTAL_BOOKS} books</span>
          </div>

          <div
            ref={bookBarRef}
            style={{ position: "relative", height: 40, cursor: "pointer", userSelect: "none", marginBottom: 6 }}
            onMouseDown={e => { isDragging.current = true; handleBookDrag(e.clientX); }}
            onMouseMove={e => { if (isDragging.current) handleBookDrag(e.clientX); }}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            onTouchStart={e => handleBookDrag(e.touches[0].clientX)}
            onTouchMove={e => handleBookDrag(e.touches[0].clientX)}
          >
            <div style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              left: 0, right: 0, height: 6, background: "#0a0f16", borderRadius: 99,
            }} />
            <div style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              left: 0, height: 6, borderRadius: 99,
              background: `linear-gradient(90deg, ${C.gold}, ${C.green})`,
              width: `${(booksCompleted / TOTAL_BOOKS) * 100}%`, transition: "width 0.1s",
            }} />
            {Array.from({ length: TOTAL_BOOKS + 1 }).map((_, idx) => {
              const reached = idx <= booksCompleted;
              const isActive = idx === booksCompleted;
              return (
                <div key={idx} style={{
                  position: "absolute", top: "50%",
                  left: `${(idx / TOTAL_BOOKS) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: isActive ? 22 : 10, height: isActive ? 22 : 10,
                  borderRadius: "50%",
                  background: reached ? C.gold : "#1e2837",
                  border: isActive ? "2.5px solid #fff" : "none",
                  boxShadow: isActive ? `0 0 12px ${C.gold}` : "none",
                  zIndex: 2, transition: "all 0.1s",
                }} />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
            {[0, 3, 6, 9, 12].map(n => (
              <span key={n} style={{ color: n <= booksCompleted ? C.gold : C.muted }}>
                {n === 12 ? "🎉 12" : n}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div style={{ flex: "0 0 310px", padding: "20px 18px", overflowY: "auto" }}>

        {/* Office Tasks */}
        <Card style={{ marginBottom: 16 }} glow={C.blue}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SectionHead accent={C.blue}>🏢 Office Tasks</SectionHead>
            {officeTotal > 0 && (
              <span style={{
                fontSize: 10, color: C.blue, fontWeight: 700,
                background: `${C.blue}20`, padding: "2px 8px",
                borderRadius: 6, border: `1px solid ${C.blue}30`,
              }}>{officeDone}/{officeTotal}</span>
            )}
          </div>
          <div style={{
            fontSize: 11, color: C.blue, fontWeight: 600,
            marginBottom: 10, padding: "8px 12px",
            background: `${C.blue}12`, borderRadius: 10,
            border: `1px solid ${C.blue}25`,
          }}>
            💼 Office tasks to complete today
          </div>

          {officeTasks.map(task => (
            <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div
                onClick={() => updateOfficeTask(task.id, "done", !task.done)}
                style={{
                  width: 18, height: 18, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                  border: `1.5px solid ${task.done ? C.blue : C.border}`,
                  background: task.done ? C.blue : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {task.done && <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>}
              </div>
              <input
                value={task.text}
                onChange={e => updateOfficeTask(task.id, "text", e.target.value)}
                placeholder="Add office task..."
                style={{
                  ...s.input, flex: 1, padding: "6px 10px",
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? C.muted : C.text, fontSize: 12,
                }}
              />
              <button
                onClick={() => removeOfficeTask(task.id)}
                style={{
                  background: "transparent", border: "none", color: C.muted,
                  cursor: "pointer", fontSize: 16, padding: "0 2px", lineHeight: 1,
                  transition: "color 0.15s",
                }}
              >×</button>
            </div>
          ))}

          <button
            onClick={addOfficeTask}
            style={{
              ...s.btn, background: "transparent",
              border: `1px dashed ${C.border2}`,
              color: C.muted2, width: "100%", marginTop: 4, fontSize: 12,
              borderRadius: 9,
            }}
          >+ Add task</button>
        </Card>

        {/* Journal */}
        <Card style={{ marginBottom: 16 }} glow={C.purple}>
          <SectionHead accent={C.purple}>✍️ Journal</SectionHead>
          {["What went well today?", "What lacked / felt off?", "What will you improve tomorrow?"].map((q, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.muted2, marginBottom: 4, fontWeight: 600 }}>{q}</div>
              <textarea
                value={journal[i]}
                onChange={e => { const c = [...journal]; c[i] = e.target.value; setJournal(c); }}
                style={{ ...s.input, minHeight: 54, resize: "vertical", display: "block" }}
              />
            </div>
          ))}
        </Card>

        {/* Notes */}
        <Card style={{ marginBottom: 16 }}>
          <SectionHead accent={C.muted2}>🗒️ Personal Notes</SectionHead>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anything on your mind..."
            style={{ ...s.input, minHeight: 90, resize: "vertical", display: "block" }}
          />
        </Card>

        {/* Day summary */}
        <Card style={{
          background: `linear-gradient(135deg, ${C.card} 0%, #0d1a1a 100%)`,
          border: `1px solid ${C.green}25`,
        }}>
          <SectionHead accent={C.green}>📊 Day at a Glance</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { label: "Tasks",   value: `${doneCount}/${TASKS.length}`, icon: "✅", accent: C.green },
              { label: "Office",  value: officeTotal > 0 ? `${officeDone}/${officeTotal}` : "—", icon: "🏢", accent: C.blue },
              { label: "Water",   value: `${waterML}ml`, icon: "💧", accent: C.blue },
              { label: "Books",   value: `${booksCompleted}/${TOTAL_BOOKS}`, icon: "📚", accent: C.gold },
              { label: "Reading", value: reading || "—", icon: "📖", accent: C.purple },
              { label: "Writing", value: writingNote ? "✓ logged" : "—", icon: "✍️", accent: C.green },
            ].map(({ label, value, icon, accent }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 11px", background: "#080d14", borderRadius: 9,
                border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 12, color: C.muted2 }}>{icon} {label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{value}</span>
              </div>
            ))}
            {period && (
              <div style={{
                textAlign: "center", padding: "8px", background: "#2d1020",
                borderRadius: 9, border: `1px solid ${C.period}30`,
                fontSize: 12, color: C.period, fontWeight: 600,
              }}>
                🌸 Period day — rest is productive
              </div>
            )}
            {pct === 100 && !period && (
              <div style={{
                textAlign: "center", padding: "10px", borderRadius: 9,
                background: `linear-gradient(135deg, ${C.green}18, ${C.teal}10)`,
                border: `1px solid ${C.green}40`, fontSize: 12, color: C.green, fontWeight: 700,
              }}>
                🌟 Perfect day, Aashika! Alhamdulillah!
              </div>
            )}
          </div>

          {/* Day type indicator */}
          {!isToday && (
            <div style={{
              marginTop: 12, padding: "10px 12px", borderRadius: 10,
              background: isFuture ? `${C.blue}10` : `${C.gold}10`,
              border: `1px solid ${isFuture ? C.blue : C.gold}25`,
              fontSize: 11, color: isFuture ? C.blue : C.gold, lineHeight: 1.5,
            }}>
              {isFuture ? "🗓️" : "📅"} You're viewing <strong>{fmt(date)}</strong>.<br />
              {isFuture ? "Plan ahead — data saves automatically." : "All data shown is from that day."}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}