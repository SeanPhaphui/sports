import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { UserBetsV2 } from "../../Utils/Utils";
import WinLossRatio from "../../WinLossRatio/WinLossRatio";
import "./StatCard.css";

interface StatCardProps {
    selectedUserId: string | null;
    handleUserChange: (event: SelectChangeEvent<string | null>) => void;
    userBets: UserBetsV2[];
    seasonRecord: {
        wins: number;
        losses: number;
    } | null;
    winRate: string;
    totalWins: number;
    totalLoss: number;
    winLossRatio: number;
    totalGames: number;
}

const StatCard: React.FC<StatCardProps> = ({
    selectedUserId,
    handleUserChange,
    userBets,
    seasonRecord,
    winRate,
    totalWins,
    totalLoss,
    winLossRatio,
    totalGames,
}) => {
    return (
        <div className="StatCard">
            <div>
                <div>Not Finished</div>
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
            <div>
                Season Record: {seasonRecord?.wins} Wins / {seasonRecord?.losses} Losses
            </div>
            <div>Win Rate: {winRate}</div>
            <div style={{ padding: "40px" }}>
                <WinLossRatio wins={totalWins} losses={totalLoss} />
            </div>
            <div>Win-Loss Ratio: {winLossRatio.toFixed(2)}</div>
            <div>Total Wins: {totalWins}</div>
            <div>Total Loss: {totalLoss}</div>
            <div>Total Games: {totalGames}</div>
        </div>
    );
};

export default StatCard;
