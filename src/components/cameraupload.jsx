import { useEffect, useRef, useState } from "react";

function Camerahandle() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const filehandle = (e) => {
        const selected = e.target.files[0]
        if (e.target.files && e.target.files.length > 0) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected))
        }
    };
    const submitfile = (e) => {
        alert("done")
    }

    return (
        <div className="camera-upload-container">
            <label className="camera-upload-btn">
                <span>📷 {file ? "Change File" : "Upload File/Video"}</span>
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={filehandle}
                    style={{ display: "none" }}
                />
            </label>

            {file && (
                <span className="camera-upload-filename" title={file.name}>
                    {file.name}
                </span>
            )}

            {file && (
                <button className="camera-submit-btn" onClick={submitfile}>
                    Submit
                </button>
            )}

            {file && (
                <div className="camera-preview-wrapper">
                    {file.type.startsWith("image") ? (
                        <img src={preview} className="camera-preview-media" alt="Upload preview" />
                    ) : (
                        <video src={preview} controls className="camera-preview-media" />
                    )}
                </div>
            )}
        </div>
    );
}

export default Camerahandle;