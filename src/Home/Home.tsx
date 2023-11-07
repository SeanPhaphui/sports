import { Card, CircularProgress, Fade, Grow, LinearProgress } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import HomeHeader from "../HomeHeader/HomeHeader";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import PlayerPicks from "../PlayerPicks/PlayerPicks";
import { Bet, UserBets, fetchCurrentWeek, updateBetsUsingWeekData } from "../Utils/Utils";
import { fetchAllBetsForWeek, saveOutcomes } from "../firebaseConfig";
import "./Home.css";
import {
    areAllGamesFinished,
    getLeaderText,
    hasAnyGameFinished,
    isBettingWindowClosed,
} from "../Utils/BetUtils";

interface HomeProps {
    user: User | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
    const [allUsersBetsFromDatabaseAfterAPIFetch, setAllUsersBetsFromDatabaseAfterAPIFetch] =
        useState<UserBets[]>([]);

    const [isLoading, setIsLoading] = useState("Starting up..."); // State to manage the loading state as a string
    const [progress, setProgress] = useState(0); // State to track progress

    // Single useEffect to fetch and update all user bets
    useEffect(() => {
        const loadAndAllBets = async () => {
            setIsLoading("Fetching current week..."); // Update loading text
            setProgress(0); // Reset progress when starting
            console.time("fetchCurrentWeek");
            const currentWeekAndSeason = await fetchCurrentWeek();
            console.timeEnd("fetchCurrentWeek");
            setProgress(33); // Update progress after fetchCurrentWeek
            setIsLoading("Loading bets for the week..."); // Update loading text
            if (currentWeekAndSeason !== null) {
                const currentWeek = `week${currentWeekAndSeason.week}`;
                console.time("fetchAllBetsForWeek");
                const usersBetsForWeek = await fetchAllBetsForWeek(
                    currentWeek,
                    currentWeekAndSeason.seasonYear.toString(),
                    (status) => setIsLoading(status)
                );
                console.timeEnd("fetchAllBetsForWeek");
                // console.log("usersBetsForWeek", usersBetsForWeek)
                setProgress(55); // Update progress after fetchAllBetsForWeek
                setIsLoading("Updating bets with week data..."); // Update loading text

                // Extract all bets into a single array
                const allBetsArray: Bet[] = usersBetsForWeek
                    .map((user: UserBets) => user.bets)
                    .flat();

                try {
                    console.time("updateBetsUsingWeekData");
                    const updatedBetsArray: Bet[] = await updateBetsUsingWeekData(
                        allBetsArray,
                        currentWeekAndSeason.week
                    );
                    console.timeEnd("updateBetsUsingWeekData");
                    console.time("test");
                    setProgress(97); // Update progress after updateBetsUsingWeekData
                    setIsLoading("Finalizing updates..."); // Update loading text
                    // Only save outcomes if a user is logged in
                    if (user) {
                        saveOutcomes(currentWeekAndSeason, updatedBetsArray);
                    }

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
            console.timeEnd("test");
            setProgress(100); // Finish progress after all operations
            setIsLoading(""); // Clear loading text when done
        };

        loadAndAllBets();
    }, [user]);

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

    const allGamesFinished = areAllGamesFinished(allUsersBetsFromDatabaseAfterAPIFetch);

    const leaderText = getLeaderText(allUsersBetsFromDatabaseAfterAPIFetch, allGamesFinished);
    const now = new Date();
    return (
        <Fade in={true} timeout={500}>
            <div className="Home">
                <HomeHeader user={user} />
                <div className="body">
                    {hasAnyGameFinished(allUsersBetsFromDatabaseAfterAPIFetch) && (
                        <div className="leader">{leaderText}</div>
                    )}
                    {!isBettingWindowClosed(now) && <CountdownTimer />}
                    {isLoading ? (
                        <>
                            <div className="loading-container">
                                {" "}
                                {/* A container for centering the spinner */}
                                <CircularProgress /> {/* The spinner itself */}
                                {/* Add the LinearProgress below CircularProgress */}
                            </div>
                            <div className="loading-text">
                                <p>{isLoading}</p> {/* Display the current loading text */}
                            </div>
                            <LinearProgress variant="determinate" value={progress} />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </Fade>
    );
};

export default Home;
