import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Game, getGamesByDate } from "../Utils/Utils";
import { Autocomplete, TextField } from "@mui/material";

const Home: React.FC = () => {
    const [startDate, setStart] = useState<Dayjs | null>(dayjs());
    const [games, setGames] = useState<Game[]>([
        {
            id: "test",
            name: "test",
            date: new Date(),
        },
    ]);

    useEffect(() => {
        if (startDate) {
            const formattedDate = startDate.format("YYYYMMDD");
            getGamesByDate(formattedDate).then(setGames);
            // console.log(getGamesByDate(formattedDate))
        }
    }, [startDate]);
    return (
        <div className="Home">
            <div className="item">
                <MobileDatePicker
                    label="Start date"
                    value={startDate}
                    onChange={(newValue: Dayjs | null) => setStart(newValue)}
                />
            </div>
            <Autocomplete
                className="input-bottom"
                freeSolo
                options={games.map((option) => option.name)}
                renderInput={(params) => <TextField {...params} label="Available games" />}
            />
        </div>
    );
};

export default Home;
