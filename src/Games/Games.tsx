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
import { fetchAllBetsForWeek, fetchUserBets, saveUserBets } from "../firebaseConfig";
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

    const [betAddedOrRemoved, setBetAddedOrRemoved] = useState(false);

    const handleAddBet = (bet: Bet) => {
        setBets((prevArray) => [...prevArray, bet]);
        console.log(bet);
        setBetAddedOrRemoved(true);
    };

    const handleRemoveBet = (bet: Bet) => {
        setBets((prev) => prev.filter((prevBet) => prevBet.id !== bet.id));
        setBetAddedOrRemoved(true);
    };

    const handleWeekChange = (week: string) => {
        setWeek(week);
        setFilterText("");
    };

    // Fetching bets from the database
    useEffect(() => {
        const uid = user?.uid;

        const loadUserBets = async () => {
            if (uid && week) {
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
        const uid = user?.uid;
        const currentWeek = `week${week}`;

        // Only execute this block if hasFetchedBets is true
        if (uid && hasFetchedBets) {
            saveUserBets(uid, currentWeek, bets);
        }
    }, [bets, hasFetchedBets]);

    const [allBetsForWeek, setAllBetsForWeek] = useState<{ uid: string; bets: Bet[]; displayName: string }[]>([]);

    const [hasFetchedAllBets, setHasFetchedAllBets] = useState(false);

    useEffect(() => {
        // This will now fetch all bets initially and whenever a new bet is added
        if ((!hasFetchedAllBets || betAddedOrRemoved) && week != undefined) {
            console.log("fetch")
            const currentWeek = `week${week}`;
            fetchAllBetsForWeek(currentWeek).then(bets => setAllBetsForWeek(bets));
            setBetAddedOrRemoved(false);
            setHasFetchedAllBets(true);  // Set this to true after fetching all bets
        }
    }, [week, betAddedOrRemoved]);

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
                        allBetsForWeek={allBetsForWeek}
                        currentUserId={user?.uid || ""}
                    />
                </div>
            </div>
        </Fade>
    );
};

export default Games;
