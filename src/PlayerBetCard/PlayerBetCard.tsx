import { Box, Card, Divider } from "@mui/material";
import React from "react";
import "./PlayerBetCard.css";
import { PlayerBetObject } from "../Utils/Utils";

interface PlayerBetCardProps {
    playerBet: PlayerBetObject;
}

const PlayerBetCard: React.FC<PlayerBetCardProps> = (props) => {
    const { playerBet } = props;

    const calculateGap = (playerBet: PlayerBetObject): number => {
        const homeScore = parseFloat(playerBet.homeTeam.score);
        const awayScore = parseFloat(playerBet.awayTeam.score);
        return Math.abs(homeScore - awayScore);
    };

    const calculateBetStatus = (playerBet: PlayerBetObject): string => {
        const homeScore = parseFloat(playerBet.homeTeam.score);
        const awayScore = parseFloat(playerBet.awayTeam.score);
        const spread = parseFloat(playerBet.spread);

        let teamScore: number, opponentScore: number;

        // Determine which team the player bet on
        if (playerBet.team === playerBet.homeTeam.location) {
            teamScore = homeScore;
            opponentScore = awayScore;
        } else {
            teamScore = awayScore;
            opponentScore = homeScore;
        }

        const difference = teamScore - opponentScore;
        const gapFromSpread = difference + spread;

        // Helper function to get "point" or "points" based on the value
        const getPointOrPoints = (value: number): string => {
            return Math.abs(value) === 1 ? "point" : "points";
        };

        // Cases
        if (gapFromSpread === 0) {
            return "Currently matching the spread";
        } else if (gapFromSpread > 0) {
            return `Currently winning by ${gapFromSpread} ${getPointOrPoints(gapFromSpread)}`;
        } else {
            return `Need ${Math.abs(gapFromSpread)} ${getPointOrPoints(
                gapFromSpread
            )} more to cover the spread`;
        }
    };

    return (
        <div className="PlayerBetCard">
            <Card className="card">
                <div className="card-group-top">
                    <div>{playerBet.team + ": " + playerBet.spread}</div>
                </div>
                <Divider />
                <div className="card-group-bottom">
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
                                <div>{playerBet.homeTeam.location}</div>
                            </div>
                            <div>{playerBet.homeTeam.score}</div>
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
                            <div>{playerBet.awayTeam.score}</div>
                        </div>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div className="current-spread">
                        <div>Lead</div>
                        <div>{calculateGap(playerBet)}</div>
                    </div>
                </div>
                <div className="status">{calculateBetStatus(playerBet)}</div>
            </Card>
        </div>
    );
};

export default PlayerBetCard;
