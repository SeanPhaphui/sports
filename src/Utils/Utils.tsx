export interface Game {
    id: string;
    name: string;
    date: Date;
}

const getOption = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};

export const getGamesByDate = async (date: string): Promise<Game[]> => {
    const proxyUrl = "https://corsproxy.io/?";
    const footballUrl = `${proxyUrl}https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${date}`;

    const data = await getOption(footballUrl);
    const games: Game[] = [];
    if (data?.events) {
        for (const event of data.events) {
            const game: Game = {
                id: event.id,
                name: event.name,
                date: new Date(event.date), // Assuming 'date' is in UTC format
            };
            games.push(game);
        }
    }
    if (games === undefined) {
        return [];
    }

    return games;
};
