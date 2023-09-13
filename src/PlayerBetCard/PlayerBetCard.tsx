import { Box, Card, Divider } from "@mui/material";
import React from "react";
import "./PlayerBetCard.css";
import {
  Bet,
  extractTeamsFromPlayerBet,
  formatDate,
} from "../Utils/Utils";
import Info from "./Info/Info";
import UpcomingInfo from "./UpcomingInfo/UpcomingInfo";
import LiveTvIcon from "@mui/icons-material/LiveTv";

interface PlayerBetCardProps {
  bet: Bet;
}

const PlayerBetCard: React.FC<PlayerBetCardProps> = (props) => {
  const { bet } = props;

  // Extract scores for clarity
  const homeScore = parseFloat(bet.game.homeTeam.score);
  const awayScore = parseFloat(bet.game.awayTeam.score);

  // Determine colors based on the scores
  const homeColor = homeScore >= awayScore ? "white" : "#6c6d6f";
  const awayColor = awayScore >= homeScore ? "white" : "#6c6d6f";

  const getTeamScores = (
    playerBet: Bet
  ): { teamScore: number; opponentScore: number } => {
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

  const getGapFromSpread = (
    teamScore: number,
    opponentScore: number,
    spread: number
  ): number => {
    const difference = teamScore - opponentScore;
    return difference + spread;
  };

  const determineBetOutcome = (
    gapFromSpread: number
  ): "win" | "lose" | "push" => {
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

  const calculateBetStatus = (
    playerBet: Bet
  ): { message: string; color: string } => {
    const spread = parseFloat(playerBet.value);
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
  };

  const { homeTeam, awayTeam } = extractTeamsFromPlayerBet(bet);

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
            <div>{bet.team + ": " + bet.value}</div>
            <div></div>
          </div>
        )}
        {bet.game.status === "upcoming" && (
          <div className="card-group-top">{bet.team + ": " + bet.value}</div>
        )}
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
            {bet.team + ": " + bet.value}
          </div>
        )}

        <Divider className="bet-divider" />
        {bet.game.status === "upcoming" ? (
          <UpcomingInfo homeTeam={homeTeam} awayTeam={awayTeam} />
        ) : (
          <Info homeTeam={homeTeam} awayTeam={awayTeam} showRecord={false} />
        )}

        {bet.game.status === "ongoing" && (
          <div className="status">{calculateBetStatus(bet).message}</div>
        )}
      </Card>
    </div>
  );
};

export default PlayerBetCard;
