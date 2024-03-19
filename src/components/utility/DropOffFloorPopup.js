import React from 'react';
import './DropOffFloorPopup.css'; // Make sure to create and import the CSS

function DropOffFloorPopup({ totalFloors, onSelectFloor, onClose }) {
    return (
        <div className="popup-container">
            <div className="popup">
                <h3>Select Drop-off Floor</h3>
                <div className="floors-grid">
                    {[...Array(totalFloors)].map((_, index) => (
                        <button
                            key={index + 1}
                            className="grid-button"
                            onClick={() => onSelectFloor(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default DropOffFloorPopup;
