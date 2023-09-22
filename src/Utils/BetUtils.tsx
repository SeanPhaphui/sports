import { Bet } from "./Utils"; // Replace this with the actual path to your Bet type

export const isBetLocked = (): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hour = now.getHours();

    if (dayOfWeek === 5 && hour >= 12) {
        return true; // Lock-in starts from 12 PM on Friday
    }

    if (dayOfWeek === 6) {
        return true; // Lock-in for the entire Saturday
    }

    if (dayOfWeek === 0) {
        return true; // Lock-in for the entire Sunday
    }

    return false; // Outside of the lock-in period
};

const getTeamScores = (playerBet: Bet): { teamScore: number; opponentScore: number } => {
    let teamScore: number, opponentScore: number;

    if (playerBet.team === playerBet.game.homeTeam.location) {
        teamScore = parseFloat(playerBet.game.homeTeam.score);
        opponentScore = parseFloat(playerBet.game.awayTeam.score);
    } else {
        teamScore = parseFloat(playerBet.game.awayTeam.score);
        opponentScore = parseFloat(playerBet.game.homeTeam.score);
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

export const getOutcomeColor = (outcome: "win" | "lose" | "push"): string => {
    switch (outcome) {
        case "win":
            return "#2ecc71";
        case "lose":
            return "#ef4035";
        case "push":
            return "#f8b300";
        default:
            return "#000000"; // Default color, could be anything
    }
};

export const calculateBetStatusColor = (bet: Bet): string => {
    const spread = parseFloat(bet.value);
    const { teamScore, opponentScore } = getTeamScores(bet);

    if (bet.type === "spread") {
        const gapFromSpread = getGapFromSpread(teamScore, opponentScore, spread);

        const outcome = determineBetOutcome(gapFromSpread);
        const outcomeColor = getOutcomeColor(outcome);
        return outcomeColor;
    } else {
        const combinedScore = teamScore + opponentScore;

        const outcome = determineOverUnderBetOutcome(
            combinedScore,
            bet.type,
            parseFloat(bet.value)
        );
        const outcomeColor = getOutcomeColor(outcome);
        return outcomeColor;
    }
};
