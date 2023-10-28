import { Divider } from "@mui/material";
import * as d3 from 'd3';
import React from "react";
import { UserBetsV2 } from "../../Utils/Utils";
import WeeklyWinComparison from "../Graphs/WeeklyWinComparison/WeeklyWinComparison";
import "./Leaderboard.css";


interface LeaderboardProps {
    allSeasonRecords: {
        [name: string]: { wins: number; losses: number };
    };
    userBets: UserBetsV2[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ allSeasonRecords, userBets }) => {
    const getSortedLeaderboard = (records: {
        [name: string]: { wins: number; losses: number };
    }) => {
        return Object.entries(records)
            .map(([name, record]) => ({ name, ...record }))
            .sort((a, b) => b.wins - a.wins || a.losses - b.losses);
    };

    const leaderboard = getSortedLeaderboard(allSeasonRecords);

    const color = d3.scaleOrdinal().domain(userBets.map(u => u.displayName)).range(d3.schemeSet2);

    return (
        <div className="Leaderboard">
            <div className="header">Season Leaderboard</div>
            <WeeklyWinComparison userBets={userBets} />

            <div className="column-headers">
                <div className="entry">Rank</div>
                <div className="entry-name">Player</div>
                <div className="entry">Wins</div>
                <div className="entry">Loss</div>
                <div className="entry">Legend</div> {/* Added new column header */}
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
                            <div className="entry" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <div className="color-box" style={{ backgroundColor: color(entry.name) as string }}></div> {/* Color box for legend */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
