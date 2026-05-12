import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const START_DATE = new Date(2026, 5, 12);

const topics = [
  { day: 1, topic: "Arrays – Two Pointers, Sliding Window", tag: "DSA", tip: "GoFarm & LeetCode 300+; revise edge cases" },
  { day: 1, topic: "Number Series, Percentages", tag: "APT", tip: "Target <60s/question" },
  { day: 2, topic: "Strings – Anagrams, Palindromes", tag: "DSA", tip: "Link to your 300+ solved habit" },
  { day: 2, topic: "Time & Work, Profit & Loss", tag: "APT", tip: "Use Vedic maths tricks" },
  { day: 3, topic: "Linked List – Reverse, Cycle Detection", tag: "DSA", tip: "Core pointer logic" },
  { day: 3, topic: "Ratios, Averages", tag: "APT", tip: "Practice 20 Qs on IndiaBix" },
  { day: 4, topic: "Stack & Queue – Monotonic Stack", tag: "DSA", tip: "Next-greater-element problems" },
  { day: 4, topic: "Logical Reasoning – Arrangements", tag: "APT", tip: "TCS NQT pattern" },
  { day: 5, topic: "Recursion & Backtracking Basics", tag: "DSA", tip: "Foundation for DP" },
  { day: 5, topic: "Verbal – Para Jumbles, RC", tag: "ENG", tip: "Read 1 article from The Hindu daily" },
  { day: 6, topic: "Mock Aptitude Test 1 + Week 1 DSA Revision", tag: "MOCK", tip: "Review arrays, strings, LL, stack" },
  { day: 6, topic: "STAR Method – Framework", tag: "HR", tip: "Write your IIT KGP hackathon win as STAR" },
  { day: 7, topic: "LeetCode Contest / Mixed Problems", tag: "DSA", tip: "Virtual contest" },
  { day: 7, topic: "Write 2 STAR Stories", tag: "HR", tip: "Story 1: IIT KGP. Story 2: EY top 1.5%" },
  { day: 8, topic: "Binary Trees – Traversals, Height", tag: "DSA", tip: "Pre/In/Post/Level-order" },
  { day: 8, topic: "OS – Processes & Threads", tag: "CS", tip: "Relate to Node.js async model" },
  { day: 9, topic: "BST – Search, Insert, LCA", tag: "DSA", tip: "LCA is very common" },
  { day: 9, topic: "OS – Scheduling Algorithms", tag: "CS", tip: "FCFS, SJF, Round Robin" },
  { day: 10, topic: "Graphs – BFS, DFS", tag: "DSA", tip: "Almost every interview asks it" },
  { day: 10, topic: "OOP – 4 Pillars + SOLID", tag: "CS", tip: "Explain with real examples" },
  { day: 11, topic: "Graphs – Topological Sort, SCC", tag: "DSA", tip: "Build systems, dependency resolution" },
  { day: 11, topic: "DBMS – ER Diagram, Relational Model", tag: "CS", tip: "Explain your schema design" },
  { day: 12, topic: "DP Intro – 1D (Fibonacci, Climbing Stairs)", tag: "DSA", tip: "Recursion → memo → tabulation" },
  { day: 12, topic: "DBMS – Normalization (1NF-3NF)", tag: "CS", tip: "Common interview Q" },
  { day: 13, topic: "Mock Aptitude Test 2 + DSA Mock Test 1", tag: "MOCK", tip: "Simulate real test" },
  { day: 13, topic: "HR – Tell Me About Yourself", tag: "HR", tip: "Link projects in your answer" },
  { day: 14, topic: "LeetCode Mixed Medium Problems", tag: "DSA", tip: "Target Trees & Graphs" },
  { day: 14, topic: "Revision – DBMS + OOP", tag: "CS", tip: "Flashcard drill" },
  { day: 15, topic: "DP – 2D (Grid, LCS, LIS)", tag: "DSA", tip: "Visualise the DP table" },
  { day: 15, topic: "Networks – OSI Model", tag: "CS", tip: "Know all 7 layers" },
  { day: 16, topic: "DP – Knapsack Variants", tag: "DSA", tip: "0/1 → Subset Sum → Partition" },
  { day: 16, topic: "Networks – TCP/IP, HTTP/HTTPS", tag: "CS", tip: "Explain the HTTP cycle" },
  { day: 17, topic: "Greedy – Activity Selection, Huffman", tag: "DSA", tip: "Prove why greedy works" },
  { day: 17, topic: "SQL – Joins, Subqueries", tag: "CS", tip: "Write 5 JOIN queries" },
  { day: 18, topic: "Heaps – K Largest, Median Stream", tag: "DSA", tip: "Priority Queue" },
  { day: 18, topic: "SQL – Aggregation, Window Functions", tag: "CS", tip: "GROUP BY, HAVING" },
  { day: 19, topic: "Advanced Graphs – Dijkstra, Floyd-Warshall", tag: "DSA", tip: "Single source vs all pairs" },
  { day: 19, topic: "DBMS – Transactions, ACID", tag: "CS", tip: "Relate to MongoDB transactions" },
  { day: 20, topic: "Full Assessment Simulation", tag: "MOCK", tip: "3 hrs, no distractions" },
  { day: 20, topic: "Full Mock HR Interview – Self Record", tag: "HR", tip: "Check clarity & confidence" },
  { day: 21, topic: "Detailed Review – Sim 1", tag: "REV", tip: "Categorise mistakes" },
  { day: 22, topic: "Revision – Arrays, Strings, LL", tag: "DSA", tip: "Re-solve hard problems" },
  { day: 22, topic: "Revision – OS Scheduling", tag: "CS", tip: "Draw Gantt charts" },
  { day: 23, topic: "Revision – Trees & Graphs", tag: "DSA", tip: "Re-do 5 classic problems" },
  { day: 23, topic: "Revision – OOP Concepts", tag: "CS", tip: "Explain Polymorphism with code" },
  { day: 24, topic: "Revision – DP Classic Problems", tag: "DSA", tip: "Fibonacci, Knapsack, LCS" },
  { day: 24, topic: "Revision – DBMS + SQL", tag: "CS", tip: "Write 10 SQL queries" },
  { day: 25, topic: "Mock Aptitude Test 3 + DSA Mock Test 2", tag: "MOCK", tip: "Final benchmark" },
  { day: 25, topic: "Mock HR Interview 2 + Networks Revision", tag: "HR", tip: "Leadership story" },
  { day: 26, topic: "Review All Mock Mistakes", tag: "REV", tip: "Make a 'Never Again' list" },
  { day: 27, topic: "Easy LeetCode Confidence Boost", tag: "DSA", tip: "5 easy + scan cheatsheets" },
  { day: 28, topic: "REST DAY 🌟", tag: "REST", tip: "Sleep well. Trust the process." },
];

