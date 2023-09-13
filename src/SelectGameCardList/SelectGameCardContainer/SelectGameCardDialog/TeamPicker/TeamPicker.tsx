import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./TeamPicker.css";

interface TeamPickerProps {
    homeTeam: string;
    awayTeam: string;
    team: string | undefined;
    onTeamChange: (team: string) => void;
}

const TeamPicker: React.FC<TeamPickerProps> = ({ homeTeam, awayTeam, team, onTeamChange }) => {
    const [alignment, setAlignment] = useState<string | undefined>(team);
    
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        setAlignment(newAlignment);
        onTeamChange(newAlignment);
    };

    useEffect(() => {
        setAlignment(team)
    }, [team]);

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
