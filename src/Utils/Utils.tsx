import dayjs from "dayjs";
import { User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

export type CurrentWeekAndSeason = {
    week: number;
    seasonYear: number;
};

export interface UserBetsV2 {
    uid: string;
    bets: {
        [year: string]: {
            [week: string]: Bet[];
        };
    };
    displayName: string;
}

export interface UserBets {
    uid: string;
    bets: Bet[];
    displayName: string;
    // ... other user properties if any
}

type SpreadBet = {
    id: string;
    team: string;
    type: "spread";
    value: string;
    game: Game;
};

type OverUnderBet = {
    id: string;
    team: string;
    type: "over" | "under";
    value: string;
    game: Game;
};

export type Bet = SpreadBet | OverUnderBet;

export interface Game {
    gameId: string;
    eventName: string;
    status: string;
    statusDetail: string;
    date: Date;
    link: string;
    odds: Odds;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
}

export interface Odds {
    spread: string;
    overUnder: string;
}

export interface TeamInfo {
    color: string;
    logo: string;
    location: string;
    abbreviation: string;
    score: string;
    record: string;
}

export interface GameCalendarObject {
    label: string;
    detail: string;
    week: string;
    seasonYear: string;
}

export interface AlertProps {
    handleAlertOpen: (open: boolean) => void;
    handleAlertMessage: (message: string) => void;
}

const fetchData = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};

