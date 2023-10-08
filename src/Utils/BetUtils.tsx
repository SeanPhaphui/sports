import { Bet, UserBets } from "./Utils"; // Replace this with the actual path to your Bet type

export const getNextFridayNoon = (): number => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);

    if (now.getDay() === 5 && new Date().getTime() < now.getTime()) {
        // If today is Friday and the current time is before noon, use today's date.
        return now.getTime();
    }

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
    return (
        isFridayNoonOrLater(date) || isSaturday(date) || isSunday(date) || isMondayBefore8am(date)
    );
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
    // Check if the game is not final
    if (bet.game.status !== "final") {
        return "#000000"; // Or any other neutral color or indicator
    }
    const { teamScore, opponentScore } = getTeamScores(bet);
    if (bet.value === "EVEN") {
        if (teamScore === opponentScore) return getOutcomeColor("push");
        if (teamScore > opponentScore) return getOutcomeColor("win");
        return getOutcomeColor("lose");
    }
    const spread = parseFloat(bet.value);

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

// Function to calculate the number of wins for a specific user
const calculateUserWins = (userBets: UserBets): number => {
    return userBets.bets.reduce((totalWins, bet) => {
        const outcomeColor = calculateBetStatusColor(bet);
        console.log("outcomeColor: ", outcomeColor);
        if (outcomeColor === getOutcomeColor("win")) {
            return totalWins + 1;
        }
        return totalWins;
    }, 0);
};

const calculateUserScore = (userBets: UserBets): number => {
    return userBets.bets.reduce((score, bet) => {
        const outcomeColor = calculateBetStatusColor(bet);
        if (outcomeColor === getOutcomeColor("win")) {
            return score + 1;
        } else if (outcomeColor === getOutcomeColor("push")) {
            return score;
        } else if (outcomeColor === getOutcomeColor("lose")) {
            return score - 1;
        }
        return score;
    }, 0);
};

// Function to determine if at least one game has finished
export const hasAnyGameFinished = (allBets: UserBets[]): boolean => {
    for (const userBets of allBets) {
        for (const bet of userBets.bets) {
            if (bet.game.status === "final") {
                return true;
            }
        }
    }
    return false;
};

export const areAllGamesFinished = (allBets: UserBets[]): boolean => {
    for (const userBets of allBets) {
        for (const bet of userBets.bets) {
            if (bet.game.status !== "final") {
                return false;
            }
        }
    }
    return true;
};


// Function to get leader text
export const getLeaderText = (allBets: UserBets[], allGamesFinished: boolean): string => {
    if (!hasAnyGameFinished(allBets)) {
        return ""; // No game has finished yet
    }

    const scores = allBets.map((user) => {
        return {
            displayName: user.displayName,
            score: calculateUserScore(user),
        };
    });

    const maxScore = Math.max(...scores.map((s) => s.score));
    const leaders = scores.filter((s) => s.score === maxScore);

    if (allGamesFinished) {
        // If all games are finished, we can make the text more conclusive
        if (leaders.length === 1) {
            return `${leaders[0].displayName.trim()} is the winner!`;
        } else {
            const leaderNames = leaders
                .map(l => l.displayName.trim().replace(/\s+/g, ' ')) // trim and replace internal excessive whitespace
                .join(", ");
            return `${leaderNames} are tied for the win!`;
        }
    } else {
        // The original logic for showing current leader(s) during the games
        if (leaders.length === 1) {
            return `${leaders[0].displayName.trim()} is currently in the lead!`;
        } else {
            const leaderNames = leaders
                .map(l => l.displayName.trim().replace(/\s+/g, ' ')) // trim and replace internal excessive whitespace
                .join(", ");
            return `${leaderNames} are currently tied for the lead!`;
        }
    }
};


