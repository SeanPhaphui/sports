import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    Bet,
    BetObject,
    GameSelectionObject,
    PlayerBet,
    getGamesByWeek,
    playerBetArrayTestObject,
} from "../Utils/Utils";
import Weeks from "../Weeks/Weeks";
import "./Home.css";

const Home: React.FC = () => {
    const [games, setGames] = useState<GameSelectionObject[]>([]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<Bet[]>([]);

    const [week, setWeek] = useState<string>();

    const [open, setOpen] = React.useState(true);

    const [activeButton, setActiveButton] = useState<string>("Top 25");

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

    return (
        <div className="Home">
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
                <PlayerPicks playerBets={bets} handleRemoveBet={handleRemoveBet}/>
                {/* {playerBets.map((playerBet) => (
                    <PlayerBetCard key={playerBet.id} playerBet={playerBet} />
                ))} */}
                <SelectGameCardList
                    gameSelections={games}
                    filterText={filterText}
                    handleAddBet={handleAddBet}
                />
            </div>
        </div>
    );
};

export default Home;
