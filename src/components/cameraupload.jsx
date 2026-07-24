import { useState } from "react";

function Camerahandle() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const filehandle = (e) => {
        const selected = e.target.files[0];
        if (e.target.files && e.target.files.length > 0) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };
    const submitfile = () => {
        alert("File uploaded successfully!");
    };

    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <label className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: "10px 20px", height: "40px", cursor: "pointer" }}>
                <span>📷 {file ? "Change Media" : "Upload Media"}</span>
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={filehandle}
                    style={{ display: "none" }}
                />
            </label>

            {file && (
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={file.name}>
                    {file.name}
                </span>
            )}

            {file && (
                <button className="btn-primary" style={{ fontSize: "13px", padding: "10px 20px", height: "40px" }} onClick={submitfile}>
                    Submit
                </button>
            )}

            {file && (
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border-subtle)", flexShrink: 0 }}>
                    {file.type.startsWith("image") ? (
                        <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Upload preview" />
                    ) : (
                        <video src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                </div>
            )}
        </div>
    );
}

export default Camerahandle;