const buildEntries = () => {
  const entries = [];
  topics.forEach(({ day, topic, tag, tip }, i) => {
    [{ offset: 0, type: "L" }, { offset: 3, type: "R1" }, { offset: 6, type: "R2" }].forEach(({ offset, type }) => {
      const d = day + offset;
      if (d <= 28) entries.push({ id: `${i}-${type}`, day: d, topic, tag, type, tip, topicIdx: i });
    });
  });
  return entries;
};

const allEntries = buildEntries();
const getDate = (day) => { const d = new Date(START_DATE); d.setDate(d.getDate() + day - 1); return d; };
const fmtDate = (day) => getDate(day).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const fmtDayName = (day) => getDate(day).toLocaleDateString("en-IN", { weekday: "short" });

const TAG_COLORS = { DSA: "#1565C0", APT: "#1976D2", CS: "#2E7D32", ENG: "#E65100", HR: "#6A1B9A", MOCK: "#B71C1C", REV: "#455A64", REST: "#757575" };
const TYPE_CONFIG = { L: { label: "📘 Learn", color: "#1565C0", bg: "#E3F2FD" }, R1: { label: "🔁 Revise", color: "#E65100", bg: "#FFF3E0" }, R2: { label: "✅ Master", color: "#2E7D32", bg: "#E8F5E9" } };