export const fetchCurrentWeek = async (): Promise<{ week: number; seasonYear: number } | null> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard`;

    const responseData = await fetchData(footballUrl);

    // Validate and process the data
    if (
        responseData?.week &&
        responseData.week.number &&
        responseData?.season &&
        responseData.season.year
    ) {
        return {
            week: responseData.week.number,
            seasonYear: responseData.season.year,
        };
    }

    return null;
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

            // Check if singleCalendar.entries is an array before iterating
            if (Array.isArray(singleCalendar.entries)) {
                for (const entry of singleCalendar.entries) {
                    const gameCalendarEntry: GameCalendarObject = {
                        label: entry.label.toUpperCase(),
                        detail: entry.detail.toUpperCase(),
                        week: responseData.week.number,
                        seasonYear: responseData.season.year,
                    };
                    calendarEntries.push(gameCalendarEntry);
                }
            } else {
                // If it's a single object, you might want to handle it differently
                // For example, you could push it directly to calendarEntries after validation
                // Or simply ignore it if it's not supposed to be processed
                console.warn(`Ignoring non-iterable entry at ${singleCalendarKey}`);
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

export const getGamesByWeek = async (week: number, top25true: boolean): Promise<Game[]> => {
    const seasonType = week <= 15 ? "-1" : 3;
    const modifiedWeek = week > 15 ? "1" : week;
    const proxyUrl = "https://corsproxy.io/?";
    const top25Url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?seasontype=${seasonType}&week=${modifiedWeek}`;
    const fbsIAUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?seasontype=${seasonType}&week=${modifiedWeek}&groups=80`;
    const completeUrl = top25true ? `${proxyUrl}${top25Url}` : `${proxyUrl}${fbsIAUrl}`;

    const data = await fetchData(completeUrl);
    const games: Game[] = [];
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
                    const game: Game = {
                        gameId: event.id,
                        eventName: event.name,
                        status: mappedStatus,
                        statusDetail: competition.status.type.shortDetail,
                        date: new Date(event.date),
                        link: event.links[0].href,
                        odds: {
                            spread: competition.odds ? competition.odds[0].details : "N/A",
                            overUnder:
                                competition.odds && competition.odds[0].overUnder
                                    ? competition.odds[0].overUnder
                                    : "N/A",
                        },
                        homeTeam: {
                            color: homeTeam.team.color ? "#" + homeTeam.team.color : "#ffffff",
                            logo: homeTeam.team.logo
                                ? homeTeam.team.logo
                                : "https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo-500.png",
                            location: homeTeam.team.location,
                            abbreviation: homeTeam.team.abbreviation,
                            score: homeTeam.score ? homeTeam.score : 0,
                            record: homeTeam.records ? homeTeam.records[0].summary : "0-0",
                        },
                        awayTeam: {
                            color: awayTeam.team.color ? "#" + awayTeam.team.color : "#ffffff",
                            logo: awayTeam.team.logo
                                ? awayTeam.team.logo
                                : "https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo-500.png",
                            location: awayTeam.team.location,
                            abbreviation: awayTeam.team.abbreviation,
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
    type: "spread" | "over" | "under",
    value: string,
    originalBetId?: string
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
                    id: originalBetId || uuidv4(),
                    team: team,
                    type: type,
                    value: value,
                    game: {
                        gameId: id,
                        eventName: "",
                        status: mappedStatus,
                        statusDetail: competition.status.type.shortDetail,
                        date: new Date(competition.date),
                        link: link.href,
                        odds: {
                            spread: "",
                            overUnder: "",
                        },
                        homeTeam: {
                            color: homeTeam.team.color ? "#" + homeTeam.team.color : "#ffffff",
                            location: homeTeam.team.location,
                            abbreviation: homeTeam.team.abbreviation,
                            score: homeTeam.score ? homeTeam.score : 0,
                            logo: homeTeam.team.logos[0].href,
                            record: homeTeam.record[0].summary,
                        },
                        awayTeam: {
                            color: awayTeam.team.color ? "#" + awayTeam.team.color : "#ffffff",
                            location: awayTeam.team.location,
                            abbreviation: awayTeam.team.abbreviation,
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
        id: originalBetId || uuidv4(),
        team: "",
        type: "spread",
        value: "",
        game: {
            gameId: "",
            eventName: "",
            status: "",
            statusDetail: "",
            date: new Date(),
            link: "",
            odds: {
                spread: "",
                overUnder: "",
            },
            homeTeam: {
                color: "",
                location: "",
                abbreviation: "",
                score: "",
                logo: "",
                record: "",
            },
            awayTeam: {
                color: "",
                location: "",
                abbreviation: "",
                score: "",
                logo: "",
                record: "",
            },
        },
    };
};

export const updateBets = async (bets: Bet[]): Promise<Bet[]> => {
    const updatedBets = [];
    for (let bet of bets) {
        try {
            const updatedBet = await getGameByGameID(
                bet.game.gameId,
                bet.team,
                bet.type,
                bet.value,
                bet.id
            );
            updatedBets.push(updatedBet);
        } catch (error) {
            console.error(`Failed to update bet with ID ${bet.id}`);
            updatedBets.push(bet); // Push the original bet if updating fails.
        }
    }

    return updatedBets;
};

export const updateBetsUsingWeekData = async (bets: Bet[], week: number): Promise<Bet[]> => {
    // Fetch all games for the given week.
    const gamesForTheWeek = await getGamesByWeek(week, false); // Assuming you want all games, change accordingly

    // Use the fetched games to update bets.
    const updatedBets = bets.map((bet) => {
        const correspondingGame = gamesForTheWeek.find((game) => game.gameId === bet.game.gameId);

        if (correspondingGame) {
            return {
                ...bet,
                game: correspondingGame,
            };
        } else {
            console.error(`Failed to update bet with ID ${bet.id}`);
            return bet; // Return the original bet if no corresponding game is found.
        }
    });

    return updatedBets;
};

export const extractTeamsFromPlayerBet = (
    playerBet: Bet
): { homeTeam: TeamInfo; awayTeam: TeamInfo } => {
    return {
        homeTeam: playerBet.game.homeTeam,
        awayTeam: playerBet.game.awayTeam,
    };
};

export const extractTeamsFromGame = (game: Game): { homeTeam: TeamInfo; awayTeam: TeamInfo } => {
    return {
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
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

export const loadBetsFromLocalStorage = (): Bet[] | null => {
    const storedBets = localStorage.getItem("Bets-Prototype-V1");
    if (storedBets) {
        const parsedBets: Bet[] = JSON.parse(storedBets);
        const mappedBets = parsedBets.map((bet) => ({
            ...bet,
            date: new Date(bet.game.date),
        }));
        return mappedBets;
    }
    return null;
};

export const convertToLocalTime = (utcDate: Date): Date => {
    const utcTime = utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
    const localOffset = new Date().getTimezoneOffset() * 60000; // Local device's timezone offset in milliseconds
    return new Date(utcTime - localOffset); // Adjust the date to local timezone
};

export const getLetter = (user: User | null) => {
    if (user && user.displayName) {
        const names = user.displayName.split(" ").slice(0, 2); // split by spaces and get the first two words
        const initials = names.map((name) => name.charAt(0).toUpperCase()).join(""); // get the first letter of each word
        return initials;
    } else if (user && user.email) {
        return user.email.charAt(0).toUpperCase();
    } else {
        return ""; // Default case if somehow displayName and email both don't exist or are empty
    }
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

export const gameSelectionArrayTestObject = [
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
        team: "Ball State",
        type: "under",
        value: "42",
        game: {
            gameId: "401520191",
            eventName: "",
            status: "ongoing",
            statusDetail: "4th - 4:15",
            date: new Date("2023-08-26T18:30:00.000Z"),
            link: "https://www.espn.com/college-football/game/_/gameId/401525434",
            odds: {
                spread: "",
                overUnder: "",
            },
            homeTeam: {
                color: "#0c2340",
                location: "Notre Dame",
                abbreviation: "XYZ",
                score: "42",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/87.png",
                record: "1-0",
            },
            awayTeam: {
                color: "#131630",
                location: "Navy",
                abbreviation: "ZXC",
                score: "3",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2426.png",
                record: "0-1",
            },
        },
    },
];
