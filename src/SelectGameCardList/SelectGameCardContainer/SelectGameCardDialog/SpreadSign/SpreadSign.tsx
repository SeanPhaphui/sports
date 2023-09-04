import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useEffect, useState } from "react";
import "./SpreadSign.css";

interface SpreadSignProps {
    onSpreadSignChange: (spread: string) => void;
}

const SpreadSign: React.FC<SpreadSignProps> = (props) => {
    const { onSpreadSignChange } = props;

    const [alignment, setAlignment] = useState<string>();
    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlignment(newAlignment);
        onSpreadSignChange(newAlignment);
    };

    return (
        <div className="SpreadSign">
            <ToggleButtonGroup
                color="primary"
                fullWidth
                value={alignment}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton className="left-toggle-button" value="-">
                    <RemoveIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton className="right-toggle-button" value="+">
                    <AddIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default SpreadSign;
