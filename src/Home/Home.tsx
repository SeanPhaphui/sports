import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    Bet,
    Game,
    betArrayTestObject,
    getGameByGameID,
    getGamesByWeek,
    loadBetsFromLocalStorage,
    updateBets,
} from "../Utils/Utils";
import Weeks from "../Weeks/Weeks";
import "./Home.css";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import DataManager from "../DataManager/DataManager";

const Home: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);

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


        // Then, in a useEffect hook, you can load the value from localStorage
    // when the component first mounts.
    useEffect(() => {
        const fetchUpdatedBets = async (originalBets: Bet[]) => {
            const updated = await updateBets(originalBets);
            setBets(updated);
        };
    
        const loadedBets = loadBetsFromLocalStorage();
        if (loadedBets) {
            fetchUpdatedBets(loadedBets);
        }
    }, []);
    

    // You can also use another useEffect to save the value to localStorage
    // whenever it changes.   
    useEffect(() => {
        localStorage.setItem('Bets-Prototype-V1', JSON.stringify(bets));
    }, [bets]);

    const refreshPage = () => {
        window.location.reload();
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
                <DataManager bets={bets} restoreBets={(bets) => setBets(bets)} clearBets={() => setBets([])}/>
                <button onClick={refreshPage}>Refresh Page</button>
                <PlayerPicks playerBets={bets} handleRemoveBet={handleRemoveBet}/>
                {bets.map((bet) => (
                    <PlayerBetCard key={bet.id} bet={bet} />
                ))}
                <SelectGameCardList
                    game={games}
                    filterText={filterText}
                    handleAddBet={handleAddBet}
                />
            </div>
        </div>
    );
};

export default Home;
