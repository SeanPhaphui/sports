import { Box } from "@mui/material";
import React from "react";
import { TeamInfo } from "../../Utils/Utils";
import "./UpcomingInfo.css";

interface UpcomingInfoProps {
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
}

const UpcomingInfo: React.FC<UpcomingInfoProps> = (props) => {
    const { homeTeam, awayTeam } = props;

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
                        src={homeTeam.logo}
                    />
                    <div>{homeTeam.location}</div>
                </div>
                <div>{homeTeam.record}</div>
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
                        src={awayTeam.logo}
                    />
                    <div>{awayTeam.location}</div>
                </div>
                <div>{awayTeam.record}</div>
            </div>
        </div>
    );
};

export default UpcomingInfo;
