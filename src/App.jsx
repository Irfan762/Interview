import { useState, useEffect } from "react";
import { api } from "./services/api";
import SyncButton from "./components/SyncButton";
import StudyPlanModal from "./components/StudyPlanModal";
import AddTaskModal from "./components/AddTaskModal";
import LoginPage from "./components/LoginPage";

const START_DATE = new Date(2026, 5, 12); // Jun 12 2026

const topics = [
  { day: 1,  topic: "Arrays – Two Pointers, Sliding Window",        tag: "DSA",  tip: "GoFarm & LeetCode 300+; revise edge cases" },
  { day: 1,  topic: "Number Series, Percentages",                    tag: "APT",  tip: "Target <60s/question" },
  { day: 2,  topic: "Strings – Anagrams, Palindromes",               tag: "DSA",  tip: "Link to your 300+ solved habit" },
  { day: 2,  topic: "Time & Work, Profit & Loss",                    tag: "APT",  tip: "Use Vedic maths tricks" },
  { day: 3,  topic: "Linked List – Reverse, Cycle Detection",        tag: "DSA",  tip: "Core pointer logic; common interview Q" },
  { day: 3,  topic: "Ratios, Averages",                              tag: "APT",  tip: "Practice 20 Qs on IndiaBix" },
  { day: 4,  topic: "Stack & Queue – Monotonic Stack",               tag: "DSA",  tip: "Important for next-greater-element problems" },
  { day: 4,  topic: "Logical Reasoning – Arrangements",              tag: "APT",  tip: "TCS NQT pattern; seating & ordering Qs" },
  { day: 5,  topic: "Recursion & Backtracking Basics",               tag: "DSA",  tip: "Foundation for DP; understand call stack deeply" },
  { day: 5,  topic: "Verbal – Para Jumbles, RC",                     tag: "ENG",  tip: "Read 1 article from The Hindu daily" },
  { day: 6,  topic: "Mock Aptitude Test 1 + Week 1 DSA Revision",   tag: "MOCK", tip: "Review arrays, strings, LL, stack, recursion" },
  { day: 6,  topic: "STAR Method – Framework",                       tag: "HR",   tip: "Write your IIT KGP hackathon win as a STAR story" },
  { day: 7,  topic: "LeetCode Contest / Mixed Problems",             tag: "DSA",  tip: "Virtual contest – use your 1356+ rating strategy" },
  { day: 7,  topic: "Write 2 STAR Stories",                          tag: "HR",   tip: "Story 1: IIT KGP win. Story 2: EY top 1.5%" },
  { day: 8,  topic: "Binary Trees – Traversals, Height",             tag: "DSA",  tip: "Pre/In/Post/Level-order; most companies ask these" },
  { day: 8,  topic: "OS – Processes & Threads",                      tag: "CS",   tip: "Relate to Node.js async model in GoFarm" },
  { day: 9,  topic: "BST – Search, Insert, LCA",                     tag: "DSA",  tip: "LCA is very common; practice 3 variants" },
  { day: 9,  topic: "OS – Scheduling Algorithms",                    tag: "CS",   tip: "FCFS, SJF, Round Robin – write pseudo-code" },
  { day: 10, topic: "Graphs – BFS, DFS",                             tag: "DSA",  tip: "Master this – almost every SDE interview asks it" },
  { day: 10, topic: "OOP – 4 Pillars + SOLID",                       tag: "CS",   tip: "Explain with real examples from MERN projects" },
  { day: 11, topic: "Graphs – Topological Sort, SCC",                tag: "DSA",  tip: "Used in build systems, dependency resolution" },
  { day: 11, topic: "DBMS – ER Diagram, Relational Model",           tag: "CS",   tip: "Explain your Wanderlust SQL schema design" },
  { day: 12, topic: "DP Intro – 1D (Fibonacci, Climbing Stairs)",    tag: "DSA",  tip: "Recursion → memoisation → tabulation" },
  { day: 12, topic: "DBMS – Normalization (1NF-3NF)",                tag: "CS",   tip: "Common interview Q; use real table examples" },
  { day: 13, topic: "Mock Aptitude Test 2 + DSA Mock Test 1",       tag: "MOCK", tip: "Simulate real test: no breaks, timed" },
  { day: 13, topic: "HR – Tell Me About Yourself + Why Company?",    tag: "HR",   tip: "Link RSCOE → hackathons → projects in your answer" },
  { day: 14, topic: "LeetCode Mixed Medium Problems",                 tag: "DSA",  tip: "Target Trees & Graphs from Amazon/Microsoft tag" },
  { day: 14, topic: "Revision – DBMS + OOP",                         tag: "CS",   tip: "Flashcard drill: 10 OOP Qs + 10 DBMS Qs" },
  { day: 15, topic: "DP – 2D (Grid, LCS, LIS)",                     tag: "DSA",  tip: "Visualise the DP table; LCS links to strings" },
  { day: 15, topic: "Networks – OSI Model",                          tag: "CS",   tip: "Know all 7 layers + protocols" },
  { day: 16, topic: "DP – Knapsack Variants",                        tag: "DSA",  tip: "0/1 Knapsack → Subset Sum → Partition Equal Subset" },
  { day: 16, topic: "Networks – TCP/IP, HTTP/HTTPS",                 tag: "CS",   tip: "You used REST APIs in GoFarm – explain the HTTP cycle" },
  { day: 17, topic: "Greedy – Activity Selection, Huffman",          tag: "DSA",  tip: "Prove why greedy works: sort by finish time" },
  { day: 17, topic: "SQL – Joins, Subqueries",                       tag: "CS",   tip: "Write 5 JOIN queries from your Wanderlust schema" },
  { day: 18, topic: "Heaps – K Largest, Median Stream",              tag: "DSA",  tip: "Know both min & max heap; Priority Queue" },
  { day: 18, topic: "SQL – Aggregation, Window Functions",           tag: "CS",   tip: "GROUP BY, HAVING, ROW_NUMBER – HackerRank SQL" },
  { day: 19, topic: "Advanced Graphs – Dijkstra, Floyd-Warshall",   tag: "DSA",  tip: "Dijkstra (single source) vs Floyd (all pairs)" },
  { day: 19, topic: "DBMS – Transactions, ACID",                     tag: "CS",   tip: "Relate to MongoDB transactions in GoFarm" },
  { day: 20, topic: "Full Assessment Simulation",                    tag: "MOCK", tip: "3 hrs, no distractions, real company test feel" },
  { day: 20, topic: "Full Mock HR Interview – Self Record",          tag: "HR",   tip: "Record on phone; check clarity, confidence, body language" },
  { day: 21, topic: "Detailed Review – Sim 1",                       tag: "REV",  tip: "Categorise mistakes: concept gap vs careless error" },
  { day: 22, topic: "Revision – Arrays, Strings, LL",               tag: "DSA",  tip: "Re-solve 1-2 hard problems per topic from error log" },
  { day: 22, topic: "Revision – OS Scheduling",                     tag: "CS",   tip: "Draw Gantt charts from memory for FCFS, SJF, RR" },
  { day: 23, topic: "Revision – Trees & Graphs",                    tag: "DSA",  tip: "Re-do 5 classic: BFS, DFS, Topological, LCA, MST" },
  { day: 23, topic: "Revision – OOP Concepts",                      tag: "CS",   tip: "Explain Polymorphism with code from your projects" },
  { day: 24, topic: "Revision – DP Classic Problems",               tag: "DSA",  tip: "Fibonacci, Knapsack, LCS, LIS, Coin Change" },
  { day: 24, topic: "Revision – DBMS + SQL",                        tag: "CS",   tip: "Write 10 SQL queries; revise ACID properties" },
  { day: 25, topic: "Mock Aptitude Test 3 + DSA Mock Test 2",      tag: "MOCK", tip: "Final benchmark – improve on Mock 1 & 2 scores" },
  { day: 25, topic: "Mock HR Interview 2 + Networks Revision",      tag: "HR",   tip: "Focus: leadership story (hackathon) + 5-year plan" },
  { day: 26, topic: "Review All Mock Mistakes",                      tag: "REV",  tip: "Make a 1-page 'Never Again' list" },
  { day: 27, topic: "Easy LeetCode Confidence Boost",               tag: "DSA",  tip: "5 easy problems + scan all cheatsheets" },
  { day: 28, topic: "REST DAY 🌟",                                   tag: "REST", tip: "Sleep well. Trust the process. You've done the work." },
];

