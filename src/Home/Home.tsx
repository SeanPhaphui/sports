import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
    Button,
    TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import SelectGameCardList from "../SelectGameCardList/SelectGameCardList";
import {
    BetObject,
    GameCalendarObject,
    GameSelectionObject,
    PlayerBet,
    fetchGameCalendar,
    getGameByID,
    getGamesByWeek
} from "../Utils/Utils";
import Weeks from "../Weeks/Weeks";
import "./Home.css";

const Home: React.FC = () => {
    const [games, setGames] = useState<GameSelectionObject[]>([]);

    const [filterText, setFilterText] = useState<string>(""); // Step 1: State for filter text'

    const [bets, setBets] = useState<BetObject[]>([]);

    const [playerBets, setPlayerBets] = useState<PlayerBet[]>([]);

    const [week, setWeek] = useState<string>();

    const [open, setOpen] = React.useState(true);

    const [activeButton, setActiveButton] = useState<string>("Top 25");

    useEffect(() => {
        if (week) {
            getGamesByWeek(parseInt(week), activeButton === "Top 25" ? true : false).then(setGames);
            // console.log(getGamesByDate(formattedDate))
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
                <div className="header">
                    <ArrowBackIosNewIcon className="back" />
                    <div className="buttons">
                        <Button
                            style={{
                                color: activeButton === "Top 25" ? "white" : "#919293",
                                backgroundColor: activeButton === "Top 25" ? "#151617" : "#3a3b3c",
                                textTransform: "none",
                            }}
                            onClick={() => setActiveButton("Top 25")}
                        >
                            Top 25
                        </Button>
                        <div className="divider"></div>
                        <Button
                            style={{
                                color: activeButton === "FBS (I-A)" ? "white" : "#919293",
                                backgroundColor:
                                    activeButton === "FBS (I-A)" ? "#151617" : "#3a3b3c",
                            }}
                            onClick={() => setActiveButton("FBS (I-A)")}
                        >
                            FBS (I-A)
                        </Button>
                    </div>
                    <TextField
                        size="small"
                        label="Search"
                        value={filterText}
                        onChange={(event) => setFilterText(event.target.value)}
                    />
                </div>
                <Weeks handleWeekChange={handleWeekChange} />
            </div>

            <div className="body">
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
                {playerBets.length >= 1 && <PlayerPicks playerBets={playerBets} />}
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
