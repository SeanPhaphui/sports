import { Fade, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { calculateUserWins, computeSeasonRecord } from "../Utils/BetUtils";
import { Bet, UserBetsV2 } from "../Utils/Utils";
import { fetchAllOutcomes, fetchAllUsers } from "../firebaseConfig";
import "./Stats.css";

interface StatsProps {
  user: User | null;
}

const Stats: React.FC<StatsProps> = ({ user }) => {
  const [userBets, setUserBets] = useState<UserBetsV2[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [winRate, setWinRate] = useState<string>("");
  const [totalWins, setTotalWins] = useState<number>(0);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [seasonRecord, setSeasonRecord] = useState<{ wins: number; losses: number } | null>(null);
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
                  const matchedOutcome = flatOutcomes.find((outcome) => outcome.id === bet.id);
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
    if (selectedUserId && userBets.length > 0) {
      const selectedUser = userBets.find((userBet) => userBet.uid === selectedUserId);
      if (selectedUser) {
        let totalWins = 0;
        let totalGames = 0;

        for (const year in selectedUser.bets) {
          for (const week in selectedUser.bets[year]) {
            const betsForTheWeek = selectedUser.bets[year][week];
            totalGames += betsForTheWeek.length;
            // Assuming calculateUserWins can calculate wins for an array of bets
            totalWins += calculateUserWins(betsForTheWeek);
          }
        }

        setTotalWins(totalWins);
        setTotalGames(totalGames);
        const calculatedWinRate = Math.round((totalWins / totalGames) * 100) + "%";
        setWinRate(calculatedWinRate);
      }
      const allSeasonRecords = computeSeasonRecord(userBets);
      const userSeasonRecord = allSeasonRecords[selectedUser?.displayName || ""];
      setSeasonRecord(userSeasonRecord);
      console.log(allSeasonRecords);
    }
  }, [userBets, selectedUserId]);

  const handleUserChange = (event: SelectChangeEvent<string | null>) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <Fade in={true} timeout={500}>
      <div className="Stats">
        <div>EXTREMELY EARLY BETA: WORK IN PROGRESS</div>
        <div>Suggestions Welcomed</div>
        <div>----------------</div>
        <div>
          <label>Select User: </label>
          <Select value={selectedUserId} onChange={handleUserChange}>
            {userBets
              .filter((userBet) => userBet.uid !== "Gj42xPYjtTOLAixJS5y8828oxG22")
              .map((userBet) => (
                <MenuItem key={userBet.uid} value={userBet.uid}>
                  {userBet.displayName}
                </MenuItem>
              ))}
          </Select>
        </div>
        <div>Win Rate: {winRate}</div>
        <div>Total Wins: {totalWins}</div>
        <div>Total Games: {totalGames}</div>
        <div>
          Season Record: {seasonRecord?.wins} Wins / {seasonRecord?.losses} Losses
        </div>
      </div>
    </Fade>
  );
};

export default Stats;
