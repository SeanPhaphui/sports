import { Box, Button, Grow } from "@mui/material";
import React, { useState } from "react";
import { PlayerBet, TeamInfo } from "../Utils/Utils";
import "./Experimental.css";

export interface PlayerPicksProps {
    playerBets: PlayerBet[];
}

const Experimental: React.FC<PlayerPicksProps> = (props) => {
    const { playerBets } = props;

    const getTeamInfo = (playerBet: PlayerBet) => {
        return playerBet.team === playerBet.homeTeam.location
            ? playerBet.homeTeam
            : playerBet.awayTeam;
    };

    const getTintedColor = (teamInfo: TeamInfo) => {
        const tintOpacity = 0.5;
        const tintedColor =
            teamInfo.color +
            Math.round(tintOpacity * 255)
                .toString(16)
                .padStart(2, "0");
        return tintedColor;
    };

    const [isRow, setRow] = useState<boolean>(true);

    const handleRowColumn = () => {
        if (isRow) {
            setRow(false);
        } else {
            setRow(true);
        }
    };

    return (
        <div className="Experimental">
            <Button onClick={handleRowColumn}>Change</Button>
            <div className={`testing ${isRow ? "row" : "column"}`}>
                {playerBets.map((playerBet) => {
                    // Determine the teamInfo based on the team in playerBet
                    const teamInfo = getTeamInfo(playerBet);

                    // Create a tinted color by adjusting the alpha channel
                    const tintedColor = getTintedColor(teamInfo);

                    return (
                        <div className="bets" key={playerBet.id}>
                            <Box
                                component="img"
                                sx={{
                                    padding: "10px",
                                    height: "3vh",
                                    width: "3vh",
                                    mx: "5px",
                                    backgroundColor: tintedColor, // Use the tinted color as the background
                                    borderRadius: "100%",
                                }}
                                src={teamInfo.logo} // Use the logo from teamInfo
                            />
                            {!isRow && <div>HELLO</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Experimental;
