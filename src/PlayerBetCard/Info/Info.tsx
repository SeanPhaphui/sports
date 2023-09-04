import { Box, Card, Divider } from "@mui/material";
import React from "react";
import "./Info.css";
import { PlayerBetObject } from "../../Utils/Utils";

interface InfoProps {
    playerBet: PlayerBetObject;
}

const Info: React.FC<InfoProps> = (props) => {
    const { playerBet } = props;

    // Extract scores for clarity
    const homeScore = parseFloat(playerBet.homeTeam.score);
    const awayScore = parseFloat(playerBet.awayTeam.score);

    // Determine colors based on the scores
    const homeColor = homeScore >= awayScore ? "white" : "#6c6d6f";
    const awayColor = awayScore >= homeScore ? "white" : "#6c6d6f";

    return (
        <div className={"Info"}>
            <div>
                <div className="team-stats">
                    <div className="logo-and-name">
                        <Box
                            component="img"
                            sx={{
                                height: "4vh",
                                width: "4vh",
                                marginRight: "10px",
                            }}
                            src={playerBet.homeTeam.logo}
                        />
                        <div style={{ color: homeColor }}>{playerBet.homeTeam.location}</div>
                    </div>
                    <div style={{ color: homeColor }}>{playerBet.homeTeam.score}</div>
                </div>
                <div className="divider"></div>
                <div className="team-stats">
                    <div className="logo-and-name">
                        <Box
                            component="img"
                            sx={{
                                height: "4vh",
                                width: "4vh",
                                marginRight: "10px",
                            }}
                            src={playerBet.awayTeam.logo}
                        />
                        <div style={{ color: awayColor }}>{playerBet.awayTeam.location}</div>
                    </div>
                    <div style={{ color: awayColor }}>{playerBet.awayTeam.score}</div>
                </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="current-spread">
                <div>Lead</div>
                <div>{Math.abs(homeScore - awayScore)}</div>
            </div>
        </div>
    );
};

export default Info;
