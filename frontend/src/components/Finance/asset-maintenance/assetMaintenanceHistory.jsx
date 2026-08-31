import { useState, useEffect } from "react";

export default function AssetMaintenanceHistory({ recordId, apiProvider }) {
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
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f2f4f7" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#234e70", marginTop: 5, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{h.action || "Status changed"}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#667085" }}>{h.user || "Admin"} · {fmt(h.created_at)}</p>
              {h.note && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#344054" }}>{h.note}</p>}
            </div>
          </div>
        ))}
    </div>
  );
}
