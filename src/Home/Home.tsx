import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    BetObject,
    GameSelectionObject,
    PlayerBet,
    getGameByID,
    getGamesByWeek,
    playerBetArrayTestObject,
} from "../Utils/Utils";
import Weeks from "../Weeks/Weeks";
import "./Home.css";
import Experimental from "../Experimental/Experimental";

const Home: React.FC = () => {
    const [games, setGames] = useState<GameSelectionObject[]>([]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<BetObject[]>([]);

    const [playerBets, setPlayerBets] = useState<PlayerBet[]>(playerBetArrayTestObject);

    const [week, setWeek] = useState<string>();

    const [open, setOpen] = React.useState(true);

    const [activeButton, setActiveButton] = useState<string>("Top 25");

    useEffect(() => {
        if (week) {
            getGamesByWeek(parseInt(week), activeButton === "Top 25" ? true : false).then(setGames);
        }
    }, [week, activeButton]);

    useEffect(() => {
        if (bets.length > 0) {
            const fetchPlayerBets = async () => {
                const newPlayerBets: PlayerBet[] = [];

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
                console.log("newPlayerBets: ", newPlayerBets);
            };

            fetchPlayerBets();
        }
    }, [bets]);

    const handleAddBet = (bet: BetObject) => {
        setBets((prevArray) => [...prevArray, bet]);
        console.log(bet);
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
                <Experimental playerBets={playerBets}/>
                {/* <PlayerPicks playerBets={playerBets} /> */}
                {/* {playerBets.map((playerBet) => (
                    <PlayerBetCard key={playerBet.id} playerBet={playerBet} />
                ))} */}
                <SelectGameCardList
                    gameSelections={games}
                    filterText={filterText}
                    onAdd={handleAddBet}
                />
            </div>
        </div>
    );
};

export default Home;
