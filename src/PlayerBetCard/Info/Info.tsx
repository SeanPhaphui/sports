import { Box, Divider } from "@mui/material";
import React from "react";
import { TeamInfo } from "../../Utils/Utils";
import "./Info.css";

interface InfoProps {
    showRecord: boolean;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
}

const Info: React.FC<InfoProps> = (props) => {
    const { homeTeam, awayTeam, showRecord } = props;

    // Extract scores for clarity
    const homeScore = parseFloat(homeTeam.score);
    const awayScore = parseFloat(awayTeam.score);

    // Determine colors based on the scores
    const homeColor = homeScore >= awayScore ? "white" : "#6c6d6f";
    const awayColor = awayScore >= homeScore ? "white" : "#6c6d6f";

    return (
        <div className={"Info"}>
            <div className="left">
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
                    <div style={{ color: awayColor }}>{awayTeam.location}</div>
                </div>
                <div className="info-divider"></div>
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
                    <div style={{ color: homeColor }}>{homeTeam.location}</div>
                </div>
            </div>
            <div className="right">
                <div className="scores">
                    <div className="score" style={{ color: awayColor }}>
                        {awayTeam.score}
                    </div>
                    <div className="info-divider"></div>
                    <div className="score" style={{ color: homeColor }}>
                        {homeTeam.score}
                    </div>
                </div>

                <Divider orientation="vertical" flexItem />
                {showRecord ? (
                    <div className="records">
                        <div className="record">{awayTeam.record}</div>
                        <div className="info-divider"></div>
                        <div className="record">{homeTeam.record}</div>
                    </div>
                ) : (
                    <div className="gap">
                        <div>Lead</div>
                        <div>{Math.abs(homeScore - awayScore)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Info;
