import { v4 as uuidv4 } from 'uuid';

export interface GameSelectionObject {
    id: string;
    name: string;
    date: Date;
    homeTeam: {
        rank: number;
        record: string;
        location: string;
        logo: string;
    };
    awayTeam: {
        rank: number;
        record: string;
        location: string;
        logo: string;
    };
}

export interface PlayerBetObject {
    id: string;
    team: string;
    spread: string;
    date: Date;
    homeTeam: {
        location: string;
        score: string;
        logo: string;
    };
    awayTeam: {
        location: string;
        score: string;
        logo: string;
    };
}

const getOption = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};

export const getGamesByDate = async (date: string): Promise<GameSelectionObject[]> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${date}`;

    const data = await getOption(footballUrl);
    const games: GameSelectionObject[] = [];
    if (data?.events) {
        for (const event of data.events) {
            const competition = event.competitions[0];
            if (competition && competition.competitors && competition.competitors.length >= 2) {
                const homeTeam = competition.competitors.find(
                    (comp: { homeAway: string }) => comp.homeAway === "home"
                );
                console.log("Home Team: ", homeTeam);
                const awayTeam = competition.competitors.find(
                    (comp: { homeAway: string }) => comp.homeAway === "away"
                );

                if (homeTeam && awayTeam) {
                    const game: GameSelectionObject = {
                        id: event.id,
                        name: event.name,
                        date: new Date(event.date),
                        homeTeam: {
                            rank: homeTeam.curatedRank.current,
                            record: homeTeam.records[0].summary,
                            location: homeTeam.team.location,
                            logo: homeTeam.team.logo,
                        },
                        awayTeam: {
                            rank: awayTeam.curatedRank.current,
                            record: awayTeam.records[0].summary,
                            location: awayTeam.team.location,
                            logo: awayTeam.team.logo,
                        },
                    };

                    games.push(game);
                }
            }
        }
    }
    console.log("From Utils - games: ", games);
    return games;
};

export const getGameByID = async (
    id: string,
    team: string,
    spread: string
): Promise<PlayerBetObject> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${id}`;

    const data = await getOption(footballUrl);
    if (data) {
        console.log("API Response Data:", data);
        const competition = data.header.competitions[0];
        if (competition && competition.competitors && competition.competitors.length >= 2) {
            const homeTeam = competition.competitors.find(
                (comp: { homeAway: string }) => comp.homeAway === "home"
            );
            console.log("Home Team: ", homeTeam);
            const awayTeam = competition.competitors.find(
                (comp: { homeAway: string }) => comp.homeAway === "away"
            );

            if (homeTeam && awayTeam) {
                const playerBetObject: PlayerBetObject = {
                    id: uuidv4(),
                    team: team,
                    spread: spread,
                    date: new Date(competition.date),
                    homeTeam: {
                        location: homeTeam.team.location,
                        score: homeTeam.score,
                        logo: homeTeam.team.logos[0].href,
                    },
                    awayTeam: {
                        location: awayTeam.team.location,
                        score: awayTeam.score,
                        logo: awayTeam.team.logos[0].href,
                    },
                };
                console.log("From Utils - betObject: ", playerBetObject);
                return playerBetObject;
            }
        }
    }
    console.log("From Utils - EMPTY BET OBJECT RETURNED");
    return {
        id: uuidv4(),
        team: team,
        spread: spread,
        date: new Date(),
        homeTeam: {
            location: "",
            score: "",
            logo: "",
        },
        awayTeam: {
            location: "",
            score: "",
            logo: "",
        },
    };
};

// Old way of getting spread relative to bet
// const calculateSpread = () => {
//     const homeScore = parseFloat(playerBet.homeTeam.score);
//     const awayScore = parseFloat(playerBet.awayTeam.score);
//     const absDifference = Math.abs(homeScore - awayScore);

//     if (absDifference === 0) {
//         return "0";
//     }

//     if (playerBet.team === playerBet.homeTeam.location) {
//         return homeScore > awayScore ? `-${absDifference}` : `+${absDifference}`;
//     } else if (playerBet.team === playerBet.awayTeam.location) {
//         return awayScore > homeScore ? `-${absDifference}` : `+${absDifference}`;
//     }

//     return null; // In case neither condition matches, though based on the given logic it shouldn't be the case.
// };
