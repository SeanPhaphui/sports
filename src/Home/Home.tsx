import {
    List,
    TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import { BetObject } from "../SelectGameCardList/SelectGameCardContainer/SelectGameCardDialog/SelectGameCardDialog";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    GameCalendarObject,
    GameSelectionObject,
    PlayerBetObject,
    fetchGameCalendar,
    gameSelectionArrayTestObject,
    getGameByID,
    getGamesByWeek,
} from "../Utils/Utils";
import "./Home.css";

const Home: React.FC = () => {
    const [games, setGames] = useState<GameSelectionObject[]>([]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<BetObject[]>([]);

    const [playerBets, setPlayerBets] = useState<PlayerBetObject[]>([]);

    const [week, setWeek] = useState<string>();

    const [gameCalendar, setGameCalendar] = useState<GameCalendarObject[]>([]);

    useEffect(() => {
        // Assuming fetchGameCalendar is the function to fetch the GameCalendarObjects
        fetchGameCalendar().then((data) => {
            setGameCalendar(data);
            
            // Setting the week after gameCalendar has been set
            // This is just an example. Modify the logic as per your requirements.
            if(data && data.length > 0) {
                setWeek("1"); // setting the first week for simplicity, modify as needed
            }
        });
    }, []);
    

    useEffect(() => {
        if (week) {
            getGamesByWeek(parseInt(week)).then(setGames);
            // console.log(getGamesByDate(formattedDate))
        }
    }, [week]);

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

    const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

    return (
        <div className="Home">
            <List className="horizontalList">
                {gameCalendar.map((gameCalObj, index) => (
                    <div
                        key={index}
                        className={`item ${index === activeItemIndex ? "active" : ""}`}
                        onClick={() => {
                            setActiveItemIndex(index);
                            setWeek((index + 1).toString()); // set the week based on the clicked index
                            setFilterText("")
                            console.log(gameCalObj.label);
                        }}
                    >
                        <div>{gameCalObj.label}</div>
                        <div className="detail">{gameCalObj.detail}</div>
                    </div>
                ))}
            </List>
            <div className="body">
                <div className="search-parameters">
                    <TextField
                        className="search-parameters-item-search"
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
        </div>
    );
};

export default Home;