export default function TrackerPage() {
  const { user } = useAuth();
  const [done, setDone] = useState(() => { try { return JSON.parse(localStorage.getItem("irfan147") || "{}"); } catch { return {}; } });
  const [filter, setFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [activeDay, setActiveDay] = useState(null);
  const [view, setView] = useState("calendar");

  useEffect(() => { localStorage.setItem("irfan147", JSON.stringify(done)); }, [done]);

  const toggle = (id) => setDone(prev => ({ ...prev, [id]: !prev[id] }));
  const totalTasks = allEntries.length;
  const doneTasks = Object.values(done).filter(Boolean).length;
  const pct = Math.round((doneTasks / totalTasks) * 100);
  const days = [...new Set(allEntries.map(e => e.day))].sort((a, b) => a - b);
  const tags = ["all", "DSA", "APT", "CS", "ENG", "HR", "MOCK", "REV", "REST"];

  const filteredEntries = (day) => allEntries.filter(e => e.day === day)
    .filter(e => filter === "all" || (filter === "done" ? done[e.id] : !done[e.id]))
    .filter(e => tagFilter === "all" || e.tag === tagFilter);

  const dayDone = (day) => allEntries.filter(e => e.day === day && done[e.id]).length;
  const dayTotal = (day) => allEntries.filter(e => e.day === day).length;

  return (
    <div style={{ padding: "24px 20px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg, #FFD700, #FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>🧠 1-4-7 Revision Tracker</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>📅 12 Jun – 9 Jul 2026 · {doneTasks}/{totalTasks} tasks · {pct}% complete</div>
        <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden", marginTop: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)", borderRadius: 8, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 10, overflow: "hidden", marginRight: 8 }}>
          {["calendar", "list"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "7px 16px", fontSize: 12, border: "none", cursor: "pointer", background: view === v ? "linear-gradient(135deg, #FFD700, #FFA500)" : "transparent", color: view === v ? "#000" : "#888", fontWeight: view === v ? 700 : 400 }}>{v === "calendar" ? "📅 Days" : "📋 List"}</button>
          ))}
        </div>
        {["all", "pending", "done"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", fontSize: 11, borderRadius: 8, border: filter === f ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.1)", background: filter === f ? "rgba(255,215,0,0.12)" : "transparent", color: filter === f ? "#FFD700" : "#888", cursor: "pointer" }}>
            {f === "all" ? "All" : f === "pending" ? "⏳ Pending" : "✅ Done"}
          </button>
        ))}
        <span style={{ color: "#333" }}>|</span>
        {tags.map(t => (
          <button key={t} onClick={() => setTagFilter(t)} style={{ padding: "4px 10px", fontSize: 10, borderRadius: 8, border: tagFilter === t ? `1px solid ${TAG_COLORS[t] || "#FFD700"}` : "1px solid rgba(255,255,255,0.1)", background: tagFilter === t ? (TAG_COLORS[t] || "#FFD700") : "transparent", color: tagFilter === t ? "#fff" : "#888", cursor: "pointer", fontWeight: tagFilter === t ? 700 : 400 }}>{t === "all" ? "All" : t}</button>
        ))}
      </div>

      {view === "calendar" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {days.map(day => {
            const entries = filteredEntries(day);
            if (entries.length === 0 && (filter !== "all" || tagFilter !== "all")) return null;
            const dDone = dayDone(day), dTotal = dayTotal(day), allDone = dDone === dTotal;
            const isOpen = activeDay === day;
            return (
              <div key={day} style={{ background: allDone ? "rgba(16,46,16,0.4)" : "rgba(15,23,42,0.5)", border: `1px solid ${allDone ? "#4CAF5066" : isOpen ? "#FFD70066" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setActiveDay(isOpen ? null : day)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: allDone ? "#4CAF50" : "#FFD700", minWidth: 55 }}>Day {day}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 70 }}>{fmtDate(day)} {fmtDayName(day)}</span>
                  <div style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
                    {[...new Set(allEntries.filter(e => e.day === day).map(e => e.tag))].map(t => (
                      <span key={t} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: TAG_COLORS[t] || "#757575", color: "#fff", fontWeight: 700 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
                    <div style={{ flex: 1, height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(dDone / dTotal) * 100}%`, height: "100%", background: allDone ? "#4CAF50" : "#FFD700", transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{dDone}/{dTotal}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#555", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {entries.length === 0 ? <div style={{ color: "#555", fontSize: 12, padding: "8px 0" }}>No tasks match filter.</div> : entries.map(entry => {
                      const isDone = !!done[entry.id];
                      const tyc = TYPE_CONFIG[entry.type];
                      return (
                        <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 10, background: isDone ? "rgba(16,46,16,0.3)" : "rgba(30,41,59,0.4)", border: `1px solid ${isDone ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: "12px 14px", opacity: isDone ? 0.7 : 1, flexWrap: "wrap" }}>
                          <button onClick={() => toggle(entry.id)} style={{ minWidth: 28, height: 28, borderRadius: "50%", border: `2px solid ${isDone ? "#4CAF50" : "#555"}`, background: isDone ? "#4CAF50" : "transparent", cursor: "pointer", fontSize: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{isDone ? "✓" : ""}</button>
                          <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 12, background: tyc.bg, color: tyc.color, fontWeight: 700, border: `1px solid ${tyc.color}`, flexShrink: 0 }}>{tyc.label}</span>
                          <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 12, background: TAG_COLORS[entry.tag], color: "#fff", fontWeight: 700, flexShrink: 0 }}>{entry.tag}</span>
                          <div style={{ flex: 1, minWidth: 150 }}>
                            <div style={{ fontSize: 13, color: isDone ? "#666" : "#f1f5f9", textDecoration: isDone ? "line-through" : "none", fontWeight: entry.type === "L" ? 700 : 400 }}>{entry.topic}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>💡 {entry.tip}</div>
                          </div>
                          {isDone && <span style={{ fontSize: 11, color: "#4CAF50", fontWeight: 700, flexShrink: 0 }}>✓ Done</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {allEntries.filter(e => filter === "all" || (filter === "done" ? done[e.id] : !done[e.id])).filter(e => tagFilter === "all" || e.tag === tagFilter).map(entry => {
            const isDone = !!done[entry.id];
            return (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 8, background: isDone ? "rgba(16,46,16,0.3)" : "rgba(15,23,42,0.5)", border: `1px solid ${isDone ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: "8px 12px", opacity: isDone ? 0.7 : 1, flexWrap: "wrap" }}>
                <button onClick={() => toggle(entry.id)} style={{ minWidth: 24, height: 24, borderRadius: "50%", border: `2px solid ${isDone ? "#4CAF50" : "#555"}`, background: isDone ? "#4CAF50" : "transparent", cursor: "pointer", fontSize: 12, flexShrink: 0 }}>{isDone ? "✓" : ""}</button>
                <span style={{ fontSize: 10, color: "#FFD700", fontWeight: 700, minWidth: 40 }}>D{entry.day}</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, background: TAG_COLORS[entry.tag], color: "#fff", fontWeight: 700 }}>{entry.tag}</span>
                <div style={{ flex: 1, fontSize: 12, color: isDone ? "#555" : "#e2e8f0", textDecoration: isDone ? "line-through" : "none" }}>{entry.topic}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        {[
          { label: "📘 Learn", count: allEntries.filter(e => e.type === "L").length, d: allEntries.filter(e => e.type === "L" && done[e.id]).length, color: "#1565C0" },
          { label: "🔁 Revise", count: allEntries.filter(e => e.type === "R1").length, d: allEntries.filter(e => e.type === "R1" && done[e.id]).length, color: "#E65100" },
          { label: "✅ Master", count: allEntries.filter(e => e.type === "R2").length, d: allEntries.filter(e => e.type === "R2" && done[e.id]).length, color: "#2E7D32" },
          { label: "🎯 Total", count: totalTasks, d: doneTasks, color: "#FFD700" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.d}<span style={{ fontSize: 14, color: "#64748b" }}>/{s.count}</span></div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginTop: 8, overflow: "hidden" }}>
              <div style={{ width: `${(s.d / s.count) * 100}%`, height: "100%", background: s.color, transition: "width 0.4s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
