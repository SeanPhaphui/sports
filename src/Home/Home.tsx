import { Card, Fade, Grow } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import HomeHeader from "../HomeHeader/HomeHeader";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import PlayerPicksHome from "../PlayerPicksHome/PlayerPicksHome";
import { Bet, fetchCurrentWeek, updateBets } from "../Utils/Utils";
import { fetchAllBetsForWeek, fetchUserBets } from "../firebaseConfig";
import "./Home.css";
import CountdownTimer from "../CountdownTimer/CountdownTimer";

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
    const [userBetsFromDatabase, setUserBetsFromDatabase] = useState<Bet[]>([]);
    const [userBetsFromDatabaseAfterAPIFetch, setUserBetsFromDatabaseAfterAPIFetch] = useState<
        Bet[]
    >([]);

    const [allUsersBetsFromDatabase, setAllUsersBetsFromDatabase] = useState<
    UserBets[]
    >([]);

    const [allUsersBetsFromDatabaseAfterAPIFetch, setAllUsersBetsFromDatabaseAfterAPIFetch] = useState<
    UserBets[]
    >([]);

    // Fetches the Currrent Users Bets from Database
    useEffect(() => {
        // Assuming you have the user's UID
        const uid = user?.uid;

        const loadUserBets = async () => {
            const weekNumber = await fetchCurrentWeek();
            if (uid && weekNumber !== null) {
                const currentWeek = `week${weekNumber}`;
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
                setUserBetsFromDatabase(formattedBets);
            }
        };

        loadUserBets();
    }, [user]);

    // Fetches Game Data For The Users Bets
    useEffect(() => {
        if (userBetsFromDatabase.length > 0) {
            const updateUserBets = async () => {
                const updatedUserBets = await updateBets(userBetsFromDatabase);
                console.log("updatedUserBets: ", updatedUserBets);
                setUserBetsFromDatabaseAfterAPIFetch(updatedUserBets)
            };
            updateUserBets();
        }
    }, [userBetsFromDatabase]);






    // Fetches All User Bets From Database For the specific Week
    useEffect(() => {
        const loadAllBets = async () => {
            const weekNumber = await fetchCurrentWeek();
            if (weekNumber !== null) {
                const currentWeek = `week${weekNumber}`;
                const usersBetsForWeek = await fetchAllBetsForWeek(currentWeek);
                setAllUsersBetsFromDatabase(usersBetsForWeek);
            }
        };

        loadAllBets();
    }, [user]);

    useEffect(() => {
        const updateAllBets = async () => {
            if (allUsersBetsFromDatabase.length > 0) {
                // Extract all bets into a single array
                const allBetsArray: Bet[] = allUsersBetsFromDatabase.map((user: UserBets) => user.bets).flat();
    
                try {
                    const updatedBetsArray: Bet[] = await updateBets(allBetsArray);
    
                    // Update the allUsersBets state with the updated bets
                    const updatedAllUsersBets: UserBets[] = allUsersBetsFromDatabase.map((user: UserBets) => {
                        return {
                            ...user,
                            bets: user.bets.map((bet: Bet) => {
                                const updatedBet: Bet | undefined = updatedBetsArray.find((ub: Bet) => ub.id === bet.id);
                                
                                // Log the original and updated bet
                                console.log('Original Bet:', bet);
                                console.log('Updated Bet:', updatedBet);
                                
                                return updatedBet ? updatedBet : bet;
                            }),
                        };
                    });
    
                    setAllUsersBetsFromDatabaseAfterAPIFetch(updatedAllUsersBets);
                    console.log("All user bets final: ", updatedAllUsersBets);
                } catch (error: any) {
                    console.error("Error updating all bets:", error);
                }
            }
        };
    
        updateAllBets();
    }, [allUsersBetsFromDatabase]);
    
    

    // Grab the current user's UID
    const currentUserId = user?.uid;

    const combinedBets = [
        ...(userBetsFromDatabaseAfterAPIFetch.length > 0
            ? [{ uid: currentUserId, bets: userBetsFromDatabaseAfterAPIFetch, displayName: "Your" }]
            : []),
        ...allUsersBetsFromDatabaseAfterAPIFetch.filter((obj) => obj.uid !== currentUserId),
    ];

    console.log("Combinned: ", combinedBets);

    return (
        <Fade in={true} timeout={500}>
            <div className="Home">
                <div className="top-bar">
                    <HomeHeader user={user} />
                </div>
                <div className="body">
                    <CountdownTimer />
                    {allUsersBetsFromDatabaseAfterAPIFetch.map((object, index) => (
                        <PlayerPicksHome
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
