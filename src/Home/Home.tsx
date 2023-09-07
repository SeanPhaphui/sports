import { Box, List, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    BetObject,
    GameCalendarObject,
    GameSelectionObject,
    PlayerBet,
    fetchGameCalendar,
    gameSelectionArrayTestObject,
    getGameByID,
    getGamesByWeek,
    playerBetArrayTestObject,
} from "../Utils/Utils";
import "./Home.css";
import { Dns, KeyboardArrowDown, People, PermMedia, Public } from "@mui/icons-material";
import PlayerPicks from "../PlayerPicks/PlayerPicks";

const Home: React.FC = () => {
    const [games, setGames] = useState<GameSelectionObject[]>([]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<BetObject[]>([]);

    const [playerBets, setPlayerBets] = useState<PlayerBet[]>([]);

    const [week, setWeek] = useState<string>();

    const [gameCalendar, setGameCalendar] = useState<GameCalendarObject[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [open, setOpen] = React.useState(true);

    useEffect(() => {
        setLoading(true); // Set loading when fetch starts
        // Assuming fetchGameCalendar is the function to fetch the GameCalendarObjects
        fetchGameCalendar().then((data) => {
            setGameCalendar(data);

            // Setting the week after gameCalendar has been set
            // This is just an example. Modify the logic as per your requirements.
            if (data && data.length > 0) {
                setWeek("1"); // setting the first week for simplicity, modify as needed
            }

            setLoading(false); // Set loading to false once fetch is complete
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

    const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

    return (
        <div className="Home">
            {loading ? (
                <List className="horizontalList">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="load-item">
                            <div className="pulsating-placeholder-top"></div>
                            <div className="pulsating-placeholder-bottom"></div>
                        </div>
                    ))}
                </List>
            ) : (
                <List className="horizontalList">
                    {gameCalendar.map((gameCalObj, index) => (
                        <div
                            key={index}
                            className={`item ${index === activeItemIndex ? "active" : ""}`}
                            onClick={() => {
                                setActiveItemIndex(index);
                                setWeek((index + 1).toString()); // set the week based on the clicked index
                                setFilterText("");
                                console.log(gameCalObj.label);
                            }}
                        >
                            <div>{gameCalObj.label}</div>
                            <div className="detail">{gameCalObj.detail}</div>
                        </div>
                    ))}
                </List>
            )}

            <div className="body">
                <div className="search-parameters">
                    <TextField
                        className="search-parameters-item-search"
                        label="Search list"
                        value={filterText}
                        onChange={(event) => setFilterText(event.target.value)}
                    />
                </div>
                {/* <div className="bets">
                    <ListItemButton
                        alignItems="flex-start"
                        onClick={() => setOpen(!open)}
                        sx={{
                            px: 3,
                            pt: 2.5,
                            pb: open ? 0 : 2.5,
                            "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } },
                        }}
                    >
                        <ListItemText
                            primary="Picks: "
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: "medium",
                                lineHeight: "20px",
                                mb: "2px",
                            }}
                        />
                        <KeyboardArrowDown
                            sx={{
                                mr: -1,
                                opacity: 0,
                                transform: open ? "rotate(-180deg)" : "rotate(0)",
                                transition: "0.2s",
                            }}
                        />
                    </ListItemButton>
                </div> */}
                {playerBets.length >= 1 && (
                    <PlayerPicks playerBets={playerBets}/>
                )}
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
