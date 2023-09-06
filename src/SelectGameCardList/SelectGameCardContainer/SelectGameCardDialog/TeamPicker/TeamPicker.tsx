import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useState } from "react";
import "./TeamPicker.css";

interface TeamPickerProps {
    homeTeam: string;
    awayTeam: string;
    onTeamChange: (team: string) => void;
}

const TeamPicker: React.FC<TeamPickerProps> = (props) => {
    const { homeTeam, awayTeam, onTeamChange } = props;
    const [alignment, setAlignment] = useState<string>();
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        setAlignment(newAlignment);
        onTeamChange(newAlignment);
    };

    return (
        <div className="TeamPicker">
            <ToggleButtonGroup
                color="primary"
                fullWidth
                value={alignment}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton className="left-toggle-button" value={awayTeam}>
                    {awayTeam}
                </ToggleButton>
                <ToggleButton className="right-toggle-button" value={homeTeam}>
                    {homeTeam}
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default TeamPicker;
