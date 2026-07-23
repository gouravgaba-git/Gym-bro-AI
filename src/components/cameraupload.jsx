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
        <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 text-xs font-semibold text-gray-200 bg-[#0f1524] hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all flex items-center gap-1.5">
                <span>📷 {file ? "Change File" : "Upload Media"}</span>
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={filehandle}
                    className="hidden"
                />
            </label>

            {file && (
                <span className="text-xs text-gray-400 max-w-[100px] truncate" title={file.name}>
                    {file.name}
                </span>
            )}

            {file && (
                <button className="px-3 py-1.5 text-xs font-bold text-white bg-[#ff4b2b] hover:bg-[#ff416c] rounded-xl transition-all cursor-pointer shadow-sm" onClick={submitfile}>
                    Submit
                </button>
            )}

            {file && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    {file.type.startsWith("image") ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Upload preview" />
                    ) : (
                        <video src={preview} className="w-full h-full object-cover" />
                    )}
                </div>
            )}
        </div>
    );
}

export default Camerahandle;