import { Card, Fade, Grow } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import HomeHeader from "../HomeHeader/HomeHeader";
import PlayerBetCard from "../PlayerBetCard/PlayerBetCard";
import PlayerPicksHome from "../PlayerPicksHome/PlayerPicksHome";
import { Bet, fetchCurrentWeek } from "../Utils/Utils";
import { fetchAllBetsForWeek, fetchUserBets } from "../firebaseConfig";
import "./Home.css";
import CountdownTimer from "../CountdownTimer/CountdownTimer";

interface HomeProps {
    user: User | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
    const [bets, setBets] = useState<Bet[]>([]);
    const [allUsersBets, setAllUsersBets] = useState<
        { uid: string; bets: Bet[]; displayName: string }[]
    >([]);

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
                setBets(formattedBets);
            }
        };

        loadUserBets();
    }, [user]);

    useEffect(() => {
        const loadAllBets = async () => {
            const weekNumber = await fetchCurrentWeek();
            if (weekNumber !== null) {
                const currentWeek = `week${weekNumber}`;
                const usersBetsForWeek = await fetchAllBetsForWeek(currentWeek);
                setAllUsersBets(usersBetsForWeek);
            }
        };

        loadAllBets();
    }, [user]);

    // Grab the current user's UID
    const currentUserId = user?.uid;

    const combinedBets = [
        ...(bets.length > 0 ? [{ uid: currentUserId, bets: bets, displayName: "Your" }] : []),
        ...allUsersBets.filter((obj) => obj.uid !== currentUserId),
    ];


    
    return (
        <Fade in={true} timeout={500}>
            <div className="Home">
                <div className="top-bar">
                    <HomeHeader user={user} />
                </div>
                <div className="body">
                        <CountdownTimer/>
                    {allUsersBets.map((object, index) => (
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
