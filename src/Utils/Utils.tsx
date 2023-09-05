import { v4 as uuidv4 } from "uuid";

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
    status: string;
    link: string;
    homeTeam: {
        location: string;
        score: string;
        logo: string;
        record: string;
    };
    awayTeam: {
        location: string;
        score: string;
        logo: string;
        record: string;
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

const mapStatusFromAPI = (apiStatus: string): "ongoing" | "upcoming" | "final" => {
    switch (apiStatus) {
        case "In Progress":
            return "ongoing";
        case "Scheduled":
            return "upcoming";
        case "Final":
            return "final";
        default:
            return "ongoing";
    }
};

export const getGameByID = async (
    id: string,
    team: string,
    spread: string
): Promise<{ playerBetObject: PlayerBetObject; status: "ongoing" | "upcoming" | "final" }> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${id}`;

    const data = await getOption(footballUrl);
    if (data) {
        console.log("API Response Data:", data);
        const competition = data.header.competitions[0];
        const link = data.header.links[0];
        // Get the mapped status from API
        const mappedStatus = mapStatusFromAPI(competition.status.type.description);

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
                    status: mappedStatus,
                    link: link.href,
                    homeTeam: {
                        location: homeTeam.team.location,
                        score: homeTeam.score ? homeTeam.score : 0,
                        logo: homeTeam.team.logos[0].href,
                        record: homeTeam.record[0].summary,
                    },
                    awayTeam: {
                        location: awayTeam.team.location,
                        score: awayTeam.score ? awayTeam.score : 0,
                        logo: awayTeam.team.logos[0].href,
                        record: awayTeam.record[0].summary,
                    },
                };
                console.log("From Utils - playerBetObject: ", playerBetObject);
                return {
                    playerBetObject: playerBetObject,
                    status: mappedStatus,
                };
            }
        }
    }
    console.log("From Utils - EMPTY BET OBJECT RETURNED");
    return {
        playerBetObject: {
            id: uuidv4(),
            team: team,
            spread: spread,
            date: new Date(),
            status: "upcoming",
            link: "",
            homeTeam: {
                location: "",
                score: "",
                logo: "",
                record: "",
            },
            awayTeam: {
                location: "",
                score: "",
                logo: "",
                record: "",
            },
        },
        status: "upcoming",
    };
};

export const formatDate = (d: Date): string => {
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
    const month = d.getMonth() + 1;  // Months are 0-indexed in JavaScript
    const day = d.getDate();
    const hour24 = d.getHours();
    const hour12 = hour24 % 12 || 12;  // Convert to 12-hour format, use 12 for 12:00 PM instead of 0
    const minute = d.getMinutes();
    const period = hour24 < 12 ? 'AM' : 'PM';
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // to make sure minutes are always two digits

    return `${weekday}, ${month}/${day}, ${hour12}:${formattedMinute} ${period}`;
}


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

// Attempt to stop unneccasry fetching
// useEffect(() => {
//     if (bets.length > 0) {
//         const fetchPlayerBets = async () => {
//             const newPlayerBets: PlayerBetObject[] = [];
//             const newBets: BetObject[] = [...bets];  // Create a copy of bets

//             for (let i = 0; i < bets.length; i++) {
//                 const bet = bets[i];
//                 if (bet.status !== 'final') {
//                     try {
//                         const { playerBetObject, status } = await getGameByID(bet.gameId, bet.team, bet.spread);
                        
//                         newPlayerBets.push(playerBetObject);
//                         newBets[i] = { ...newBets[i], status };  // Update the status of the current bet

//                     } catch (error) {
//                         console.error(`Error fetching game for bet ${bet.gameId}:`, error);
//                     }
//                 }
//             }

//             setPlayerBets(newPlayerBets);
//             setBets(newBets);  // Update the bets state with the updated statuses
//         };

//         fetchPlayerBets();
//     }
// }, [bets]);
