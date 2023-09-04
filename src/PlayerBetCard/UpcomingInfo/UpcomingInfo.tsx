import { Box, Card, Divider } from "@mui/material";
import React from "react";
import "./UpcomingInfo.css";
import { PlayerBetObject } from "../../Utils/Utils";

interface UpcomingInfoProps {
    playerBet: PlayerBetObject;
}

const UpcomingInfo: React.FC<UpcomingInfoProps> = (props) => {
    const { playerBet } = props;

    return (
        <div className="UpcomingInfo">
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
                    <div>{playerBet.homeTeam.location}</div>
                </div>
                <div>{playerBet.homeTeam.record}</div>
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
                    <div>{playerBet.awayTeam.location}</div>
                </div>
                <div>{playerBet.awayTeam.record}</div>
            </div>
        </div>
    );
};

export default UpcomingInfo;
