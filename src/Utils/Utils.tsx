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
