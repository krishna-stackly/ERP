import { useState, useEffect, useRef } from "react";

export default function FormReceivableAttachment({ recordId, apiProvider }) {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading]     = useState(false);
  const fileRef                       = useRef(null);

  useEffect(() => {
    if (recordId && apiProvider?.fetchAttachments)
      apiProvider.fetchAttachments(recordId).then(setAttachments);
  }, [recordId]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!recordId) { alert("Save the record first."); return; }
    setUploading(true);
    try {
      const r = await apiProvider.uploadAttachment(recordId, file);
      if (r) setAttachments((p) => [...p, r]);
    } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleDelete = async (id) => {
    const ok = await apiProvider?.deleteAttachment(recordId, id);
    if (ok) setAttachments((p) => p.filter((a) => (a.id || a.attachment_id) !== id));
  };

  const fmt = (raw) => {
    if (!raw) return "";
    try { return new Date(raw).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return raw; }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #d0d5dd", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#344054", cursor: "pointer", opacity: uploading ? 0.5 : 1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" fill="#344054">
            <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64z"/>
          </svg>
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        <span style={{ fontSize: 12, color: "#98a2b3" }}>Upload related files (Invoices, Receipts, Images)</span>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" style={{ display: "none" }} onChange={handleUpload} />
      </div>
      {attachments.length > 0 && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#344054", margin: "0 0 8px" }}>Attached Files:</p>
          {attachments.map((a, i) => (
            <div key={a.id || i} style={{ marginBottom: 10 }}>
              <p style={{ margin: "0 0 5px", fontSize: 13, color: "#344054" }}>
                {i + 1}. <strong>{a.file_name || a.name || "file"}</strong>
                {a.uploaded_by && <span style={{ color: "#667085" }}> — uploaded by {a.uploaded_by}{a.created_at && ` at ${fmt(a.created_at)}`}</span>}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { const l = document.createElement("a"); l.href = a.file_url || a.url; l.download = a.file_name || "file"; l.target = "_blank"; document.body.appendChild(l); l.click(); l.remove(); }}
                  style={{ background: "#234e70", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download</button>
                <button onClick={() => handleDelete(a.id || a.attachment_id)}
                  style={{ background: "#fff", color: "#d92d20", border: "1px solid #d92d20", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {attachments.length === 0 && !uploading && <p style={{ fontSize: 13, color: "#98a2b3" }}>No attachments yet.</p>}
    </div>
  );
}
