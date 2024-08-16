import { Fade, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { calculateUserWins, computeSeasonRecord } from "../Utils/BetUtils";
import { Bet, UserBetsV2 } from "../Utils/Utils";
import {
    fetchAllOutcomes,
    fetchAllUsers,
    fetchAllUsersBets,
    fetchAvailableSeasons,
} from "../firebaseConfig";
import GraphCard from "./GraphCard/GraphCard";
import Leaderboard from "./Leaderboard/Leaderboard";
import StatCard from "./StatCard/StatCard";
import "./Stats.css";

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
    const [seasons, setSeasons] = useState<string[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<string>("2023");

    useEffect(() => {
        // Fetch available seasons from Firebase
        const fetchSeasons = async () => {
            try {
                const availableSeasons = await fetchAvailableSeasons();
                setSeasons(availableSeasons);

                // Set the default season to the most current season (e.g., the latest one)
                if (availableSeasons.length > 0) {
                    setSelectedSeason(availableSeasons[0]);
                }
            } catch (error) {
                console.error("Failed to fetch seasons:", error);
            }
        };

        fetchSeasons();
    }, []);

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
                const rawOutcomesData = await fetchAllOutcomes(selectedSeason); // Fetch based on the selected season

                // Assuming selectedSeason is "2023"
                const outcomesForYear = rawOutcomesData[selectedSeason]; // This is what you had before

                // Convert outcomesForYear to a flat list for easier searching
                // Convert raw outcomes data to a flat list for easier searching
                const flatOutcomes: Bet[] = [];
                for (const week in outcomesForYear) {
                    flatOutcomes.push(...outcomesForYear[week]);
                }
                const rawUserData = await fetchAllUsers();
                const rawUsersBetsData = await fetchAllUsersBets();



                const userBetsArray: UserBetsV2[] = [];

                for (const userId in rawUsersBetsData) {
                    if (userId === "Gj42xPYjtTOLAixJS5y8828oxG22") continue; // skip the test account
                    const user = rawUsersBetsData[userId];
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
                        displayName: rawUserData[userId].displayName,
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
        if (selectedSeason) {
            aggregateUserBets()
                .then((data) => {
                    setUserBets(data);
                    if (data.length > 0) {
                        setSelectedUserId(data[0].uid);
                    }
                })
                .catch((error) => {
                    console.error("Failed to aggregate user bets:", error);
                });
        }
    }, [selectedSeason]);

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

    const handleSeasonChange = (event: SelectChangeEvent<string>) => {
        setSelectedSeason(event.target.value);
    };

    return (
        <Fade in={true} timeout={500}>
            <div className="Stats">
                {/* Dropdown for selecting the season */}
                <Select
                    value={selectedSeason}
                    onChange={handleSeasonChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Select season" }}
                >
                    {seasons.map((season) => (
                        <MenuItem key={season} value={season}>
                            {season}
                        </MenuItem>
                    ))}
                </Select>
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
