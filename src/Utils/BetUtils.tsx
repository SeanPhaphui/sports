import { Bet } from "./Utils"; // Replace this with the actual path to your Bet type

export const getNextFridayNoon = (): number => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const daysUntilNextFriday = (5 + 7 - now.getDay()) % 7 || 7;
    now.setDate(now.getDate() + daysUntilNextFriday);
    return now.getTime();
  };

  const isFridayNoonOrLater = (date: Date): boolean => {
    return date.getDay() === 5 && date.getHours() >= 12;
};

const isSaturday = (date: Date): boolean => {
    return date.getDay() === 6;
};

const isSunday = (date: Date): boolean => {
    return date.getDay() === 0;
};

const isMondayBefore8am = (date: Date): boolean => {
    return date.getDay() === 1 && date.getHours() < 8;
};

export const isBettingWindowClosed = (date: Date): boolean => {
    return isFridayNoonOrLater(date) || isSaturday(date) || isSunday(date) || isMondayBefore8am(date);
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
