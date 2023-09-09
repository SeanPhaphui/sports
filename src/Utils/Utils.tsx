import { v4 as uuidv4 } from "uuid";

export interface Bet {
    id: string;
    team: string;
    spread: string;
    game: Game;
}

export interface Game {
    gameId: string;
    status: string;
    date: Date;
    link: string;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
}

export interface TeamInfo {
    color: string;
    logo: string;
    location: string;
    score: string;
    record: string;
}

export interface GameSelectionObject {
    id: string;
    eventName: string;
    spread: string;
    overUnder: string;
    date: Date;
    status: string;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
}

export interface BetObject {
    uniqueId: string;
    gameId: string;
    team: string;
    spread: string;
    status?: "final" | "ongoing" | "upcoming"; // Add more statuses as needed
}

export interface PlayerBet {
    id: string;
    team: string;
    link: string;
    spread: string;
    date: Date;
    status: string;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
}
export interface GameCalendarObject {
    label: string;
    detail: string;
    week: string;
}

const fetchData = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};

export const fetchGameCalendar = async (): Promise<GameCalendarObject[]> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard`;

    const responseData = await fetchData(footballUrl);
    const calendarEntries: GameCalendarObject[] = [];

    // Validate and process the data
    if (responseData?.leagues && responseData?.week) {
        const leaguesCalendar = responseData.leagues[0].calendar;

        for (const singleCalendarKey in leaguesCalendar) {
            const singleCalendar = leaguesCalendar[singleCalendarKey];

            for (const entry of singleCalendar.entries) {
                const gameCalendarEntry: GameCalendarObject = {
                    label: entry.label.toUpperCase(),
                    detail: entry.detail.toUpperCase(),
                    week: responseData.week.number
                };
                calendarEntries.push(gameCalendarEntry);
            }
        }
    }

    // Optionally, you can remove the console log if not needed.
    console.log("From Utils - calendar: ", calendarEntries);

    return calendarEntries;
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

export const getGamesByWeek = async (
    week: number,
    top25true: boolean
): Promise<GameSelectionObject[]> => {
    const proxyUrl = "https://corsproxy.io/?";
    const top25Url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?seasontype=-1&week=${week}`;
    const fbsIAUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?seasontype=-1&week=${week}&groups=80`;
    const completeUrl = top25true ? `${proxyUrl}${top25Url}` : `${proxyUrl}${fbsIAUrl}`;

    const data = await fetchData(completeUrl);
    const games: GameSelectionObject[] = [];
    if (data?.events) {
        for (const event of data.events) {
            const competition = event.competitions[0];
            // Get the mapped status from API
            const mappedStatus = mapStatusFromAPI(competition.status.type.description);
            if (competition && competition.competitors && competition.competitors.length >= 2) {
                const homeTeam = competition.competitors.find(
                    (comp: { homeAway: string }) => comp.homeAway === "home"
                );
                const awayTeam = competition.competitors.find(
                    (comp: { homeAway: string }) => comp.homeAway === "away"
                );

                if (homeTeam && awayTeam) {
                    const game: GameSelectionObject = {
                        id: event.id,
                        eventName: event.name,
                        date: new Date(event.date),
                        spread: competition.odds ? competition.odds[0].details : "N/A",
                        overUnder: competition.odds ? competition.odds[0].overUnder : "N/A",
                        status: mappedStatus,
                        homeTeam: {
                            color: homeTeam.team.color ? "#" + homeTeam.team.color : "#ffffff",
                            logo: homeTeam.team.logo
                                ? homeTeam.team.logo
                                : "https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo-500.png",
                            location: homeTeam.team.location,
                            score: homeTeam.score ? homeTeam.score : 0,
                            record: homeTeam.records ? homeTeam.records[0].summary : "0-0",
                        },
                        awayTeam: {
                            color: awayTeam.team.color ? "#" + awayTeam.team.color : "#ffffff",
                            logo: awayTeam.team.logo
                                ? awayTeam.team.logo
                                : "https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo-500.png",
                            location: awayTeam.team.location,
                            score: awayTeam.score ? awayTeam.score : 0,
                            record: awayTeam.records ? awayTeam.records[0].summary : "0-0",
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

export const getGameByGameID = async (
    id: string,
    team: string,
    spread: string
): Promise<Bet> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${id}`;

    const data = await fetchData(footballUrl);
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
                const bet: Bet = {
                    id: uuidv4(),
                    team: team,
                    spread: spread,
                    game: {
                        gameId: id,
                        status: mappedStatus,
                        date: new Date(competition.date),
                        link: link.href,
                        homeTeam: {
                            color: homeTeam.team.color ? "#" + homeTeam.team.color : "#ffffff",
                            location: homeTeam.team.location,
                            score: homeTeam.score ? homeTeam.score : 0,
                            logo: homeTeam.team.logos[0].href,
                            record: homeTeam.record[0].summary,
                        },
                        awayTeam: {
                            color: awayTeam.team.color ? "#" + awayTeam.team.color : "#ffffff",
                            location: awayTeam.team.location,
                            score: awayTeam.score ? awayTeam.score : 0,
                            logo: awayTeam.team.logos[0].href,
                            record: awayTeam.record[0].summary,
                        },
                    },
                };
                console.log("From Utils FETCH - bet: ", bet);
                return bet;
            }
        }
    }
    console.log("From Utils - EMPTY BET RETURNED");
    return {
        id: uuidv4(),
        team: team,
        spread: spread,
        game: {
            gameId: "",
            status: "",
            date: new Date(),
            link: "",
            homeTeam: {
                color: "",
                location: "",
                score: "",
                logo: "",
                record: "",
            },
            awayTeam: {
                color: "",
                location: "",
                score: "",
                logo: "",
                record: "",
            },
        },
    };
};

