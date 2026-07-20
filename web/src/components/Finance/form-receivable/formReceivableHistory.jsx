import { useState, useEffect } from "react";

export default function FormReceivableHistory({ recordId, apiProvider }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (recordId && apiProvider?.fetchHistory)
      apiProvider.fetchHistory(recordId).then(setHistory);
  }, [recordId]);

  const fmt = (raw) => {
    if (!raw) return "";
    try { return new Date(raw).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return raw; }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {history.length === 0
        ? <p style={{ fontSize: 13, color: "#98a2b3" }}>No history yet.</p>
        : history.map((h, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8f0fe", color: "#234e70", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>A</div>
            <p style={{ margin: 0, fontSize: 13, color: "#344054", lineHeight: 1.5 }}>
              {h.description || h.message || `${h.action || "Updated"} by ${h.user || "User"}`}
              {h.created_at && <span style={{ color: "#98a2b3", fontSize: 12 }}> on {fmt(h.created_at)}</span>}
            </p>
          </div>
        ))}
    </div>
  );
}
