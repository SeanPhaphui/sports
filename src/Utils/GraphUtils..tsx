import { UserBetsV2 } from "./Utils";

export const getSortedFinalWeeks = (userBets: UserBetsV2[]): string[] => {
    const weeks = new Set<string>();

    const allUsersHaveFinalizedGamesForWeek = (year: string, week: string): boolean => {
        // Filter out users who don't have data for the given year and week
        const relevantUsers = userBets.filter(user => user.bets[year] && user.bets[year][week]);

        // Check if all games for the given year and week for the remaining users are final
        return relevantUsers.every(user => user.bets[year][week].every(bet => bet.game.status === "final"));
    };

    userBets.forEach((user) => {
        for (let year in user.bets) {
            for (let week in user.bets[year]) {
                // Check if all games for all participating users for this week have a status of "Final"
                if (allUsersHaveFinalizedGamesForWeek(year, week)) {
                    weeks.add(week);
                }
            }
        }
    });

    const weeksArray = Array.from(weeks);

    // Sort the array based on week number
    weeksArray.sort((a, b) => {
        const numA = parseInt(a.replace("week", ""));
        const numB = parseInt(b.replace("week", ""));
        return numA - numB;
    });

    return weeksArray;
};


