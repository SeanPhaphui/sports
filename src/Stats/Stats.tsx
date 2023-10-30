import { Fade, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { calculateUserWins, computeSeasonRecord } from "../Utils/BetUtils";
import { Bet, UserBetsV2 } from "../Utils/Utils";
import WinLossRatio from "../WinLossRatio/WinLossRatio";
import { fetchAllOutcomes, fetchAllUsers } from "../firebaseConfig";
import GraphCard from "./GraphCard/GraphCard";
import Leaderboard from "./Leaderboard/Leaderboard";
import "./Stats.css";
import StatCard from "./StatCard/StatCard";

interface StatsProps {
    user: User | null;
}

const Stats: React.FC<StatsProps> = ({ user }) => {
    const [userBets, setUserBets] = useState<UserBetsV2[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>("");
    const [winLossRatio, setWinLossRatio] = useState<number>(0);
    const [winRate, setWinRate] = useState<string>("");
    const [totalWins, setTotalWins] = useState<number>(0);
    const [totalLoss, setTotalLoss] = useState<number>(0);
    const [totalGames, setTotalGames] = useState<number>(0);
    const [allSeasonRecords, setAllSeasonRecords] = useState<{
        [name: string]: { wins: number; losses: number };
    }>({});
    const [seasonRecord, setSeasonRecord] = useState<{ wins: number; losses: number } | null>(null);

    const calculateWinLossRatio = (wins: number, losses: number) => {
        if (losses === 0) {
            // If a user has never lost, then the ratio would be infinite (wins/0).
            // You can handle this edge case by either returning a string like "Infinite" or
            // just the number of wins. For simplicity, let's return the number of wins.
            return wins;
        }
        return wins / losses;
    };

    useEffect(() => {
        const aggregateUserBets = async (): Promise<UserBetsV2[]> => {
            try {
                const rawOutcomesData = await fetchAllOutcomes();
                const rawUserData = await fetchAllUsers();

                // Convert raw outcomes data to a flat list for easier searching
                const flatOutcomes: Bet[] = [];
                for (const year in rawOutcomesData) {
                    for (const week in rawOutcomesData[year]) {
                        flatOutcomes.push(...rawOutcomesData[year][week]);
                    }
                }

                const userBetsArray: UserBetsV2[] = [];

                for (const userId in rawUserData) {
                    if (userId === "Gj42xPYjtTOLAixJS5y8828oxG22") continue; // skip the test account
                    const user = rawUserData[userId];
                    const userBets: { [year: string]: { [week: string]: Bet[] } } = {};

                    if (user.bets) {
                        for (const year in user.bets) {
                            if (!userBets[year]) userBets[year] = {};
                            for (const week in user.bets[year]) {
                                if (!userBets[year][week]) userBets[year][week] = [];
                                const weekBets = user.bets[year][week];
                                for (const bet of weekBets) {
                                    const matchedOutcome = flatOutcomes.find(
                                        (outcome) => outcome.id === bet.id
                                    );
                                    if (matchedOutcome) {
                                        userBets[year][week].push({
                                            ...bet,
                                            game: matchedOutcome.game,
                                        });
                                    } else {
                                        userBets[year][week].push(bet);
                                    }
                                }
                            }
                        }
                    }

                    userBetsArray.push({
                        uid: userId,
                        displayName: user.displayName,
                        bets: userBets,
                    });
                }
                console.log(userBetsArray);
                return userBetsArray;
            } catch (error) {
                console.error("Error aggregating user bets:", error);
                throw error;
            }
        };
        aggregateUserBets()
            .then((data) => {
                console.log("SETTING USER BETS");
                setUserBets(data);
                // Set the first user as the default selected user.
                if (data.length > 0) {
                    setSelectedUserId(data[0].uid);
                }
            })
            .catch((error) => {
                console.error("Failed to aggregate user bets:", error);
            });
    }, []);

    useEffect(() => {
        if (userBets.length > 0) {
            const computedAllSeasonRecords = computeSeasonRecord(userBets);
            setAllSeasonRecords(computedAllSeasonRecords);
        }
    }, [userBets]);

    useEffect(() => {
        if (selectedUserId && userBets.length > 0) {
            const selectedUser = userBets.find((userBet) => userBet.uid === selectedUserId);
            if (selectedUser) {
                let totalWins = 0;
                let totalGames = 0;

                for (const year in selectedUser.bets) {
                    for (const week in selectedUser.bets[year]) {
                        const betsForTheWeek = selectedUser.bets[year][week].filter(
                            (bet) => bet.game.status === "final"
                        ); // filter out games that have status of "Final"
                        totalGames += betsForTheWeek.length;
                        // Assuming calculateUserWins can calculate wins for an array of bets
                        totalWins += calculateUserWins(betsForTheWeek);
                    }
                }

                setTotalWins(totalWins);
                setTotalGames(totalGames);
                setTotalLoss(totalGames - totalWins);
                const calculatedWinRate = Math.round((totalWins / totalGames) * 100) + "%";
                setWinRate(calculatedWinRate);
                // Calculate win-loss ratio after setting total wins and losses
                const ratio = calculateWinLossRatio(totalWins, totalGames - totalWins);
                setWinLossRatio(ratio);
            }
            const userSeasonRecord = allSeasonRecords[selectedUser?.displayName || ""];
            setSeasonRecord(userSeasonRecord);
        }
    }, [userBets, selectedUserId, allSeasonRecords]);

    const handleUserChange = (event: SelectChangeEvent<string | null>) => {
        setSelectedUserId(event.target.value);
    };

    return (
        <Fade in={true} timeout={500}>
            <div className="Stats">
                <Leaderboard allSeasonRecords={allSeasonRecords} userBets={userBets} />
                {/* <Graph userBets={userBets} /> */}
                <GraphCard title="Cumulative Bet Wins" userBets={userBets} />
                <StatCard
                    selectedUserId={selectedUserId}
                    handleUserChange={handleUserChange}
                    userBets={userBets}
                    seasonRecord={seasonRecord}
                    winRate={winRate}
                    totalWins={totalWins}
                    totalLoss={totalLoss}
                    winLossRatio={winLossRatio}
                    totalGames={totalGames}
                />
                <div style={{ padding: "40px" }}></div>
            </div>
        </Fade>
    );
};

export default Stats;
