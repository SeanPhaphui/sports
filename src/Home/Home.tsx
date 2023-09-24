import { Card, Fade, Grow } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import HomeHeader from "../HomeHeader/HomeHeader";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import { Bet, fetchCurrentWeek, updateBetsUsingWeekData } from "../Utils/Utils";
import { fetchAllBetsForWeek, saveOutcomes } from "../firebaseConfig";
import "./Home.css";

interface HomeProps {
    user: User | null;
}

interface UserBets {
    uid: string;
    bets: Bet[];
    displayName: string;
    // ... other user properties if any
}

const Home: React.FC<HomeProps> = ({ user }) => {
    const [allUsersBetsFromDatabaseAfterAPIFetch, setAllUsersBetsFromDatabaseAfterAPIFetch] =
        useState<UserBets[]>([]);

    // Single useEffect to fetch and update all user bets
    useEffect(() => {
        const loadAndAllBets = async () => {
            const weekNumber = await fetchCurrentWeek();
            if (weekNumber !== null) {
                const currentWeek = `week${weekNumber}`;
                const usersBetsForWeek = await fetchAllBetsForWeek(currentWeek);

                // Extract all bets into a single array
                const allBetsArray: Bet[] = usersBetsForWeek
                    .map((user: UserBets) => user.bets)
                    .flat();

                try {
                    const updatedBetsArray: Bet[] = await updateBetsUsingWeekData(allBetsArray, weekNumber);
                    saveOutcomes(weekNumber, updatedBetsArray);

                    // Update the allUsersBets state with the updated bets
                    const updatedAllUsersBets: UserBets[] = usersBetsForWeek.map(
                        (user: UserBets) => {
                            return {
                                ...user,
                                bets: user.bets.map((bet: Bet) => {
                                    const updatedBet: Bet | undefined = updatedBetsArray.find(
                                        (ub: Bet) => ub.id === bet.id
                                    );
                                    return updatedBet ? updatedBet : bet;
                                }),
                            };
                        }
                    );

                    setAllUsersBetsFromDatabaseAfterAPIFetch(updatedAllUsersBets);
                } catch (error: any) {
                    console.error("Error updating all bets:", error);
                }
            }
        };

        loadAndAllBets();
    }, []);

    // Grab the current user's UID
    const currentUserId = user?.uid;

    // Now when rendering, extract the current user's bets from allUsersBetsFromDatabaseAfterAPIFetch
    const currentUserBets = allUsersBetsFromDatabaseAfterAPIFetch.find(
        (bet) => bet.uid === currentUserId
    );

    // Modify combinedBets to use currentUserBets
    const combinedBets = [
        ...(currentUserBets ? [{ ...currentUserBets, displayName: "Your" }] : []),
        ...allUsersBetsFromDatabaseAfterAPIFetch.filter((obj) => obj.uid !== currentUserId),
    ];

    return (
        <Fade in={true} timeout={500}>
            <div className="Home">
                <div className="top-bar">
                    <HomeHeader user={user} />
                </div>
                <div className="body">
                    <CountdownTimer />
                    {allUsersBetsFromDatabaseAfterAPIFetch.map((object, index) => (
                        <PlayerPicks
                            key={index}
                            playerBets={object.bets}
                            displayName={object.displayName}
                        />
                    ))}
                    <TransitionGroup>
                        {combinedBets.map((betObject, index) => (
                            <Grow in={true} key={index} timeout={500}>
                                <Card className="pick-list">
                                    <h4>
                                        {betObject.displayName === "Your"
                                            ? `${betObject.displayName} Week's Picks`
                                            : `${betObject.displayName}'s Picks`}
                                    </h4>
                                    {betObject.bets.map((bet) => (
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

export default Home;
