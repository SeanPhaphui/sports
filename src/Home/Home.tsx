import { DateCalendar, MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { GameSelectionObject, getGamesByDate } from "../Utils/Utils";
import { Autocomplete, Box, Card, Paper, TextField } from "@mui/material";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";

const Home: React.FC = () => {
    const [startDate, setStart] = useState<Dayjs | null>(dayjs());
    const [games, setGames] = useState<GameSelectionObject[]>([
        {
            id: "401532394",
            name: "Howard Bison at Eastern Michigan Eagles",
            date: new Date("2023-09-01T22:30:00.000Z"),
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

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text

    useEffect(() => {
        if (startDate) {
            const formattedDate = startDate.format("YYYYMMDD");
            getGamesByDate(formattedDate).then(setGames);
            // console.log(getGamesByDate(formattedDate))
        }
    }, [startDate]);
    return (
        <div className="Home">
            <div className="search-parameters">
                <MobileDatePicker
                    className="search-parameters-item"
                    label="Pick date"
                    value={startDate}
                    onChange={(newValue: Dayjs | null) => setStart(newValue)}
                />
                {/* <DateCalendar value={startDate} onChange={(newValue: Dayjs | null) => setStart(newValue)} /> */}
                <div className="divider"></div>
                <TextField
                    className="search-parameters-item"
                    label="Search list"
                    value={filterText}
                    onChange={(event) => setFilterText(event.target.value)}
                />
            </div>
            <SelectGameCardList gameSelections={games} filterText={filterText}/>
        </div>
    );
};

export default Home;
