import { Box, Card, Divider } from "@mui/material";
import React from "react";
import "./PlayerBetCard.css";
import { PlayerBetObject, formatDate } from "../Utils/Utils";
import Info from "./Info/Info";
import UpcomingInfo from "./UpcomingInfo/UpcomingInfo";
import LiveTvIcon from "@mui/icons-material/LiveTv";

interface PlayerBetCardProps {
    playerBet: PlayerBetObject;
}

const PlayerBetCard: React.FC<PlayerBetCardProps> = (props) => {
    const { playerBet } = props;

    // Extract scores for clarity
    const homeScore = parseFloat(playerBet.homeTeam.score);
    const awayScore = parseFloat(playerBet.awayTeam.score);

    // Determine colors based on the scores
    const homeColor = homeScore >= awayScore ? "white" : "#6c6d6f";
    const awayColor = awayScore >= homeScore ? "white" : "#6c6d6f";

    const getTeamScores = (
        playerBet: PlayerBetObject
    ): { teamScore: number; opponentScore: number } => {
        let teamScore: number, opponentScore: number;

        if (playerBet.team === playerBet.homeTeam.location) {
            teamScore = homeScore;
            opponentScore = awayScore;
        } else {
            teamScore = awayScore;
            opponentScore = homeScore;
        }

        return { teamScore, opponentScore };
    };

    const getGapFromSpread = (teamScore: number, opponentScore: number, spread: number): number => {
        const difference = teamScore - opponentScore;
        return difference + spread;
    };

    const determineBetOutcome = (gapFromSpread: number): "win" | "lose" | "push" => {
        if (gapFromSpread > 0) return "win";
        if (gapFromSpread < 0) return "lose";
        return "push"; // Exactly 0
    };

    const getOutcomeColor = (outcome: "win" | "lose" | "push"): string => {
        switch (outcome) {
            case "win":
                return "#2ecc71";
            case "lose":
                return "#ef4035";
            case "push":
                return "#f8b300";
        }
    };

    const calculateBetStatus = (playerBet: PlayerBetObject): { message: string; color: string } => {
        const spread = parseFloat(playerBet.spread);
        const { teamScore, opponentScore } = getTeamScores(playerBet);
        const gapFromSpread = getGapFromSpread(teamScore, opponentScore, spread);

        const getPointOrPoints = (value: number): string => {
            return Math.abs(value) === 1 ? "point" : "points";
        };

        const outcome = determineBetOutcome(gapFromSpread);
        const outcomeColor = getOutcomeColor(outcome);

        if (outcome === "push") {
            return { message: "Currently matching the spread", color: outcomeColor };
        } else if (outcome === "win") {
            return {
                message: `Currently winning by ${gapFromSpread} ${getPointOrPoints(gapFromSpread)}`,
                color: outcomeColor,
            };
        } else {
            return {
                message: `Need ${Math.abs(gapFromSpread)} ${getPointOrPoints(
                    gapFromSpread
                )} more to cover the spread`,
                color: outcomeColor,
            };
        }
    };

    return (
        <div className="PlayerBetCard">
            <Card className="card">
                {playerBet.status === "upcoming" && (
                    <div className="date">{formatDate(playerBet.date)}</div>
                )}
                {playerBet.status === "ongoing" && (
                    <div className="ongoing-top">
                        <a href={playerBet.link} target="_blank" rel="noopener noreferrer">
                            <LiveTvIcon />
                        </a>
                        <div>{playerBet.team + ": " + playerBet.spread}</div>
                        <div></div>
                    </div>
                )}
                {playerBet.status === "final" && (
                    <div
                        className="card-group-top"
                        style={{
                            color:
                                playerBet.status === "final"
                                    ? calculateBetStatus(playerBet).color
                                    : undefined,
                        }}
                    >
                        {playerBet.team + ": " + playerBet.spread}
                    </div>
                )}

                <Divider />
                {playerBet.status === "upcoming" ? (
                    <UpcomingInfo playerBet={playerBet} />
                ) : (
                    <Info playerBet={playerBet} />
                )}

                {playerBet.status === "ongoing" && (
                    <div className="status">{calculateBetStatus(playerBet).message}</div>
                )}
            </Card>
        </div>
    );
};

export default PlayerBetCard;
