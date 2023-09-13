import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useState } from "react";
import "./OverUnder.css";

interface OverUnderProps {
    onOverUnderChange: (overUnder: "over" | "under") => void;
}

const OverUnder: React.FC<OverUnderProps> = ({ onOverUnderChange }) => {
    const [alignment, setAlignment] = useState<"over" | "under">();

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: "over" | "under") => {
        setAlignment(newAlignment);
        onOverUnderChange(newAlignment);
    };

    return (
        <div className="OverUnder">
            <ToggleButtonGroup
                color="primary"
                fullWidth
                value={alignment}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton className="left-toggle-button" value="over">
                    Over
                </ToggleButton>
                <ToggleButton className="right-toggle-button" value="under">
                    Under
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default OverUnder;
