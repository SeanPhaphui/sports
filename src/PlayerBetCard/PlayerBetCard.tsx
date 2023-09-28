import { Box, Card, Divider } from "@mui/material";
import React from "react";
import "./PlayerBetCard.css";
import { Bet, extractTeamsFromPlayerBet, formatDate } from "../Utils/Utils";
import Info from "./Info/Info";
import UpcomingInfo from "./UpcomingInfo/UpcomingInfo";
import LiveTvIcon from "@mui/icons-material/LiveTv";

interface PlayerBetCardProps {
    bet: Bet;
}

const PlayerBetCard: React.FC<PlayerBetCardProps> = (props) => {
    const { bet } = props;

    const title =
        bet.type === "spread"
            ? bet.team + ": " + bet.value
            : bet.type.charAt(0).toUpperCase() + bet.type.slice(1) + ": " + bet.value;

    // Extract scores for clarity
    const homeScore = parseFloat(bet.game.homeTeam.score);
    const awayScore = parseFloat(bet.game.awayTeam.score);

    // Determine colors based on the scores
    const homeColor = homeScore >= awayScore ? "white" : "#6c6d6f";
    const awayColor = awayScore >= homeScore ? "white" : "#6c6d6f";

    const getTeamScores = (playerBet: Bet): { teamScore: number; opponentScore: number } => {
        let teamScore: number, opponentScore: number;

        if (playerBet.team === playerBet.game.homeTeam.location) {
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

    const determineOverUnderBetOutcome = (
        combinedScore: number,
        type: "spread" | "over" | "under",
        overUnderValue: number
    ): "win" | "lose" | "push" => {
        if (type === "over") {
            if (combinedScore > overUnderValue) return "win";
            if (combinedScore < overUnderValue) return "lose";
        }
        if (type === "under") {
            if (combinedScore < overUnderValue) return "win";
            if (combinedScore > overUnderValue) return "lose";
        }
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

    const calculateBetStatus = (playerBet: Bet): { message: string; color: string } => {
        if (playerBet.value === "EVEN") {
            const { teamScore, opponentScore } = getTeamScores(playerBet);
            if (teamScore > opponentScore) {
                return { message: "Currently winning", color: getOutcomeColor("win") };
            } else if (teamScore < opponentScore) {
                return { message: "Currently losing", color: getOutcomeColor("lose") };
            } else {
                return { message: "Currently a tie", color: getOutcomeColor("push") };
            }
        }
        const spread = parseFloat(playerBet.value);
        const { teamScore, opponentScore } = getTeamScores(playerBet);

        const getPointOrPoints = (value: number): string => {
            return Math.abs(value) === 1 ? "point" : "points";
        };
        if (bet.type === "spread") {
            const gapFromSpread = getGapFromSpread(teamScore, opponentScore, spread);

            const outcome = determineBetOutcome(gapFromSpread);
            const outcomeColor = getOutcomeColor(outcome);
            if (outcome === "push") {
                return { message: "Currently matching the spread", color: outcomeColor };
            } else if (outcome === "win") {
                return {
                    message: `Currently covering by ${gapFromSpread} ${getPointOrPoints(
                        gapFromSpread
                    )}`,
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
        } else {
            const combinedScore = teamScore + opponentScore;
            const gapFromOverUnder = combinedScore - parseFloat(playerBet.value);

            const outcome = determineOverUnderBetOutcome(
                combinedScore,
                playerBet.type,
                parseFloat(playerBet.value)
            );
            const outcomeColor = getOutcomeColor(outcome);
            if (outcome === "push") {
                return { message: "Currently matching the over/under value", color: outcomeColor };
            } else if (outcome === "win") {
                const overOrUnder = gapFromOverUnder > 0 ? "over" : "under";
                return {
                    message: `Currently ${overOrUnder} by ${Math.abs(
                        gapFromOverUnder
                    )} ${getPointOrPoints(gapFromOverUnder)}`,
                    color: outcomeColor,
                };
            } else if (outcome === "lose" && playerBet.type === "over") {
                const overOrUnderNeeded = gapFromOverUnder > 0 ? "under" : "over";
                return {
                    message: `Need ${Math.abs(gapFromOverUnder)} ${getPointOrPoints(
                        gapFromOverUnder
                    )} more to hit the ${overOrUnderNeeded}`,
                    color: outcomeColor,
                };
            } else {
                return {
                    message: `Unable to Win`,
                    color: outcomeColor,
                };
            }
        }
    };

    const { homeTeam, awayTeam } = extractTeamsFromPlayerBet(bet);
    const isOverUnder = bet.type !== "spread" ? true : false;

    return (
        <div className="PlayerBetCard">
            <Card className="card">
                {bet.game.status === "upcoming" && (
                    <div className="date">{formatDate(bet.game.date)}</div>
                )}
                {bet.game.status === "ongoing" && (
                    <div className="ongoing-top">
                        <a href={bet.game.link} target="_blank" rel="noopener noreferrer">
                            <LiveTvIcon />
                        </a>
                        <div>{title}</div>
                        <div className="status-detail">{bet.game.statusDetail}</div>
                    </div>
                )}
                {bet.game.status === "upcoming" && <div className="card-group-top">{title}</div>}
                {bet.game.status === "final" && (
                    <div
                        className="card-group-top"
                        style={{
                            color:
                                bet.game.status === "final"
                                    ? calculateBetStatus(bet).color
                                    : undefined,
                        }}
                    >
                        {title}
                    </div>
                )}

                <Divider className="bet-divider" />
                {bet.game.status === "upcoming" ? (
                    <UpcomingInfo homeTeam={homeTeam} awayTeam={awayTeam} />
                ) : (
                    <Info
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        showRecord={false}
                        showTotal={isOverUnder}
                    />
                )}

                {bet.game.status === "ongoing" && (
                    <div className="status">{calculateBetStatus(bet).message}</div>
                )}
            </Card>
        </div>
    );
};

export default PlayerBetCard;
