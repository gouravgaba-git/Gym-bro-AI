// function InfoTemplate({ onClose }) {
//     return (
//         <div className="overlay">
//             <div className="info-box">

//                 <button
//                     className="close-btn"
//                     onClick={onClose}
//                 >
//                     ✕
//                 </button>

//                 <h2>Barbell Back Squat</h2>

//                 <p>Primary Muscle: Quadriceps</p>

//                 <p>Difficulty: Intermediate</p>

//                 <p>
//                     Keep your chest up, brace your core,
//                     and squat until your thighs are parallel.
//                 </p>

//             </div>
//         </div>
//     );
// }

// export default InfoTemplate;
import { createPortal } from "react-dom";
import { useEffect } from "react";

function InfoTemplate({ onClose }) {

    useEffect(() => {
        // Disable background scrolling
        document.body.style.overflow = "hidden";

        return () => {
            // Restore scrolling when modal closes
            document.body.style.overflow = "auto";
        };
    }, []);

    return createPortal(
        <div className="overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose}>✖</button>

                <h2>Exercise Information</h2>
                <p>This is your template.</p>

            </div>
        </div>,
        document.body
    );
}

export default InfoTemplate;