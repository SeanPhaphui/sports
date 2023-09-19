import { Fade } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    Bet,
    Game,
    getGamesByWeek
} from "../Utils/Utils";
import Weeks from "../Weeks/Weeks";
import { fetchUserBets, saveUserBets } from "../firebaseConfig";
import "./Games.css";

interface GamesProps {
    user: User | null;
}

const Games: React.FC<GamesProps> = ({ user }) => {
    const [games, setGames] = useState<Game[]>([]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<Bet[]>([]);

    const [week, setWeek] = useState<string>();

    const [activeButton, setActiveButton] = useState<string>("Top 25");

    // New state variable to track if bets have been fetched
    const [hasFetchedBets, setHasFetchedBets] = useState<boolean>(false);

    useEffect(() => {
        if (week) {
            getGamesByWeek(parseInt(week), activeButton === "Top 25" ? true : false).then(setGames);
        }
    }, [week, activeButton]);

    const handleAddBet = (bet: Bet) => {
        setBets((prevArray) => [...prevArray, bet]);
        console.log(bet);
    };

    const handleRemoveBet = (bet: Bet) => {
        setBets((prev) => prev.filter((prevBet) => prevBet.id !== bet.id));
    };

    const handleWeekChange = (week: string) => {
        setWeek(week);
        setFilterText("");
    };

    // Fetching bets from the database
    useEffect(() => {
        const uid = user?.uid;

        const loadUserBets = async () => {
            if (uid) {
                const currentWeek = `week${week}`;
                const userBets = await fetchUserBets(uid, currentWeek);
                const formattedBets = userBets.map(
                    (bet: { game: { date: string | number | Date } }) => ({
                        ...bet,
                        game: {
                            ...bet.game,
                            date: new Date(bet.game.date), // Convert string back to Date object
                        },
                    })
                );
                console.log("Games - Loading Bets From Database: ", formattedBets);
                setBets(formattedBets);

                // Set hasFetchedBets to true after fetching and setting bets
                setHasFetchedBets(true);
            }
        };

        loadUserBets();
    }, [week]);

    // Saving bets to the database
    useEffect(() => {
        console.log("UGHHHGHG: ", bets);
        const uid = user?.uid;
        const currentWeek = `week${week}`;

        // Only execute this block if hasFetchedBets is true
        if (uid && hasFetchedBets) {
            saveUserBets(uid, currentWeek, bets);
        }
    }, [bets, hasFetchedBets]);

    return (
        <Fade in={true} timeout={500}>
            <div className="Games">
                <div className="top-bar">
                    <Header
                        activeButton={activeButton}
                        setActiveButton={setActiveButton}
                        filterText={filterText}
                        setFilterText={setFilterText}
                    />
                    <Weeks handleWeekChange={handleWeekChange} />
                </div>
                <div className="body">
                    <PlayerPicks playerBets={bets} handleRemoveBet={handleRemoveBet} />
                    <SelectGameCardList
                        game={games}
                        filterText={filterText}
                        handleAddBet={handleAddBet}
                    />
                </div>
            </div>
        </Fade>
    );
};

export default Games;
