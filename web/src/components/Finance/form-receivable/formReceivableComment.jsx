import { useState, useEffect } from "react";

export default function FormReceivableComment({ recordId, apiProvider }) {
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");
  const [adding, setAdding]     = useState(false);

  useEffect(() => {
    if (recordId && apiProvider?.fetchComments)
      apiProvider.fetchComments(recordId).then(setComments);
  }, [recordId]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    if (!recordId) { alert("Save the record first."); return; }
    setAdding(true);
    try {
      const r = await apiProvider.addComment(recordId, text.trim());
      if (r) { setComments((p) => [...p, r]); setText(""); }
    } finally { setAdding(false); }
  };

  const fmt = (raw) => {
    if (!raw) return "";
    try { return new Date(raw).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return raw; }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <input type="text" placeholder="Enter your comment..." value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ border: "1px solid #d0d5dd", borderRadius: 8, padding: "9px 14px", fontSize: 14, outline: "none" }} />
        <button onClick={handleAdd} disabled={adding || !text.trim()}
          style={{ alignSelf: "flex-start", background: "#234e70", color: "#fff", border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: adding || !text.trim() ? 0.5 : 1 }}>
          {adding ? "Adding..." : "+ Add"}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {comments.length === 0
          ? <p style={{ fontSize: 13, color: "#98a2b3" }}>No comments yet.</p>
          : comments.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#234e70", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {(c.user || c.created_by || "U")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                  {c.user || c.created_by || "User"}{" "}
                  <span style={{ fontWeight: 400, color: "#667085", fontSize: 12 }}>— {fmt(c.created_at)}</span>
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: "#344054" }}>"{c.comment || c.text}"</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
