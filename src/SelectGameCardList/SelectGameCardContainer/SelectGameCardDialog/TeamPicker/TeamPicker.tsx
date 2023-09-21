import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./TeamPicker.css";

interface TeamPickerProps {
    homeTeam: string;
    awayTeam: string;
    team: string | undefined;
    onTeamChange: (team: string) => void;
    disabledOptions: string[];
}

const TeamPicker: React.FC<TeamPickerProps> = ({ homeTeam, awayTeam, team, onTeamChange, disabledOptions }) => {
    const [alignment, setAlignment] = useState<string | undefined>(team);
    
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        setAlignment(newAlignment);
        onTeamChange(newAlignment);
    };

    useEffect(() => {
        if (disabledOptions.includes(team || '')) {
            // Pick the other team if the initial 'team' value is disabled
            const newTeam = team === homeTeam ? awayTeam : homeTeam;
            setAlignment(newTeam);
            onTeamChange(newTeam);
        } else {
            // Otherwise, set alignment to the initial 'team' value
            setAlignment(team);
        }
    }, [team, homeTeam, awayTeam, disabledOptions, onTeamChange]);
    
    

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
                <ToggleButton disabled={disabledOptions.includes(awayTeam)} className="left-toggle-button" value={awayTeam}>
                    {awayTeam}
                </ToggleButton>
                <ToggleButton disabled={disabledOptions.includes(homeTeam)} className="right-toggle-button" value={homeTeam}>
                    {homeTeam}
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default TeamPicker;
