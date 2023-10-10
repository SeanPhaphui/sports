import { Fade, Card, Grow } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import React, { useState } from "react";
import "./History.css";
import HistoryHeader from "./HistoryHeader/HistoryHeader";
import { UserBets } from "../Utils/Utils";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import { areAllGamesFinished, getLeaderText, hasAnyGameFinished } from "../Utils/BetUtils";

interface HistoryProps {}

const History: React.FC<HistoryProps> = () => {
    const [allUsersOutcomesFromDatabase, setAllUsersOutcomesFromDatabase] = useState<UserBets[]>(
        []
    );

    const allGamesFinished = areAllGamesFinished(allUsersOutcomesFromDatabase);

    const leaderText = getLeaderText(allUsersOutcomesFromDatabase, allGamesFinished);

    return (
        <Fade in={true} timeout={500}>
            <div className="History">
                <HistoryHeader
                    onOutcomesFetched={(fetchedOutcomes) => {
                        setAllUsersOutcomesFromDatabase(fetchedOutcomes);
                    }}
                />
                <div className="body">
                    {hasAnyGameFinished(allUsersOutcomesFromDatabase) && (
                        <div className="leader">{leaderText}</div>
                    )}
                    {allUsersOutcomesFromDatabase.map((object, index) => (
                        <PlayerPicks
                            key={index}
                            playerBets={object.bets}
                            displayName={object.displayName}
                        />
                    ))}
                    <TransitionGroup>
                        {allUsersOutcomesFromDatabase.map((outcomeObject, index) => (
                            <Grow in={true} key={index} timeout={500}>
                                <Card className="pick-list">
                                    <h4>{outcomeObject.displayName}'s Picks</h4>
                                    {outcomeObject.bets.map((bet) => (
                                        <PlayerBetCard key={bet.id} bet={bet} />
                                    ))}
                                </Card>
                            </Grow>
                        ))}
                    </TransitionGroup>
                </div>
            </div>
        </Fade>
    );
};

export default History;
