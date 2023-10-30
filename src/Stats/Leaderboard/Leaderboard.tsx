import { Divider, Skeleton } from "@mui/material";
import * as d3 from "d3";
import React, { useMemo } from "react";
import { UserBetsV2 } from "../../Utils/Utils";
import WeeklyWinComparison from "../Graphs/WeeklyWinComparison/WeeklyWinComparison";
import "./Leaderboard.css";
import { getSortedFinalWeeks } from "../../Utils/GraphUtils.";

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
    if(leaderboard.length === 0){
        console.log("ALLLLL", allSeasonRecords)
    }

    const color = d3
        .scaleOrdinal()
        .domain(userBets.map((u) => u.displayName))
        .range(d3.schemeSet2);

    const weeksArray = useMemo(() => getSortedFinalWeeks(userBets), [userBets]);

    return (
        <div className="Leaderboard">
            <div className="header">Season Leaderboard</div>
            <WeeklyWinComparison userBets={userBets} weeksArray={weeksArray} />

            <div className="column-headers">
                <div className="entry">Rank</div>
                <div className="entry-name">Player</div>
                <div className="entry">Wins</div>
                <div className="entry">Loss</div>
                <div className="entry">Legend</div> {/* Added new column header */}
            </div>
            <div>
                {leaderboard.length === 0 ? (
                    // Render skeletons
                    <>
                        <Skeleton sx={{ bgcolor: 'grey.900' }} variant="text" width="100%" height={25} />
                        <Divider className="divider" />
                        <Skeleton sx={{ bgcolor: 'grey.900' }} variant="text" width="100%" height={25} />
                        <Divider className="divider" />
                        <Skeleton sx={{ bgcolor: 'grey.900' }} variant="text" width="100%" height={25} />
                        <Divider className="divider" />
                        <Skeleton sx={{ bgcolor: 'grey.900' }} variant="text" width="100%" height={25} />
                    </>
                ) : (
                    // Original rendering of leaderboard
                    leaderboard.map((entry, index) => (
                        <div key={entry.name}>
                            {index > 0 && <Divider className="divider" />}
                            <div className="column-values">
                                <div className="entry">{index + 1}</div>
                                <div className="entry-name">{entry.name}</div>
                                <div className="entry">{entry.wins}</div>
                                <div className="entry">{entry.losses}</div>
                                <div
                                    className="entry"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                    }}
                                >
                                    <div
                                        className="color-box"
                                        style={{ backgroundColor: color(entry.name) as string }}
                                    ></div>{" "}
                                    {/* Color box for legend */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
