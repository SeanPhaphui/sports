import { Divider } from "@mui/material";
import React from "react";
import "./Leaderboard.css";

interface LeaderboardProps {
    allSeasonRecords: {
        [name: string]: { wins: number; losses: number };
    };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ allSeasonRecords }) => {
    const getSortedLeaderboard = (records: {
        [name: string]: { wins: number; losses: number };
    }) => {
        return Object.entries(records)
            .map(([name, record]) => ({ name, ...record }))
            .sort((a, b) => b.wins - a.wins || a.losses - b.losses);
    };

    const leaderboard = getSortedLeaderboard(allSeasonRecords);

    return (
        <div className="Leaderboard">
            <div className="header">Season Leaderboard</div>
            <div className="column-headers">
                <div className="entry">Rank</div>
                <div className="entry-name">Player</div>
                <div className="entry">Wins</div>
                <div className="entry">Loss</div>
            </div>
            <div>
                {leaderboard.map((entry, index) => (
                    <div key={entry.name}>
                        {index > 0 && <Divider className="divider" />}
                        <div className="column-values">
                            <div className="entry">{index + 1}</div>
                            <div className="entry-name">{entry.name}</div>
                            <div className="entry">{entry.wins}</div>
                            <div className="entry">{entry.losses}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
