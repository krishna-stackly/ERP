import { useState, useRef } from "react";

export default function AssetMaintenanceAttachment({ recordId, apiProvider }) {
  const [files, setFiles]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef                = useRef(null);

  const handleUpload = async (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    if (!recordId) { alert("Save the record first."); return; }
    setUploading(true);
    try {
      for (const f of selected) {
        const r = await apiProvider?.uploadAttachment(recordId, f);
        if (r) setFiles((p) => [...p, r]);
        else setFiles((p) => [...p, { name: f.name, size: f.size }]);
      }
    } finally { setUploading(false); e.target.value = ""; }
  };

  const fmt = (bytes) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        style={{ border: "2px dashed rgba(35,78,112,0.4)", borderRadius: 10, padding: "24px", textAlign: "center", cursor: "pointer", background: "rgba(249,249,249,1)" }}
        onClick={() => inputRef.current?.click()}
      >
        <p style={{ fontSize: 14, color: "rgba(35,78,112,1)", fontWeight: 600, margin: 0 }}>Click to upload or drag & drop</p>
        <p style={{ fontSize: 12, color: "#98a2b3", margin: "4px 0 0" }}>PDF, PNG, JPG, XLSX up to 10MB</p>
        <input type="file" multiple hidden ref={inputRef} onChange={handleUpload} />
      </div>
      {uploading && <p style={{ fontSize: 13, color: "#667085" }}>Uploading...</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {files.length === 0
          ? <p style={{ fontSize: 13, color: "#98a2b3" }}>No attachments yet.</p>
          : files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1px solid #e4e7ec", borderRadius: 8, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: 16, height: 16, fill: "#234e70" }}>
                  <path d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"/>
                </svg>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#344054" }}>{f.name || f.file_name}</p>
                  {f.size && <p style={{ margin: 0, fontSize: 11, color: "#98a2b3" }}>{fmt(f.size)}</p>}
                </div>
              </div>
              {f.url && (
                <a href={f.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: "#234e70", fontWeight: 600, textDecoration: "none" }}>Download</a>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
