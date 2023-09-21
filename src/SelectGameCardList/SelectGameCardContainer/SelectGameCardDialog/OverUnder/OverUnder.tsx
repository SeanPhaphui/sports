import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./OverUnder.css";

interface OverUnderProps {
    onOverUnderChange: (overUnder: "over" | "under") => void;
    disabledOptions: string[];
}

const OverUnder: React.FC<OverUnderProps> = ({ onOverUnderChange, disabledOptions }) => {
    const [alignment, setAlignment] = useState<"over" | "under">();

    useEffect(() => {
        if (disabledOptions.includes("over") && !disabledOptions.includes("under")) {
            setAlignment("under");
            onOverUnderChange("under");
        } else if (disabledOptions.includes("under") && !disabledOptions.includes("over")) {
            setAlignment("over");
            onOverUnderChange("over");
        }
    }, [disabledOptions]);

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
                <ToggleButton 
                    className="left-toggle-button" 
                    value="over"
                    disabled={disabledOptions.includes("over")}
                >
                    Over
                </ToggleButton>
                <ToggleButton 
                    className="right-toggle-button" 
                    value="under"
                    disabled={disabledOptions.includes("under")}
                >
                    Under
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default OverUnder;
