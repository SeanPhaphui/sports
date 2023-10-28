import { UserBetsV2 } from "./Utils";

export const getSortedFinalWeeks = (userBets: UserBetsV2[]): string[] => {
    const weeks = new Set<string>();

    userBets.forEach((user) => {
        for (let year in user.bets) {
            for (let week in user.bets[year]) {
                // Check if all games for this week have a status of "Final"
                const allGamesFinal = user.bets[year][week].every(
                    (bet) => bet.game.status === "final"
                );
                if (allGamesFinal) {
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
}
