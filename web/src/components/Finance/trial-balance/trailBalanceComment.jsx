import { useState, useEffect } from "react";

export default function TrailBalanceComment({ recordId, apiProvider }) {
  const [comments, setComments]   = useState([]);
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding]       = useState(false);

  useEffect(() => {
    if (recordId && apiProvider?.fetchComments) {
      apiProvider.fetchComments(recordId).then(setComments);
    }
  }, [recordId]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    if (!recordId) {
      alert("Save the record first before adding comments.");
      return;
    }
    setAdding(true);
    try {
      const result = await apiProvider.addComment(recordId, newComment.trim());
      if (result) {
        setComments((prev) => [...prev, result]);
        setNewComment("");
      }
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (raw) => {
    if (!raw) return "";
    try {
      return new Date(raw).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return raw;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <input
          type="text"
          placeholder="Enter your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{
            border: "1px solid #d0d5dd", borderRadius: "8px",
            padding: "10px 14px", fontSize: "14px", outline: "none",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newComment.trim()}
          style={{
            alignSelf: "flex-start",
            background: "#234e70", color: "#fff",
            border: "none", borderRadius: "6px",
            padding: "7px 16px", fontSize: "13px",
            fontWeight: 600, cursor: "pointer",
            opacity: adding || !newComment.trim() ? 0.5 : 1,
          }}
        >
          {adding ? "Adding..." : "+ Add"}
        </button>
      </div>

      {/* Comment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#98a2b3" }}>No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#234e70", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, flexShrink: 0,
              }}>
                {(c.user || c.created_by || "U")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a1a2e" }}>
                  {c.user || c.created_by || "User"}{" "}
                  <span style={{ fontWeight: 400, color: "#667085", fontSize: "12px" }}>
                    — {formatDate(c.created_at || c.date)}
                  </span>
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#344054" }}>
                  "{c.comment || c.text}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status changes section */}
      {comments.some((c) => c.status_change) && (
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#344054", margin: "0 0 8px" }}>
            Status Changes:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {comments
              .filter((c) => c.status_change)
              .map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "#e8f0fe", color: "#234e70",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, flexShrink: 0,
                  }}>A</div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#667085" }}>
                    {c.status_change}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
