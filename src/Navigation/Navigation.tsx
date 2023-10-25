import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ScoreboardRoundedIcon from "@mui/icons-material/ScoreboardRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import "./Navigation.css";

interface NavigationProps {
    value: string;
    onValueChange: (newValue: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ value, onValueChange }) => {
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        onValueChange(newValue);
    };

    return (
        <div className="Navigation">
            <BottomNavigation
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                showLabels
                value={value}
                onChange={handleChange}
            >
                <BottomNavigationAction
                    disableRipple
                    label="Home"
                    value="/"
                    icon={<HomeRoundedIcon />}
                />
                <BottomNavigationAction
                    disableRipple
                    label="Games"
                    value="/games"
                    icon={<ScoreboardRoundedIcon />}
                />
                <BottomNavigationAction
                    disableRipple
                    label="History"
                    value="/history"
                    icon={<HistoryRoundedIcon />}
                />
                <BottomNavigationAction
                    disableRipple
                    label="Stats"
                    value="/stats"
                    icon={<LeaderboardRoundedIcon />}
                />
            </BottomNavigation>
        </div>
    );
};

export default Navigation;