export const extractTeamsFromPlayerBet = (
    playerBet: Bet
): { homeTeam: TeamInfo; awayTeam: TeamInfo } => {
    return {
        homeTeam: playerBet.game.homeTeam,
        awayTeam: playerBet.game.awayTeam,
    };
};

export const extractTeamsFromGameSelection = (
    gameSelection: GameSelectionObject
): { homeTeam: TeamInfo; awayTeam: TeamInfo } => {
    return {
        homeTeam: gameSelection.homeTeam,
        awayTeam: gameSelection.awayTeam,
    };
};

export const formatDate = (d: Date): string => {
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d);
    const month = d.getMonth() + 1; // Months are 0-indexed in JavaScript
    const day = d.getDate();
    const hour24 = d.getHours();
    const hour12 = hour24 % 12 || 12; // Convert to 12-hour format, use 12 for 12:00 PM instead of 0
    const minute = d.getMinutes();
    const period = hour24 < 12 ? "AM" : "PM";
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // to make sure minutes are always two digits

    return `${weekday}, ${month}/${day}, ${hour12}:${formattedMinute} ${period}`;
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

export const gameSelectionArrayTestObject: GameSelectionObject[] = [
    {
        id: "401532394",
        eventName: "Howard Bison at Eastern Michigan Eagles",
        date: new Date("2023-09-01T22:30:00.000Z"),
        spread: "EM -42.0",
        overUnder: "50",
        status: "upcoming",
        homeTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Eastern Michigan",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2199.png",
        },
        awayTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Howard",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/47.png",
        },
    },
    {
        id: "401520163",
        eventName: "Central Michigan Chippewas at Michigan State Spartans",
        date: new Date("2023-09-01T23:00:00.000Z"),
        spread: "EM -42.0",
        overUnder: "50",
        status: "upcoming",
        homeTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Michigan State",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/127.png",
        },
        awayTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Central Michigan",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2117.png",
        },
    },
    {
        id: "401525463",
        eventName: "Miami (OH) RedHawks at Miami Hurricanes",
        date: new Date("2023-09-01T23:00:00.000Z"),
        spread: "EM -42.0",
        overUnder: "50",
        status: "upcoming",
        homeTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Miami",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png",
        },
        awayTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Miami (OH)",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/193.png",
        },
    },
    {
        id: "401525462",
        eventName: "Louisville Cardinals at Georgia Tech Yellow Jackets",
        date: new Date("2023-09-01T23:30:00.000Z"),
        spread: "EM -42.0",
        overUnder: "50",
        status: "upcoming",
        homeTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Georgia Tech",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/59.png",
        },
        awayTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Louisville",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/97.png",
        },
    },
    {
        id: "401525815",
        eventName: "Missouri State Bears at Kansas Jayhawks",
        date: new Date("2023-09-02T00:00:00.000Z"),
        spread: "EM -42.0",
        overUnder: "50",
        status: "upcoming",
        homeTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Kansas",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png",
        },
        awayTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Missouri State",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png",
        },
    },
    {
        id: "401523988",
        eventName: "Stanford Cardinal at Hawai'i Rainbow Warriors",
        date: new Date("2023-09-02T03:00:00.000Z"),
        spread: "EM -42.0",
        overUnder: "50",
        status: "upcoming",
        homeTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Hawai'i",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/62.png",
        },
        awayTeam: {
            color: "#ffffff",
            score: "0",
            record: "1-0",
            location: "Stanford",
            logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/24.png",
        },
    },
];

export const betArrayTestObject: Bet[] = [
    {
        id: "d7baf1ab-fb7b-4897-a406-4918b27e4984",
        team: "Notre Dame",
        spread: "-9.5",
        game: {
            gameId: "401525434",
            status: "ongoing",
            date: new Date("2023-08-26T18:30:00.000Z"),
            link: "https://www.espn.com/college-football/game/_/gameId/401525434",
            homeTeam: {
                color: "#0c2340",
                location: "Notre Dame",
                score: "42",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/87.png",
                record: "1-0",
            },
            awayTeam: {
                color: "#131630",
                location: "Navy",
                score: "3",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2426.png",
                record: "0-1",
            },
        },
    },
];