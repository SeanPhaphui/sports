import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import { BetObject } from "../SelectGameCardList/SelectGameCardContainer/SelectGameCardDialog/SelectGameCardDialog";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    GameSelectionObject,
    PlayerBetObject,
    getGameByID,
    getGamesByWeek
} from "../Utils/Utils";
import "./Home.css";

const Home: React.FC = () => {
    const [startDate, setStart] = useState<Dayjs | null>(dayjs());
    const [games, setGames] = useState<GameSelectionObject[]>([
        {
            id: "401532394",
            name: "Howard Bison at Eastern Michigan Eagles",
            date: new Date("2023-09-01T22:30:00.000Z"),
            spread: "EM -42.0",
            homeTeam: {
                rank: 12,
                record: "1-0",
                location: "Eastern Michigan",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2199.png",
            },
            awayTeam: {
                rank: 12,
                record: "1-0",
                location: "Howard",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/47.png",
            },
        },
        {
            id: "401520163",
            name: "Central Michigan Chippewas at Michigan State Spartans",
            date: new Date("2023-09-01T23:00:00.000Z"),
            spread: "EM -42.0",
            homeTeam: {
                rank: 12,
                record: "1-0",
                location: "Michigan State",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/127.png",
            },
            awayTeam: {
                rank: 12,
                record: "1-0",
                location: "Central Michigan",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2117.png",
            },
        },
        {
            id: "401525463",
            name: "Miami (OH) RedHawks at Miami Hurricanes",
            date: new Date("2023-09-01T23:00:00.000Z"),
            spread: "EM -42.0",
            homeTeam: {
                rank: 12,
                record: "1-0",
                location: "Miami",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png",
            },
            awayTeam: {
                rank: 12,
                record: "1-0",
                location: "Miami (OH)",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/193.png",
            },
        },
        {
            id: "401525462",
            name: "Louisville Cardinals at Georgia Tech Yellow Jackets",
            date: new Date("2023-09-01T23:30:00.000Z"),
            spread: "EM -42.0",
            homeTeam: {
                rank: 12,
                record: "1-0",
                location: "Georgia Tech",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/59.png",
            },
            awayTeam: {
                rank: 12,
                record: "1-0",
                location: "Louisville",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/97.png",
            },
        },
        {
            id: "401525815",
            name: "Missouri State Bears at Kansas Jayhawks",
            date: new Date("2023-09-02T00:00:00.000Z"),
            spread: "EM -42.0",
            homeTeam: {
                rank: 12,
                record: "1-0",
                location: "Kansas",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png",
            },
            awayTeam: {
                rank: 12,
                record: "1-0",
                location: "Missouri State",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png",
            },
        },
        {
            id: "401523988",
            name: "Stanford Cardinal at Hawai'i Rainbow Warriors",
            date: new Date("2023-09-02T03:00:00.000Z"),
            spread: "EM -42.0",
            homeTeam: {
                rank: 12,
                record: "1-0",
                location: "Hawai'i",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/62.png",
            },
            awayTeam: {
                rank: 12,
                record: "1-0",
                location: "Stanford",
                logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/24.png",
            },
        },
    ]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<BetObject[]>([]);

    const [playerBets, setPlayerBets] = useState<PlayerBetObject[]>([]);

    const [week, setWeek] = useState<string>();


    const handleChangeWeek = (event: SelectChangeEvent) => {
        setWeek(event.target.value as string);
    };

    useEffect(() => {
        if (week) {
            getGamesByWeek(parseInt(week)).then(setGames);
            // console.log(getGamesByDate(formattedDate))
        }
    }, [week]);

    useEffect(() => {
        if (startDate) {
            const formattedDate = startDate.format("YYYYMMDD");
            // getGamesByDate(formattedDate).then(setGames);
            // console.log(getGamesByDate(formattedDate))
        }
    }, [startDate]);

    useEffect(() => {
        if (bets.length > 0) {
            const fetchPlayerBets = async () => {
                const newPlayerBets: PlayerBetObject[] = [];

                for (let i = 0; i < bets.length; i++) {
                    const bet = bets[i];
                    try {
                        const { playerBetObject, status } = await getGameByID(
                            bet.gameId,
                            bet.team,
                            bet.spread
                        );
                        newPlayerBets.push(playerBetObject);
                    } catch (error) {
                        console.error(`Error fetching game for bet ${bet.gameId}:`, error);
                    }
                }

                setPlayerBets(newPlayerBets);
            };

            fetchPlayerBets();
        }
    }, [bets]);

    const handleAddBet = (bet: BetObject) => {
        setBets((prevArray) => [...prevArray, bet]);
        console.log(bet);
    };
    return (
        <div className="Home">
            <div className="search-parameters">
                <FormControl fullWidth>
                    <InputLabel>Week</InputLabel>
                    <Select value={week} label="Week" onChange={handleChangeWeek}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                        <MenuItem value={14}>14</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    className="search-parameters-item"
                    label="Search list"
                    value={filterText}
                    onChange={(event) => setFilterText(event.target.value)}
                />
            </div>
            {playerBets.map((playerBet) => (
                <PlayerBetCard key={playerBet.id} playerBet={playerBet} />
            ))}
            <SelectGameCardList
                gameSelections={games}
                filterText={filterText}
                onAdd={handleAddBet}
            />
        </div>
    );
};

export default Home;