// Build 1-4-7 entries: each topic gets Learn (day D), Revise (D+3), Master (D+6)
const buildEntries = () => {
  const entries = [];
  topics.forEach(({ day, topic, tag, tip }, i) => {
    [
      { offset: 0, type: "L" },
      { offset: 3, type: "R1" },
      { offset: 6, type: "R2" },
    ].forEach(({ offset, type }) => {
      const d = day + offset;
      if (d <= 28) {
        entries.push({ id: `${i}-${type}`, day: d, topic, tag, type, tip, topicIdx: i });
      }
    });
  });
  return entries;
};

const allEntries = buildEntries();

const getDate = (day) => {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + day - 1);
  return d;
};

const fmtDate = (day) => {
  const d = getDate(day);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtDayName = (day) => {
  const d = getDate(day);
  return d.toLocaleDateString("en-IN", { weekday: "long" });
};

const TAG_COLORS = {
  DSA:  { bg: "#1565C0", light: "#E3F2FD", text: "#0D47A1" },
  APT:  { bg: "#1976D2", light: "#E8F4FD", text: "#0D47A1" },
  CS:   { bg: "#2E7D32", light: "#E8F5E9", text: "#1B5E20" },
  ENG:  { bg: "#E65100", light: "#FFF3E0", text: "#BF360C" },
  HR:   { bg: "#6A1B9A", light: "#F3E5F5", text: "#4A148C" },
  MOCK: { bg: "#B71C1C", light: "#FFEBEE", text: "#7F0000" },
  REV:  { bg: "#455A64", light: "#ECEFF1", text: "#263238" },
  REST: { bg: "#757575", light: "#F5F5F5", text: "#424242" },
};

const TYPE_CONFIG = {
  L:  { label: "📘 Learn",   color: "#1565C0", bg: "#E3F2FD", short: "L" },
  R1: { label: "🔁 Revise",  color: "#E65100", bg: "#FFF3E0", short: "R1" },
  R2: { label: "✅ Master",  color: "#2E7D32", bg: "#E8F5E9", short: "R2" },
};

const WEEK_COLORS = ["#1B4F72","#145A32","#6E2F8B","#7D6608"];

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("irfan147_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("irfan147") || "{}"); } catch { return {}; }
  });
  const [filter, setFilter] = useState("all"); // all | pending | done
  const [tagFilter, setTagFilter] = useState("all");
  const [activeDay, setActiveDay] = useState(null);
  const [view, setView] = useState("calendar"); // calendar | list
  const [syncing, setSyncing] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [studyPlanDay, setStudyPlanDay] = useState(null);
  const [addTaskDay, setAddTaskDay] = useState(null);
  const [customTasks, setCustomTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("irfan147_custom") || "{}"); } catch { return {}; }
  });

  // Load progress from backend on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await api.getProgress();
        if (progress && Object.keys(progress).length > 0) {
          setDone(progress);
          localStorage.setItem("irfan147", JSON.stringify(progress));
          setBackendAvailable(true);
        }
      } catch (error) {
        console.log("Backend not available, using localStorage");
        setBackendAvailable(false);
      }
    };
    loadProgress();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("irfan147", JSON.stringify(done));
  }, [done]);

  // Sync custom tasks to localStorage
  useEffect(() => {
    localStorage.setItem("irfan147_custom", JSON.stringify(customTasks));
  }, [customTasks]);

  const addCustomTask = (day, taskData) => {
    const taskId = `custom-${day}-${Date.now()}`;
    const newTask = {
      id: taskId,
      day,
      topic: taskData.topic,
      tag: taskData.tag,
      tip: taskData.tip,
      type: "L",
      topicIdx: -1,
    };

    setCustomTasks(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newTask]
    }));
  };

  const deleteCustomTask = (day, taskId) => {
    setCustomTasks(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(t => t.id !== taskId)
    }));
    
    // Also remove from done
    setDone(prev => {
      const newDone = { ...prev };
      delete newDone[taskId];
      return newDone;
    });
  };

  const toggle = async (id) => {
    // Optimistic update
    setDone(prev => ({ ...prev, [id]: !prev[id] }));
    
    // Sync to backend if available
    if (backendAvailable) {
      try {
        setSyncing(true);
        await api.toggleTask(id);
      } catch (error) {
        console.error("Failed to sync to backend:", error);
      } finally {
        setSyncing(false);
      }
    }
  };

  const totalTasks = allEntries.length;
  const doneTasks = Object.values(done).filter(Boolean).length;
  const pct = Math.round((doneTasks / totalTasks) * 100);

  const days = [...new Set(allEntries.map(e => e.day))].sort((a, b) => a - b);
  const tags = ["all", "DSA", "APT", "CS", "ENG", "HR", "MOCK", "REV", "REST"];

  const filteredEntries = (day) => {
    const baseEntries = allEntries.filter(e => e.day === day);
    const customEntries = customTasks[day] || [];
    const allDayEntries = [...baseEntries, ...customEntries];
    
    return allDayEntries
      .filter(e => filter === "all" || (filter === "done" ? done[e.id] : !done[e.id]))
      .filter(e => tagFilter === "all" || e.tag === tagFilter);
  };

  const dayDone = (day) => {
    const baseEntries = allEntries.filter(e => e.day === day);
    const customEntries = customTasks[day] || [];
    return [...baseEntries, ...customEntries].filter(e => done[e.id]).length;
  };
  
  const dayTotal = (day) => {
    const baseEntries = allEntries.filter(e => e.day === day);
    const customEntries = customTasks[day] || [];
    return baseEntries.length + customEntries.length;
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("irfan147_user");
    setUser(null);
  };

  // Show login page if not logged in
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: "#e0e0e0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95))",
        backdropFilter: "blur(10px)",
        borderBottom: "2px solid #FFD700",
        padding: "24px 32px 20px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,215,0,0.1)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ 
                fontSize: 28, 
                fontWeight: "800", 
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: 0.5,
                marginBottom: 6
              }}>
                🧠 Irfan's 1-4-7 Revision Tracker
              </div>
              <div style={{ fontSize: 13, color: "#b0b0b0", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  👤 {user.name}
                </span>
                <span style={{ color: "#555" }}>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  📅 12 Jun – 9 Jul 2026
                </span>
                <span style={{ color: "#555" }}>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  ⏱️ 28 Days
                </span>
                <span style={{ color: "#555" }}>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#FFD700" }}>
                  🏆 IIT KGP Winner
                </span>
                <span style={{ color: "#555" }}>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#4CAF50" }}>
                  ⭐ EY Top 1.5%
                </span>
                <span style={{ color: "#555" }}>•</span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "4px 12px",
                    fontSize: 11,
                    fontWeight: "600",
                    background: "rgba(244, 67, 54, 0.1)",
                    color: "#f44336",
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(244, 67, 54, 0.2)";
                    e.currentTarget.style.borderColor = "#f44336";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(244, 67, 54, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(244, 67, 54, 0.3)";
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>

            {/* Progress */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, color: "#d0d0d0", marginBottom: 6, fontWeight: "500" }}>
                <span style={{ 
                  color: "#4CAF50", 
                  fontWeight: "bold", 
                  fontSize: 24,
                  textShadow: "0 0 20px rgba(76, 175, 80, 0.5)"
                }}>{doneTasks}</span>
                <span style={{ color: "#999", fontSize: 13 }}> / {totalTasks} tasks</span>
              </div>
              <div style={{ 
                width: 240, 
                height: 12, 
                background: "rgba(255,255,255,0.05)", 
                borderRadius: 12, 
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
              }}>
                <div style={{
                  width: `${pct}%`, 
                  height: "100%",
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  borderRadius: 12,
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 0 20px rgba(102, 126, 234, 0.5)",
                }} />
              </div>
              <div style={{ 
                fontSize: 13, 
                fontWeight: "bold",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginTop: 6 
              }}>
                {pct}% Complete
              </div>
              <div style={{ marginTop: 10 }}>
                <SyncButton done={done} onSync={() => setBackendAvailable(true)} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
            {/* View toggle */}
            <div style={{ display: "flex", background: "rgba(13, 27, 42, 0.6)", backdropFilter: "blur(5px)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", marginRight: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              {["calendar","list"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "8px 18px", fontSize: 13, border: "none", cursor: "pointer",
                  background: view === v ? "linear-gradient(135deg, #FFD700, #FFA500)" : "transparent",
                  color: view === v ? "#000" : "#aaa", fontWeight: view === v ? "bold" : "normal",
                  transition: "all 0.3s",
                  transform: view === v ? "scale(1)" : "scale(0.95)"
                }}>{v === "calendar" ? "📅 By Day" : "📋 All Tasks"}</button>
              ))}
            </div>

            {/* Status filter */}
            {["all","pending","done"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", fontSize: 12, borderRadius: 10, border: "2px solid",
                borderColor: filter === f ? "#FFD700" : "rgba(255,255,255,0.1)",
                background: filter === f ? "linear-gradient(135deg, #FFD700, #FFA500)" : "rgba(26, 26, 46, 0.6)",
                backdropFilter: "blur(5px)",
                color: filter === f ? "#000" : "#aaa", cursor: "pointer", fontWeight: filter === f ? "bold" : "normal",
                transition: "all 0.3s",
                boxShadow: filter === f ? "0 4px 12px rgba(255, 215, 0, 0.3)" : "none",
                transform: filter === f ? "translateY(-1px)" : "none"
              }}>
                {f === "all" ? "All" : f === "pending" ? "⏳ Pending" : "✅ Done"}
              </button>
            ))}

            <span style={{ color: "#444", fontSize: 16 }}>|</span>

            {/* Tag filter */}
            {tags.map(t => (
              <button key={t} onClick={() => setTagFilter(t)} style={{
                padding: "6px 14px", fontSize: 11, borderRadius: 10, border: "2px solid",
                borderColor: tagFilter === t ? (TAG_COLORS[t]?.bg || "#FFD700") : "rgba(255,255,255,0.1)",
                background: tagFilter === t ? (TAG_COLORS[t]?.bg || "#FFD700") : "rgba(26, 26, 46, 0.6)",
                backdropFilter: "blur(5px)",
                color: tagFilter === t ? "#fff" : "#888", cursor: "pointer", fontWeight: tagFilter === t ? "bold" : "normal",
                transition: "all 0.3s",
                boxShadow: tagFilter === t ? `0 4px 12px ${TAG_COLORS[t]?.bg || "#FFD700"}66` : "none",
                transform: tagFilter === t ? "translateY(-1px)" : "none"
              }}>{t === "all" ? "All Subjects" : t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* 1-4-7 Legend */}
        <div style={{
          display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap",
          background: "rgba(17, 24, 39, 0.6)", 
          backdropFilter: "blur(10px)",
          borderRadius: 16, 
          padding: "16px 20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          <span style={{ fontSize: 13, color: "#888", marginRight: 8, fontWeight: "600" }}>📚 Legend:</span>
          {Object.entries(TYPE_CONFIG).map(([k, v]) => (
            <span key={k} style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 13,
              background: v.bg, color: v.color, padding: "6px 14px", borderRadius: 24,
              fontWeight: "bold", border: `2px solid ${v.color}`,
              boxShadow: `0 2px 8px ${v.color}33`,
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default"
            }}>{v.label}</span>
          ))}
          <span style={{ fontSize: 12, color: "#666", marginLeft: "auto", alignSelf: "center", fontStyle: "italic" }}>
            L = Learn today · R1 = Revise (3 days later) · R2 = Master (6 days later)
          </span>
        </div>

        {view === "calendar" ? (
          /* ── CALENDAR VIEW ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {days.map(day => {
              const entries = filteredEntries(day);
              if (entries.length === 0 && (filter !== "all" || tagFilter !== "all")) return null;
              const dDone = dayDone(day);
              const dTotal = dayTotal(day);
              const allDone = dDone === dTotal;
              const week = Math.ceil(day / 7);
              const isOpen = activeDay === day;

              return (
                <div key={day} style={{
                  background: allDone 
                    ? "linear-gradient(135deg, rgba(16, 46, 16, 0.6), rgba(20, 60, 20, 0.4))" 
                    : "linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))",
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${allDone ? "#4CAF50" : isOpen ? "#FFD700" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 16, 
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isOpen 
                    ? "0 8px 32px rgba(255,215,0,0.3), 0 0 0 3px rgba(255,215,0,0.1)" 
                    : allDone 
                    ? "0 4px 16px rgba(76, 175, 80, 0.2)"
                    : "0 2px 8px rgba(0,0,0,0.3)",
                  transform: isOpen ? "translateY(-2px)" : "none",
                }}>
                  {/* Day header – clickable to expand */}
                  <button onClick={() => setActiveDay(isOpen ? null : day)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 20px", background: "transparent", border: "none",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Week badge */}
                    <div style={{
                      minWidth: 36, height: 36, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${WEEK_COLORS[week - 1]}, ${WEEK_COLORS[week - 1]}dd)`,
                      display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: "bold", color: "#fff",
                      boxShadow: `0 4px 12px ${WEEK_COLORS[week - 1]}66`,
                      border: "2px solid rgba(255,255,255,0.2)"
                    }}>W{week}</div>

                    {/* Day number */}
                    <div style={{
                      minWidth: 60, fontWeight: "800", fontSize: 16,
                      color: allDone ? "#4CAF50" : "#FFD700",
                      textShadow: allDone ? "0 0 10px rgba(76, 175, 80, 0.5)" : "0 0 10px rgba(255, 215, 0, 0.3)"
                    }}>Day {day}</div>

                    {/* Date */}
                    <div style={{ fontSize: 13, color: "#a0aec0", minWidth: 130, fontWeight: "500" }}>
                      📅 {fmtDate(day)} · {fmtDayName(day).slice(0, 3)}
                    </div>

                    {/* Subject tags preview */}
                    <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
                      {[...new Set([
                        ...allEntries.filter(e => e.day === day).map(e => e.tag),
                        ...(customTasks[day] || []).map(e => e.tag)
                      ])].map(t => (
                        <span key={t} style={{
                          fontSize: 10, padding: "4px 10px", borderRadius: 12,
                          background: TAG_COLORS[t]?.bg || "#757575", color: "#fff", fontWeight: "bold",
                          boxShadow: `0 2px 6px ${TAG_COLORS[t]?.bg || "#757575"}66`,
                          border: "1px solid rgba(255,255,255,0.2)"
                        }}>{t}</span>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 110 }}>
                      <div style={{ flex: 1, height: 6, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          width: `${(dDone / dTotal) * 100}%`, height: "100%",
                          background: allDone ? "#4CAF50" : "#FFD700",
                          transition: "width 0.4s",
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: allDone ? "#4CAF50" : "#94a3b8", minWidth: 32 }}>
                        {dDone}/{dTotal}
                      </span>
                    </div>

                    {/* Add Task Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddTaskDay(day);
                      }}
                      style={{
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #4CAF50, #45a049)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 0.3s",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(76, 175, 80, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
                      }}
                    >
                      ➕ Add Task
                    </button>

                    {/* Study Plan Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStudyPlanDay(day);
                      }}
                      style={{
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 0.3s",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                      }}
                    >
                      📚 Study Plan
                    </button>

                    {/* Chevron */}
                    <div style={{ fontSize: 14, color: "#555", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▼</div>
                  </button>

                  {/* Expanded tasks */}
                  {isOpen && (
                    <div style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {filteredEntries(day).length === 0 ? (
                        <div style={{ color: "#555", fontSize: 12, padding: "8px 0" }}>No tasks match the current filter.</div>
                      ) : (
                        filteredEntries(day).map(entry => {
                          const isDone = !!done[entry.id];
                          const tc = TAG_COLORS[entry.tag] || { bg: "#757575" };
                          const tyc = TYPE_CONFIG[entry.type];
                          const isCustom = entry.id.startsWith("custom-");
                          
                          return (
                            <div key={entry.id} style={{
                              display: "flex", alignItems: "center", gap: 12,
                              background: isDone 
                                ? "linear-gradient(135deg, rgba(16, 46, 16, 0.4), rgba(20, 60, 20, 0.2))" 
                                : "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(51, 65, 85, 0.3))",
                              backdropFilter: "blur(5px)",
                              border: `1px solid ${isDone ? "rgba(76, 175, 80, 0.3)" : "rgba(255,255,255,0.1)"}`,
                              borderRadius: 12, padding: "14px 16px",
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              opacity: isDone ? 0.7 : 1,
                              transform: "translateX(0)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateX(4px)";
                              e.currentTarget.style.borderColor = isDone ? "rgba(76, 175, 80, 0.5)" : "rgba(255, 215, 0, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateX(0)";
                              e.currentTarget.style.borderColor = isDone ? "rgba(76, 175, 80, 0.3)" : "rgba(255,255,255,0.1)";
                            }}
                            >
                              {/* Toggle button */}
                              <button onClick={() => toggle(entry.id)} style={{
                                minWidth: 32, height: 32, borderRadius: "50%",
                                border: `3px solid ${isDone ? "#4CAF50" : "#666"}`,
                                background: isDone ? "linear-gradient(135deg, #4CAF50, #45a049)" : "rgba(255,255,255,0.05)",
                                cursor: "pointer", display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 16,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                flexShrink: 0,
                                boxShadow: isDone ? "0 4px 12px rgba(76, 175, 80, 0.4)" : "none",
                                transform: "scale(1)",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                              >{isDone ? "✓" : ""}</button>

                              {/* Type badge */}
                              <span style={{
                                fontSize: 10, padding: "5px 12px", borderRadius: 16,
                                background: tyc.bg, color: tyc.color,
                                fontWeight: "bold", border: `2px solid ${tyc.color}`,
                                minWidth: 70, textAlign: "center", flexShrink: 0,
                                boxShadow: `0 2px 6px ${tyc.color}33`,
                              }}>{tyc.label}</span>

                              {/* Subject tag */}
                              <span style={{
                                fontSize: 10, padding: "5px 12px", borderRadius: 16,
                                background: tc.bg, color: "#fff",
                                fontWeight: "bold", minWidth: 45, textAlign: "center", flexShrink: 0,
                                boxShadow: `0 2px 6px ${tc.bg}66`,
                                border: "1px solid rgba(255,255,255,0.2)"
                              }}>{entry.tag}</span>

                              {/* Topic */}
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: 14, color: isDone ? "#666" : "#f1f5f9",
                                  textDecoration: isDone ? "line-through" : "none",
                                  fontWeight: entry.type === "L" ? "700" : "500",
                                  transition: "all 0.2s",
                                  letterSpacing: 0.3
                                }}>{entry.topic}</div>
                                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                  <span style={{ fontSize: 14 }}>💡</span>
                                  <span>{entry.tip}</span>
                                </div>
                              </div>

                              {/* Delete button for custom tasks */}
                              {isCustom && (
                                <button
                                  onClick={() => deleteCustomTask(day, entry.id)}
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    background: "rgba(244, 67, 54, 0.1)",
                                    color: "#f44336",
                                    border: "1px solid rgba(244, 67, 54, 0.3)",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    flexShrink: 0,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(244, 67, 54, 0.2)";
                                    e.currentTarget.style.borderColor = "#f44336";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(244, 67, 54, 0.1)";
                                    e.currentTarget.style.borderColor = "rgba(244, 67, 54, 0.3)";
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              )}

                              {/* Done label */}
                              {isDone && (
                                <span style={{ 
                                  fontSize: 12, 
                                  color: "#4CAF50", 
                                  fontWeight: "bold", 
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "4px 10px",
                                  background: "rgba(76, 175, 80, 0.1)",
                                  borderRadius: 12,
                                  border: "1px solid rgba(76, 175, 80, 0.3)"
                                }}>
                                  <span>✓</span> Done
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ── LIST VIEW ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {allEntries
              .filter(e => filter === "all" || (filter === "done" ? done[e.id] : !done[e.id]))
              .filter(e => tagFilter === "all" || e.tag === tagFilter)
              .map(entry => {
                const isDone = !!done[entry.id];
                const tc = TAG_COLORS[entry.tag];
                const tyc = TYPE_CONFIG[entry.type];
                const week = Math.ceil(entry.day / 7);
                return (
                  <div key={entry.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: isDone ? "#0a1f0a" : "#0f172a",
                    border: `1px solid ${isDone ? "#2d5a2d" : "#1e293b"}`,
                    borderRadius: 8, padding: "10px 14px",
                    opacity: isDone ? 0.7 : 1,
                    transition: "all 0.25s",
                  }}>
                    <button onClick={() => toggle(entry.id)} style={{
                      minWidth: 26, height: 26, borderRadius: "50%",
                      border: `2px solid ${isDone ? "#4CAF50" : "#555"}`,
                      background: isDone ? "#4CAF50" : "transparent",
                      cursor: "pointer", fontSize: 13, flexShrink: 0, transition: "all 0.2s",
                    }}>{isDone ? "✓" : ""}</button>

                    <div style={{
                      minWidth: 50, fontSize: 10, color: "#FFD700", fontWeight: "bold",
                    }}>Day {entry.day}</div>

                    <div style={{ fontSize: 10, color: "#64748b", minWidth: 80 }}>{fmtDate(entry.day).slice(0, 6)}</div>

                    <span style={{
                      fontSize: 8, padding: "2px 7px", borderRadius: 10,
                      background: WEEK_COLORS[week - 1], color: "#fff", fontWeight: "bold", minWidth: 26, textAlign: "center",
                    }}>W{week}</span>

                    <span style={{
                      fontSize: 9, padding: "2px 7px", borderRadius: 10,
                      background: tyc.bg, color: tyc.color, fontWeight: "bold", border: `1px solid ${tyc.color}`, minWidth: 58, textAlign: "center",
                    }}>{tyc.label}</span>

                    <span style={{
                      fontSize: 9, padding: "2px 7px", borderRadius: 10,
                      background: tc.bg, color: "#fff", fontWeight: "bold", minWidth: 36, textAlign: "center",
                    }}>{entry.tag}</span>

                    <div style={{ flex: 1, fontSize: 12, color: isDone ? "#555" : "#e2e8f0", textDecoration: isDone ? "line-through" : "none" }}>
                      {entry.topic}
                    </div>

                    {isDone && <span style={{ fontSize: 11, color: "#4CAF50", fontWeight: "bold" }}>✓</span>}
                  </div>
                );
              })}
          </div>
        )}

        {/* Stats footer */}
        <div style={{
          marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16,
        }}>
          {[
            { label: "📘 To Learn", count: allEntries.filter(e => e.type === "L").length, done: allEntries.filter(e => e.type === "L" && done[e.id]).length, color: "#1565C0", gradient: "linear-gradient(135deg, #1565C0, #1976D2)" },
            { label: "🔁 To Revise", count: allEntries.filter(e => e.type === "R1").length, done: allEntries.filter(e => e.type === "R1" && done[e.id]).length, color: "#E65100", gradient: "linear-gradient(135deg, #E65100, #F57C00)" },
            { label: "✅ To Master", count: allEntries.filter(e => e.type === "R2").length, done: allEntries.filter(e => e.type === "R2" && done[e.id]).length, color: "#2E7D32", gradient: "linear-gradient(135deg, #2E7D32, #388E3C)" },
            { label: "🎯 Total Tasks", count: totalTasks, done: doneTasks, color: "#FFD700", gradient: "linear-gradient(135deg, #FFD700, #FFA500)" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(15, 23, 42, 0.6)", 
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: 16,
              padding: "20px 20px", 
              textAlign: "center",
              transition: "all 0.3s",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}44`;
              e.currentTarget.style.borderColor = `${s.color}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, fontWeight: "600" }}>{s.label}</div>
              <div style={{ 
                fontSize: 32, 
                fontWeight: "800", 
                background: s.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 4
              }}>
                {s.done}<span style={{ fontSize: 18, color: "#64748b" }}>/{s.count}</span>
              </div>
              <div style={{ marginTop: 10, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ 
                  width: `${(s.done / s.count) * 100}%`, 
                  height: "100%", 
                  background: s.gradient, 
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: `0 0 10px ${s.color}66`
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, fontWeight: "500" }}>
                {Math.round((s.done / s.count) * 100)}% Complete
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "#64748b", padding: "20px" }}>
          <div style={{ marginBottom: 8 }}>
            Progress is saved in your browser · Click any Day to expand · Click ○ to toggle done
          </div>
          {backendAvailable && (
            <div style={{ 
              marginTop: 8, 
              color: "#4CAF50",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "rgba(76, 175, 80, 0.1)",
              borderRadius: 20,
              border: "1px solid rgba(76, 175, 80, 0.3)",
              fontSize: 11,
              fontWeight: "600"
            }}>
              <span style={{ fontSize: 14 }}>✓</span>
              Synced with backend {syncing && "· Syncing..."}
            </div>
          )}
          {!backendAvailable && (
            <div style={{ 
              marginTop: 8, 
              color: "#FFA500",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "rgba(255, 165, 0, 0.1)",
              borderRadius: 20,
              border: "1px solid rgba(255, 165, 0, 0.3)",
              fontSize: 11,
              fontWeight: "600"
            }}>
              <span style={{ fontSize: 14 }}>⚠</span>
              Backend offline · Using local storage only
            </div>
          )}
        </div>
      </div>

      {/* Study Plan Modal */}
      {studyPlanDay && (
        <StudyPlanModal
          day={studyPlanDay}
          topics={allEntries.filter(e => e.day === studyPlanDay && e.type === "L")}
          onClose={() => setStudyPlanDay(null)}
        />
      )}

      {/* Add Task Modal */}
      {addTaskDay && (
        <AddTaskModal
          day={addTaskDay}
          onAdd={(taskData) => addCustomTask(addTaskDay, taskData)}
          onClose={() => setAddTaskDay(null)}
        />
      )}
    </div>
  );
}
